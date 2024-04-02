// import it into your project
const { legos } = "money-legos"

// instantiate contracts with it

async function main() {


    const daiContract = new ethers.Contract(
      legos.erc20.abi,
      legos.erc20.dai.address,
      provider
    )
    // start interacting!
    const balanceWei = await daiContract.balanceOf(
     "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
    )
    const balance = ethers.utils.formatEther(balanceWei)
    console.log(`Balance of EF: ${balance.toString()}`)

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });