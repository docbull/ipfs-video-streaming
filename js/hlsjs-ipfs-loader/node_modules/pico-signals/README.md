# pico-signals

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/pico-signals
[downloads-image]:https://img.shields.io/npm/dm/pico-signals.svg
[npm-image]:https://img.shields.io/npm/v/pico-signals.svg
[travis-url]:https://travis-ci.org/moxystudio/js-pico-signals
[travis-image]:http://img.shields.io/travis/moxystudio/js-pico-signals/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/js-pico-signals
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/js-pico-signals/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/js-pico-signals
[david-dm-image]:https://img.shields.io/david/moxystudio/js-pico-signals.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/js-pico-signals?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/js-pico-signals.svg

A very simple signal library inspired by the [signals](https://github.com/millermedeiros/js-signals) package.


## Installation

```sh
$ npm install pico-signals
```

This library is written in modern JavaScript and is published with both CommonJS and ES module transpiled variants.

If you target older browsers please make sure to transpile accordingly. 


## Usage

```js
import picoSignals from 'pico-signals';

const listener1 = () => console.log('Listener 1');
const listener2 = () => console.log('Listener 2');

const ps = picoSignals();

const removeListener1 = ps.add(listener1);
const removeListener2 = ps.add(listener2);

ps.dispatch('foo', 'bar');
//=> Both listeners will be called and both logs produced.
//=> Every listener will receive the same arguments provided in the dispatch method.

removeListener2();
//=> Deletes `listener2` from the listeners list;

ps.dispatch();
//=> Only `listener1` will be called since its currently the only listener on the list.

ps.clear();
//=> Clears all listeners.
```

## API

### add(listener)

Adds a new listener to the list.

Returns a method to remove the listener.

#### listener
Type: `Function`

A listener to be called on dispatch.

### delete(listener)

Deletes a listener from the list.

#### listener
Type: `Function`

An existing listener in the list.

### clear()

Deletes all listeners from the list.

### dispatch(...args)

Calls every listener with the specified arguments.


## Tests

```sh
$ npm test
$ npm test -- --watch # during development
```


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

