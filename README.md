<img src = "https://user-images.githubusercontent.com/59289320/164983610-4a7c91ad-08c2-4aed-8e78-00f8e2d35829.png" width="50%">

### HLS-based IPFS Video Streaming for Web 3.0

This web application is an IPFS-based HLS video streaming service for Web 3.0. This system is structured as hybrid P2P because there is a web server for advertising videos and encoding the videos into several chunks and encryption.



### How to setup HTTPS for express based web server

You need to setup `SSL` for running `HTTPS` service. The web page to playback the videos in this project requires HTML file from web server. However, if you run web server on `HTTP` or `localhost`, the contents may be blocked by web browsers, such as `chrome`, `safari`, `firefox`, and `brave`, because there is a security policy called `CORS`. Fortunately, you can build HTTPS using simple ceritifications.

Here is an instruction:

```
$ openssl ecparam -out rootca.key -name prime256v1 -genkey
$ cat rootca.key
$ openssl req -new -sha256 -key rootca.key -out rootca.csr
$ cat rootca.
$ cat rootca.csr 
$ openssl x509 -req -sha256 -days 999999 -in rootca.csr -signkey rootca.key -out rootca.crt
```

Before you install `mkcert`, you need to install `brew` or `homebrew` first.

```
$ brew install mkcert
$ mkcert -install
$ mkcert localhost
```
