import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { Table, Button } from "@web3uikit/core";
import Image from "next/image";
import { ethers, Contract, ContractInterface } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
import ListModal from "../components/ListModal";
import erc20Abi from "../constants/Token.json";
import List from "../components/List";

declare var window: any;

export default function Sell(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<(string | JSX.Element)[][]>([]);

    const supportedNetworks = [80001, 5];

    useEffect(() => {
        updateUI();
    }, [isWeb3Enabled, data]);

    async function updateUI() {}

    return (
        <div>
            {isWeb3Enabled ? (
                <div>
                    {supportedNetworks.includes(parseInt(chainId!)) ? (
                        <div className="p-6">
                            <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">
                                Your Listed Tokens
                            </div>
                            <Table
                                columnsConfig="60px 35px 1fr 1fr 1fr 1fr 200px"
                                data={[
                                    [
                                        "",
                                        "",
                                        "WETH",
                                        "1200 DAI / WETH",
                                        "10",
                                        "3",
                                        <Button
                                            onClick={() => {}}
                                            text="Buy"
                                            theme="primary"
                                            size="large"
                                        />,
                                    ],
                                ]}
                                header={[
                                    "",
                                    "",
                                    <span>Token</span>,
                                    <span>Price</span>,
                                    <span>Amount</span>,
                                    <span>Limit</span>,
                                    "", //buy
                                ]}
                                maxPages={1}
                                pageSize={8}
                                isLoading={isLoading}
                            />

                            <List />
                        </div>
                    ) : (
                        <div>Plz Connect to a Supported network {supportedNetworks}</div>
                    )}
                </div>
            ) : (
                <div>Please Connect Your Wallet</div>
            )}
        </div>
    );
}
