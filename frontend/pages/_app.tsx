import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";
import { NotificationProvider } from "@web3uikit/core";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/harendra-shakya/fellowswap-2",
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <title>FellowSwap</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/logo.png" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
            <footer className="fixed bottom-0 left-2">
                <p className="footer__copyright">
                    <a target="_blank" href="https://twitter.com/harendrashakya_">
                        © Harendra Shakya
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default MyApp;
