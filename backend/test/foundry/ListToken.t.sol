// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../contracts/P2P.sol";
import "../../contracts/test-token/GenericERC20.sol";
import "forge-std/console.sol";
import {BaseSetup} from "./BaseSetup.t.sol";
import {Utils} from "./utils/Utils.sol";

contract ListTokenTest is BaseSetup {

    function setUp() public virtual override {
        BaseSetup.setUp();
    }

    function testRevertsIfAlreadyListed() public {
        vm.prank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.expectRevert(abi.encodePacked("P2P: Already listed"));
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
    }

    function testRevertIfPriceIsZero() public {
        vm.prank(user);
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Invalid Price"));
        p2p.listToken(address(weth), address(dai), 0, AMOUNT, LIMIT);
    }

    function testRevertIfAmountIsZero() public {
        vm.prank(user);
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Invalid Amount"));
        p2p.listToken(address(weth), address(dai), PRICE, 0, LIMIT);
    }

    function testRevertIfAmountIsMoreThanBalance() public {
        vm.prank(user);
        this.setUp();
        vm.expectRevert(abi.encodePacked("P2P: Not have enough tokens"));
        p2p.listToken(address(weth), address(dai), PRICE, 10000000 ether, LIMIT);
    }

    function testRevertIfAmountIsLessThanLimit() public {
        vm.prank(user);
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
