// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICollectionStaker {

    function isStaker(address stakerAddress) external returns(bool assertIsStaker);

    function insertStaker(uint256 tokenId, uint256 amount) external returns(uint256 index);

    function getStaker(address stakerAddress) external returns( uint256 tokenId, uint256 amount, uint256 timestamp, uint256 index, uint256 secondsStaked);

    function getStakerCount() external returns(uint256 count);

    function getStakerAtIndex(uint256 index) external returns(address stakerAddress);

    function getStakers() external returns(address[] memory);

    function unstakeStaker(uint256 amount) external returns(uint256 index);

    function stakingTime(address) external returns(uint256);

}
