import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";
import { verify } from "../utils/verify";

const deployFunction: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const developmentChains: string[] = ["hardhat", "localhost"];
    const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
    const chainId: number | undefined = network.config.chainId;
    if (!chainId) return;

    const waitConfirmations: number = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("-----------------------------------------------------------");
    log("deploying......");

    const p2p = await deploy("P2P", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: waitConfirmations,
    });

    await deploy("GenericERC20", {
        from: deployer,
        log: true,
        args: ["MOCK", "MOCK", 18],
        waitConfirmations: waitConfirmations,
    });

    log("deployed!");

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY &&
        process.env.POLYGONSCAN_API_KEY
    ) {
        log("veryfying.....");
        await verify(p2p.address, []);
        log("veryfied!");
    }
};

export default deployFunction;
deployFunction.tags = ["all", "main"];
