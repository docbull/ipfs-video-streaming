// connectWalletPressed waits MetaMask button click event for MetaMask wallet connection.
// 
async function connectWalletPressed() {
    if (window.ethereum) {    
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (addressArray.length > 0) {
                console.log("🦊 MetaMask connected!");
                document.getElementById('walletButton').src = "/metamask_connected.png";
            } else {
                console.log("🦊 Please connect to MetaMask using the top-right button.");
            }
        } catch (error) {
            console.log("😥 Something went wrong." + error);
        }
    } else {
        console.log("❗️ Your browser is not support Ethereum.");
    }
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