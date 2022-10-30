import { useEffect, useState } from "react";
import { Modal, useNotification, Input, Select } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { ethers, Contract } from "ethers";
import { OptionProps } from "@web3uikit/core";
import contractAddresses from "../constants/networkMapping.json";

declare var window: any;

type ListModalProps = {
    isVisible: boolean;
    onClose: () => void;
};

export default function ListModal({ isVisible, onClose }: ListModalProps) {
    const { isWeb3Enabled, account, chainId } = useMoralis();
    const [isOkDisabled, setIsOkDisabled] = useState(false);
    const [amount1, setAmount1] = useState("0");
    const [amount2, setAmount2] = useState("0");
    const [OptionProps, setOptionProps] = useState<OptionProps[]>();
    const [token1, setToken1] = useState("WETH");
    const [token2, setToken2] = useState("DAI");
    const dispatch = useNotification();

    const allTokens = ["WETH", "WBTC", "DAI", "USDC"];

    const price = 1200;

    const updateOptions = async () => {
        let _data: OptionProps[] = [];
        allTokens.forEach(async (token, i) => {
            _data.push({
                id: token,
                label: token,
            });
        });
        setOptionProps(_data);
    };

    const handleListSuccess = async function () {
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
        updateOptions();
    }, [isWeb3Enabled, amount1, amount2]);

    return (
        <div className="pt-2">
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={() => {}}
                title={`List WETH`}
                width="450px"
                isCentered={true}
                isOkDisabled={isOkDisabled}
            >
                <div className="grid grid-cols-2 gap-3 place-content-stretch h-35">
                    <Input
                        label="Amount"
                        name="Amount"
                        type="text"
                        onChange={(e) => {
                            if (e.target.value === "" || +e.target.value <= 0) return;
                            setTimeout(() => {
                                setAmount1(e.target.value);
                            }, 1000);
                        }}
                        value={amount1}
                        disabled={isOkDisabled}
                    />
                    <Select
                        defaultOptionIndex={0}
                        label="Sell"
                        onChange={async (OptionProps) => {
                            setToken1(OptionProps.label.toString());
                        }}
                        options={OptionProps}
                        disabled={isOkDisabled}
                    />
                    <div className="pt-6">
                        <Input
                            label="Price"
                            name="Amount"
                            type="text"
                            onChange={(e) => {
                                if (e.target.value === "" || +e.target.value <= 0) return;
                                setTimeout(() => {
                                    setAmount2(e.target.value);
                                }, 1000);
                            }}
                            disabled={false}
                            value={amount2}
                        />
                    </div>
                    <div className="pt-6">
                        <Select
                            defaultOptionIndex={2}
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
                        value={amount2}
                        disabled={false}
                    />
                </div>
                <div className="pb-6 pt-4">Price in USD: {price}</div>
            </Modal>
        </div>
    );
}
