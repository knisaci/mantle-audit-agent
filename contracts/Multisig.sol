// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Multisig {
    address[] public owners;
    uint256 public required;
    
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }
    
    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmed;
    
    constructor(address[] memory _owners, uint256 _required) {
        owners = _owners;
        required = _required;
    }
    
    function submit(address to, uint256 value, bytes calldata data) external {
        transactions.push(Transaction(to, value, data, false, 0));
    }
    
    function confirm(uint256 txId) external {
        confirmed[txId][msg.sender] = true;
        transactions[txId].confirmations++;
    }
    
    function execute(uint256 txId) external {
        Transaction storage txn = transactions[txId];
        require(txn.confirmations >= required, "Not enough confirmations");
        require(!txn.executed, "Already executed");
        txn.executed = true;
        (bool success,) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Failed");
    }
    
    receive() external payable {}
}
