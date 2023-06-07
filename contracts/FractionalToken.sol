// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FractionalToken is ERC20, Ownable {
    address private vault;
    // Mapping to keep track of the amount each user has already claimed
    mapping(address => uint256) public claimableAmounts;

    // Variable to determine the maximum amount each user can claim
    uint256 public maxClaimAmount;
    modifier onlyVault() {
        require(
            vault == msg.sender,
            "Only the vault can call the token contract"
        );
        _;
    }

    constructor() ERC20("Orebits", "ORBS") {}

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function mint(address account, uint256 amount) external onlyVault {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyVault {
        _burn(account, amount);
    }
}
