const { erc20Address } = require("C:/Users/Alvin/Downloads/balancer-flash-loan/scripts/addresses");
const { index } = require("C:/Users/Alvin/Downloads/balancer-flash-loan/utils/index");
// TOKENS FOR FLASHLOAN
const TOKEN_1 = erc20Address.WETH
//const TOKEN_1 = "0xC6A6E859d337B5d595E0726bC99071279d9C137C"
//const TOKEN_2 = null

//USDC Supports Full Amount of Balance to FlashLoan about 9 Million...
//MOST TOKEN BORROW CAPS ARE AROUND THE 9-15 MILLION MARK.

//run this command in hardhat to test on localhost: npx hardhat run --network localhostnet scripts/deployBalancerFlashLoan.js
//run this command in hardhat to run on ETHmainnet: npx hardhat run --network mainnet scripts/deployBalancerFlashLoan.js

const balancerVault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";


const hre = require("hardhat");


// MAIN FUNCTION FOR DEPLOYING BALANCER FLASHLOAN
async function main() {
    // TOKEN HANDLING VARS
  Lock = await hre.ethers.getContractFactory("Lock")
  token = Lock.attach(TOKEN_1)
  const SYMBOL = await token.symbol()
  const DECIM = await token.decimals()



  // Actual Deploying Of Contract with slashes to make it look COOL!
  console.log("Hi,",process.env.ACCOUNT_ADDRESS, "deploying...");
  console.log(" ")
  console.log("/")
  const FlashLoan = await hre.ethers.getContractFactory("FlashLoanRecipient");
  const flashLoan = await FlashLoan.deploy();//(balancerVault, TOKEN_1);

  //const FlashLoan = await hre.ethers.getContractFactory("FlashLoanRecipient"); // Replace with your contract's factory
  //const flashLoan = await FlashLoan.attach('0xa85EffB2658CFd81e0B1AaD4f2364CdBCd89F3a1');



  await flashLoan.deployed();

  console.log("BalancerV2 Flash Loan contract deployed: ", flashLoan.address);
  console.log("//")
  console.log("Balancer V2 Vault Address: ", await flashLoan.vault())
  console.log("///")
  console.log("Selected Token:", SYMBOL)
  console.log("////")
  console.log(await SYMBOL, "Token Address: ", TOKEN_1)
  console.log("/////")
  console.log("Balance Of", SYMBOL, "Token In BalancerV2 Vault:", await token.balanceOf(flashLoan.vault()))
  console.log("/////")
  console.log("Decimals Of", SYMBOL, ":", DECIM)
  console.log("//////")

  console.log("Running Function: makeFlashLoan....")
  console.log("///////")
  var loanamount
  var loanamountfull
  loanamount = 860.6573//50000//16_304//10_520_000//65000 9_348_000
  loanamountfull = index.getBigNumber(loanamount, DECIM)

  // Note Inputs Have To Have the [INPUT] format for both javascript, and remix, because of the nature of this contract, 
    //only Accepts Arrays

  await flashLoan.makeFlashLoan(
    [TOKEN_1],
    [loanamountfull],
    "0x",
  )

  console.log("FlashLoaned With BalancerV2 a Total Of ", loanamount, SYMBOL)
  console.log("///////")
  
  

  //console.log(hre.ethers.utils.parseUnits("10000000", await token.decimals()))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
