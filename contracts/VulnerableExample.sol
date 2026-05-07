// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableExample {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABILITY: reentrancy attack possible here
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Sends ETH before updating balance — classic reentrancy
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
