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
        uint256 limit;
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
        listings[msg.sender][_from][_to] = Listing(
            _from,
            _to,
            _fromTokens,
            _toTokens,
            _limit,
            msg.sender
        ); // from and to are tokens
    }

    function buyToken(
        address _from,
        address _to,
        address _seller,
        uint256 _amount
    ) external {
        Listing memory listing = listings[_seller][_to][_from];
        require(listing.fromTokens != 0, "P2P: Listing not exists");
        require(listing.limit >= _amount && _amount <= listing.fromTokens, "P2P: Out of limit");
        _safeTranferFrom(_from, msg.sender, address(this), _amount);

        _safeTranferFrom(_to, _seller, address(this), _amount);

        uint256 amount = (_amount * 9995) / 10000; // fee

        _safeTranfer(_to, msg.sender, amount);
    }
}
