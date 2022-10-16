import { BigNumber, Signer } from "ethers";
import { expect, assert } from "chai";
const { ethers, network } = require("hardhat");
import { P2P, P2P__factory } from "../typechain";

describe("contract tests", function () {
    const amount1 = ethers.utils.parseEther("1");
    let p2p: P2P, user: Signer, user2: Signer;

    beforeEach(async function () {
        const accounts = await ethers.getSigners(2);
        user = accounts[0];
        user2 = accounts[1];

        const p2pFactory: P2P__factory = await ethers.getContractFactory("P2P");
        p2p = await p2pFactory.deploy();
        await p2p.deployed();
    });

    describe("function", function () {
        it("", async function () {});
    });
});
