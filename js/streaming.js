// initIPFS gets video chunks from IPFS using it's own CID. 
async function initIPFS(CID) {
  const repoPath = 'ipfs-' + Math.random();
  let start = new Date();
  const node = await Ipfs.create({
    repo: repoPath,
  });
  let end = new Date();
  console.log(`IPFS create: ${end-start}ms`);

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
      const message = document.createTextNode(`${CID}`);
      status.appendChild(message);
      video.play();
    });
  } else {
    const status = document.getElementById('status');
    const message = document.createTextNode('Sorry, your browser does not support HLS');
    status.appendChild(message);
  }
}

async function printBitswapStat(node) {
  const stats = node.bitswap.stat();
  console.log("🗂", stats);
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

// printSwarmPeers shows connected IPFS nodes in swarm.
async function printSwarmPeers(node) {
  const conn = await node.swarm.peers();
  console.log('--- Connected Swarm Peers ---');
  conn.forEach(peer => {
    console.log(peer);
  });
  console.log('-----------------------------');
}

// printSwarmAddrs shows IPFS bootstrap nodes' multi-addresses even they
// are not connected.
async function printSwarmAddrs(node) {
  const peerInfos = await node.swarm.addrs();
  console.log('-------- Swarm Addrs --------');
  peerInfos.forEach(info => {
    console.log(info.id);
    info.addrs.forEach(addr => console.log(addr.toString()));
  })
  console.log('-----------------------------');
}

// addSwarmPeer tries to connect with IPFS peer
async function addSwarmPeer(node, peerID) {
  await node.swarm.connect(peerID);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        console.log("🦊 MetaMask connected!");
        document.getElementById('walletButton').src = "/metamask_connected.png";
      } else {
        console.log("🦊 Please connect to MetaMask using the top-right button.");
        document.getElementById('walletButton').src = "/metamask_disconnected.png";
      }
    } catch (error) {
      console.log("😢 " + error);
    }
  } else {
    console.log("You need to install MetaMask");
  }
});
