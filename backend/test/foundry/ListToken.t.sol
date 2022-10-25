// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../contracts/P2P.sol";
import "../../contracts/test-token/GenericERC20.sol";
import "forge-std/console.sol";

contract ListTokenTest is Test {
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
    }

    function testRevertsIfAlreadyListed() public {
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.expectRevert(abi.encodePacked("P2P: Already listed"));
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
    }

    function testRevertIfPriceIsZero() public {
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Invalid Price"));
        p2p.listToken(address(weth), address(dai), 0, AMOUNT, LIMIT);
    }

    function testRevertIfAmountIsZero() public {
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Invalid Amount"));
        p2p.listToken(address(weth), address(dai), PRICE, 0, LIMIT);
    }

    function testRevertIfAmountIsMoreThanBalance() public {
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Not have enough tokens"));
        p2p.listToken(address(weth), address(dai), PRICE, 10000000 ether, LIMIT);
    }

    function testRevertIfAmountIsLessThanLimit() public {
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Limit should be less than amount"));
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, 11 ether);
    }

    function testStoresData() public {
        vm.prank(user);
        this.setUp();
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.prank(user2);
        P2P.Listing memory listing = p2p.getListing(user, address(weth), address(dai));

        assertEq(listing.price, PRICE);
        assertEq(listing.amount, AMOUNT);
        assertEq(listing.limit, LIMIT);
    }
}
