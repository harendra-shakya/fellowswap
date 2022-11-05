import { useMoralis } from "react-moralis";
import Buy from "../components/Buy";
import { NextPage } from "next";

export default function Home(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();

    const supportedNetworks = [80001, 5];

    return (
        <div>
            {isWeb3Enabled ? (
                <div>
                    {supportedNetworks.includes(parseInt(chainId!)) ? (
                        <div>
                            <Buy />
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
