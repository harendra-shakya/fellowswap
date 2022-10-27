import { useMoralis } from "react-moralis";
import Buy from "../components/Buy";

export default function Home(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();

    return (
        <div>
            {isWeb3Enabled ? (
                <div>
                    {parseInt(chainId!) === 80001 ? (
                        <div>
                            <Buy />
                        </div>
                    ) : (
                        <div>Plz Connect to Mumbai testnet</div>
                    )}
                </div>
            ) : (
                <div>Please Connect Your Wallet</div>
            )}
        </div>
    );
}
