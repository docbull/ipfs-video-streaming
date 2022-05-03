import { uploader } from '../public/uploader.js';

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
            const video = req.files.uploading;
            const thumbnail = req.files.thumbnail;
            var videoName = video.name;
            var thumbnailName = thumbnail.name;
            let title = videoName.split('.');
            video.mv(`./data/${videoName}`, function (err) {
                if (err) {
                    res.render('index.ejs');
                    console.log(err);
                } else {
                    thumbnail.mv(`./img/${thumbnailName}`, function (err) {
                        if (err) {
                            res.render('index.ejs');
                            console.log(err);
                        } else {
                            // fileInfo indicates information of uploaded video. It contains filename 
                            // (e.g., example.mp4) and title (e.g., example).
                            const fileInfo = ({
                                video: videoName,
                                title: title[0],
                                thumbnail: `/${thumbnailName}`
                            })
                            uploader(fileInfo).then(result => res.render('index.ejs'));
                        }
                    })   
                }
            });
        }
    })
}
