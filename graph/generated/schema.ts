// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ActiveToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ActiveToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ActiveToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ActiveToken", id.toString(), this);
    }
  }

  static load(id: string): ActiveToken | null {
    return changetype<ActiveToken | null>(store.get("ActiveToken", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    return value!.toBytes();
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get fromToken(): Bytes {
    let value = this.get("fromToken");
    return value!.toBytes();
  }

  set fromToken(value: Bytes) {
    this.set("fromToken", Value.fromBytes(value));
  }

  get toToken(): Bytes {
    let value = this.get("toToken");
    return value!.toBytes();
  }

  set toToken(value: Bytes) {
    this.set("toToken", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value!.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get limit(): BigInt {
    let value = this.get("limit");
    return value!.toBigInt();
  }

  set limit(value: BigInt) {
    this.set("limit", Value.fromBigInt(value));
  }
}

export class TokenListed extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenListed entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenListed must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenListed", id.toString(), this);
    }
  }

  static load(id: string): TokenListed | null {
    return changetype<TokenListed | null>(store.get("TokenListed", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get fromToken(): Bytes {
    let value = this.get("fromToken");
    return value!.toBytes();
  }

  set fromToken(value: Bytes) {
    this.set("fromToken", Value.fromBytes(value));
  }

  get toToken(): Bytes {
    let value = this.get("toToken");
    return value!.toBytes();
  }

  set toToken(value: Bytes) {
    this.set("toToken", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value!.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get limit(): BigInt {
    let value = this.get("limit");
    return value!.toBigInt();
  }

  set limit(value: BigInt) {
    this.set("limit", Value.fromBigInt(value));
  }
}

export class TokenCanceled extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenCanceled entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenCanceled must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenCanceled", id.toString(), this);
    }
  }

  static load(id: string): TokenCanceled | null {
    return changetype<TokenCanceled | null>(store.get("TokenCanceled", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get fromToken(): Bytes {
    let value = this.get("fromToken");
    return value!.toBytes();
  }

  set fromToken(value: Bytes) {
    this.set("fromToken", Value.fromBytes(value));
  }

  get toToken(): Bytes {
    let value = this.get("toToken");
    return value!.toBytes();
  }

  set toToken(value: Bytes) {
    this.set("toToken", Value.fromBytes(value));
  }
}

export class TokenBought extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenBought entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenBought must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenBought", id.toString(), this);
    }
  }

  static load(id: string): TokenBought | null {
    return changetype<TokenBought | null>(store.get("TokenBought", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    return value!.toBytes();
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get fromToken(): Bytes {
    let value = this.get("fromToken");
    return value!.toBytes();
  }

  set fromToken(value: Bytes) {
    this.set("fromToken", Value.fromBytes(value));
  }

  get toToken(): Bytes {
    let value = this.get("toToken");
    return value!.toBytes();
  }

  set toToken(value: Bytes) {
    this.set("toToken", Value.fromBytes(value));
  }

  get boughtTokens(): BigInt {
    let value = this.get("boughtTokens");
    return value!.toBigInt();
  }

  set boughtTokens(value: BigInt) {
    this.set("boughtTokens", Value.fromBigInt(value));
  }

  get soldToken(): BigInt {
    let value = this.get("soldToken");
    return value!.toBigInt();
  }

  set soldToken(value: BigInt) {
    this.set("soldToken", Value.fromBigInt(value));
  }
}
