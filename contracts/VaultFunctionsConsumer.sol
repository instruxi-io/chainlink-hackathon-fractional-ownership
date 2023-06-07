// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./FunctionsConsumer.sol";
import "./IFractionalNFT.sol";
import "./IFractionalToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {FunctionsConsumer} from "./FunctionsConsumer.sol";

// VAULT
contract VaultFunctionsConsumer is FunctionsConsumer {
    IFractionalNFT public nftContract;
    IFractionalToken public fractionalToken;
    AggregatorV3Interface public priceFeed;

    mapping(uint256 => address) public depositor;

    constructor(
        address _nftContract,
        address _fractionalToken,
        address _priceFeed,
        address _oracle
    ) FunctionsConsumer(_oracle) {
        nftContract = IFractionalNFT(_nftContract);
        fractionalToken = IFractionalToken(_fractionalToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal virtual override {
        latestResponse = response;
        latestError = err;
        // string memory decodedResponse = string(response);
        (uint256 totalSupply, uint256 tokenId) = abi.decode(
            response,
            (uint256, uint256)
        );
        _fractionalize(totalSupply * 10 ** 18, tokenId);
        emit OCRResponse(requestId, response, err);
    }

    function depositNFT(
        uint256 tokenId,
        string calldata source,
        bytes calldata secrets,
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyOwner returns (bytes32 requestId) {
        require(
            !(nftContract.getTotalSupplied(tokenId) > 0),
            "Fractional tokens already minted"
        );
        depositor[tokenId] = nftContract.ownerOf(tokenId);
        // Get the latest price of gold from the Chainlink Price Feed
        // (, int256 price, , , ) = priceFeed.latestRoundData();

        // Transfer the NFT to the vault
        nftContract.transferFrom(
            nftContract.ownerOf(tokenId),
            address(this),
            tokenId
        );
        requestId = executeRequest(
            source,
            secrets,
            args,
            subscriptionId,
            gasLimit
        );
        return requestId;
    }

    function withdrawNFT(uint256 tokenId) public onlyOwner {
        delete (depositor[tokenId]);
        // nftContract.updateIsFractionalized(tokenId, false);
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        fractionalToken.burn(msg.sender, nftContract.getTotalSupplied(tokenId));
        nftContract.updateTotalSupplied(tokenId, 0);
    }

    function _fractionalize(uint256 totalSupply, uint256 tokenId) private {
        require(nftContract.exists(tokenId), "Token ID does not exist");

        // nftContract.updateIsFractionalized(tokenId, true);
        nftContract.updateTotalSupplied(tokenId, totalSupply);
        fractionalToken.mint(depositor[tokenId], totalSupply);
    }

    // Chainlink Keeper function
    // function checkUpkeep(
    //     bytes calldata checkData
    // )
    //     external
    //     view
    //     override
    //     returns (bool upkeepNeeded, bytes memory performData)
    // {
    //     uint256[] memory tokensToFractionalize = new uint256[](
    //         nftContract.getTokenIdsCount()
    //     );
    //     uint256 count = 0;
    //     for (uint256 i = 0; i < nftContract.getTokenIdsCount(); i++) {
    //         uint256 tokenId = nftContract.getTokenIdByIndex(i);
    //         bool isFractionalized = nftContract.getIsFractionalized(tokenId);
    //         if (!isFractionalized) {
    //             tokensToFractionalize[count] = tokenId;
    //             count++;
    //         }
    //     }
    //     if (count > 0) {
    //         upkeepNeeded = true;
    //         performData = abi.encode(tokensToFractionalize, count);
    //     } else {
    //         upkeepNeeded = false;
    //         performData = "0x";
    //     }
    // }

    // Chainlink Keeper function
    // function performUpkeep(bytes calldata performData) external override {
    //     (uint256[] memory tokensToFractionalize, uint256 count) = abi.decode(
    //         performData,
    //         (uint256[], uint256)
    //     );
    //     for (uint256 i = 0; i < count; i++) {
    //         uint256 tokenId = tokensToFractionalize[i];
    //         _fractionalize(tokenId);
    //     }
    // }
}
