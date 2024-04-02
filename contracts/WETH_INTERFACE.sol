// SPDX-License-Identifier: GPL-3.0-or-later
//function withdraw(uint wad) public
pragma solidity ^0.8.10;

interface IWETH9 {
    /*IF A FUNCTION IS PAYABLE, ALWAYS MAKE SURE YOUR PAYABLE KEYWORD IS USED IN THE INTERFACE AS WELL, OTHERWISE, 
    IT WONT RECOGNISE THE FUNCTION, THIS IS MOSTLY DUE TO VERSION DIFFERENCES. usually minor and major versioning differences.
    */

    function transferFrom(address src, address dst, uint256 wad)
        external payable 
        returns (bool);

    function transfer(address dst, uint256 wad) external  returns (bool);

    function withdraw(uint wad) external payable;

    function approve(address guy, uint wad) external returns (bool);
    

    function balanceOf(address account) external view returns (uint256);

    function deposit() external payable;

    event  Approval(address indexed src, address indexed guy, uint256 wad);
    event  Transfer(address indexed src, address indexed dst, uint256 wad);
    event  Deposit(address indexed dst, uint256 wad);
    event  Withdrawal(address indexed src, uint256 wad);
}