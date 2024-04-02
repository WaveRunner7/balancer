import { providers, Wallet, } from "ethers";
import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
} from "@flashbots/ethers-provider-bundle";

import { ethers } from "hardhat";
import { error } from "console";

const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const CHAIN_ID = 5; // eth mainnet
const FLASHBOTS_ENDPOINT = "https://rpc-goerli.flashbots.net";

const providerr = new providers.JsonRpcProvider({
  // @ts-ignore
  //url: 'http://127.0.0.1:8545/',//'https://rpc.tenderly.co/fork/bd83ff9a-5efb-480e-a35a-356cebe064c9',//'http://127.0.0.1:8545',//
  //url: 'https://rpc.tenderly.co/fork/bd83ff9a-5efb-480e-a35a-356cebe064c9',
  url: 'https://eth-goerli.g.alchemy.com/v2/UTmFIzS5YU3jTzrbxxuZt8QngVxA9nlI',
});

// @ts-ignore
const wallet = new Wallet(process.env.MAIN_PRIV, providerr);

async function main() {
  const targetAddress = "0xf7a79D203ea69E78F9D3F33c68eA7160537E7A57";
  const nonce = await providerr.getTransactionCount(targetAddress);

  //const blockNumber: number = await providerr.getBlockNumber();
  //const bllock = ethers.providers.Block = await providerr.getBlock(blockNumber);

  console.log(nonce)

  const signer = new Wallet(
    "0xf89330067cd27fd7fd8f6819f56fb3a4b7aa56d6e0a7ea26e4b2aca9a14bc869"
  );
  //   const signer = Wallet.createRandom();
  const flashbot = await FlashbotsBundleProvider.create(
    providerr,
    signer,
    FLASHBOTS_ENDPOINT
  );
  providerr.on("block", async (block) => {
    console.log(`block: ${block}`);

    const signedTx = await flashbot.signBundle([
      {
        signer: wallet,
        transaction: {
          chainId: CHAIN_ID,
          // EIP 1559 transaction
          type: 2,
          value: 0,
          data: "0x",
          maxFeePerGas: GWEI * 3n,//91815759765,//78506209663,//GWEI * 3n,
          maxPriorityFeePerGas: GWEI * 2n,
          gasLimit: 1000000,
          to: "0xf7a79D203ea69E78F9D3F33c68eA7160537E7A57",
          nonce: nonce,
        },
      },
    ]);

    const targetBlock = block + 1;
    const sim = await flashbot.simulate(signedTx, targetBlock);

    if ("error" in sim) {
      console.log(`simulation error: ${sim.error.message}`);
    } else {
      console.log(`simulation success: ${JSON.stringify(sim, null, 2)}`);
      console.log(`simulation success`);
    }

    const res = await flashbot.sendRawBundle(signedTx, targetBlock);
    if ("error" in res) {
      throw new Error(res.error.message);
    }

    const bundleResolution = await res.wait();
    if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
      console.log(`Congrats, included in ${targetBlock}`);
      console.log(JSON.stringify(sim, null, 2));
      process.exit(0);
    } else if (
      bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion
    ) {
      console.log(`Not included in ${targetBlock}`);
    } else if (
      bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh
    ) {
      console.log("Nonce too high, bailing");
      process.exit(1);
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});