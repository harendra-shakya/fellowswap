// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract P2P is ReentrancyGuard {

    struct Listing {
        address from;
        address to;
        uint256 fromTokens;
        uint256 toTokens;
        address seller;
    }

    modifier notListed(
        address _from,
        address _to,
        address _seller
    ) {
        Listing memory listing = listings[_seller][_from][_to];
        require(listing.fromTokens == 0, "P2P: Already listed");
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

    function listToken(
        address _from,
        address _to,
        uint256 _fromTokens,
        uint256 _toTokens
    )
        external
        notListed(_from, _to, msg.sender)
        isEnoughToken(_fromTokens, _toTokens, _from, msg.sender)
    {
        listings[msg.sender][_from][_to] = Listing(_from, _to, _fromTokens, _toTokens, msg.sender); // from and to are tokens
    }
}
