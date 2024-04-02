// A Simple program to make 2 ether transfers hidden from the mempool with flashbots

//https://www.youtube.com/watch?v=gme0uNyIIsE


import {Wallet, BigNumber, providers} from 'ethers'
const {FlashbotsBundleProvider, FlashbotsBundleResolution} = require('@flashbots/ethers-provider-bundle');
const provider = new providers.JsonRpcProvider(
    'http://127.0.0.1:8545/'
)

const authSigner = new Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
)

const start = async () => {
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        'https://relay.flashbots.net'
    )

    const GWEI = BigNumber.from(10).pow(9)
	const LEGACY_GAS_PRICE = GWEI.mul(13)
	const PRIORITY_FEE = GWEI.mul(100)
	const blockNumber = await provider.getBlockNumber()
	const block = await provider.getBlock(blockNumber)
	const maxBaseFeeInFutureBlock =
		FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, 6)
    
     
}
