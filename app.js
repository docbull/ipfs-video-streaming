//const Bundler = require('parcel-bundler');
const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

const HTTP_PORT = 8888;
const HTTPS_PORT = 11800;

const PORT = 11800;

const options = {
    key: fs.readFileSync('./ssl/rootca.key'),
    cert: fs.readFileSync('./ssl/rootca.crt')
};

const app = express();

const file = './views/index.ejs';

//const bundler = new Bundler(file, options);

const router = require('./routes/router')(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, '/img')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/css')));

//app.use(bundler.middleware());

app.get('/', (req, res) => { res.json({ message: `Server is running on port ${req.secure ? HTTPS_PORT : HTTP_PORT}` }); }); 

http.createServer(app).listen(HTTP_PORT);
https.createServer(options, app).listen(HTTPS_PORT);
