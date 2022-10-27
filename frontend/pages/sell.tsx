import { useMoralis } from "react-moralis";

export default function Sell(): JSX.Element {
    const { isWeb3Enabled, chainId, account } = useMoralis();

    return (
        <div>
            {isWeb3Enabled ? (
                <div>
                    {parseInt(chainId!) === 80001 ? (
                        <div>
                            hii
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
