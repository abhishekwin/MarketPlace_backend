// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/mocks/interfaces/blackListInterface.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract Blacklist is BlacklistInterface, Ownable {
    mapping(address => bool) blacklisted;

    function blacklist(address node) public  override onlyOwner {
        blacklisted[node] = true;
       emit Blacklisted(node);
    }

    function unblacklist(address node) public override onlyOwner {
        blacklisted[node] = false;
        emit Unblacklisted(node);
    }

    function isPermitted(address node) public view  override returns (bool) {
        return !blacklisted[node];
    }
}