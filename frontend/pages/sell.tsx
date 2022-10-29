import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { Table, Button } from "@web3uikit/core";
import Image from "next/image";
import { ethers, Contract, ContractInterface } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
declare var window: any;

export default function Sell(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSellModal, setShowSellModal] = useState<boolean>(false);

    return (
        <div>
            {isWeb3Enabled ? (
                <div>
                    {parseInt(chainId!) === 80001 ? (
                        <div className="p-6">
                            <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">
                                Your Wallet
                            </div>
                            <Table
                                columnsConfig="60px 35px 1fr 1fr 1fr 200px"
                                data={[
                                    [
                                        "",
                                        "",
                                        "WETH",
                                        "10000",
                                        "$1200",
                                        <Button
                                            onClick={() => {}}
                                            text="List"
                                            theme="primary"
                                            size="large"
                                        />,
                                    ],
                                ]}
                                header={[
                                    "",
                                    "",
                                    <span>Token</span>,
                                    <span>Your Balance</span>,
                                    <span>Price</span>, // use chainlink to get the prices
                                    "",
                                ]}
                                maxPages={1}
                                pageSize={8}
                                isLoading={isLoading}
                            />
                            {/* <SellModal isVisible={showSellModal} onClose={() => setShowSellModal(false)} /> */}
                        </div>
                    ) : (
                        <div>Plz Connect to Mumbai testnet</div>
                    )}
                </div>
            ) : (
                <div>Please Connect Your Wallet</div>
            )}
        </div>
    );
}
