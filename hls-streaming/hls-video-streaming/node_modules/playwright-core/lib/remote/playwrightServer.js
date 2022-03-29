"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlaywrightServer = void 0;

var _debug = _interopRequireDefault(require("debug"));

var http = _interopRequireWildcard(require("http"));

var _ws = _interopRequireDefault(require("ws"));

var _dispatcher = require("../dispatchers/dispatcher");

var _instrumentation = require("../server/instrumentation");

var _playwright = require("../server/playwright");

var _browser = require("../server/browser");

var _processLauncher = require("../utils/processLauncher");

var _registry = require("../utils/registry");

var _playwrightDispatcher = require("../dispatchers/playwrightDispatcher");

var _socksProxy = require("../utils/socksProxy");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const debugLog = (0, _debug.default)('pw:server');

class PlaywrightServer {
  static async startDefault(options = {}) {
    const {
      path = '/ws',
      maxClients = 1,
      enableSocksProxy = true
    } = options;
    return new PlaywrightServer(path, maxClients, enableSocksProxy);
  }

  constructor(path, maxClients, enableSocksProxy, browser) {
    this._path = void 0;
    this._maxClients = void 0;
    this._enableSocksProxy = void 0;
    this._browser = void 0;
    this._wsServer = void 0;
    this._clientsCount = 0;
    this._path = path;
    this._maxClients = maxClients;
    this._enableSocksProxy = enableSocksProxy;
    this._browser = browser;
  }

  async listen(port = 0) {
    const server = http.createServer((request, response) => {
      response.end('Running');
    });
    server.on('error', error => debugLog(error));
    const wsEndpoint = await new Promise((resolve, reject) => {
      server.listen(port, () => {
        const address = server.address();

        if (!address) {
          reject(new Error('Could not bind server socket'));
          return;
        }

        const wsEndpoint = typeof address === 'string' ? `${address}${this._path}` : `ws://127.0.0.1:${address.port}${this._path}`;
        resolve(wsEndpoint);
      }).on('error', reject);
    });
    debugLog('Listening at ' + wsEndpoint);
    this._wsServer = new _ws.default.Server({
      server,
      path: this._path
    });

    const originalShouldHandle = this._wsServer.shouldHandle.bind(this._wsServer);

    this._wsServer.shouldHandle = request => originalShouldHandle(request) && this._clientsCount < this._maxClients;

    this._wsServer.on('connection', async (ws, request) => {
      if (this._clientsCount >= this._maxClients) {
        ws.close(1013, 'Playwright Server is busy');
        return;
      }

      this._clientsCount++;
      const connection = new Connection(ws, request, this._enableSocksProxy, this._browser, () => this._clientsCount--);
      ws[kConnectionSymbol] = connection;
    });

    return wsEndpoint;
  }

  async close() {
    const server = this._wsServer;
    if (!server) return;
    debugLog('closing websocket server');
    const waitForClose = new Promise(f => server.close(f)); // First disconnect all remaining clients.

    await Promise.all(Array.from(server.clients).map(async ws => {
      const connection = ws[kConnectionSymbol];
      if (connection) await connection.close();

      try {
        ws.terminate();
      } catch (e) {}
    }));
    await waitForClose;
    debugLog('closing http server');
    await new Promise(f => server.options.server.close(f));
    this._wsServer = undefined;
    debugLog('closed server');
  }

}

exports.PlaywrightServer = PlaywrightServer;
let lastConnectionId = 0;
const kConnectionSymbol = Symbol('kConnection');

class Connection {
  constructor(ws, request, enableSocksProxy, browser, onClose) {
    this._ws = void 0;
    this._onClose = void 0;
    this._dispatcherConnection = void 0;
    this._cleanups = [];
    this._id = void 0;
    this._disconnected = false;
    this._ws = ws;
    this._onClose = onClose;
    this._id = ++lastConnectionId;
    debugLog(`[id=${this._id}] serving connection: ${request.url}`);
    this._dispatcherConnection = new _dispatcher.DispatcherConnection();

    this._dispatcherConnection.onmessage = message => {
      if (ws.readyState !== ws.CLOSING) ws.send(JSON.stringify(message));
    };

    ws.on('message', message => {
      this._dispatcherConnection.dispatch(JSON.parse(Buffer.from(message).toString()));
    });
    ws.on('close', () => this._onDisconnect());
    ws.on('error', error => this._onDisconnect(error));
    new _dispatcher.Root(this._dispatcherConnection, async scope => {
      if (browser) return await this._initPreLaunchedBrowserMode(scope, browser);
      const url = new URL('http://localhost' + (request.url || ''));
      const browserHeader = request.headers['x-playwright-browser'];
      const browserAlias = url.searchParams.get('browser') || (Array.isArray(browserHeader) ? browserHeader[0] : browserHeader);
      const proxyHeader = request.headers['x-playwright-proxy'];
      const proxyValue = url.searchParams.get('proxy') || (Array.isArray(proxyHeader) ? proxyHeader[0] : proxyHeader);
      if (!browserAlias) return await this._initPlaywrightConnectMode(scope, enableSocksProxy && proxyValue === '*');
      return await this._initLaunchBrowserMode(scope, enableSocksProxy && proxyValue === '*', browserAlias);
    });
  }

  async _initPlaywrightConnectMode(scope, enableSocksProxy) {
    debugLog(`[id=${this._id}] engaged playwright.connect mode`);
    const playwright = (0, _playwright.createPlaywright)('javascript'); // Close all launched browsers on disconnect.

    this._cleanups.push(() => (0, _processLauncher.gracefullyCloseAll)());

    const socksProxy = enableSocksProxy ? await this._enableSocksProxy(playwright) : undefined;
    return new _playwrightDispatcher.PlaywrightDispatcher(scope, playwright, socksProxy);
  }

  async _initLaunchBrowserMode(scope, enableSocksProxy, browserAlias) {
    debugLog(`[id=${this._id}] engaged launch mode for "${browserAlias}"`);

    const executable = _registry.registry.findExecutable(browserAlias);

    if (!executable || !executable.browserName) throw new Error(`Unsupported browser "${browserAlias}`);
    const playwright = (0, _playwright.createPlaywright)('javascript');
    const socksProxy = enableSocksProxy ? await this._enableSocksProxy(playwright) : undefined;
    const browser = await playwright[executable.browserName].launch((0, _instrumentation.internalCallMetadata)(), {
      channel: executable.type === 'browser' ? undefined : executable.name
    }); // Close the browser on disconnect.
    // TODO: it is technically possible to launch more browsers over protocol.

    this._cleanups.push(() => browser.close());

    browser.on(_browser.Browser.Events.Disconnected, () => {
      // Underlying browser did close for some reason - force disconnect the client.
      this.close({
        code: 1001,
        reason: 'Browser closed'
      });
    });
    return new _playwrightDispatcher.PlaywrightDispatcher(scope, playwright, socksProxy, browser);
  }

  async _initPreLaunchedBrowserMode(scope, browser) {
    debugLog(`[id=${this._id}] engaged pre-launched mode`);
    browser.on(_browser.Browser.Events.Disconnected, () => {
      // Underlying browser did close for some reason - force disconnect the client.
      this.close({
        code: 1001,
        reason: 'Browser closed'
      });
    });
    const playwright = browser.options.rootSdkObject;
    const playwrightDispatcher = new _playwrightDispatcher.PlaywrightDispatcher(scope, playwright, undefined, browser); // In pre-launched mode, keep the browser and just cleanup new contexts.
    // TODO: it is technically possible to launch more browsers over protocol.

    this._cleanups.push(() => playwrightDispatcher.cleanup());

    return playwrightDispatcher;
  }

  async _enableSocksProxy(playwright) {
    const socksProxy = new _socksProxy.SocksProxy();
    playwright.options.socksProxyPort = await socksProxy.listen(0);
    debugLog(`[id=${this._id}] started socks proxy on port ${playwright.options.socksProxyPort}`);

    this._cleanups.push(() => socksProxy.close());

    return socksProxy;
  }

  async _onDisconnect(error) {
    this._disconnected = true;
    debugLog(`[id=${this._id}] disconnected. error: ${error}`); // Avoid sending any more messages over closed socket.

    this._dispatcherConnection.onmessage = () => {};

    debugLog(`[id=${this._id}] starting cleanup`);

    for (const cleanup of this._cleanups) await cleanup().catch(() => {});

    this._onClose();

    debugLog(`[id=${this._id}] finished cleanup`);
  }

  async close(reason) {
    if (this._disconnected) return;
    debugLog(`[id=${this._id}] force closing connection: ${(reason === null || reason === void 0 ? void 0 : reason.reason) || ''} (${(reason === null || reason === void 0 ? void 0 : reason.code) || 0})`);

    try {
      this._ws.close(reason === null || reason === void 0 ? void 0 : reason.code, reason === null || reason === void 0 ? void 0 : reason.reason);
    } catch (e) {}
  }

}