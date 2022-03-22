export async function processAnnounce(addr) {
    const ipfsAPI = require('ipfs-core')
    const ipfs = ipfsAPI.create({
        repo: 'ok' + Math.random(),
        config: {
            Addresses: {
                Swarm: [
                    '/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
                ]
            },
        }
    })

    peers = await ipfs.warm.peers();
    for(i in peers) {
        if(peers[i].peer == peer) {
            return
        }
    }

    // get our peerid
    myIPFSID = await ipfs.id();
    myIPFSID = myIPFSID.id;

    // not really an announcement if it's from us
    if (addr.from == myIPFSID) {
        return;
    }

    // if we got a keep-alive, nothing to do
    if (addr == "keep-alive") {
        console.log(addr);
        return;
    }

    peer = addr.split("/")[9];
    console.log("Peer: " + peer);
    console.log("Me: " + myIPFSID);
    if (peer == myIPFSID) { // return if the peer being announced is us
        return;
    }

    // get a list of peers
    peers = await ipfs.swarm.peers();
    for (i in peers) {
        // if we're already connected to the peer, don't bother doing a
        // circuit connection
        if (peers[i].peer == peer) {
            return;
        }
    }
    // log the address to console as we're about to attempt a connection
    console.log(addr);

    // connection almost always fails the first time, but almost always
    // succeeds the second time, so we do this:
    try {
        await ipfs.swarm.connect(addr);
    } catch(err) {
        console.log(err);
        await ipfs.swarm.connect(addr);
    }
}

// process announcements over the relay network, and publish our own
// keep-alives to keep the channel alive
await ipfs.pubsub.subscribe("announce-circuit", processAnnounce);
setInterval(function(){ipfs.pubsub.publish("announce-circuit", "peer-alive");}, 15000);