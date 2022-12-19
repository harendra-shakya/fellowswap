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
    log(`deploying on ${network.name}......`);

    // Note: P2P = fellowswap
    const p2p = await deploy("P2P", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: waitConfirmations,
    });

    log("deployed!");

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY &&
        process.env.POLYGONSCAN_API_KEY &&
        process.env.FTMSCAN_API_KEY
    ) {
        log(`verifying on ${network.name} Etherscan.....`);
        await verify(p2p.address, []);
        log("verified!");
    }
};

export default deployFunction;
deployFunction.tags = ["all", "main"];
