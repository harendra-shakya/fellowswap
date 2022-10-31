import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";
import * as fs from "fs";

const deployFunction: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();
    const chainId: number | undefined = network.config.chainId;
    if (!chainId) return;
    const developmentChains: string[] = ["hardhat", "localhost"];

    const waitConfirmations: number = developmentChains.includes(network.name) ? 1 : 6;

    const helperPath = "../frontend/constants/helper.json";
    const mappingPath = "../frontend/constants/networkMapping.json";
    const contractAddresses = await JSON.parse(fs.readFileSync(mappingPath, "utf8"));
    const helperFile = await JSON.parse(fs.readFileSync(helperPath, "utf8"));

    const args = [
        ["WBTC", "WBTC", "8"],
        ["WETH", "WETH", "18"],
        ["DAI", "DAI", "18"],
        ["USDC", "USDC", "6"],
    ];

    for (let i = 0; i < args.length; i++) {
        log("-----------------------------------------------------------");
        log(`deploying ${args[i][0]}......`);
        let token = await deploy("GenericERC20", {
            from: deployer,
            log: true,
            args: args[i],
            waitConfirmations: waitConfirmations,
        });

        if (chainId! in contractAddresses) {
            if (!contractAddresses[chainId!][args[i][0]]) {
                contractAddresses[chainId!][args[i][0]] = [token.address];
            } else {
                contractAddresses[chainId!][args[i][0]].pop();
                contractAddresses[chainId!][args[i][0]].push(token.address);
            }
        } else {
            contractAddresses[chainId!] = { [args[i][0]]: [token.address] };
        }

        if (chainId! in helperFile) {
            if (!helperFile[chainId!][token.address]) {
                helperFile[chainId!][token.address] = args[i][0];
            }
        } else {
            helperFile[chainId!] = { [token.address]: args[i][0] };
        }
    }

    fs.writeFileSync(mappingPath, JSON.stringify(contractAddresses));
    fs.writeFileSync(helperPath, JSON.stringify(helperFile));

};

export default deployFunction;
deployFunction.tags = ["all", "tokens"];
