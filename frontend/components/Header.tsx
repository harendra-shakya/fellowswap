import Link from "next/link";
import { ConnectButton } from "@web3uikit/web3";

export default function Header(): JSX.Element {
    return (
        <nav className="p-4 border-b-2 flex flex-row">
            <h1 className="px-5 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-400">
                P2P
            </h1>
            <div className="flex flex-row justify-between absolute top-0 right-10 items-center">
                <Link href="/">
                    <a className="mr-3 p-6">Buy</a>
                </Link>
                <Link href="/sell">
                    <a className="mr-3 p-6">Sell</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    );
}
