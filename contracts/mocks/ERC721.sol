// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

            
    mapping(uint256 => uint256) public royality; //tokenId=>royality
    uint256 public maximumRoyality;    //Set the maximum Royality.

    constructor(uint256 _maxRoyality) ERC721("Iam", "Win") {
        _tokenIds.increment();
        maximumRoyality = _maxRoyality;
    }
    //    /**
    //  * @dev 
    //  * @notice 
    //  * @param to: 
    //  * @param tokenURI: 
    //  * @param royality: 
    //  **/
   function mint(
        address to,
        address creator,
        string memory tokenURI,
        uint256 _royality
    ) public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        royality[newItemId] = _royality;
        return newItemId;
    }

       // Fallback function must be declared as external.
    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
       
    }
}
