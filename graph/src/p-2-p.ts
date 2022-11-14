import { p2p, BuyToken, CancelListing, ListToken } from "../generated/p2p/p2p";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  BuyToken as BuyTokenEvent,
  CancelListing as CancelListingEvent,
  ListToken as ListTokenEvent,
} from "../generated/p2p/p2p";
import {
  TokenListed,
  ActiveToken,
  TokenBought,
  TokenCanceled,
} from "../generated/schema";

export function handleListToken(event: ListTokenEvent): void {
  let tokenListed = TokenListed.load(
    getIdFromEventParams(
      event.params.seller,
      event.params.fromToken,
      event.params.toToken
    )
  );
  let activeItem = ActiveToken.load(
    getIdFromEventParams(
      event.params.seller,
      event.params.fromToken,
      event.params.toToken
    )
  );
  if (!tokenListed) {
    tokenListed = new TokenListed(
      getIdFromEventParams(
        event.params.seller,
        event.params.fromToken,
        event.params.toToken
      )
    );
  }
  if (!activeItem) {
    activeItem = new ActiveToken(
      getIdFromEventParams(
        event.params.seller,
        event.params.fromToken,
        event.params.toToken
      )
    );
  }
  tokenListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  tokenListed.fromToken = event.params.fromToken;
  activeItem.fromToken = event.params.fromToken;

  tokenListed.toToken = event.params.toToken;
  activeItem.toToken = event.params.toToken;

  tokenListed.amount = event.params.amount;
  activeItem.amount = event.params.amount;

  tokenListed.price = event.params.price;
  activeItem.price = event.params.price;

  tokenListed.limit = event.params.limit;
  activeItem.limit = event.params.limit;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  tokenListed.save();
  activeItem.save();
}

export function handleCancelListing(event: CancelListingEvent): void {
  let itemCanceled = TokenCanceled.load(
    getIdFromEventParams(
      event.params.seller,
      event.params.fromToken,
      event.params.toToken
    )
  );
  let activeItem = ActiveToken.load(
    getIdFromEventParams(
      event.params.seller,
      event.params.fromToken,
      event.params.toToken
    )
  );
  if (!itemCanceled) {
    itemCanceled = new TokenCanceled(
      getIdFromEventParams(
        event.params.seller,
        event.params.fromToken,
        event.params.toToken
      )
    );
  }

  itemCanceled.seller = event.params.seller;
  itemCanceled.fromToken = event.params.fromToken;
  itemCanceled.toToken = event.params.toToken;
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  itemCanceled.save();
  activeItem!.save();
}

export function handleBuyToken(event: BuyTokenEvent): void {
  let itemBought = TokenBought.load(
    getIdFromEventParams(
      event.params.seller,
      event.params.fromToken,
      event.params.toToken
    )
  );
  let activeItem = ActiveToken.load(
    getIdFromEventParams(
      event.params.seller,
      event.params.fromToken,
      event.params.toToken
    )
  );
  if (!itemBought) {
    itemBought = new TokenBought(
      getIdFromEventParams(
        event.params.seller,
        event.params.fromToken,
        event.params.toToken
      )
    );
  }

  itemBought.buyer = event.params.buyer;
  itemBought.seller = event.params.seller;
  itemBought.toToken = event.params.toToken;
  itemBought.fromToken = event.params.fromToken;
  itemBought.boughtTokens = event.params.boughtTokens;
  itemBought.soldToken = event.params.soldToken;

  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

let counter = 0;

function getIdFromEventParams(
  seller: Address,
  fromToken: Address,
  toToken: Address
): string {
  counter++;
  return seller.toHexString() + fromToken.toHexString() + toToken.toHexString();
}
