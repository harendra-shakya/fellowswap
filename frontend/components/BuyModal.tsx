import { useEffect, useState } from "react";
import { Modal, useNotification, Input, Select } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { ethers, Contract } from "ethers";
import { OptionProps } from "@web3uikit/core";
import contractAddresses from "../constants/networkMapping.json";

declare var window: any;

type BuyModalProps = {
    isVisible: boolean;
    onClose: () => void;
};

export default function BuyModal({ isVisible, onClose }: BuyModalProps) {
    const { isWeb3Enabled, account, chainId } = useMoralis();
    const [isOkDisabled, setIsOkDisabled] = useState(false);
    const [amount1, setAmount1] = useState("0");
    const [amount2, setAmount2] = useState("0");
    const dispatch = useNotification();

    const allTokens = ["WETH", "WBTC", "DAI", "USDC"];

    const price = 1200;

    const handleBuySuccess = async function () {
        onClose && onClose();
        dispatch({
            type: "success",
            title: "Liquidity added!",
            message: "Liquidity added - Please Refresh",
            position: "topL",
        });
    };

    const updateInputs = async function (value: string) {
        try {
            setIsOkDisabled(true);
            setTimeout(() => {
                setAmount1(value);
                const _amount2 = +value * price;
                setAmount2(_amount2.toString());
            }, 1000);
            setIsOkDisabled(false);
        } catch (e) {
            console.log(e);
        }
    };

    async function updateUI() {}

    useEffect(() => {
        updateUI();
    }, [isWeb3Enabled, amount1, amount2]);

    return (
        <div className="pt-2">
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={() => {}}
                title={`Buy WETH`}
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
                            label={`Buy ${"WETH"}`} // change
                            name="Amount"
                            type="text"
                            onChange={(e) => {
                                if (e.target.value === "" || +e.target.value <= 0) {
                                    setAmount2("0");
                                }
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
                            label={`Sell ${"DAI"}`} // change
                            name="Amount"
                            type="text"
                            value={amount2}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="pt-4">Seller: </div>
                <div className="pb-6">Price: {price}</div>
            </Modal>
        </div>
    );
}
