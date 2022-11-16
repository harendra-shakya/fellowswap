import { useEffect, useState } from "react";
import { Modal, useNotification, Input, Select } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { ethers, Contract } from "ethers";
import { OptionProps } from "@web3uikit/core";
import contractAddresses from "../constants/networkMapping.json";
import p2pAbi from "../constants/P2P.json";
import erc20Abi from "../constants/Token.json";

declare var window: any;

type ListModalProps = {
    isVisible: boolean;
    onClose: () => void;
    index: number;
    tokenNames: string[];
    tokenAddresses: string[];
    tokenBalances: string[];
    marketPrice: string;
};

export default function ListModal({
    isVisible,
    onClose,
    index,
    tokenNames,
    tokenAddresses,
    tokenBalances,
    marketPrice,
}: ListModalProps) {
    const { isWeb3Enabled, account, chainId } = useMoralis();
    const [isOkDisabled, setIsOkDisabled] = useState(false);
    const [OptionProps, setOptionProps] = useState<OptionProps[]>();
    const [token2, setToken2] = useState("");
    const [amount, setAmount] = useState("0");
    const [price, setPrice] = useState("0");
    const [limit, setLimit] = useState("0");
    const [info, setInfo] = useState("");
    const dispatch = useNotification();

    useEffect(() => {
        updateInfo();
    }, [isWeb3Enabled, OptionProps]);

    useEffect(() => {
        updateOptions();
    }, [isWeb3Enabled]);

    const updateInfo = async () => {
        setInfo("");
        if (tokenNames[index] == token2) {
            setInfo("Info: Can't list same token");
        }
    };

    const updateOptions = async () => {
        let _data: OptionProps[] = [];

        tokenNames.forEach(async (token, i) => {
            _data.push({
                id: token,
                label: token,
            });
        });
        setOptionProps(_data);
    };

    const listToken = async () => {
        try {
            if (+tokenBalances[index] - +amount <= 0) {
                alert("Amount exceeds balance!");
                return;
            }
            if (+amount <= 0 || +price <= 0) {
                alert("Input should be more than zero!");
                return;
            }
            setIsOkDisabled(true);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const _chainId: "31337" | "5" = parseInt(chainId!).toString() as "31337" | "5";
            const p2pAddress = contractAddresses[_chainId]["P2P"][0];
            type Token = "WETH" | "DAI" | "WBTC" | "USDC";

            const p2p = new ethers.Contract(p2pAddress, p2pAbi, signer);
            console.log("listing token");

            const _token1: Token = tokenNames[index] as Token;
            const _token2: Token = token2 as Token;

            const token1Addr: string = contractAddresses[_chainId][_token1][0];
            const token2Addr: string = contractAddresses[_chainId][_token2][0];

            const token1__ = await new ethers.Contract(token1Addr, erc20Abi, signer);
            const token2__ = await new ethers.Contract(token2Addr, erc20Abi, signer);
            const deci1 = await token1__.decimals();
            const deci2 = await token2__.decimals();

            const _amount = ethers.utils.parseUnits(amount, deci1);
            const _price = ethers.utils.parseUnits(price, deci2);
            const _limit = ethers.utils.parseUnits(limit, deci1);

            let tx = await token1__.approve(p2pAddress, _amount);
            let txReceipt = await tx.wait(1);
            if (txReceipt.status === 1) {
                console.log("aprroved");
            } else {
                alert("Tx failed. Plz try agains!");
            }

            tx = await p2p.listToken(token1Addr, token2Addr, _price, _amount, _limit);
            console.log("receiving confirmations...");
            txReceipt = await tx.wait();
            if (txReceipt.status === 1) {
                console.log("listed");
                handleListSuccess();
            } else {
                alert("Tx failed. Plz try agains!");
            }
            setIsOkDisabled(false);
        } catch (e) {
            console.log(e);
            setIsOkDisabled(false);
        }
    };

    const handleListSuccess = async function () {
        onClose && onClose();
        dispatch({
            type: "success",
            title: "Token Listed for sell!",
            message: "Token Listed for sell - Please Refresh",
            position: "topL",
        });
    };

    return (
        <div className="pt-2">
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={listToken}
                title={`List ${tokenNames[index]}`}
                width="450px"
                isCentered={true}
                isOkDisabled={info === "Info: Can't list same token" ? true : isOkDisabled}
            >
                <div className="grid grid-cols-2 gap-3 place-content-stretch h-35">
                    <Input
                        label="Amount"
                        name="Amount"
                        type="text"
                        onChange={(e) => {
                            if (e.target.value === "") return;
                            setAmount(e.target.value);
                        }}
                        value={amount}
                        disabled={isOkDisabled}
                    />
                    <Select
                        defaultOptionIndex={0}
                        label="Sell"
                        options={[
                            {
                                id: tokenNames[index],
                                label: tokenNames[index],
                            },
                        ]}
                        disabled={true}
                    />
                    <div className="pt-6">
                        <Input
                            label="Price"
                            name="Amount"
                            type="text"
                            onChange={(e) => {
                                if (e.target.value === "") return;
                                setPrice(e.target.value);
                            }}
                            disabled={false}
                            value={price}
                        />
                    </div>
                    <div className="pt-6">
                        <Select
                            label="Buy"
                            onChange={(OptionProps) => {
                                setToken2(OptionProps.label.toString());
                            }}
                            options={OptionProps}
                            disabled={isOkDisabled}
                        />
                    </div>
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
                        label={`Limit`} // change
                        name="Amount"
                        type="text"
                        onChange={(e) => {
                            if (e.target.value === "") setLimit("0");
                            else setLimit(e.target.value);
                        }}
                        disabled={false}
                    />
                </div>
                <div className="pt-4">{info}</div>
                <div className="pt-4">Market Price: ${marketPrice}</div>
                <div className="">
                    Your Balance: {tokenBalances[index]} {tokenNames[index]}
                </div>
                <div className="pb-6">
                    Remaining Balance: {+tokenBalances[index] - +amount} {tokenNames[index]}
                </div>
            </Modal>
        </div>
    );
}
