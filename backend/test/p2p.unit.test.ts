import { BigNumber, Signer } from "ethers";
import { expect, assert } from "chai";
const { ethers } = require("hardhat");
import { P2P, P2P__factory, GenericERC20, GenericERC20__factory } from "../typechain";

describe("contract tests", function () {
    const amount1 = ethers.utils.parseEther("1");
    let p2p: P2P,
        wethToken: GenericERC20,
        usdcToken: GenericERC20,
        wbtcToken: GenericERC20,
        daiToken: GenericERC20,
        user: Signer,
        user2: Signer;

    beforeEach(async function () {
        const accounts = await ethers.getSigners(2);
        user = accounts[0];
        user2 = accounts[1];

        const p2pFactory: P2P__factory = await ethers.getContractFactory("P2P");
        p2p = await p2pFactory.deploy();
        await p2p.deployed();

        const erc20Factory: GenericERC20__factory = await ethers.getContractFactory(
            "GenericERC20"
        );

        daiToken = await erc20Factory.deploy("DAI", "DAI", "18");
        usdcToken = await erc20Factory.deploy("USDC", "USDC", "6");
        wbtcToken = await erc20Factory.deploy("WBTC", "WBTC", "8");
        wethToken = await erc20Factory.deploy("WETH", "WETH", "18");
    });

    describe("function", function () {
        it("", async function () {});
    });

    // * test with foundry instead
});
