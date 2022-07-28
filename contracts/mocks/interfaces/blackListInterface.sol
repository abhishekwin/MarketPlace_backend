// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface BlacklistInterface {
    event Blacklisted(address indexed node);
    event Unblacklisted(address indexed node);

    function blacklist(address node) external ;

    function unblacklist(address node) external ;

    function isPermitted(address node) external view returns (bool);
}
