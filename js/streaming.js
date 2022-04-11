// initIPFS gets video chunks from IPFS using it's own CID. 
async function initIPFS(CID) {
  const repoPath = 'ipfs-' + Math.random();
  let start = new Date();
  const node = await Ipfs.create({repo: repoPath});
  let end = new Date();
  console.log(`IPFS create: ${end-start}ms`);

  addBootstrapPeer(node, '/ip4/203.247.240.228/tcp/4001/p2p/12D3KooWKLPAVDieCLqV4FhjRXpUZ9biPsKbWWLduBojr5doifh6');

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
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const message = document.createTextNode(`${CID}`)
      status.appendChild(message)
      video.play();
    });
  } else {
    const status = document.getElementById('status');
    const message = document.createTextNode('Sorry, your browser does not support HLS')
    status.appendChild(message)
  }
}

// printBootstrapPeers prints all bootstrapping peers
async function printBootstrapPeers(node) {
  const peerList = await node.bootstrap.list();
  for(let peer of peerList.Peers) {
    console.log(peer.toString());
  }
}

// addBootstrapPeer adds bootstrapping peer into the bootstrap peer list, and 
// prints all peers' ID in the list.
async function addBootstrapPeer(node, peerID) {
  let res = await node.bootstrap.add(peerID);
  printBootstrapPeers(node);
}