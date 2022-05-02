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

exports.encodeHLS = async function (fileInfo) {
    const filePath = path.join(__dirname, "../../data");
    const workingDir = `${filePath}/${fileInfo.title}`
    let args = [
        `${filePath}/${fileInfo.title}`
    ];
    execac('mkdir', args);
    args = [
        '-i', `${filePath}/${fileInfo.video}`,
        '-profile:v', 'baseline',
        '-level', '3.0',
        '-start_number', '0',
        '-hls_time', '2',
        '-hls_list_size', '0',
        '-f', 'hls',
        `${workingDir}/master.m3u8`
    ];
    const result = await execac('ffmpeg', args);
    console.log(result);
}

const testFileInfo = ({
    title: "bae",
    ext: "mp4"
});
