const { ethers } = require("ethers");

const flashbotsURL = "https://rpc.flashbots.net";
const provider = new ethers.providers.JsonRpcProvider(
  flashbotsURL 
);

async function main() {
const signer = provider.getSigner();
const userAddress = await signer.getAddress();
const ethBalance = await provider.getBalance(userAddress);
console.log(`User:${userAddress} Balance:${ethBalance}ETH`);

}
//

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});