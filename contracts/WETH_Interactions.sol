// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "contracts/WETH_INTERFACE.sol";
import "hardhat/console.sol";

contract Wrapped_Ether_Interactions {
    //THIS CONTRACT WAS MADE TO PROTOTYPE THE FUNCTIONS FOR INTERACTING WITH WETH ON ETH MAINNET FROM ANOTHER CONTRACT
    address payable public owner;
    address private  immutable Token1;
    IWETH9 public WETH;

    constructor(address _WETH_Address) {
        owner = payable(msg.sender);
        Token1 = _WETH_Address;
        WETH = IWETH9(Token1);
    }

    //function weth_deposit() public payable {
    //    return WETH.deposit();
    //}

    function weth_balance_check() public view returns (uint balance) {
        //WETH.transfer(address(this), WETH.balanceOf(msg.sender));
        balance = WETH.balanceOf(msg.sender);
        return balance;
        //WETH.withdraw(balance);

    }

    function weth_withdraw() public payable onlyOwner {

        uint balance1 = WETH.balanceOf(msg.sender);
        WETH.transferFrom(msg.sender, address(this), balance1);

        uint balance = WETH.balanceOf(address(this));
        WETH.withdraw(balance);
    }

    function weth_withdraw_and_move_ETH() public payable onlyOwner {

        uint balance1 = WETH.balanceOf(msg.sender);
        WETH.transferFrom(msg.sender, address(this), balance1);

        uint balance = WETH.balanceOf(address(this));
        WETH.withdraw(balance);
        withdraw();
    }

    function WETH_APPROVE(address _address) public onlyOwner {
        WETH.approve(_address, 10000000000000000000000000000000000000000000);
    }
    

    function getBalance(address _input) public view returns (uint256) {
        return WETH.balanceOf(_input);
        
    }

    function withdraw() public payable onlyOwner {
       return owner.transfer(address(this).balance);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "only owner.");
        _;
    }

    receive() external payable {
        //console.log("Received: ", msg.value, "ETH from: ", msg.sender);
    } //THIS IS REQUIRED TO ACCEPT ETHEREUM (ETH) Transfers you can also put your own function when it receives ETH




}