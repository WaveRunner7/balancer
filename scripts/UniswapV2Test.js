// https://www.youtube.com/watch?v=0TREYDENMcA
const { ethers } = require('ethers');
const { index } = require("C:/Users/Alvin/Downloads/balancer-flash-loan/utils/index");

const UniswapRouter02Address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const ABI = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts);'
]

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

const amountIn = ethers.utils.parseEther("1");
console.log(amountIn);

//TOKENS IN AND OUT
const path = ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2','0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'];


const router = new ethers.Contract(
    UniswapRouter02Address,
    ABI,
    provider
)

const main = async() => {
    const accounts = await router.getAmountsOut(amountIn, ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"])
    const price = ethers.utils.formatUnits(accounts[1].toString(), 6)
    console.log('price', price)
}

main()