// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract P2P is ReentrancyGuard {

    bytes4 private constant T_SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));
    bytes4 private constant TF_SELECTOR =
        bytes4(keccak256(bytes("transferFrom(address,address,uint256)")));

    struct Listing {
        uint256 price;
        uint256 amount;
        uint256 limit;
        address seller;
    }

    modifier notListed(
        address _fromToken,
        address _toToken,
        address _seller
    ) {
        Listing memory listing = listings[_seller][_fromToken][_toToken];
        require(listing.price == 0, "P2P: Already listed");
        _;
    }

    modifier isListed(
        address _fromToken,
        address _toToken,
        address _seller
    ) {
        Listing memory listing = listings[_seller][_fromToken][_toToken];
        require(listing.price > 0, "P2P: Not listed");
        _;
    }

    modifier isEnoughToken(
        uint256 _price,
        uint256 _amount,
        address _fromToken,
        address _seller
    ) {
        require(_price > 0 && _amount > 0, "P2P: Invalid Price");
        require(IERC20(_fromToken).balanceOf(_seller) >= _amount, "P2P: Not have enough tokens");
        _;
    }

    mapping(address => mapping(address => mapping(address => Listing))) private listings;

    function _safeTranfer(
        address token,
        address to,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(T_SELECTOR, to, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Transfer Failed!");
    }

    function _safeTranferFrom(
        address token,
        address from,
        address to,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(TF_SELECTOR, from, to, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Transfer Failed!");
    }

    function updateListing(
        address _fromToken,
        address _toToken,
        uint256 _price,
        uint256 _amount,
        uint256 _limit
    ) external isEnoughToken(_price, _amount, _fromToken, msg.sender) {
        listings[msg.sender][_fromToken][_toToken] = Listing(_price, _amount, _limit, msg.sender);
    }

    function listToken(
        address _fromToken,
        address _toToken,
        uint256 _price,
        uint256 _amount,
        uint256 _limit
    )
        external
        notListed(_fromToken, _toToken, msg.sender)
        isEnoughToken(_price, _amount, _fromToken, msg.sender)
    {
        listings[msg.sender][_fromToken][_toToken] = Listing(_price, _amount, _limit, msg.sender); // from and to are tokens
    }

    function buyToken(
        address _fromToken,
        address _toToken,
        address _seller,
        uint256 _amount
    ) external isListed(_fromToken, _toToken, _seller) {
        Listing memory listing = listings[_seller][_toToken][_fromToken];
        require(listing.limit >= _amount && _amount <= listing.amount, "P2P: Out of limit");

        // `seller from` = `buyer to` and vice versa
        _safeTranferFrom(_fromToken, msg.sender, address(this), listing.price * _amount); // buyer -> contract
        _safeTranferFrom(_toToken, _seller, address(this), _amount); // seller -> contract

        uint256 amount = (_amount * 9998) / 10000; // fee
        uint256 amount2 = (listing.price * _amount * 9998) / 10000; // fee

        _safeTranfer(_toToken, msg.sender, amount);
        _safeTranfer(_fromToken, _seller, amount2);
    }

    function cancelListing(
        address _fromToken,
        address _toToken
    ) external isListed(_fromToken, _toToken, msg.sender) {
        delete listings[msg.sender][_fromToken][_toToken];
    }
}
