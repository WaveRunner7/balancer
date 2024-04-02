// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@balancer-labs/v2-vault/contracts/Swaps.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISwap {


    function swap(
        SingleSwap memory singleSwap,
        FundManagement memory funds,
        uint256 limit,
        uint256 deadline
    )
        external
        payable
        override
        nonReentrant
        whenNotPaused
        authenticateFor(funds.sender)
        returns (uint256 amountCalculated);

    function batchSwap(
        SwapKind kind,
        BatchSwapStep[] memory swaps,
        IAsset[] memory assets,
        FundManagement memory funds,
        int256[] memory limits,
        uint256 deadline
    )
        external
        payable
        override
        nonReentrant
        whenNotPaused
        authenticateFor(funds.sender)
        returns (int256[] memory assetDeltas)
    
}