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

  Hls.DefaultConfig.loader = HlsjsIpfsLoader;
  Hls.DefaultConfig.debug = false;

  if (Hls.isSupported()) {
    const video = document.getElementById('video');
    const status = document.getElementById('status');
    const hls = new Hls();
    hls.config.ipfs = node;
    hls.config.ipfsHash = CID;
    hls.loadSource('master.m3u8');
    hls.attachMedia(video);

    // hls.on() methods will be triggered when it parsed master.m3u8 file.
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const node = document.createTextNode(`${CID}`);
      status.appendChild(node);

      video.play();
    })
  } else {
    const status = document.getElementById('status');
    const message = document.createTextNode('Sorry, your browser does not support HLS');
    status.appendChild(node);
  }
}

// load HLS video chunks from IPFS/Filecoin nodes to playback the video.
document.addEventListener('DOMContentLoaded', async () => {
  init();
})
