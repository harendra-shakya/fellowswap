// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/P2P.sol";
import "../../contracts/test-token/GenericERC20.sol";
import "forge-std/console.sol";
import {Utils} from "./utils/Utils.sol";
import {BaseSetup} from "./BaseSetup.t.sol";

contract BuyTokenTest is BaseSetup {
    function setUp() public virtual override {
        BaseSetup.setUp();
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
    }

    function testRevertIfAmountIsLessThanLimit() public {
        vm.prank(user);
        this.setUp();
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Out of limit"));
        p2p.buyToken(address(dai), address(weth), user, 2 ether);
    }

    function testRevertIfNotListed() public {
        vm.prank(user);
        this.setUp();
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Not listed"));
        p2p.buyToken(address(dai), address(usdc), user, 3 ether);
    }

    function testBuyToken() public {
        vm.startPrank(user);
        this.setUp();
        weth.approve(address(p2p), 21000000 ether);
        vm.stopPrank();
        vm.startPrank(user2);
        uint256 userBeforeBalace = weth.balanceOf(user);
        uint256 user2BeforeBalace = dai.balanceOf(user2);
        dai.approve(address(p2p), 21000000 ether);
        console.log("but token");
        p2p.buyToken(address(dai), address(weth), user, 4 ether);

        assertEq(userBeforeBalace - weth.balanceOf(user), 4 ether);
        assertEq(user2BeforeBalace - dai.balanceOf(user2), 1200 ether * 4);
        assertEq(dai.balanceOf(user), (1200 ether * 4 * 9998) / 10000);
        assertEq(weth.balanceOf(user2), (4 ether * 9998) / 10000);
        vm.stopPrank();
    }

    function testFuzzingBuyToken(uint256 _amount) public {
        vm.assume(_amount >= 3 && _amount <= 10);
        uint256 amount = _amount * 10**18;
        vm.startPrank(user);
        this.setUp();
        weth.approve(address(p2p), 21000000 ether);
        vm.stopPrank();
        vm.startPrank(user2);
        uint256 userBeforeBalace = weth.balanceOf(user);
        uint256 user2BeforeBalace = dai.balanceOf(user2);
        dai.approve(address(p2p), 21000000 ether);
        console.log("but token");
        p2p.buyToken(address(dai), address(weth), user, amount);

        assertEq(userBeforeBalace - weth.balanceOf(user), amount);
        assertEq(user2BeforeBalace - dai.balanceOf(user2), 1200 ether * _amount);
        assertEq(dai.balanceOf(user), (1200 ether * _amount * 9998) / 10000);
        assertEq(weth.balanceOf(user2), (amount * 9998) / 10000);
        vm.stopPrank();
    }
}
