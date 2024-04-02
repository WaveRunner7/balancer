//import { Wallet, BigNumber, ethers, providers } from 'ethers'
// Import the required modules from ethers
const { Wallet, BigNumber, ethers, providers } = require('ethers');

const { FlashbotsBundleProvider, FlashBotsBundleResolution } = require('@flashbots/ethers-provider-bundle')

const provider = new providers.JsonRpcProvider(
    'http://127.0.0.1:8545'
)

const authSigner = new Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
)

const start = async() => {
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        'https://relay.flashbots.net',
    )

    const GWEI = BigNumber.from(10).pow(9)
    const LEGACY_GAS_PRICE = GWEI.mul(13)
    const PRIORITY_FEE = GWEI.mul(100)
    const blockNumber = await provider.getBlockNumber()
    const block = await provider.getBlock(blockNumber)
    const maxBaseFeeInFutureBlock =
        FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, 6)
    const amountInEther = '0.001'

    const signedTransactions = await flashbotsProvider.signBundle([
        {
            signer: authSigner,
            transaction: {
                to: '0xf201fFeA8447AB3d43c98Da3349e0749813C9009',
                type: 2,
                maxFeePerGas: PRIORITY_FEE.add(maxBaseFeeInFutureBlock),
                maxPriorityFeePerGas: PRIORITY_FEE,
                data: '0x',
                chainId: 1,
                value: ethers.utils.parseEther(amountInEther),
            },
        },

        {
            signer: authSigner,
            transaction: {
                to: '0xf201fFeA8447AB3d43c98Da3349e0749813C9009',
                gasPrice: LEGACY_GAS_PRICE,
                data: '0x',
                value: ethers.utils.parseEther(amountInEther),
            },
        },
    ])

    console.log(new Date())
    console.log('Starting to run the simulation...')
    const simulation = await flashbotsProvider.simulate(
        signedTransactions,
        blockNumber + 1,
    )
    console.log(new Date())

    if (simulation.firstRevert) {
        console.log(`Simulation Error: ${simulation.firstRevert.error}`)
    
    } else {
        console.log(
            `Simulation Success: ${blockNumber}}`
        )

    }



}

start()