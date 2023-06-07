// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IFractionalNFT {
    struct Fractionalization {
        address fractionalToken; // Use address type for the interface
        bool isFractionalized;
        uint256 totalSupply;
    }

    function mint(uint256 tokenId, uint256 totalSupply) external;

    function exists(uint256 tokenId) external view returns (bool);

    function ownerOf(uint256 tokenId) external view returns (address);

    function transferFrom(address from, address to, uint256 tokenId) external;

    // Get the Fractionalization struct for a specific token ID
    // function getFractionalization(
    //     uint256 tokenId
    // ) external view returns (Fractionalization memory);

    function getIsFractionalized(uint256 tokenId) external view returns (bool);

    function getFractionalSupply(
        uint256 tokenId
    ) external view returns (uint256);

    function getTotalSupplied(uint256 tokenId) external view returns (uint256);

    function updateIsFractionalized(uint tokenId, bool updateBool) external;

    function updateTotalSupplied(uint tokenId, uint totalSupplied) external;

    // Get the total number of token IDs
    function getTokenIdsCount() external view returns (uint256);

    // Get a specific token ID by index
    function getTokenIdByIndex(uint256 index) external view returns (uint256);

    // Fractionalize a specific token ID
    function fractionalize(uint256 tokenId) external;

    // Event emitted when a token is fractionalized
    event TokenFractionalized(
        uint256 indexed tokenId,
        address fractionalToken,
        uint256 totalSupply
    );
}
