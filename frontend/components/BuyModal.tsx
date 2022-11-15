import { useEffect, useState } from "react";
import { Modal, useNotification, Input, Select } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { ethers, Contract } from "ethers";
import { OptionProps } from "@web3uikit/core";
import contractAddresses from "../constants/networkMapping.json";
import p2pAbi from "../constants/P2P.json";
import erc20Abi from "../constants/Token.json";
import { getTokenName } from "../pages/helper";
import { useQuery, gql } from "@apollo/client";

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
    const [amount1, setAmount1] = useState("0");
    const [amount2, setAmount2] = useState("0");
    const [token1, setToken1] = useState("");
    const [token2, setToken2] = useState("");
    const [amount, setAmount] = useState("0");
    const [price, setPrice] = useState("0");
    const [limit, setLimit] = useState("0");
    const [info, setInfo] = useState("");
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
    }, [isOkDisabled, isVisible, amount2, listingData]);

    console.log("price", price);

    const updatePrice = async function () {
        try {
            if (listingData?.fromToken == undefined) return;
            console.log("updating prices");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const _chainId = parseInt(chainId!).toString();
            console.log("1");
            const p2pAddress = contractAddresses[_chainId]["P2P"][0];
            console.log("2");
            const p2p = new ethers.Contract(p2pAddress, p2pAbi, signer);

            console.log("3");
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

            setAmount(ethers.utils.formatUnits(listingData.amount, deci1).toString());
            console.log(
                "setting this price",
                ethers.utils.formatUnits(listingData.price.toString(), deci2).toString()
            );
            setPrice(ethers.utils.formatUnits(listingData.price.toString(), deci2).toString());
            setLimit(ethers.utils.formatUnits(listingData.limit, deci1).toString());

            setIsOkDisabled(false);
        } catch (e) {
            console.log(e);
            console.log("this error is comming from updateprices");
            setIsOkDisabled(false);
        }
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
                onOk={() => {}}
                title={`Buy ${token1}`}
                width="450px"
                isCentered={true}
                isOkDisabled={isOkDisabled}
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
                                if (e.target.value === "" || +e.target.value <= 0) return;
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
                <div className="pt-4">Price: {price}</div>
                <div className="pb-6">Seller: {listingData.seller}</div>
            </Modal>
        </div>
    );
}
