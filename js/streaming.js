// initIPFS gets video chunks from IPFS using it's own CID. 
async function initIPFS(CID) {
  const repoPath = 'ipfs-' + Math.random();
  let start = new Date();
  const node = await Ipfs.create({
    repo: repoPath,
    config: {
      Bootstrap: [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
        '/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
        '/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        '/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
        '/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN',
        '/ip4/203.247.240.228/tcp/4001/p2p/12D3KooWKLPAVDieCLqV4FhjRXpUZ9biPsKbWWLduBojr5doifh6',
        '/ip4/203.247.240.228/tcp/4003/ws/p2p/12D3KooWDpp2acwvwvHq3ASUQFNY13U5mNC2RhAqw8LC5iUjyqGD'
      ]
    }
  });
  let end = new Date();
  console.log(`IPFS create: ${end-start}ms`);

  const peerID = '/ip4/203.247.240.228/tcp/4003/ws/p2p/12D3KooWDpp2acwvwvHq3ASUQFNY13U5mNC2RhAqw8LC5iUjyqGD';

  addBootstrapPeer(node, peerID);
  printSwarmAddrs(node);
  setTimeout(() => localAddress(node), 3000);

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
  console.log('--- Connected Swarm Peers ---');
  conn.forEach(peer => {
    console.log(peer);
  });
  console.log('-----------------------------');
}

async function printSwarmAddrs(node) {
  const peerInfos = await node.swarm.addrs();
  console.log('-------- Swarm Addrs --------');
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
