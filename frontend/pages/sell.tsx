import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { Table, Button } from "@web3uikit/core";
import Image from "next/image";
import { ethers, Contract, ContractInterface } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
import ListModal from "../components/ListModal";
import erc20Abi from "../constants/Token.json";

declare var window: any;

export default function Sell(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSellModal, setShowSellModal] = useState<boolean>(false);
    const [tokenBalances, setTokenBalances] = useState<string[]>([]);
    const [tokenAddresses, setTokenAddresses] = useState<string[]>([]);
    const [data, setData] = useState<(string | JSX.Element)[][]>([]);
    const [index, setIndex] = useState<number>(0);

    const tokenNames = ["WBTC", "WETH", "DAI", "USDC"]; // it is just for testing
    const supportedNetworks = [80001, 5];

    useEffect(() => {
        updateUI();
    }, [isWeb3Enabled, data]);

    async function updateUI() {
        await fetchTokenAddreses();
        await fetchBalances();
        await showTable();
    }

    async function fetchTokenAddreses() {
        try {
            // setIsLoading(true);
            type Token = "WETH" | "DAI" | "WBTC" | "USDC";
            const addresses: string[] = [];
            const _chainId: "31337" | "5" = parseInt(chainId!).toString() as "31337" | "5";

            for (let token of tokenNames) {
                const _token: Token = token as Token;
                addresses.push(contractAddresses[_chainId][_token][0]);
            }

            setTokenAddresses(addresses);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchBalances() {
        const balances: string[] = [];
        try {
            const { ethereum } = window;
            const provider = await new ethers.providers.Web3Provider(ethereum);
            const signer = await provider.getSigner();
            for (let tokenAddress of tokenAddresses) {
                const token = await new ethers.Contract(tokenAddress, erc20Abi, signer);
                const tokenBalance = await token.balanceOf(account);
                let decimal = await token.decimals();
                balances.push(ethers.utils.formatUnits(tokenBalance, decimal));
            }

            setTokenBalances(balances);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            console.log("Error is coming from fetchBalances");
        }
    }

    async function showTable() {
        const rows: (string | JSX.Element)[][] = [];
        try {
            tokenNames.forEach((tokenName, i) => {
                if (+tokenBalances[i] > 0) {
                    rows.push([
                        <Image src={`/${tokenName.toLowerCase()}.svg`} height="45" width="45" />,
                        tokenName.toUpperCase().toString(),
                        `${tokenBalances[i]}`,
                        "$1200",
                        <Button
                            onClick={() => {
                                setIndex(i);
                                setShowSellModal(true);
                            }}
                            text="List"
                            theme="primary"
                            size="large"
                        />,
                    ]);
                }
            });
            setData(rows);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            console.log("This error is coming from showTable");
        }
    }

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
                            <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">
                                Your Wallet
                            </div>
                            <Table
                                columnsConfig="60px 1fr 1fr 1fr 200px"
                                data={data}
                                header={[
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
                            <ListModal
                                isVisible={showSellModal}
                                onClose={() => setShowSellModal(false)}
                                index={index}
                                tokenNames={tokenNames}
                                tokenAddresses={tokenAddresses}
                                tokenBalances={tokenBalances}
                            />
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
