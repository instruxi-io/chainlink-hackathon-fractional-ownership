// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FractionalToken.sol";

contract FractionalNFT is ERC721, Ownable {
    struct Fractionalization {
        bool isFractionalized;
        uint256 totalSupplied;
    }

    mapping(uint256 => Fractionalization) public fractionalizations;
    uint256[] public tokenIds;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mint(uint256 tokenId) public onlyOwner {
        require(!_exists(tokenId), "Token ID already exist");
        _mint(msg.sender, tokenId);
        tokenIds.push(tokenId);
        fractionalizations[tokenId] = Fractionalization({
            isFractionalized: false,
            totalSupplied: 0
        });
    }

    function getTokenIdsCount() external view returns (uint256 tokenIdCount) {
        tokenIdCount = tokenIds.length;
    }

    function getTokenIdByIndex(
        uint256 index
    ) external view returns (uint256 tokenId) {
        tokenId = tokenIds[index];
    }

    function getIsFractionalized(
        uint256 tokenId
    ) external view returns (bool isFractionalized) {
        isFractionalized = fractionalizations[tokenId].isFractionalized;
    }

    function getTotalSupplied(
        uint256 tokenId
    ) external view returns (uint256 totalSupplied) {
        totalSupplied = fractionalizations[tokenId].totalSupplied;
    }

    function updateIsFractionalized(uint tokenId, bool updateBool) external {
        fractionalizations[tokenId].isFractionalized = updateBool;
    }

    function updateTotalSupplied(uint tokenId, uint totalSupplied) external {
        fractionalizations[tokenId].totalSupplied = totalSupplied;
    }

    function exists(uint256 tokenId) external view returns (bool itExists) {
        itExists = _exists(tokenId);
    }
}
