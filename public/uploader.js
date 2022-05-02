import path from 'path';
import execa from 'execa';
import fs from 'fs-extra';
import process from 'process';
import dotenv from 'dotenv';
import { Web3Storage, getFilesFromPath } from 'web3.storage';
dotenv.config();

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

// Web3StorageUploader uploads video chunks into IPFS network using Web3.Storage.
async function Web3StorageUploader(web3Token, filePaths) {
    const token = web3Token;

    if (!token) {
        return console.error('🔖 A token is needed. You can create one on https://web3.storage');
    }

    if (filePaths.length < 1) {
        return console.error('😅 Please supply the path to a file or directory');
    }

    const storage = new Web3Storage({ token });
    const files = []
    for (const path of filePaths) {
        const pathFiles = await getFilesFromPath(path);
        files.push(...pathFiles);
    }

    console.log(`📤 Uploading ${files.length} files`);
    const cid = await storage.put(files);
    console.log('📦 Content added with CIDv1:', `"${cid}"`);
    const { stdout } = await execa(`ipfs`, [`cid`, `format`, `-f`, `"%M"`, `-b`, `base58btc`, `${cid}`]);
    console.log('📦 Content added with CIDv0:', stdout);
    console.log('🎉 The video is successfully uploaded!');
}

// encodesHLS encodes the video using HLS protocol based on ffmpeg that installed in media server. 
async function encodeHLS(fileInfo, filePath) {
    const workingDir = `${filePath}${fileInfo.title}`
    let args = [
        `${filePath}${fileInfo.title}`
    ];
    execac('mkdir', args);
    args = [
        '-i', `${filePath}${fileInfo.video}`,
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

exports.uploader = async function (fileInfo) {
    const filePath = path.join(__dirname, '../data/');
    const web3Token = process.env.Web3Token;

    let fileDir = `${filePath}${fileInfo.title}/`;
    let filePaths = [];
    fs.readdir(path.join(filePath, fileInfo.title), (err, files) => {
        if (files) {
            files.forEach(file => {
                console.log(file);
                filePaths.push(fileDir+file);
            });
        }
    });

    await encodeHLS(fileInfo, filePath)
        .then(result => Web3StorageUploader(web3Token, filePaths));
}
