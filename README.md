<img src = "https://user-images.githubusercontent.com/59289320/164983610-4a7c91ad-08c2-4aed-8e78-00f8e2d35829.png" width="50%">

# IPFS-based HLS Video Streaming Service for Web 3.0

This web application is an IPFS-based HLS video streaming service for Web 3.0. This system is structured as hybrid P2P because there is a web server for advertising videos and encoding the videos into several chunks and encryption. The goal of this project is providing fast video streaming service as a Web 3.0 streaming service using IPFS.

It contains `JS-IPFS`, `HLS.js`, and `HLSjs-IPFS-Loader` modules.

On the process:
- `Video uploader` When user uploads a video on the web app, it encodes the video into several chunks using `HLS`, and then it uploads to IPFS network using `Web3.Storage`, one of the famous Filecoin-backed Pinning Services, for the use of permanent storage.
- `NFT` When user uploads a video on the web app, minty metadata of the video using `Ropsten Test Network`.
- `IPFS scheduling` ...

## Contents
- [localhost example](#localhost-example)
- [Web Server based Streaming Service](#web-server-based-streaming-service)

## localhost example
[This sample](https://github.com/docbull/ipfs-video-streaming/tree/main/localhost-hls-streaming) lets you experience IPFS-based HLS video streaming. It's based on [JS-IPFS example](https://github.com/ipfs-examples/js-ipfs-examples/tree/master/examples/browser-video-streaming).

# Quick Start
```
# run this example
$ npm start
```

It opens `8888 port` for running example, and you can see download latency of each video chunk in the browser console.

## Web Server based Streaming Service


# How to setup HTTPS for express based web server

You need to setup `SSL` for running `HTTPS` service. The web page to playback the videos in this project requires HTML file from web server. However, if you run web server on `HTTP` or `localhost`, the contents may be blocked by web browsers, such as `chrome`, `safari`, `firefox`, and `brave`, because there is a security policy called `CORS`. Fortunately, you can build HTTPS using simple ceritifications.

Here is an instruction:

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
