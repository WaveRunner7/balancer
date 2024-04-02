// scripts/resetNonce.js
async function main() {
    const [deployer] = await ethers.getSigners();

  
    // Specify the target address and the desired nonce
    const targetAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const nonce = await ethers.provider.getTransactionCount(targetAddress);
    const desiredNonce = 123; // Replace with the desired nonce value
  
    // Send a transaction to set the nonce of the target address
    await deployer.sendTransaction({
      to: targetAddress,
      nonce: nonce,
    });
  
    console.log(`Nonce of ${targetAddress} set to ${await ethers.provider.getTransactionCount(targetAddress)}`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  