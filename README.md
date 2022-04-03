# 🌒  🌓  🌔  🌕  🌖  🌗  🌘 
### HLS-based IPFS Video Streaming for Web 3.0




### How to setup HTTPS for express based web server
    openssl ecparam -out rootca.key -name prime256v1 -genkey
    cat rootca.key 
    openssl req -new -sha256 -key rootca.key -out rootca.csr
    cat rootca.
    cat rootca.csr 
    openssl x509 -req -sha256 -days 999999 -in rootca.csr -signkey rootca.key -out rootca.crt
    brew install mkcert
    mkcert -install
    mkcert localhost

