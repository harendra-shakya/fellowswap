// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../contracts/P2P.sol";
import "../../contracts/test-token/GenericERC20.sol";
import "forge-std/console.sol";

contract ButTokenTest is Test {
    P2P public p2p;
    GenericERC20 public dai;
    GenericERC20 public usdc;
    GenericERC20 public weth;
    uint256 public constant PRICE = 1200 ether;
    uint256 public constant AMOUNT = 10 ether;
    uint256 public constant LIMIT = 3 ether;
    address public constant user = 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84;
    address public constant user2 = 0xC3A3362DC30588a027767063459dC533Dc4A421a;

    function setUp() public {
        p2p = new P2P();
        dai = new GenericERC20("DAI", "DAI", 18);
        usdc = new GenericERC20("USDC", "USDC", 6);
        weth = new GenericERC20("WETH", "WETH", 18);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        
    }

    function testRevertIfAmountIsLessThanLimit() public {
        vm.prank(user);
        this.setUp();
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Out of limit"));
        p2p.buyToken(address(weth), address(dai), user, 2 ether);
    }
}
