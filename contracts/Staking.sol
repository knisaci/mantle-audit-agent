// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Staking {
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public stakedAt;
    uint256 public rewardRate = 10; // 10% APY

    function stake() external payable {
        require(msg.value > 0, "Must stake something");
        stakedAmount[msg.sender] += msg.value;
        stakedAt[msg.sender] = block.timestamp;
    }

    function getReward(address user) public view returns (uint256) {
        uint256 duration = block.timestamp - stakedAt[user];
        return (stakedAmount[user] * rewardRate * duration) / (365 days * 100);
    }

    function unstake() external {
        uint256 amount = stakedAmount[msg.sender];
        uint256 reward = getReward(msg.sender);
        require(amount > 0, "Nothing staked");
        
        stakedAmount[msg.sender] = 0;
        stakedAt[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount + reward}("");
        require(success, "Transfer failed");
    }
}
