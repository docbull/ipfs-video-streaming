import { uploader } from '../public/uploading/uploader.js';

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.render('index.ejs')
    })
    app.get('/player', function(req, res) {
        res.render('player.ejs')
    })

    // when you upload a video using the top-right upload button, and it posts the video
    // on the media server and the server encodes the video using HLS protocol.
    app.post('/upload', async (req, res) => {
        if (req.files) {
            console.log(req.files);
            var file = req.files.uploading;
            var filename = file.name;
            let title = filename.split('.');
            file.mv('./data/' + filename, function (err) {
                if (err) {
                    res.render('index.ejs');
                    console.log(err);
                } else {
                    // fileInfo indicates information of uploaded video. It contains filename 
                    // (e.g., example.mp4) and title (e.g., example).
                    const fileInfo = ({
                        video: filename,
                        title: title[0]
                    })
                    uploader(fileInfo).then(result => res.render('index.ejs'));
                }
            });
        }
    })
}
