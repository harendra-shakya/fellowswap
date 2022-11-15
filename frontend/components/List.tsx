import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { Table, Button } from "@web3uikit/core";
import Image from "next/image";
import { ethers, Contract, ContractInterface } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
import ListModal from "../components/ListModal";
import erc20Abi from "../constants/Token.json";
import linkitAbi from "../constants/Linkit.json";
import addresses from "../constants/networkMapping.json";

declare var window: any;

export default function List(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSellModal, setShowSellModal] = useState<boolean>(false);
    const [tokenBalances, setTokenBalances] = useState<string[]>([]);
    const [tokenAddresses, setTokenAddresses] = useState<string[]>([]);
    const [data, setData] = useState<(string | JSX.Element)[][]>([]);
    const [index, setIndex] = useState<number>(0);
    // const [price, setPrice] = useState<number>();

    const tokenNames = ["WBTC", "WETH", "DAI", "USDC"]; // it is just for testing
    // console.log("data", data);

    useEffect(() => {
        updateUI();
    }, [isWeb3Enabled]);

    useEffect(() => {
        if (tokenBalances.length == 0 || data.length == 0) updateUI();
    }, [isWeb3Enabled, tokenBalances]);

    async function updateUI() {
        await fetchTokenAddreses();
        await fetchBalances();
        await showTable();
    }

    const getMarketPrice = async function (name: string) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const address = addresses["80001"]["Linkit"][0];
        const contract = await new ethers.Contract(address, linkitAbi, signer);
        const data = await contract.getLatestPrice(name);
        return parseInt(data[0]) / 10 ** parseInt(data[1]);
    };

    async function fetchTokenAddreses() {
        try {
            console.log("fetching address....");
            type Token = "WETH" | "DAI" | "WBTC" | "USDC";
            const addresses: string[] = [];
            const _chainId: "31337" | "5" = parseInt(chainId!).toString() as "31337" | "5";

            for (let token of tokenNames) {
                const _token: Token = token as Token;
                addresses.push(contractAddresses[_chainId][_token][0]);
            }
            console.log("addresses", addresses);
            setTokenAddresses(addresses);
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchBalances() {
        try {
            console.log("fetching balances....");
            const balances: string[] = [];
            const provider = await new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            for (let tokenAddress of tokenAddresses) {
                const token = await new ethers.Contract(tokenAddress, erc20Abi, signer);
                const tokenBalance = await token.balanceOf(account);
                let decimal = await token.decimals();
                balances.push(ethers.utils.formatUnits(tokenBalance, decimal));
            }
            console.log("balances", balances);
            setTokenBalances(balances);
        } catch (e) {
            console.log(e);
            console.log("Error is coming from fetchBalances");
        }
    }

    async function showTable() {
        try {
            console.log("rendering list table!");
            if (tokenBalances.length == 0) {
                console.log("no token balances");
                return;
            }
            const rows: (string | JSX.Element)[][] = [];
            const prices: number[] = [];

            for (let i = 0; i < tokenNames.length; i++) {
                let token = tokenNames[i];
                if (token.includes("W")) token = token.substring(1);
                prices.push(await getMarketPrice(token.toUpperCase()));
            }

            // console.log("newArray", newArr);
            // console.log("prices", prices);

            for (let i = 0; i < tokenNames.length; i++) {
                if (+tokenBalances[i] <= 0) return;

                // console.log("-------------------------------------------");
                // console.log("tokenN", token);
                // const price = await getMarketPrice(token.toUpperCase());
                // console.log("and here is the price", price);
                // console.log("-------------------------------------------");
                rows.push([
                    <Image src={`/${tokenNames[i].toLowerCase()}.svg`} height="45" width="45" />,
                    tokenNames[i].toUpperCase().toString(),
                    `${tokenBalances[i]}`,
                    `$${prices[i]}`,
                    <Button
                        onClick={() => {
                            console.log("setting index", i);
                            setIndex(i);
                            setShowSellModal(true);
                        }}
                        text="List"
                        theme="primary"
                        size="large"
                    />,
                ]);
            }

            setData(rows);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            console.log("This error is coming from showTable");
        }
    }

    return (
        <div>
            <div className="p-6">
                <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">Your Wallet</div>
                <Table
                    columnsConfig="60px 1fr 1fr 1fr 200px"
                    data={data}
                    header={[
                        "",
                        <span>Token</span>,
                        <span>Your Balance</span>,
                        <span>Market Price</span>, // use chainlink to get the prices
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
        </div>
    );
}
