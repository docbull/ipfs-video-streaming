module.exports = function (app) {
    app.get('/', function(req, res) {
        res.render('index.ejs')
    })
    app.get('/player', function(req, res) {
        res.render('player.ejs')
    })
}