import { encodeHLS } from '../public/uploader/hls-encoder.js';

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.render('index.ejs')
    })
    app.get('/player', function(req, res) {
        res.render('player.ejs')
    })

    app.post('/upload', (req, res) => {
        if (req.files) {
            console.log(req.files);
            var file = req.files.uploading;
            var filename = file.name;
            let title = filename.split('.');
            console.log(title[0]);
    
            file.mv('./data/' + filename, function (err) {
                if (err) {
                    res.render('index.ejs');
                    console.log(err);
                } else {
                    const fileInfo = ({
                        video: filename,
                        title: title[0]
                    })
                    encodeHLS(fileInfo);

                    res.render('index.ejs');
                }
            });
        }
    })
}