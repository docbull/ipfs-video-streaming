<img src = "https://user-images.githubusercontent.com/59289320/164983610-4a7c91ad-08c2-4aed-8e78-00f8e2d35829.png" width="50%">

## IPFS-based HLS Video Streaming Service for Web 3.0

This web application is an IPFS-based HLS video streaming service for Web 3.0. This system is structured as hybrid P2P because there is a web server for advertising videos and encoding the videos into several chunks and encryption. The goal of this project is providing fast video streaming service as a Web 3.0 streaming service using IPFS.

It contains `JS-IPFS`, `HLS.js`, and `HLSjs-IPFS-Loader` modules.

## Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)

If you want to run IPFS-based HLS streaming example on localhost (don't want to setup server side), you can refer [this sample](https://github.com/ipfs-examples/js-ipfs-examples/tree/master/examples/browser-video-streaming) that lets you experience IPFS-based HLS video streaming running on localhost.

## Prerequisites

### HTTPS Set Up

You need to setup `SSL` for running `HTTPS` service. The web page to playback the videos in this project requires HTML file from web server. However, if you run web server on HTTP or localhost, the contents may be blocked by web browsers, such as `chrome`, `safari`, `firefox`, and `brave`, because there is a security policy in libp2p. Fortunately, you can build HTTPS using simple ceritifications.

Follow the instruction in `ssl` folder:

```
$ openssl ecparam -out rootca.key -name prime256v1 -genkey
$ cat rootca.key
$ openssl req -new -sha256 -key rootca.key -out rootca.csr
$ cat rootca.csr 
$ openssl x509 -req -sha256 -days 999999 -in rootca.csr -signkey rootca.key -out rootca.crt
```

Before you install `mkcert`, you need to install `brew` or `homebrew` first.

```
$ brew install mkcert
$ mkcert -install
$ mkcert localhost
```

### Web3.Storage

This app uses [Web3.Storage](https://web3.storage), a Filecoin-backed Pinning Service, for uploading HLS chunks to IPFS network. If you want to activate video uploading functionality, you need to set up Web3.Storage API in `.env` file. [Here](https://web3.storage/docs/#quickstart) is an instruction for setting up your Web3.Storage API.
```
# .env
Web3Token=eyJhbGc...
```

## Quick Start

```javascript
# install NodeJS modules
$ npm install
# run the web app
$ npm start
```
