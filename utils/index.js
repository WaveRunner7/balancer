const { ethers } = require("hardhat");


module.exports = {
    index: {
      getBigNumber: (amount, decimals = 18) => {
        return ethers.utils.parseUnits(amount.toString(), decimals);
      }
    }
  };


const getBigNumber = (amount, decimals = 18) => {
  return ethers.utils.parseUnits(amount.toString(), decimals);
};