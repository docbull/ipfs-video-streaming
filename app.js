const express = require('express')
const app = express()
const PORT = 11800

const router = require('./router/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/img'))
app.use(express.static(__dirname + '/hls-player/hls-video-streaming'))

function handleListen() {
    console.log(`Server listening port: ${PORT}`)
}

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, handleListen);
