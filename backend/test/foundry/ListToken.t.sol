// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
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
        this.setUp();
        vm.startPrank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.expectRevert(abi.encodePacked("P2P: Already listed"));
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.stopPrank();
    }

    function testRevertIfPriceIsZero() public {
        this.setUp();
        vm.startPrank(user);

        vm.expectRevert(abi.encodePacked("P2P: Invalid Price"));
        p2p.listToken(address(weth), address(dai), 0, AMOUNT, LIMIT);
        vm.stopPrank();
    }

    function testRevertIfAmountIsZero() public {
        this.setUp();
        vm.startPrank(user);

        vm.expectRevert(abi.encodePacked("P2P: Invalid Amount"));
        p2p.listToken(address(weth), address(dai), PRICE, 0, LIMIT);
        vm.stopPrank();
    }

    function testRevertIfAmountIsMoreThanBalance() public {
        this.setUp();
        vm.startPrank(user);

        vm.expectRevert(abi.encodePacked("P2P: Amount Exceeds balance"));
        p2p.listToken(
            address(weth),
            address(dai),
            PRICE,
            100000000000000000000000000 ether,
            LIMIT
        );
        vm.stopPrank();
    }

    function testRevertIfAmountIsLessThanLimit() public {
        this.setUp();
        vm.startPrank(user);

        vm.expectRevert(abi.encodePacked("P2P: Limit should be less than amount"));
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, 11 ether);
        vm.stopPrank();
    }

    function testStoresData() public {
        this.setUp();
        vm.startPrank(user);

        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.stopPrank();
        vm.prank(user2);
        P2P.Listing memory listing = p2p.getListing(user, address(weth), address(dai));

        assertEq(listing.price, PRICE);
        assertEq(listing.amount, AMOUNT);
        assertEq(listing.limit, LIMIT);
    }
}
