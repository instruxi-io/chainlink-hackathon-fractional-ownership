// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

interface IERC1155StakerUpgradeable is IERC1155Upgradeable {

    function tokenIdToCollectionStaker(uint256) external view returns (address);

    function registeredStakerAddresses(address) external view returns (bool);

    function registerStaker(address) external;

}
