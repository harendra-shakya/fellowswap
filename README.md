## Inspiration

Dexs are cool, safe and secure but they have some problems like the high fee they charge 0.3% normally which is 3x higher than Binance fee which is a Cex. If there is no intermediary in Decentralized platforms and it is fully automated then why so high fee?? Because of market makers. And the not only fee is high they cause high slippage and are vulnerable to attacks like flash loan attacks and sandwich attacks. That's why I created FellowSwap.

## What it does

Unlike traditional dex, FellowSwap does not have any market makers, FellowSwap facilitates trade directly between users without any market maker with only a 0.02% trading fee which is 15x less than a normal dex like uniswap. There is no danger of slippage as the prices are set by the seller, not by old AMM logic. And it is also resistant to attacks like flash loan attacks and sandwich attacks as the price is not calculated by old-generation AMM logic.

For selling the tokens, the users can list the tokens which will be shown on to buy page to everyone. In the listing function in the smart contract, it stores data like the price and address of the token in a struct. And emits an event that is indexed by the graph. Also while listing tokens users can see real-time market prices of the tokens which is coming from Chainlink data feeds (Price feed) which makes the user experience a little bit better.

Then users can buy tokens directly from the seller. A user can compare different prices offered by different sellers and choose the best one for himself. As there is no market maker so we only charge a 0.02% fee as a protocol fee but we can reduce it to 0% if we get funding to attract more users. Also during buying all the data of the transaction are being stored on ipfs via web3storage for backup purposes.

All the main three functions Listing, buying, and canceling token emits an event that is indexed by the graph that shows the data to users cheaply.

## How I built it

FellowSwap is a decentralized protocol. I have gone to every extent possible in this time frame to make this whole protocol decentralized. Decentralization was achieved by using different technologies. These are the following Technologies we have used in the FellowSwap:-

- **Polygon(Sponsor)** - Project Deployed on Polygon testnet.
- **Chainlink** - Used chainlink Data feeds for showing real-time prices on frontend.
- **Web3 Storage/IPFS(Sponsor)** - Tx data is also being stored on IPFS for backup
- **Solidity** - Language for writing smart contract
- **Foundry**- For testing
- **The Graph** - For indexing data
- **Hardhat**- For deploying
- **Typescript** - Typescript is used for writing frontend code.
- **Next js** - Helped in building frontend efficiently.
- **Ethers** - Library to interact with the blockchain
- **Tailwindcss** - Helped in building ui
- **Web3 UI kit** - Helped in building ui

I developed all the Smart Contracts with Solidity. These contracts are thoroughly tested by building different tests using Foundry and later deployed on the Polygon Testnet with hardhat. I used the graph for indexing data. Next.js helped in building a serverless client side and chainlink helped me to show real-time prices on frontend.

## Challenges I ran into

I ran into many challenges like in starting I wanted to try something new so I tested contracts with foundry, I faced many bugs but I resolved them. And another problem came my way to how to display real-time market prices of tokens for FREE without adding anything to my contracts and that's why I built [Linkit](https://github.com/harendra-shakya/linkit).

## What I learned

While building this I learned how to use foundry for testing. I also learned a lot from chainlink technical workshops. And also the most important lesson is that when you're are working on a problem you can also find a new problem and solve it. Just like I stuck into the problem and built [Linkit](https://github.com/harendra-shakya/linkit).

## What's next for FellowSwap

It is just an MVP and it still requires many features to make the user experience better like notification service, sorting tokens etc. And will try to get funds and work on it to launch on mainnet because I know p2p and 15x less fee than uniswap is a good idea I guess.
