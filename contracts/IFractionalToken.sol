// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IFractionalToken {
    function totalSupply() external view returns (uint256);

    function setClaimAmount(
        address _claimAddress,
        uint256 _claimAmount
    ) external;

    function claim(address to) external view returns (bool);

    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}
