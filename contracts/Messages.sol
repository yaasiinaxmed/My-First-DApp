// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Message {
    mapping(address => string) public messages;

    // Create messages
    function createMessage(string memory _message) public {
        messages[msg.sender] = _message;
    }

    // Get messages by address
    function getMessages(address _owner) public view returns (string memory) {
        return messages[_owner];
    }

}