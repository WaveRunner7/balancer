const hre = require("hardhat");
const ethers = require("ethers")
const solc = require("solc")
const fs = require("fs-extra")
require("dotenv").config()

var Implement_Address = null
const My_Add = process.env.OLD_AD

async function main () {
    ServiceRegistryFacotry = await hre.ethers.getContractFactory("contracts/ServiceRegistry.sol:ServiceRegistry");
    ServiceRegistry = await ServiceRegistryFacotry.deploy()
    console.log(ServiceRegistry.address)

    OperationExecutorFactory = await hre.ethers.getContractFactory("OperationExecutor");
    OperationExecutor = await OperationExecutorFactory.deploy(ServiceRegistry.address)
    console.log(OperationExecutor.address)

    //DEPLOY ACCOUNTGUARD
    const AccountGuardContractFactory = await hre.ethers.getContractFactory("AccountGuard");
    const AccountGuard = await AccountGuardContractFactory.deploy();
    //GET PERMISSION FROM GUARD
    console.log(AccountGuard.address)
    const AccountGuard_Address = await AccountGuard.address
    //console.log(await AccountGuard.permit("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", true))
    //console.log(await AccountGuard.canCall("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))

    //DEPLOY ACCOUNTIMPLEMENTATION
    const AccountImplementationFactory = await hre.ethers.getContractFactory("AccountImplementation")
    const AccountImplementation = await AccountImplementationFactory.deploy(AccountGuard_Address)
    //RUN FUNCTION
    Implement_Address = await AccountImplementation.address
    console.log(await AccountGuard.initializeFactory())
    console.log(Implement_Address)
    //console.log(await AccountGuard.permit("0xcA71C36D26f515AD0cce1D806B231CBC1185CdfC", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",true))
    console.log(await AccountGuard.permit(My_Add,My_Add,true))
    console.log(await AccountGuard.permit(OperationExecutor.address,My_Add,true))
    console.log(await AccountGuard.permit(My_Add,Implement_Address,true))

    console.log(await AccountGuard.setWhitelist(My_Add, true))
    console.log(await AccountGuard.setWhitelist(OperationExecutor.address, true))
    console.log(await AccountGuard.setWhitelist(Implement_Address, true))
    console.log(await AccountGuard.canCall(My_Add,My_Add))

    //EXECUTE FUNCTION
    AccountImplementation.execute(OperationExecutor.address, "0xf1298ed70000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000154000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000126000000000000000000000000000000000000000000000000000000000000013a0659de0ea7426ebf3658481941708805f7ecc3f3743ffe9b690fb9bda9420e1f200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000116485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000114000000000000000000000000000000000000000000000000000000000000010e000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002c1e8070000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000005a00000000000000000000000000000000000000000000000000000000000000ca00000000000000000000000000000000000000000000000000000000000000e8036303c18db5a95d0dd17b9bac9bc1dbd0130264cd8a04fb5e9b427a3a03ad49e00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000800000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000001a9cea49daeb8c36ea707a9171ebdf4097796dd40000000000000000000000000000000000000000000000000000000002c1e8070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063a704c764c67859c50bac2b538e4a24d8e687ad8dd81ecdf715e3523b9d5e5d00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000173eb4c80a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009f9d224c26adad40cade24655f1c5e3cf307c390fc6874e710cb56bdd504bc2600000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000000000000253ed73b900000000000000000000000000000000000000000000000000000000024ca555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000004a87c0252000000000000000000000000003208684f96458c540eb08f6f01b9e9afb2b7d4f000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000003208684f96458c540eb08f6f01b9e9afb2b7d4f0000000000000000000000000826e9f2e79ceea850df4d4757e0d12115a720d740000000000000000000000000000000000000000000000000000000253ed73b900000000000000000000000000000000000000000000000000000000024ca55500000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002f40000000000000000000000000000000000000000000002b600028800023e00a007e5c0d200000000000000000000000000000000000000000000021a00020000013051204a585e0f7c18e2c414221d6402652d5e0990e5f8a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800a4a5dcbcdf000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000d0b2f5018b5d22759724af6d4281ac0b132663600000000000000000000000003208684f96458c540eb08f6f01b9e9afb2b7d4f0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005120d51a44d3fae010294c616388b506acda1bfaae46dac17f958d2ee523a2206206994597c13d831ec70044394747c5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000249b01400000000000000000000000000000000000000000000000000000000000000000020d6bdbf782260fac5e5542a773aa44fbcfedf7c193bc2c59900a0f2fa6b662260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000024f9a9600000000000000000000000000004bc680a06c4eca272260fac5e5542a773aa44fbcfedf7c193bc2c5991111111254fb6c44bac0bed2854e76f90643097d0000000000000000000000000000000000000000000000000000000253ed73b9000000000000000000000000b03a869400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099a01a03a55f29ec20c6bf18507e20b640f963fe896c06188dfa3bf5a753ddc400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000600000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000ca71c36d26f515ad0cce1d806b231cbc1185cdfc0000000000000000000000000000000000000000000000000000000002c1e807000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b8020e49c93f2144cdce5b93dc159b086f98dcfba95a09eec862664fbfa6a8a40000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000166438e3cb190ad4e896f7b4bd36c98f5b7dc3f5eb885f019521b3b819bc0de80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000166438e3cb190ad4e896f7b4bd36c98f5b7dc3f5eb885f019521b3b819bc0de80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d416a6e61436c6f7365546f436f6c6c61746572616c506f736974696f6e000000")
    //const provider = new ethers.getDefaultProvider("http://127.0.0.1:8545")
    // let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    //let wallet = new ethers.Wallet(process.env.FORK_WALLET_SECRET, provider)

    //const abi = fs.readFileSync("./BalancerV2_sol_FlashLoanRecipient.abi", "utf8")
    //const binary = fs.readFileSync(
    //    "./BalancerV2_sol_FlashLoanRecipient.bin",
    //    "utf8"
    //)
    //const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    //const contract = await contractFactory.deploy();
    //console.log(contract)
    


    //console.log("The Thingg: ")
    //const nonce = await wallet.getTransactionCount();
    //const tx = {
    //    nonce: nonce,
    //    gasPrice: 20000000000,
    //    gasLimit: 6721975,
    //    to: Implement_Address,
    //    value: 0,
    //    data: "0x1cff79cd000000000000000000000000ca71c36d26f515ad0cce1d806b231cbc1185cdfc00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001584f1298ed70000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000154000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000126000000000000000000000000000000000000000000000000000000000000013a0659de0ea7426ebf3658481941708805f7ecc3f3743ffe9b690fb9bda9420e1f200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000116485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000114000000000000000000000000000000000000000000000000000000000000010e000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002c1e8070000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000005a00000000000000000000000000000000000000000000000000000000000000ca00000000000000000000000000000000000000000000000000000000000000e8036303c18db5a95d0dd17b9bac9bc1dbd0130264cd8a04fb5e9b427a3a03ad49e00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000800000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000001a9cea49daeb8c36ea707a9171ebdf4097796dd40000000000000000000000000000000000000000000000000000000002c1e8070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063a704c764c67859c50bac2b538e4a24d8e687ad8dd81ecdf715e3523b9d5e5d00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000173eb4c80a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009f9d224c26adad40cade24655f1c5e3cf307c390fc6874e710cb56bdd504bc2600000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000000000000253ed73b900000000000000000000000000000000000000000000000000000000024ca555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000004a87c0252000000000000000000000000003208684f96458c540eb08f6f01b9e9afb2b7d4f000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000003208684f96458c540eb08f6f01b9e9afb2b7d4f0000000000000000000000000826e9f2e79ceea850df4d4757e0d12115a720d740000000000000000000000000000000000000000000000000000000253ed73b900000000000000000000000000000000000000000000000000000000024ca55500000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002f40000000000000000000000000000000000000000000002b600028800023e00a007e5c0d200000000000000000000000000000000000000000000021a00020000013051204a585e0f7c18e2c414221d6402652d5e0990e5f8a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800a4a5dcbcdf000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000d0b2f5018b5d22759724af6d4281ac0b132663600000000000000000000000003208684f96458c540eb08f6f01b9e9afb2b7d4f0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005120d51a44d3fae010294c616388b506acda1bfaae46dac17f958d2ee523a2206206994597c13d831ec70044394747c5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000249b01400000000000000000000000000000000000000000000000000000000000000000020d6bdbf782260fac5e5542a773aa44fbcfedf7c193bc2c59900a0f2fa6b662260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000024f9a9600000000000000000000000000004bc680a06c4eca272260fac5e5542a773aa44fbcfedf7c193bc2c5991111111254fb6c44bac0bed2854e76f90643097d0000000000000000000000000000000000000000000000000000000253ed73b9000000000000000000000000b03a869400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099a01a03a55f29ec20c6bf18507e20b640f963fe896c06188dfa3bf5a753ddc400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000600000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000ca71c36d26f515ad0cce1d806b231cbc1185cdfc0000000000000000000000000000000000000000000000000000000002c1e807000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b8020e49c93f2144cdce5b93dc159b086f98dcfba95a09eec862664fbfa6a8a40000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000166438e3cb190ad4e896f7b4bd36c98f5b7dc3f5eb885f019521b3b819bc0de80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a485e92d980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000166438e3cb190ad4e896f7b4bd36c98f5b7dc3f5eb885f019521b3b819bc0de80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a485e92d98000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d416a6e61436c6f7365546f436f6c6c61746572616c506f736974696f6e00000000000000000000000000000000000000000000000000000000000000",
    //    chainId: provider.chainId,
    //};
    
    //const signedTxResponse = await wallet.signTransaction(tx);
    //console.log(signedTxResponse);
    //const sentTxResponse = await wallet.sendTransaction(tx);
    //await sentTxResponse.wait(1);
    //console.log(sentTxResponse)
    

}



main()
