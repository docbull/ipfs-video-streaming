'use strict'

import { create } from 'ipfs-core'
import Hls from './hls.js'
import HlsjsIpfsLoader from './hlsjs-ipfs-loader.min.js'

document.addEventListener('DOMContentLoaded', async () => {
  const testHash = 'bafybeigwiw6ngj5aeqkim27xb5bpgg3pdpuk3xvwypqp3yotf6vun25jnu'
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
})
