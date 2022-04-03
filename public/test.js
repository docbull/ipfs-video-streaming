const IPFS = require('../node_modules/ipfs-core/cjs/src/index.js');
const Hls = require('../node_modules/hls.js/dist/hls.js');
const HlsjsIpfsLoader = require('../node_modules/hlsjs-ipfs-loader/src/index.js');
//const Hls = require('hls.js');
//const HlsjsIpfsLoader = require('hlsjs-ipfs-loader');

async function init() {
  // test CID for streaming rapunzel.mp4; encoded to HLS using FFmpeg
  const CID = 'QmR3zmVpKFvukuUfXQiKmQYjgiEPnnu5MqShXc9BDXg7Lc';
  const repoPath = 'ipfs-' + Math.random();
  const node = await IPFS.create({
    repo: repoPath
  })

  const stream = node.cat('QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A')
  let data = ''

  for await (const chunk of stream) {
    data += chunk.toString()
  }

  console.log(data)
}

// load HLS video chunks from IPFS/Filecoin nodes to playback the video.
document.addEventListener('DOMContentLoaded', async () => {
  init();
})
