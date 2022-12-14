// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./libraries/TransferHelpers.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract P2P is ReentrancyGuard {
    struct Listing {
        uint256 price;
        uint256 amount;
        uint256 limit;
        address seller;
    }

    event ListToken(
        address indexed seller,
        address indexed fromToken,
        address indexed toToken,
        uint256 price,
        uint256 amount,
        uint256 limit
    );

    event BuyToken(
        address indexed buyer,
        address indexed fromToken,
        address indexed seller,
        address toToken,
        uint256 boughtTokens,
        uint256 soldToken
    );

    event CancelListing(
        address indexed seller,
        address indexed fromToken,
        address indexed toToken
    );

    modifier notListed(address _fromToken, address _toToken) {
        Listing memory listing = listings[msg.sender][_fromToken][_toToken];
        require(listing.price == 0, "P2P: Already listed");
        _;
    }

    modifier isListed(
        address _fromToken,
        address _toToken,
        address _seller
    ) {
        Listing memory listing = listings[_seller][_fromToken][_toToken];
        require(listing.seller != address(0), "P2P: Not listed");
        _;
    }

    modifier isEnoughToken(
        uint256 _price,
        uint256 _amount,
        address _fromToken
    ) {
        require(_price > 0, "P2P: Invalid Price");
        require(_amount > 0, "P2P: Invalid Amount");
        require(
            IERC20Metadata(_fromToken).balanceOf(msg.sender) >= _amount,
            "P2P: Amount Exceeds balance"
        );
        _;
    }

    mapping(address => mapping(address => mapping(address => Listing))) private listings;

    function updateListing(
        address _seller,
        address _fromToken,
        address _toToken,
        uint256 _price,
        uint256 _amount,
        uint256 _limit
    ) private isListed(_fromToken, _toToken, _seller) {
        require(_price > 0, "P2P: Invalid Price");

        if (_amount > IERC20Metadata(_fromToken).balanceOf(_seller) || _amount == 0) {
            delete listings[_seller][_fromToken][_toToken];
            emit CancelListing(msg.sender, _fromToken, _toToken);
        } else {
            // stack too deep error
            {
                listings[_seller][_fromToken][_toToken] = Listing(
                    _price,
                    _amount,
                    _limit,
                    _seller
                );
            }
            emit ListToken(_seller, _fromToken, _toToken, _price, _amount, _limit);
        }
    }

    function listToken(
        address _fromToken,
        address _toToken,
        uint256 _price,
        uint256 _amount,
        uint256 _limit
    ) external notListed(_fromToken, _toToken) isEnoughToken(_price, _amount, _fromToken) {
        require(_amount >= _limit, "P2P: Limit should be less than amount");
        Listing memory listing;
        listing.price = _price;
        listing.amount = _amount;
        listing.limit = _limit;
        listing.seller = msg.sender;

        listings[msg.sender][_fromToken][_toToken] = listing;
        // listings[msg.sender][_fromToken][_toToken] = Listing(_price, _amount, _limit, msg.sender); // from and to are tokens
        emit ListToken(msg.sender, _fromToken, _toToken, _price, _amount, _limit);
    }

    function buyToken(
        address _fromToken,
        address _toToken,
        address _seller,
        uint256 _amount
    ) external isListed(_toToken, _fromToken, _seller) nonReentrant {
        Listing memory listing = listings[_seller][_toToken][_fromToken];
        require(_amount >= listing.limit && _amount <= listing.amount, "P2P: Out of limit");

        uint256 decimals = 10**IERC20Metadata(_toToken).decimals();

        // `seller from` = `buyer to` and vice versa
        TransferHelpers.safeTranferFrom(
            _fromToken,
            msg.sender,
            address(this),
            (listing.price * _amount) / decimals // this is important as we are passing token amount with decimals as if we pass amount without decimals then they won't be able to buy tokens in decimals e.g. 0.001 BTC
        ); // buyer -> contract
        TransferHelpers.safeTranferFrom(_toToken, _seller, address(this), _amount); // seller -> contract

        uint256 amount = (_amount * 9998) / 10000; // fee
        uint256 amount2 = ((listing.price * _amount * 9998) / decimals) / 10000; // fee

        TransferHelpers.safeTranfer(_toToken, msg.sender, amount);
        TransferHelpers.safeTranfer(_fromToken, _seller, amount2);

        emit BuyToken(msg.sender, _fromToken, _seller, _toToken, _amount, amount2);

        updateListing(
            _seller,
            _toToken,
            _fromToken,
            listing.price,
            (listing.amount - _amount),
            listing.limit
        );
    }

    function cancelListing(address _fromToken, address _toToken)
        external
        isListed(_fromToken, _toToken, msg.sender)
    {
        delete listings[msg.sender][_fromToken][_toToken];
        emit CancelListing(msg.sender, _fromToken, _toToken);
    }

    function getListing(
        address _seller,
        address _fromToken,
        address _toToken
    ) external view returns (Listing memory listing) {
        listing = listings[_seller][_fromToken][_toToken];
    }
}
