//'use strict'

/*
import { create } from 'ipfs-core'
import Hls from 'hls.js'
import HlsjsIpfsLoader from 'hlsjs-ipfs-loader'
*/

//import { create } from '../node_modules/ipfs-core/cjs/src/index.js'
import { create } from '../js/ipfs-core/cjs/src/index.js'
import Hls from '../node_modules/hls.js/dist/hls.js'
import HlsjsIpfsLoader from '../node_modules/hlsjs-ipfs-loader/src/index.js'

async function init() {
  const testHash = 'QmR3zmVpKFvukuUfXQiKmQYjgiEPnnu5MqShXc9BDXg7Lc'
  const repoPath = 'ipfs-' + Math.random()
  const node = await create({ repo: repoPath })

  Hls.DefaultConfig.loader = HlsjsIpfsLoader
  Hls.DefaultConfig.debug = false
  if (Hls.isSupported()) {
    const video = document.getElementById('video')
    const status = document.getElementById('status')
    const hls = new Hls()
    hls.config.ipfs = node
    hls.config.ipfsHash = testHash
    hls.loadSource('master.m3u8')
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const node = document.createTextNode(`${testHash}`);
      status.appendChild(node);

      video.play()
    })
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  init()
})
