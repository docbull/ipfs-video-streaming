import path from 'path';
import execa from 'execa';
import fs from 'fs-extra';
import process from 'process';
import dotenv from 'dotenv';
import json2csv from 'json2csv';
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import ffmpeg from 'fluent-ffmpeg';
dotenv.config();

let filePaths = [];

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

// updateVideoLists updates uploaded video lists as CSV file
async function updateVideoLists(fileName, fields, data) {
    let jsonCSV = json2csv.parse;
    const filename = path.join(__dirname, `${fileName}`);

    let rows;
    if (!fs.existsSync(filename)) {
        rows = jsonCSV(data, { header: true });
    } else {
        rows = jsonCSV(data, { header: false });
    }
    fs.appendFileSync(filename, rows);
    fs.appendFileSync(filename, '\r\n');
}

async function readDirectory(filePath, fileInfo) {
    const fsPromises = fs.promises;
    let fileDir = `${filePath}${fileInfo.title}/`;
    console.log(fileDir);
    
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(filePath, fileInfo.title), (err, files) => {
            if (files) {
                files.forEach(file => {
                    filePaths.push(fileDir+file);
                });
                resolve('successfully read the directory');
            }
        });

    });
}

// Web3StorageUploader uploads video chunks into IPFS network using Web3.Storage.
async function Web3StorageUploader(web3Token, fileInfo, filePath) {
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
    const { stdout } = await execa(`ipfs`, [`cid`, `format`, `-f`, `"%M"`, `-b`, `base58btc`, `${cid}`]);
    console.log(`📦 Video chunks are added with CIDv1: "${cid}" and CIDv0: ${stdout}`);

    const fields = [fileInfo.title, fileInfo.CID, fileInfo.thumbnail];
    const data = [{
        title: fileInfo.title,
        CID: cid,
        thumbnail: `${fileInfo.thumbnail}`
    }];
    await updateVideoLists('./video-list.csv', fields, data);

    console.log('🎉 The video is successfully uploaded!');
}

// IPFSUploader uploads video chunks to IPFS network using Web3.Storage, a Filecoin-backed
// Pinning Service
async function IPFSUploader(web3Token, fileInfo, filePath) {
    await readDirectory(filePath, fileInfo)
        .then(result => Web3StorageUploader(web3Token, fileInfo, filePath));
}

// encodesHLS encodes the video using HLS protocol based on ffmpeg that installed in media server
async function encodeHLS(fileInfo, filePath) {
    const workingDir = `${filePath}${fileInfo.title}`
    let args = [
        `${filePath}${fileInfo.title}`
    ];
    // make a directory that has same name of the uploaded video title
    execac('mkdir', args);

    return new Promise((resolve) => {
        ffmpeg(`${filePath}${fileInfo.video}`, { timeout: 432000 })
            .addOptions([
                '-i', `${filePath}${fileInfo.video}`,
                '-profile:v', 'baseline',
                '-level', '3.0',
                '-start_number', '0',
                '-hls_time', '2',
                '-hls_list_size', '0',
                '-f', 'hls'
            ]).output(`${workingDir}/master.m3u8`).on('end', () => {
                console.log('FFmpeg End');
            }).run();
        return '📼 HLS encoded!';
    });
}

exports.uploader = async function (fileInfo) {
    const filePath = path.join(__dirname, '../data/');
    const web3Token = process.env.Web3Token;

    await encodeHLS(fileInfo, filePath)
        .then(result => console.log(result));
    IPFSUploader(web3Token, fileInfo, filePath)
}
