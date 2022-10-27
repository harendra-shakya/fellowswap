import { Table, Button } from "@web3uikit/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import BuyModal from "./BuyModal";
import { ethers, Contract, ContractInterface } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
declare var window: any;

export default function Pool(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [data, setData] = useState<(string | JSX.Element)[][]>([]);
    const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
    const [existingPools, setExistingPools] = useState<string[]>();

    async function updateUI() {
        await showTable();
    }

    useEffect(() => {
        updateUI();
    }, [isWeb3Enabled]);

    const showTable = async () => {
        setIsLoading(true);
        setIsLoading(false);
    };

    return (
        <div className="p-6">
            <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">Buy</div>
            <Table
                columnsConfig="60px 35px 1fr 1fr 1fr 1fr 1fr 200px"
                data={[
                    [
                        "",
                        "",
                        "WETH",
                        "1200 DAI / WETH",
                        "10",
                        "3",
                        "0xC3A3.....Dc421a",
                        <Button onClick={() => {}} text="Buy" theme="primary" size="large" />,
                    ],
                ]}
                header={[
                    "",
                    "",
                    <span>Token</span>,
                    <span>Price</span>,
                    <span>Available Tokens</span>,
                    <span>Limit</span>,
                    <span>Seller</span>,
                    "", //buy
                ]}
                maxPages={1}
                pageSize={8}
                isLoading={isLoading}
            />
            <BuyModal isVisible={showBuyModal} onClose={() => setShowBuyModal(false)} />
        </div>
    );
}
