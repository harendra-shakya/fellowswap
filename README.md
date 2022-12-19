## Inspiration

Although DEXs are cool, safe, and secure, they have some problems, like their high fee of 0.3%. This is three times more expensive than Binance's fee, which is a CEX. Why is the fee so high if decentralized platforms do not have an intermediary and are fully automated? Because of market makers. And not only do they charge high fees, but they also cause high slippage and are vulnerable to attacks like flash loan attacks and sandwich attacks. That's why I created FellowSwap.

## What it does

Unlike traditional DEXs, FellowSwap does not have any market makers. Instead, FellowSwap facilitates trade directly between users without any market maker with only a 0.02% trading fee which is 15x less than a normal DEX like uniswap. There is no danger of price slippage as the prices are set by the seller, not by old AMM logic. And it is also resistant to attacks like flash loan attacks and sandwich attacks as the price is not calculated by old-generation AMM logic.

In order for users to sell tokens, they can list them on the Buy page, where everyone will be able to see them. In the listing function in the smart contract, it stores data like the price and address of the token in a struct. And emits an event that is indexed by the graph. Also while listing tokens users can see real-time market prices of the tokens which come from Chainlink data feeds (Price feed) which makes the user experience a little bit better.

Then users can buy tokens directly from the seller. A user can compare different prices offered by different sellers and choose the most advantageous one for himself. There is no market maker, so we charge only a protocol fee of 0.02% to fund development.

## But how will liquidity come without market makers?

Now you will say if there is no market maker then there won't be enough liquidity for everyone.

But the thing, there will be, but how? because people will provide liquidity for trading. e.g. a trader can set a price of 1 USDC for 1.01 DAI, and they can easily trade.

## Conclusion

P2P trading is also provided by many centralized exchanges. So we know it's a good model. And that's how I got this idea, by looking at centralized exchanges.

There are some P2P DEXs in the market, but they are more like order books, so users have to wait for a while. Here, we are just showing all the options to users, so they can be more independent, and it is an instant transaction. Overall, Fellowswap is a promising protocol, waiting to hit the market.

[Live Server](https://fellowswap.vercel.app/) (Deployed on [Polygon testnet](https://mumbai.polygonscan.com/address/0x43e2e60228457E79bb8CeF680d738A404B0Ab2aA#contracts) and [Fantom testnet](https://testnet.ftmscan.com/address/0x10d5809623e57fa3e213F3eC92f2FF4834f0aBb7#code)). Note: Fellowswap's contract name is P2P.

