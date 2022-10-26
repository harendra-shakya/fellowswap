// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
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
        vm.prank(user);
        this.setUp();
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Out of limit"));
        p2p.buyToken(address(dai), address(weth),  user, 2 ether);
    }

    function testRevertIfNotListed() public {
        vm.prank(user);
        this.setUp();
        vm.prank(user2);
        vm.expectRevert(abi.encodePacked("P2P: Not listed"));
        p2p.buyToken(address(dai), address(usdc),  user, 3 ether);
    }

    function testBuyToken() public {
        this.setUp();
        vm.startPrank(user);
        p2p.listToken(address(weth), address(dai), PRICE, AMOUNT, LIMIT);
        weth.approve(address(p2p), 21000000 ether);
        vm.stopPrank();
        vm.startPrank(user2);
        uint256 beforeBalace = weth.balanceOf(user);
        dai.approve(address(p2p), 21000000 ether);
        console.log("but token");
        P2P.Listing memory listing = p2p.getListing(user, address(weth), address(dai));
        p2p.buyToken(address(dai), address(weth), user, 4 ether);

        assert(weth.balanceOf(user) < beforeBalace);
        vm.stopPrank();

    }

    function testFuzzingBuyToken(uint256 amount) public {
      
    }
}
