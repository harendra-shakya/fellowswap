import { useEffect, useState } from "react";
import { Modal, useNotification, Input, Select } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import contractAddresses from "../constants/networkMapping.json";
import p2pAbi from "../constants/P2P.json";
import erc20Abi from "../constants/Token.json";
import { getTokenName } from "./helper";
import { useQuery, gql } from "@apollo/client";
import { Web3Storage } from "web3.storage";

declare var window: any;

type BuyModalProps = {
    isVisible: boolean;
    onClose: () => void;
    listingData: {
        fromToken: string;
        toToken: string;
        amount: string;
        price: string;
        limit: string;
        seller: string;
    };
    index: number;
};

export default function BuyModal({ isVisible, onClose, listingData, index }: BuyModalProps) {
    const { isWeb3Enabled, account, chainId } = useMoralis();
    const [isOkDisabled, setIsOkDisabled] = useState(false);
    const [amount1, setAmount1] = useState<string>("0");
    const [amount2, setAmount2] = useState<string>("0");
    const [token1, setToken1] = useState<string>("");
    const [token2, setToken2] = useState<string>("");
    const [availableTokens, setAvailableTokens] = useState<string>("0");
    const [price, setPrice] = useState<string>("0");
    const [limit, setLimit] = useState<string>("0");
    const [userBalance, setUserBalance] = useState<string>("0");

    const dispatch = useNotification();

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

    async function updateUI() {
        console.log("updating ui");
        setToken1((await getTokenName(listingData?.fromToken)).toString());
        setToken2((await getTokenName(listingData?.toToken)).toString());
        await updatePrice();
    }

    useEffect(() => {
        updateUI();
    }, [isOkDisabled, isVisible]);

    console.log("price", price);

    const updatePrice = async function () {
        try {
            if (listingData?.fromToken == undefined) return;
            console.log("updating prices");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const token1__ = await new ethers.Contract(
                listingData?.fromToken.toString(),
                erc20Abi,
                signer
            );
            const token2__ = await new ethers.Contract(
                listingData.toToken.toString(),
                erc20Abi,
                signer
            );
            const deci1 = await token1__.decimals();
            const deci2 = await token2__.decimals();

            setUserBalance(
                ethers.utils.formatUnits(await token2__.balanceOf(account), deci2).toString()
            );

            setAvailableTokens(ethers.utils.formatUnits(listingData?.amount, deci1).toString());
            console.log(
                "setting this price",
                ethers.utils.formatUnits(listingData?.price.toString(), deci2).toString()
            );
            setPrice(ethers.utils.formatUnits(listingData?.price.toString(), deci2).toString());
            setLimit(ethers.utils.formatUnits(listingData?.limit, deci1).toString());
        } catch (e) {
            console.log(e);
            console.log("this error is comming from updateprices");
            setIsOkDisabled(false);
        }
    };

    // * Saving transaction data on ipfs for backup
    const saveOnIpfs = async () => {
        try {
            console.log("saving data on ipfs for backup...");
            const token = process.env.NEXT_PUBLIC_API_TOKEN!;
            // console.log("api token", token);
            const client = await new Web3Storage({ token });

            const object = {
                soldTokenAddr: listingData?.toToken.toString(),
                boughtTokenAddr: listingData?.fromToken.toString(),
                boughtTokens: `${amount1} ${token1}`,
                price: `${price} `,
                soldTokens: `${amount2} ${token2}`,
                seller: listingData?.seller.toString(),
                buyer: account,
            };

            const blob = new Blob([JSON.stringify(object)], {
                type: "application/json",
            });
            const files = [new File([blob], `${account}.json`)];
            const cid = await client.put(files);
            // console.log("cid", cid);
            console.log("data stored on ipfs via web3 storage");
        } catch (e) {
            console.log(e);
        }
    };

    const buyToken = async () => {
        try {
            if (+limit > +amount1) {
                alert("Amount should be more than specified by buyer");
                return;
            }
            if (+amount1 <= 0) {
                alert("Input should be more than zero!");
                return;
            }
            if (+userBalance - +amount2 <= 0) {
                alert("Amount exceeds balance!");
                return;
            }

            setIsOkDisabled(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const _chainId: "31337" | "5" = parseInt(chainId!).toString() as "31337" | "5";

            const toToken = await new ethers.Contract(
                listingData?.toToken.toString(),
                erc20Abi,
                signer
            );

            let decimals = await toToken.decimals();

            const p2pAddress = contractAddresses[_chainId]["P2P"][0];
            const p2p = new ethers.Contract(p2pAddress, p2pAbi, signer);
            console.log("buting token");

            const approveAmount = ethers.utils.parseUnits(amount2, decimals);

            let tx = await toToken.approve(p2pAddress, approveAmount);
            let txReceipt = await tx.wait(1);
            if (txReceipt.status === 1) {
                console.log("aprroved");
            } else {
                alert("Tx failed. Plz try agains!");
            }

            const fromToken = await new ethers.Contract(
                listingData?.fromToken.toString(),
                erc20Abi,
                signer
            );

            decimals = await fromToken.decimals();

            const _amount = ethers.utils.parseUnits(amount1, decimals);

            tx = await p2p.buyToken(
                listingData?.toToken.toString(),
                listingData?.fromToken.toString(),
                listingData?.seller.toString(),
                _amount
            );
            console.log("receiving confirmations...");
            txReceipt = await tx.wait();
            if (txReceipt.status === 1) {
                handleBuySuccess();
                await saveOnIpfs();
            } else {
                alert("Tx failed. Plz try agains!");
            }
            setIsOkDisabled(false);
        } catch (e) {
            console.log(e);
            setIsOkDisabled(false);
        }
    };

    const handleBuySuccess = async function () {
        onClose && onClose();
        dispatch({
            type: "success",
            title: "Token Bought!",
            message: "Token Bought - Please Refresh",
            position: "topL",
        });
    };

    const updateInputs = async function (value: string) {
        try {
            setIsOkDisabled(true);
            const _amount2 = +value * +price;
            setAmount1(value);
            setAmount2(_amount2.toString());
            setIsOkDisabled(false);
            updateUI();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="pt-2">
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={buyToken}
                title={`Buy ${token1}`}
                width="450px"
                isCentered={true}
                isOkDisabled={isOkDisabled || loading}
            >
                <div>
                    <div
                        className="pt-6"
                        style={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Input
                            label={`Buy ${token1}`} // change
                            name="Amount"
                            type="text"
                            onChange={(e) => {
                                if (e.target.value === "") return;
                                updateInputs(e.target.value);
                            }}
                            value={amount1}
                            disabled={isOkDisabled}
                        />
                    </div>
                    <div
                        className="pt-8"
                        style={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Input
                            label={`Sell ${token2}`} // change
                            name="Amount"
                            type="text"
                            value={amount2}
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="pt-8">Price: {price}</div>
                <div className="">Available: {availableTokens}</div>
                <div className="">
                    Minimum Buy: {limit} {token1}
                </div>

                <div className="pb-6">Seller: {listingData?.seller}</div>

                <div className="">
                    Your Balance: {userBalance} {token2}
                </div>
                <div className="pb-6">
                    Ramaining Balance: {+userBalance - +amount2} {token2}
                </div>
            </Modal>
        </div>
    );
}
