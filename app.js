const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const HTTP_PORT = 8888;
const HTTPS_PORT = 11800;

const options = {
    key: fs.readFileSync('./ssl/rootca.key'),
    cert: fs.readFileSync('./ssl/rootca.crt')
};

const app = express();
//Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins
app.use(cors());
app.use(fileUpload());

const router = require('./routes/router')(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, '/img')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/streaming')));
app.use(express.static(path.join(__dirname, '/public/uploading')));
app.use(express.static(path.join(__dirname, '/css')));

http.createServer(app).listen(HTTP_PORT);
https.createServer(options, app).listen(HTTPS_PORT);
