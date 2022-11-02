import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { BuyToken, CancelListing, ListToken } from "../generated/P2P/P2P"

export function createBuyTokenEvent(
  buyer: Address,
  fromToken: Address,
  seller: Address,
  toToken: Address,
  boughtTokens: BigInt,
  soldToken: BigInt
): BuyToken {
  let buyTokenEvent = changetype<BuyToken>(newMockEvent())

  buyTokenEvent.parameters = new Array()

  buyTokenEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyTokenEvent.parameters.push(
    new ethereum.EventParam("fromToken", ethereum.Value.fromAddress(fromToken))
  )
  buyTokenEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  buyTokenEvent.parameters.push(
    new ethereum.EventParam("toToken", ethereum.Value.fromAddress(toToken))
  )
  buyTokenEvent.parameters.push(
    new ethereum.EventParam(
      "boughtTokens",
      ethereum.Value.fromUnsignedBigInt(boughtTokens)
    )
  )
  buyTokenEvent.parameters.push(
    new ethereum.EventParam(
      "soldToken",
      ethereum.Value.fromUnsignedBigInt(soldToken)
    )
  )

  return buyTokenEvent
}

export function createCancelListingEvent(
  seller: Address,
  fromToken: Address,
  toToken: Address
): CancelListing {
  let cancelListingEvent = changetype<CancelListing>(newMockEvent())

  cancelListingEvent.parameters = new Array()

  cancelListingEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  cancelListingEvent.parameters.push(
    new ethereum.EventParam("fromToken", ethereum.Value.fromAddress(fromToken))
  )
  cancelListingEvent.parameters.push(
    new ethereum.EventParam("toToken", ethereum.Value.fromAddress(toToken))
  )

  return cancelListingEvent
}

export function createListTokenEvent(
  seller: Address,
  fromToken: Address,
  toToken: Address,
  price: BigInt,
  amount: BigInt,
  limit: BigInt
): ListToken {
  let listTokenEvent = changetype<ListToken>(newMockEvent())

  listTokenEvent.parameters = new Array()

  listTokenEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  listTokenEvent.parameters.push(
    new ethereum.EventParam("fromToken", ethereum.Value.fromAddress(fromToken))
  )
  listTokenEvent.parameters.push(
    new ethereum.EventParam("toToken", ethereum.Value.fromAddress(toToken))
  )
  listTokenEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  listTokenEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  listTokenEvent.parameters.push(
    new ethereum.EventParam("limit", ethereum.Value.fromUnsignedBigInt(limit))
  )

  return listTokenEvent
}
