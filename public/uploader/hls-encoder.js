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

// async function encodeHLS(fileInfo) {
//     const args = [
//         '-i', `${fileInfo.title}.${fileInfo.ext}`,
//         '-profile:v', 'baseline',
//         '-level', '3.0',
//         '-start_number', '0',
//         '-hls_time', '2',
//         '-hls_list_size', '0',
//         '-f', 'hls',
//         'master.m3u8'
//     ];
//     const result = await execac('ffmpeg', args);
//     console.log(result);
// }

exports.encodeHLS = async function (fileInfo) {
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

const testFileInfo = ({
    title: "bae",
    ext: "mp4"
});

//encodeHLS(testFileInfo);
