// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/P2P.sol";
import "../../contracts/test-token/GenericERC20.sol";
import "forge-std/console.sol";

contract BaseSetup is Test {
    P2P public p2p;
    GenericERC20 public dai;
    GenericERC20 public usdc;
    GenericERC20 public weth;
    uint256 public constant PRICE = 1200 ether;
    uint256 public constant AMOUNT = 10 ether;
    uint256 public constant LIMIT = 3 ether;
    address public user = 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84;
    address public user2 = address(0x2);

    function setUp() public virtual {
        p2p = new P2P();
        dai = new GenericERC20("DAI", "DAI", 18, user2);
        usdc = new GenericERC20("USDC", "USDC", 6, user);
        weth = new GenericERC20("WETH", "WETH", 18, user);
    }
}
