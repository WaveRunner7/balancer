// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

//related to uniswapV3
pragma abicoder v2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "./IFlashLoanRecipient.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";

//import "./IBalancerVault.sol";
import "hardhat/console.sol";

import "./WETH_INTERFACE.sol";

//uniswapV2 Library (Router Actually Does The Swaps)
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

//uniswapV3 Library (Router Actually Does The Swaps)
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

//import "./ISwap.sol";

contract BalancerAction is IFlashLoanRecipient {

    uint24 public constant poolFee = 3000;

    using SafeMath for uint256;

    address public immutable vaultAddress;

    address public Token1;
    address public Token2;

    string public token1Symbol;
    string public token2Symbol;

    address payable owner;
    address payable funds_address;
    address payable self_address;
    
    address public immutable uniswapV2Router02Address;
    address public immutable sushiSwapRouter02Address;
    address public immutable uniswapV3RouterAddress;

    IVault public immutable vault;

    IUniswapV2Router02 UniswapV2Router02;
    IUniswapV2Router02 SushiSwapRouter02;

    ISwapRouter public immutable UniswapV3Router;

    uint256 public arbStrategy = 0;

    IERC20 public eRC20Token1;
    IERC20 public eRC20Token2;

    


    //ISwap public immutable swapVault;

    //address _vault, address _Token1) other constructor params
    constructor(address _funds_address, address _balancerVaultAddress, address _uniswapV3RouterAddress, address _uniswapV2Router02Address, address _sushiSwapRouter02Address, address _token1, address _token2, string memory _tokenString1, string memory _tokenString2) {
        owner = payable(msg.sender);

        funds_address = payable(_funds_address);
        vaultAddress = _balancerVaultAddress;
        uniswapV3RouterAddress = _uniswapV3RouterAddress;
        uniswapV2Router02Address = _uniswapV2Router02Address;
        sushiSwapRouter02Address = _sushiSwapRouter02Address;

        Token1 = _token1; // (BORROW TOKEN)
        Token2 = _token2; // (SWAP TOKEN 1)

        eRC20Token1 = IERC20(Token1);
        eRC20Token2 = IERC20(Token2);

        token1Symbol = _tokenString1;
        token2Symbol = _tokenString2;

        vault = IVault(vaultAddress); //BalancerVault
        UniswapV2Router02 = IUniswapV2Router02(uniswapV2Router02Address);
        SushiSwapRouter02 = IUniswapV2Router02(sushiSwapRouter02Address);
        UniswapV3Router = ISwapRouter(uniswapV3RouterAddress);

        console.log("Owner Address: ", owner);
    }

    function weth_withdraw_func() public {
        IWETH9 wethToken = IWETH9(Token1);
        uint balance = wethToken.balanceOf(address(this));

        //wethToken.approve(address(this), balance);
        //console.log("allowance: ");
        wethToken.withdraw(balance);

    }

    function approve_tokens(address _input_address, uint256 _amount) public returns (uint256[] memory allowances) {

        eRC20Token1.approve(_input_address, _amount);
        eRC20Token2.approve(_input_address, _amount);
        
        
        //RETURNS THE NEW ALLOWANCES
        allowances = new uint256[](2); //SETS THE VALUES
        allowances[0] = eRC20Token1.allowance(address(this), _input_address);
        allowances[1] = eRC20Token2.allowance(address(this), _input_address);
        
        console.log("Allowance For ERC20Token1 : ", allowances[0], "Allowance For ERC20Token2: ", allowances[1]);

    }

    function withdraw_func(address _tokenAddress) public onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(owner, token.balanceOf(address(this)));
    }

    function change_Tokens(address _token1, address _token2) public onlyOwner {
        
        /*UPDATES TOKENS USED FOR ARBITRAGE STRADEGIES AND APPLIES THE
        ERC20 INTERFACE TO THE TOKENS / CREATES INSTANCES OF THE TWO ERC20 ADDRESSES
        */

        Token1 = _token1;
        Token2 = _token2;

        eRC20Token1 = IERC20(Token1);
        eRC20Token2 = IERC20(Token2);

    }

    function update_funds_address(address _input_address) public onlyOwner {
        funds_address = payable(_input_address);
    }

    function update_Token_Strings(string memory _tokenString1, string memory _tokenString2) public onlyOwner {
        token1Symbol = _tokenString1;
        token2Symbol = _tokenString2;
    }


    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory
    ) external override {
        

        // Business Logic




        //IWETH9 wethToken = IWETH9(Token1);
        //uint balance = wethToken.balanceOf(address(this));

        //wethToken.approve(address(this), 10000000000000000000000000000000000000000000);
        //wethToken.withdraw(balance);
        //ETH TRANSFER CHECK
        //console.log("ETH Balance: ", address(this).balance);
        //console.log("WETH Balance: ", wethToken.balanceOf(address(this)));
        
        //UNISWAPV2 TO UNISWAPV3 LOGIC IF UNISWAPV2 IS CHEAPER
        
        if (arbStrategy == 1) {

            //EXAMPLE SWAP UNISWAP V2
            approve_tokens(address(UniswapV2Router02), 10000000000000000000000000000000000000000000);
            approve_tokens(address(UniswapV3Router), 10000000000000000000000000000000000000000000);

            uint amountOutMin = 0;
            uint amountIn = eRC20Token1.balanceOf(address(this));
            
            console.log("UniswapV2 Pre-Transfer: ", token1Symbol, " BALANCE: ", amountIn);
            address[] memory path;
            path = new address[](2);
            path[0] = Token1;
            path[1] = Token2;
            UniswapV2Router02.swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), block.timestamp);
            console.log("UniswapV2 Transfer: ", token2Symbol, "BALANCE: ", eRC20Token2.balanceOf(address(this)));

            path[0] = Token2;
            path[1] = Token1;
            amountIn = eRC20Token2.balanceOf(address(this));

            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: path[0],
                    tokenOut: path[1],
                    fee: poolFee,
                    recipient: address(this),
                    deadline: block.timestamp,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                });
            
            UniswapV3Router.exactInputSingle(params);

            console.log("UniswapV3 Transfer: ", token1Symbol, "BALANCE: ", eRC20Token1.balanceOf(address(this)));

            

            //UniswapV2Router02.swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, address(this), block.timestamp);
            //console.log("ETH BALANCE: ", address(this).balance);//eRC20Token1.balanceOf(address(this)));

        }

        //IF UNISWAPV3 IS (CHEAPER UNISWAPV3 TO UNISWAPV2)
        if (arbStrategy == 2) {

            
            approve_tokens(address(UniswapV2Router02), 10000000000000000000000000000000000000000000);
            approve_tokens(address(UniswapV3Router), 10000000000000000000000000000000000000000000);

            uint amountOutMin = 0;
            uint amountIn = eRC20Token1.balanceOf(address(this));
            console.log("UniswapV3 Pre-Transfer: ", token1Symbol, " BALANCE: ", amountIn);
            address[] memory path;
            path = new address[](2);
            path[0] = Token1;
            path[1] = Token2;


            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: path[0],
                    tokenOut: path[1],
                    fee: poolFee,
                    recipient: address(this),
                    deadline: block.timestamp,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                });
            
            UniswapV3Router.exactInputSingle(params);

            console.log("UniswapV3 Transfer: ", token2Symbol, "BALANCE: ", eRC20Token2.balanceOf(address(this)));

            path[0] = Token2;
            path[1] = Token1;
            amountIn = eRC20Token2.balanceOf(address(this));


            UniswapV2Router02.swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), block.timestamp);
            console.log("UniswapV2 Transfer: ", token1Symbol, "BALANCE: ", eRC20Token1.balanceOf(address(this)));

        }



        //amountOutMin must be retrieved from an oracle of some kind (UniswapV2Factor) semi-optional, because setting minimal amount ( )
        // to zero "will" work, but it makes it to where if you end up with less money then you started with, the function will just go through
        // so amountOutMin, is great for making sure the amount of tokens you receive are less than a certain amount.
        



        
        //THE GOAL IS HERE, WE NEED TO HAVE SOME BUSINESS LOGIC THATS PROFITABLE
        //console.log("business logic goes here.");
        //console.log(owner); //the address thats the owner
        //vault.getPool(0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2);
        
        
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
            //withdraw ERC20 TOKEN Profit if there is some of the users choice
            IERC20 tokenA = IERC20(Token1);
            if ( tokenA.balanceOf(address(this)) != 0 ) {
                withdraw_func(Token1);
            }

            if ( address(this).balance != 0 ) {
                //WITHDRAWS ETH FUNDS IF THEY EXIST
                uint256 full_balance = address(this).balance;
                uint256 split_balance = full_balance * 40 / 100;
                funds_address.transfer(split_balance);
                owner.transfer(address(this).balance); //transfer's remaining balance
            }
        }
    }

    function makeFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        bytes memory userData,
        uint256 _arbStrat
    ) external {
        //TokenA = tokens;
        //SETS THE STRATEGY WHEN THE FLASHLOAN IS MADE FOR WHICH STRAT TO USE
        arbStrategy = _arbStrat;
        console.log("Arbitrage Stategy:", arbStrategy);
        vault.flashLoan(
            IFlashLoanRecipient(address(this)),
            tokens,
            amounts,
            userData
        );
    }

    


    // function valut_RegisterTheTokens(bytes32 _poolId, address _token1, address _token2) public view {
    //     vault.registerTokens(_poolId, [IERC20(_token1)], [0]);
    // }

    // function check_pool(bytes32 _input) public view returns {
    //     vault.getPoolTokens(_input);
    // }

    //function poolData() view public {
        //return "Hello World";
    //    vault.getPoolTokens(0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014);
    //}

    modifier onlyOwner() {
        console.log("msg.sender: ", msg.sender,  "owner: ", owner);
        require(
            (msg.sender == owner),
            "Only the contract owner can call this function"
        );
        _;
    }


    // Fallback function
    fallback() external payable {
        // Handle incoming Ether transactions

    }

    // Receive function (Solidity version 0.6.0 and above)
    receive() external payable {
        // Handle incoming Ether transactions
    //    IERC20 wethToken = IERC20(Token1);
    //    wethToken.transfer(owner, wethToken.balanceOf(address(this))); //gets ETH
    }

}
