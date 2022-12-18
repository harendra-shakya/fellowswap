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
    }

    function testRevertIfAmountIsLessThanLimit() public {
        this.setUp();
        vm.startPrank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.stopPrank();
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Out of limit"));
        p2p.buyToken(address(dai), address(weth), user, 2 ether);
    }

    function testRevertIfNotListed() public {
        this.setUp();
        vm.startPrank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.stopPrank();
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Not listed"));
        p2p.buyToken(address(dai), address(usdc), user, 3 ether);
    }

    function testBuyToken() public {
        this.setUp();
        vm.startPrank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.stopPrank();
        uint256 wethAmount = 4 ether;
        uint256 daiAmount = 4 * 1200 ether; // 1 weth = 1200 dai

        vm.startPrank(user);
        weth.approve(address(p2p), wethAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        uint256 userBeforeBalace = weth.balanceOf(user);
        uint256 user2BeforeBalace = dai.balanceOf(user2);
        dai.approve(address(p2p), daiAmount);
        console.log("but token");
        p2p.buyToken(address(dai), address(weth), user, wethAmount);

        assertEq(userBeforeBalace - weth.balanceOf(user), wethAmount);
        assertEq(user2BeforeBalace - dai.balanceOf(user2), daiAmount);
        assertEq(dai.balanceOf(user), (daiAmount * 9998) / 10000);
        assertEq(weth.balanceOf(user2), (wethAmount * 9998) / 10000);
        vm.stopPrank();
    }

    function testBuyWithUSDC() public {
        this.setUp();
        vm.startPrank(user);
        uint256 usdcPrice = 1200 * 10**6; // 1 weth = 1200 usdc
        p2p.listToken(address(weth), address(usdc), usdcPrice, AMOUNT, LIMIT);
        uint256 wethAmount = 4 ether;
        uint256 usdcAmount = 4 * usdcPrice;

        weth.approve(address(p2p), wethAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        uint256 userBeforeBalace = weth.balanceOf(user);
        uint256 user2BeforeBalace = usdc.balanceOf(user2);
        usdc.approve(address(p2p), usdcAmount);
        p2p.buyToken(address(usdc), address(weth), user, wethAmount);

        assertEq(userBeforeBalace - weth.balanceOf(user), wethAmount);
        assertEq(user2BeforeBalace - usdc.balanceOf(user2), usdcAmount);
        assertEq(usdc.balanceOf(user), (usdcAmount * 9998) / 10000);
        assertEq(weth.balanceOf(user2), (wethAmount * 9998) / 10000);
        vm.stopPrank();
    }

    function testBuyWBTCWithUSDC() public {
        this.setUp();
        uint256 usdcPrice = 16000 * 10**6; // 1 btc = 16000 usdc
        uint256 wbtcAmount = 4 * 10**8;
        uint256 usdcAmount = 4 * usdcPrice;

        vm.startPrank(user);
        p2p.listToken(address(wbtc), address(usdc), usdcPrice, AMOUNT, 3 * 10**8);
        wbtc.approve(address(p2p), wbtcAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        uint256 userBeforeBalace = wbtc.balanceOf(user);
        uint256 user2BeforeBalace = usdc.balanceOf(user2);
        usdc.approve(address(p2p), usdcAmount);
        p2p.buyToken(address(usdc), address(wbtc), user, wbtcAmount);
        vm.stopPrank();

        assertEq(userBeforeBalace - wbtc.balanceOf(user), wbtcAmount);
        assertEq(user2BeforeBalace - usdc.balanceOf(user2), usdcAmount);
        assertEq(usdc.balanceOf(user), (usdcAmount * 9998) / 10000);
        assertEq(wbtc.balanceOf(user2), (wbtcAmount * 9998) / 10000);
    }

    function testFuzzingBuyWithUSDC(uint256 amount) public {
        vm.assume(amount >= 3 && amount <= 10);
        this.setUp();
        vm.startPrank(user);

        uint256 usdcPrice = 1200 * 10**6; // 1 weth = 1200 usdc
        p2p.listToken(address(weth), address(usdc), usdcPrice, AMOUNT, LIMIT);
        uint256 wethAmount = amount * 10**18;
        uint256 usdcAmount = amount * usdcPrice;

        weth.approve(address(p2p), wethAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        uint256 userBeforeBalace = weth.balanceOf(user);
        uint256 user2BeforeBalace = usdc.balanceOf(user2);
        usdc.approve(address(p2p), usdcAmount);
        p2p.buyToken(address(usdc), address(weth), user, wethAmount);

        assertEq(userBeforeBalace - weth.balanceOf(user), wethAmount);
        assertEq(user2BeforeBalace - usdc.balanceOf(user2), usdcAmount);
        assertEq(usdc.balanceOf(user), (usdcAmount * 9998) / 10000);
        assertEq(weth.balanceOf(user2), (wethAmount * 9998) / 10000);
        vm.stopPrank();
    }

    function testFuzzingBuyWBTCWithUSDC(uint256 amount) public {
        vm.assume(amount >= 3 && amount <= 10);
        this.setUp();
        uint256 usdcPrice = 16000 * 10**6; // 1 btc = 16000 usdc
        uint256 wbtcAmount = amount * 10**8;
        uint256 usdcAmount = amount * usdcPrice;

        vm.startPrank(user);
        p2p.listToken(address(wbtc), address(usdc), usdcPrice, AMOUNT, 3 * 10**8);
        wbtc.approve(address(p2p), wbtcAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        uint256 userBeforeBalace = wbtc.balanceOf(user);
        uint256 user2BeforeBalace = usdc.balanceOf(user2);
        usdc.approve(address(p2p), usdcAmount);
        p2p.buyToken(address(usdc), address(wbtc), user, wbtcAmount);
        vm.stopPrank();

        assertEq(userBeforeBalace - wbtc.balanceOf(user), wbtcAmount);
        assertEq(user2BeforeBalace - usdc.balanceOf(user2), usdcAmount);
        assertEq(usdc.balanceOf(user), (usdcAmount * 9998) / 10000);
        assertEq(wbtc.balanceOf(user2), (wbtcAmount * 9998) / 10000);
    }

    function testFuzzingBuyToken(uint256 amount) public {
        vm.assume(amount >= 3 && amount <= 10);
        this.setUp();
        uint256 wethAmount = amount * 10**18;
        uint256 daiAmount = amount * 1200 ether; // 1 weth = 1200 dai
        vm.startPrank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);

        weth.approve(address(p2p), wethAmount);
        vm.stopPrank();
        vm.startPrank(user2);
        uint256 userBeforeBalace = weth.balanceOf(user);
        uint256 user2BeforeBalace = dai.balanceOf(user2);
        dai.approve(address(p2p), daiAmount);

        p2p.buyToken(address(dai), address(weth), user, wethAmount);

        assertEq(userBeforeBalace - weth.balanceOf(user), wethAmount);
        assertEq(user2BeforeBalace - dai.balanceOf(user2), daiAmount);
        assertEq(dai.balanceOf(user), (daiAmount * 9998) / 10000);
        assertEq(weth.balanceOf(user2), (wethAmount * 9998) / 10000);
        vm.stopPrank();
    }
}
