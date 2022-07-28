// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BlackList is Ownable {
    mapping(address => bool) blacklisted;
    event Blacklisted(address _node, bool);

    modifier _isPermitted() {
        require(blacklisted[msg.sender], "User BlackListed");
        _;
    }

    function AddRemoveBlacklist(address node) public {
        if (!blacklisted[node]) {
            blacklisted[node] = true;
            emit Blacklisted(node, true);
        } else {
            blacklisted[node] = false;

            emit Blacklisted(node, false);
        }
    }
}
