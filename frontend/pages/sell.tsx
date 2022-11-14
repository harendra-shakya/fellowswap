import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { Table, Button } from "@web3uikit/core";
import Image from "next/image";
import { ethers, Contract, ContractInterface } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
import p2pAbi from "../constants/P2P.json";
import erc20Abi from "../constants/Token.json";
import { Modal, useNotification, Input, Select } from "@web3uikit/core";
import List from "../components/List";
import { useQuery, gql, from } from "@apollo/client";
import tokenNames from "../constants/helper.json";
import { getTokenName } from "./helper";

declare var window: any;

export default function Sell(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<(string | JSX.Element)[][]>([]);
    const [isOkDisabled, setIsOkDisabled] = useState<boolean>(false);
    const dispatch = useNotification();

    const supportedNetworks = [80001, 5];

    const GET_ACTIVE_ITEMS = gql`
        {
            activeTokens(
                first: 5
                where: { buyer: "0x0000000000000000000000000000000000000000" }
            ) {
                fromToken
                toToken
                amount
                price
                limit
                seller
            }
        }
    `;

    const { loading, error, data: listedToken } = useQuery(GET_ACTIVE_ITEMS);
    console.log("data", listedToken);

    useEffect(() => {
        if (isWeb3Enabled && !loading) showTable();
    }, [isWeb3Enabled, listedToken, loading]);

    async function cancelListing(fromToken: string, toToken: string) {
        try {
            setIsOkDisabled(true);
            console.log("cancling these tokens", fromToken, toToken);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const _chainId: "31337" | "5" = parseInt(chainId!).toString() as "31337" | "5";
            const p2pAddress = contractAddresses[_chainId]["P2P"][0];

            const p2p = new ethers.Contract(p2pAddress, p2pAbi, signer);
            console.log("canceling listing");

            const tx = await p2p.cancelListing(fromToken, toToken);
            console.log("receiving confirmations...");
            const txReceipt = await tx.wait();
            if (txReceipt.status === 1) {
                console.log("listed");
                alert("Token removed from listing!");
                handleCancelSuccess();
            } else {
                alert("Tx failed. Plz try agains!");
            }
            setIsOkDisabled(false);
        } catch (e) {
            console.log(e);
            setIsOkDisabled(false);
        }
    }

    const handleCancelSuccess = async function () {
        dispatch({
            type: "success",
            title: "Token removed from listing!",
            message: "Token removed from listing - Please Refresh",
            position: "topL",
        });
    };

    async function showTable() {
        try {
            setIsLoading(true);
            console.log("rendering sell table!");

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const rows: (string | JSX.Element)[][] = [];
            for (let i = 0; i < listedToken.activeTokens.length; i++) {
                const {
                    fromToken,
                    toToken,
                    amount,
                    price,
                    limit,
                    seller,
                }: {
                    fromToken: string;
                    toToken: string;
                    amount: string;
                    price: string;
                    limit: string;
                    seller: string;
                } = listedToken.activeTokens[i];
                if (seller !== account) return;
                const fromToken__ = await new ethers.Contract(fromToken, erc20Abi, signer);
                const toToken__ = await new ethers.Contract(toToken, erc20Abi, signer);

                const deci1 = await fromToken__.decimals();
                const deci2 = await toToken__.decimals();

                const _fromToken: string = await getTokenName(fromToken);
                const _toToken: string = await getTokenName(toToken);

                const _amount = await ethers.utils.formatUnits(amount, deci1);
                const _price = await ethers.utils.formatUnits(price, deci2);
                const _limit = await ethers.utils.formatUnits(limit, deci1);

                rows.push([
                    <Image src={`/${_fromToken.toLowerCase()}.svg`} height="45" width="45" />,
                    <Image src={`/${_toToken.toLowerCase()}.svg`} height="45" width="45" />,
                    _fromToken,
                    `${`${_price} ${_toToken} / ${_fromToken}`}`,
                    `${_amount}`,
                    `${_limit}`,
                    <Button
                        onClick={() => {
                            cancelListing(fromToken, toToken);
                        }}
                        text="Cancel"
                        theme="colored"
                        size="large"
                        color="red"
                    />,
                ]);
            }

            setTableData(rows);
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
                    {supportedNetworks.includes(parseInt(chainId!)) && !loading ? (
                        <div className="p-6">
                            <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">
                                Your Listed Tokens
                            </div>
                            <Table
                                columnsConfig="60px 35px 1fr 1fr 1fr 1fr 200px"
                                data={tableData}
                                header={[
                                    "",
                                    "",
                                    <span>Token</span>,
                                    <span>Price</span>,
                                    <span>Amount</span>,
                                    <span>Limit</span>,
                                    "",
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
