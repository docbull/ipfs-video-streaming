// initIPFS gets video chunks from IPFS using it's own CID. 
async function initIPFS(CID) {
  const repoPath = 'ipfs-' + Math.random();
  let start = new Date();
  const node = await Ipfs.create({
    repo: repoPath,
    config: {
      /*
      Bootstrap: [
        '/ip4/203.247.240.228/tcp/4001/p2p/12D3KooWKLPAVDieCLqV4FhjRXpUZ9biPsKbWWLduBojr5doifh6',
        '/ip4/203.247.240.228/tcp/4002/p2p/12D3KooWDpp2acwvwvHq3ASUQFNY13U5mNC2RhAqw8LC5iUjyqGD',
        '/ip4/203.247.240.228/tcp/4003/ws/p2p/12D3KooWDpp2acwvwvHq3ASUQFNY13U5mNC2RhAqw8LC5iUjyqGD',
        '/ip4/147.75.109.213/tcp/4001/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/ip4/147.75.83.83/tcp/4001/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip4/127.0.0.1/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip6/2604:1380:2000: 7a00::1/tcp/4001/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip6/::1/tcp/4001/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip4/147.75.83.83/udp/4001/quic/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip4/127.0.0.1/udp/4001/quic/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip6/2604:1380:2000:7a00::1/udp/4001/quic/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip6/::1/udp/4001/quic/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip4/127.0.0.1/tcp/8081/ws/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/ip6/64:ff9b::934b:5353/udp/4001/quic/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'
      ]
      */
    }
  });
  let end = new Date();
  console.log(`IPFS create: ${end-start}ms`);

  const peerID = '/ip4/203.247.240.228/tcp/4001/p2p/12D3KooWKLPAVDieCLqV4FhjRXpUZ9biPsKbWWLduBojr5doifh6';
  //const peerID = '/ip4/203.247.240.228/tcp/9090/ws/p2p-webrtc-star';
  
  addBootstrapPeer(node, peerID);
  //printBootstrapPeers(node);
  setTimeout(() => printSwarmAddrs(node), 5000);

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

// printBootstrapPeers prints all bootstrapping peers.
async function printBootstrapPeers(node) {
  const peerList = await node.bootstrap.list();
  console.log('------ Bootstrap Peers ------');
  for(let peer of peerList.Peers) {
    console.log(peer.toString());
  }
  console.log('-----------------------------');
}

// addBootstrapPeer adds bootstrapping peer into the bootstrap peer list.
async function addBootstrapPeer(node, peerID) {
  let res = await node.bootstrap.add(peerID);
  console.log('added peer:', res.Peers.toString());
}

async function printSwarmPeers(node) {
  const conn = await node.swarm.peers();
  console.log('-------- Swarm Peers --------');
  conn.forEach(peer => {
    console.log(peer);
  });
  console.log('-----------------------------');
}

async function printSwarmAddrs(node) {
  const peerInfos = await node.swarm.addrs();
  console.log('--- Connected Swarm Addrs ---');
  peerInfos.forEach(info => {
    console.log(info.id);
    info.addrs.forEach(addr => console.log(addr.toString()));
  })
  console.log('-----------------------------');
}

async function addSwarmPeer(node, peerID) {
  await node.swarm.connect(peerID);
}

async function localAddress(node) {
  const multiAddrs = await node.swarm.localAddrs();
  console.log(multiAddrs);
}
