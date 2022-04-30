const path = require('path');
const execa = require('execa');

function execac(command, args) {
    return new Promise((resolve, reject) => {
        const proc = execa(command, args);

        proc.stdout.on('data', (data) => {
            console.log(data);
        });
        
        proc.stderr.setEncoding("utf8");
        proc.stderr.on('data', (data) => {
            console.log(data);
        });

        proc.on('close', () => {
            resolve(`${command} end`);
        });
    })
}

async function packageToDash(fileInfo) {
    const rootPath = path.join(__dirname, 'data', fileInfo.title, fileInfo.mpdName);
    const filePath = path.join(__dirname, 'data', `${fileInfo.fileName}.${fileInfo.ext}`);
    const args = [
        '-i', `${fileInfo.title}.${fileInfo.ext}`,
        '-profile:v', 'baseline',
        '-level', '3.0',
        '-start_number', '0',
        '-hls_time', '2',
        '-hls_list_size', '0',
        '-f', 'hls',
        'master.m3u8'

    ];
    const result = await execac('ffmpeg', args);
    console.log(result);
}

const file = ({
    title: "bae",
    mpdName: "dash.mpd",
    ext: "mp4"
});

packageToDash(file);