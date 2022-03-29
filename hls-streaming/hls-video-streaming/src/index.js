'use strict'

//import * as  IPFS from 'ipfs-core'
/*
import { create } from 'ipfs-core'
import Hls from 'hls.js'
import HlsjsIpfsLoader from 'hlsjs-ipfs-loader'
*/

import { create } from '../node_modules/ipfs-core/cjs/src/index.js'
import Hls from 'https://cdn.jsdelivr.net/npm/hls.js@latest'
import HlsjsIpfsLoader from '../node_modules/hlsjs-ipfs-loader/src/index.js'

// Rapunzel CIDv0
let cidv0_1 = 'Qmcn3b9WpuYbqwUpFUEtqaJofvnJCnzGuRLLEPrWqBnoYi'
let cidv0_2 = 'QmVnTyqiaY4aB5sMD2BbzTpy4izjNvy6iLku5Ch9gQmSjV'
let cidv0_3 = 'QmR3zmVpKFvukuUfXQiKmQYjgiEPnnu5MqShXc9BDXg7Lc'
let cidv0_4 = 'QmNMqPbeey2UgEg845jCbXoYS6j4r7H8sdHECSWySXFKUC'

let cidv1_1 = ''
let cidv1_2 = 'bafybeibij3pacfmj2uaf6prygjj3coxxtb2aeisvy3flfn2onzvie7teie'

async function dht() {
  // DHT for finding peers who have the content
  const ipfs = await IPFS.create()
  const providers = ipfs.dht.findProvs('QmVnTyqiaY4aB5sMD2BbzTpy4izjNvy6iLku5Ch9gQmSjV')

  for await (const provider of providers) {
    console.log(provider.id.toString())
  }
}

document.addEventListener('DOMContentLoaded', async () => {
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
})
