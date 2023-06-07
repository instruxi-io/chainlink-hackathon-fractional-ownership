// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IFractionalNFT.sol";
import "./IFractionalToken.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract NFTVault is
    AutomationCompatibleInterface,
    FunctionsClient,
    ConfirmedOwner
{
    IFractionalNFT public nftContract;
    IFractionalToken public fractionalToken;
    AggregatorV3Interface public priceFeed;

    mapping(uint256 => address) public depositor;
    using Functions for Functions.Request;

    bytes32 public latestRequestId;
    bytes public latestResponse;
    bytes public latestError;

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    constructor(
        address _nftContract,
        address _fractionalToken,
        address _priceFeed,
        address _oracle
    ) FunctionsClient(_oracle) ConfirmedOwner(msg.sender) {
        nftContract = IFractionalNFT(_nftContract);
        fractionalToken = IFractionalToken(_fractionalToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getDepositor(
        uint256 tokenId
    ) external view returns (address depositorAddress) {
        depositorAddress = depositor[tokenId];
    }

    function depositNFT(uint256 nftTokenId) public onlyOwner {
        require(
            !nftContract.getIsFractionalized(nftTokenId),
            "Fractional tokens already minted"
        );
        depositor[nftTokenId] = nftContract.ownerOf(nftTokenId);
        // Get the latest price of gold from the Chainlink Price Feed
        // (, int256 price, , , ) = priceFeed.latestRoundData();

        // Transfer the NFT to the vault
        nftContract.transferFrom(
            nftContract.ownerOf(nftTokenId),
            address(this),
            nftTokenId
        );
    }

    function withdrawNFT(uint256 nftTokenId) public onlyOwner {
        require(
            nftContract.getFractionalSupply(nftTokenId) == 0,
            "Fractional tokens must be burned first"
        );
        nftContract.transferFrom(address(this), msg.sender, nftTokenId);
    }

    function _fractionalize(uint256 tokenId) private {
        require(nftContract.exists(tokenId), "Token ID does not exist");
        require(
            !nftContract.getIsFractionalized(tokenId),
            "Token ID is already fractionalized"
        );
        uint256 totalSupply = nftContract.getFractionalSupply(tokenId);
        nftContract.updateIsFractionalized(tokenId, true);
        fractionalToken.mint(depositor[tokenId], totalSupply);
    }

    function executeRequest(
        string calldata source,
        bytes calldata secrets,
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyOwner returns (bytes32) {
        Functions.Request memory req;
        req.initializeRequest(
            Functions.Location.Inline,
            Functions.CodeLanguage.JavaScript,
            source
        );
        if (secrets.length > 0) {
            req.addRemoteSecrets(secrets);
        }
        if (args.length > 0) req.addArgs(args);

        bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
        latestRequestId = assignedReqID;
        return assignedReqID;
    }

    function updateOracleAddress(address oracle) public onlyOwner {
        setOracle(oracle);
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        latestResponse = response;
        latestError = err;
        emit OCRResponse(requestId, response, err);
    }

    // Chainlink Keeper function
    function checkUpkeep(
        bytes calldata checkData
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256[] memory tokensToFractionalize = new uint256[](
            nftContract.getTokenIdsCount()
        );
        uint256 count = 0;
        for (uint256 i = 0; i < nftContract.getTokenIdsCount(); i++) {
            uint256 tokenId = nftContract.getTokenIdByIndex(i);
            bool isFractionalized = nftContract.getIsFractionalized(tokenId);
            if (!isFractionalized) {
                tokensToFractionalize[count] = tokenId;
                count++;
            }
        }
        if (count > 0) {
            upkeepNeeded = true;
            performData = abi.encode(tokensToFractionalize, count);
        } else {
            upkeepNeeded = false;
            performData = "0x";
        }
    }

    // Chainlink Keeper function
    function performUpkeep(bytes calldata performData) external override {
        (uint256[] memory tokensToFractionalize, uint256 count) = abi.decode(
            performData,
            (uint256[], uint256)
        );
        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = tokensToFractionalize[i];
            _fractionalize(tokenId);
        }
    }
}
