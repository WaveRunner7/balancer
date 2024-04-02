require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  //solidity: 0.8.4,
  //solidity: "0.7.3",
  defaultNetwork: "localhostnet",

  networks: {
    hardhat: {
      //chainId: 31337,
      //chainId: 1337
      chainId: 1,
      forking: {
        url: process.env.ETH_MAIN_NEW, //INFURA2 ALCHEMY
      },
    },

    tenderly: {
      url: "https://rpc.tenderly.co/fork/bd83ff9a-5efb-480e-a35a-356cebe064c9",
      accounts: [process.env.FORK_WALLET_SECRET],
    },

    sepolia: {
      url: process.env.INFURA_SEPOLIA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    //  
    },
    inf_goerli: {
      url: process.env.INFURA_GOERLI_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },

    goerli: {
      url: process.env.GOE,
      accounts: [process.env.PRIVATE_KEY],
    },

    flashbots: {
      url: process.env.FLASHBOTSS,
      accounts: [process.env.PRIVATE_KEY],
    },

    localhostnet: {
      chainId: 1,
      url: 'http://127.0.0.1:8545/',
      accounts: [process.env.FORK_WALLET_SECRET],
      gas: 30000000 
      //accounts: [process.env.FORK_WALLET_SECRET]
      //accounts: [process.env.PRIVATE_KEY]

    },
    mainnet: {
      url: process.env.INFURA_MAINNET_ENDPOINT,
      accounts:[process.env.PRIVATE_KEY]
    },
  },
};
