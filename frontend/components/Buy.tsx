import { Table, Button } from "@web3uikit/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import BuyModal from "./BuyModal";
import { useQuery, gql } from "@apollo/client";
import { ethers, Contract, ContractInterface } from "ethers";
import erc20Abi from "../constants/Token.json";
import contractAddresses from "../constants/networkMapping.json";
import { getTokenName } from "../pages/helper";

declare var window: any;

export default function Pool(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [data, setData] = useState<(string | JSX.Element)[][]>([]);
    const [listingData, setListingData] = useState<{
        fromToken: string;
        toToken: string;
        amount: string;
        price: string;
        limit: string;
        seller: string;
    }>();

    const [showBuyModal, setShowBuyModal] = useState<boolean>(false);

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

    async function showTable() {
        try {
            setIsLoading(true);
            console.log("rendering table!");

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
                console.log("1");
                if (seller !== account) return;
                console.log("2");
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
                    `${seller}`,
                    <Button
                        onClick={() => {
                            setShowBuyModal(true);
                            setListingData(listedToken.activeTokens[i]);
                        }}
                        text="Buy"
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
        <div className="p-6">
            <div className="p-8 pt-6 font-semibold text-3xl text-gray-500">Buy Token</div>
            <Table
                columnsConfig="60px 35px 1fr 1fr 1fr 1fr 2fr 200px"
                data={data}
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
            <BuyModal
                isVisible={showBuyModal}
                onClose={() => setShowBuyModal(false)}
                listingData={listingData!}
            />
        </div>
    );
}
