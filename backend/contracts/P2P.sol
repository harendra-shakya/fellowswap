// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract P2P is ReentrancyGuard {
    struct Listing {
        uint256 price;
        uint256 amount;
        uint256 limit;
        address seller;
    }

    modifier notListed(
        address _from,
        address _to,
        address _seller
    ) {
        Listing memory listing = listings[_seller][_from][_to];
        require(listing.price == 0, "P2P: Already listed");
        _;
    }

    modifier isListed(
        address _from,
        address _to,
        address _seller
    ) {
        Listing memory listing = listings[_seller][_from][_to];
        require(listing.price > 0, "P2P: Not listed");
        _;
    }

    modifier isEnoughToken(
        uint256 _fromTokens,
        uint256 _toTokens,
        address _from,
        address _seller
    ) {
        require(_fromTokens > 0 && _toTokens > 0, "P2P: Invalid Price");
        require(IERC20(_from).balanceOf(_seller) >= _fromTokens, "P2P: Not have enough tokens");
        _;
    }

    mapping(address => mapping(address => mapping(address => Listing))) private listings;

    bytes4 private constant T_SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));
    bytes4 private constant TF_SELECTOR =
        bytes4(keccak256(bytes("transferFrom(address,address,uint256)")));

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
        address _from,
        address _to,
        uint256 _fromTokens,
        uint256 _toTokens,
        uint256 _limit
    ) external isEnoughToken(_fromTokens, _toTokens, _from, msg.sender) {
        listings[msg.sender][_from][_to] = Listing(_fromTokens, _toTokens, _limit, msg.sender);
    }

    function listToken(
        address _from,
        address _to,
        uint256 _fromTokens,
        uint256 _toTokens,
        uint256 _limit
    )
        external
        notListed(_from, _to, msg.sender)
        isEnoughToken(_fromTokens, _toTokens, _from, msg.sender)
    {
        listings[msg.sender][_from][_to] = Listing(_fromTokens, _toTokens, _limit, msg.sender); // from and to are tokens
    }

    function buyToken(
        address _from,
        address _to,
        address _seller,
        uint256 _amount
    ) external isListed(_from, _to, _seller) {
        Listing memory listing = listings[_seller][_to][_from];
        require(listing.limit >= _amount && _amount <= listing.amount, "P2P: Out of limit");

        // `seller from` = `buyer to` and vice versa
        _safeTranferFrom(_from, msg.sender, address(this), listing.price * _amount); // buyer -> contract
        _safeTranferFrom(_to, _seller, address(this), _amount); // seller -> contract

        uint256 amount = (_amount * 9998) / 10000; // fee
        uint256 amount2 = (listing.price * _amount * 9998) / 10000; // fee

        _safeTranfer(_to, msg.sender, amount);
        _safeTranfer(_from, _seller, amount2);
    }
}
