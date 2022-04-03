/*
import express from 'express';
import path from 'path';
import cors from 'cors';
*/

const Bundler = require('parcel-bundler');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 11800;

const options = {};

const file = './views/index.ejs';

const bundler = new Bundler(file, options);

const router = require('./routes/router')(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

// img folder includes icon image file
app.use(express.static(path.join(__dirname, '/img')));
// hls-streaming
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(path.join(__dirname, '/js')));

app.use(bundler.middleware());

function handleListen() {
    console.log(`Server running at ${PORT} port`);
}

app.listen(PORT, handleListen);

/*
const express = require('express');
const path = require('path');

const app = express();
const PORT = 11800;

const router = require('./routes/router')(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

//app.use(cors());

// img folder includes icon image file
app.use(express.static(path.join(__dirname, '/img')));
// hls-streaming
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(path.join(__dirname, '/js')));

app.use(express.static(path.join(__dirname, '/hls-streaming/hls-video-streaming')));

function handleListen() {
    console.log(`Server running at ${PORT} port`);
}

app.listen(PORT, handleListen);
*/
