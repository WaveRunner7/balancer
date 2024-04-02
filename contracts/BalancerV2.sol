// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.0;
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "./IFlashLoanRecipient.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
//import "./IBalancerVault.sol";
import "hardhat/console.sol";
//import "./ISwap.sol";

contract FlashLoanRecipient is IFlashLoanRecipient {
    using SafeMath for uint256;

    address public immutable vaultAddress;
    address public immutable Token1;
    address payable owner;
    IVault public immutable vault;
    //ISwap public immutable swapVault;

    //address _vault, address _Token1) other constructor params
    constructor() {
        vaultAddress = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;//_vault;
        Token1 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;//_Token1;
        vault = IVault(vaultAddress);
        //swapVault = ISwap(vaultAddress);
    }

    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory
    ) external override {
        // Business Logic
        
        // Returning Function
        for (uint256 i = 0; i < tokens.length; ++i) {
            IERC20 token = tokens[i];
            uint256 amount = amounts[i];
            //vault.joinPool(0xfebb0bbf162e64fb9d0dfe186e517d84c395f016000000000000000000000502, vaultAddress, address(this));
            console.log("borrowed amount:", amount);
            uint256 feeAmount = feeAmounts[i];
            console.log("flashloan fee: ", feeAmount);
            
            

            // Return loan
            token.transfer(vaultAddress, amount);
            //withdraw Profit if there is some
            IERC20 tokenA = IERC20(Token1);
            if ( tokenA.balanceOf(address(this)) != 0 ) {
                withdraw(Token1);
            }
        }
    }

    function makeFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        bytes memory userData
    ) external {
        //TokenA = tokens;
        vault.flashLoan(
            IFlashLoanRecipient(address(this)),
            tokens,
            amounts,
            userData
        );
    }

    function withdraw(address _tokenAddress) public onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    //function poolData() view public {
        //return "Hello World";
    //    vault.getPoolTokens(0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014);
    //}

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}
