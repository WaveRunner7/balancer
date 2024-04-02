const { erc20Address } = require("C:/Users/Alvin/Downloads/balancer-flash-loan/scripts/addresses");
const { index } = require("C:/Users/Alvin/Downloads/balancer-flash-loan/utils/index");
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
const { ethers } = require('ethers'); // Add this line

const TOKEN_1 = erc20Address.USDC
// ... Rest of your imports ...
const balancerVault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";


async function main() {
  const flashbotsPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Replace with your private key
  //const infuraProjectId = ''; // Replace with your Infura project ID
  const contractAddress = '0xa85EffB2658CFd81e0B1AaD4f2364CdBCd89F3a1' // Replace with your contract address
  const contractAbi = []; // Replace with your contract's ABI

  const provider = new FlashbotsBundleProvider(
    flashbotsPrivateKey,
    `https://relay.flashbots.net`
  );

  const wallet = new ethers.Wallet(flashbotsPrivateKey, provider);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

  // ... Rest of your contract interactions ...

  // Example flash loan parameters
  const loanamount = 8_520_000;
  const loanamountfull = index.getBigNumber(loanamount, 6);

  // Construct the flash loan transaction here
  const FlashLoan = await hre.ethers.getContractFactory("FlashLoanRecipient"); // Replace with your contract's factory
  const flashLoan = await FlashLoan.attach('0xa85EffB2658CFd81e0B1AaD4f2364CdBCd89F3a1');
  //console.log(flashLoan.contractAddress)

  const makeFlashLoanTx = await flashLoan.populateTransaction.makeFlashLoan(
    [TOKEN_1],
    [loanamountfull],
    "0x"
  );

  const flashLoanTransaction = {
    transaction: makeFlashLoanTx,
    signer: wallet, // The signer of the transaction
  };

  // ... Other transactions if needed ...

  const bundleTransactions = [
    flashLoanTransaction,
    // ... other transactions ...
  ];

  // Sign and submit the bundle
  const signedBundle = await wallet.signBundle(bundleTransactions);
  await provider.sendBundle(signedBundle);

  console.log("Flash loan bundle submitted.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
