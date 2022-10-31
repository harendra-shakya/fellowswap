import { DeployFunction } from "hardhat-deploy/types";
import { ethers, network } from "hardhat";
import * as fs from "fs";

const deployFunction: DeployFunction = async () => {
    await updateAbi();
    await updateAddresses();
};

const abiPath = "../frontend/constants/";
const mappingPath = "../frontend/constants/networkMapping.json";

const updateAbi = async () => {
    const p2p = await ethers.getContract("P2P");
    const token = await ethers.getContract("GenericERC20");
    const strings = ["P2P.json", "Token.json"];
    const contracts = [p2p, token];

    for (let i = 0; i < strings.length; i++) {
        let _interface: string | NodeJS.ArrayBufferView = contracts[i].interface.format(
            ethers.utils.FormatTypes.json
        ) as string | NodeJS.ArrayBufferView;

        fs.writeFileSync(abiPath + strings[i], _interface);
    }
};

const updateAddresses = async () => {
    const p2p = await ethers.getContract("P2P");
    const contractAddresses = await JSON.parse(fs.readFileSync(mappingPath, "utf8"));
    const chainId = await network.config.chainId?.toString();

        if (chainId! in contractAddresses) {
            if (!contractAddresses[chainId!]["P2P"]) {
                contractAddresses[chainId!]["P2P"] = [p2p.address];
            } else {
                contractAddresses[chainId!]["P2P"].pop();
                contractAddresses[chainId!]["P2P"].push(p2p.address);
            }
        } else {
            contractAddresses[chainId!] = { ["P2P"]: [p2p.address] };
        }

    fs.writeFileSync(mappingPath, JSON.stringify(contractAddresses));
};

export default deployFunction;
deployFunction.tags = ["all", "frontend"];
