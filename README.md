## Inspiration

Dexs are cool, safe and secure but they have some problems like the high fee they charge 0.3% normally which is 3x higher than Binance fee which is a Cex. If there is no intermediary in Decentralized platforms and it is fully automated then why so high fee?? Because of market makers. And the not only fee is high they cause high slippage and are vulnerable to attacks like flash loan attacks and sandwich attacks. That's why I created FellowSwap.

## What it does

Unlike traditional dex, FellowSwap does not have any market makers, FellowSwap facilitates trade directly between users without any market maker with only a 0.02% trading fee which is 15x less than a normal dex like uniswap. There is no danger of slippage as the prices are set by the seller, not by old AMM logic. And it is also resistant to attacks like flash loan attacks and sandwich attacks as the price is not calculated by old-generation AMM logic.

For selling the tokens, the users can list the tokens which will be shown on to buy page to everyone. In the listing function in the smart contract, it stores data like the price and address of the token in a struct. And emits an event that is indexed by the graph. Also while listing tokens users can see real-time market prices of the tokens which is coming from Chainlink data feeds (Price feed) which makes the user experience a little bit better.

Then users can buy tokens directly from the seller. A user can compare different prices offered by different sellers and choose the best one for himself. As there is no market maker so we only charge a 0.02% fee as a protocol fee but we can reduce it to 0% if we get funding to attract more users. Also during buying all the data of the transaction are being stored on ipfs via web3storage for backup purposes.

All the main three functions Listing, buying, and canceling token emits an event that is indexed by the graph that shows the data to users cheaply.

[Live Server](https://fellowswap.vercel.app/)
