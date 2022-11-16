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
import styles from "../styles/Home.module.css";

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
    const [index, setIndex] = useState<number>(0);

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

    const getData = async function (
        fromToken: string,
        toToken: string,
        amount: string,
        price: string,
        limit: string
    ) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const fromToken__ = await new ethers.Contract(fromToken, erc20Abi, signer);
        const toToken__ = await new ethers.Contract(toToken, erc20Abi, signer);

        const deci1 = await fromToken__.decimals();
        const deci2 = await toToken__.decimals();

        const _fromToken: string = await getTokenName(fromToken);
        const _toToken: string = await getTokenName(toToken);

        const _amount = await ethers.utils.formatUnits(amount, deci1);
        const _price = await ethers.utils.formatUnits(price, deci2);
        const _limit = await ethers.utils.formatUnits(limit, deci1);

        return { _fromToken, _toToken, _amount, _price, _limit };
    };

    async function showTable() {
        try {
            setIsLoading(true);
            console.log("rendering table!");

            const rows: (string | JSX.Element)[][] = [];

            const fromTokens: string[] = [];
            const toTokens: string[] = [];
            const amounts: string[] = [];
            const limits: string[] = [];
            const prices: string[] = [];

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

                const { _fromToken, _toToken, _amount, _price, _limit } = await getData(
                    fromToken,
                    toToken,
                    amount,
                    price,
                    limit
                );
                fromTokens.push(_fromToken);
                toTokens.push(_toToken);
                amounts.push(_amount);
                prices.push(_price);
                limits.push(_limit);
            }

            for (let i = 0; i < listedToken.activeTokens.length; i++) {
                const {
                    seller,
                }: {
                    seller: string;
                } = listedToken.activeTokens[i];

                console.log("------------------------------------------");
                console.log("in buy the index is", i);
                console.log("------------------------------------------");

                rows.push([
                    <Image
                        src={`/svg/${fromTokens[i].toLowerCase()}.svg`}
                        height="45"
                        width="45"
                    />,
                    <Image src={`/svg/${toTokens[i].toLowerCase()}.svg`} height="45" width="45" />,
                    fromTokens[i],
                    `${`${prices[i]} ${toTokens[i]} / ${fromTokens[i]}`}`,
                    `${amounts[i]}`,
                    `${limits[i]}`,
                    `${seller}`,
                    <Button
                        onClick={async () => {
                            console.log("setting this listing data", listedToken.activeTokens);
                            console.log("setting the index", i);
                            setIndex(i);
                            setListingData(await listedToken.activeTokens[i]);
                            setShowBuyModal(true);
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
            console.log("This error is coming from showTable, Buy");
        }
    }

    return (
        <div className={`${styles.bgImg} px-28 p-6`}>
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
                index={index}
            />
        </div>
    );
}
