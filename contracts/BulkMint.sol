// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BulkMintNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("BulkMintNFT", "BMN") {}

    function mint(address player, string memory tokenURI)
        public onlyOwner
        returns(uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return "ipfs://bafybeifgxh2lo3jpx6xg2bl3wlnifgpahcdvmktl42jz7d7m7x7y6yap3i/";
    }

    fallback() external payable {
        /// send / transfer (forwards 2300 gas to this fallback function)
        /// call (forwards all of the gas)
    }
    // receive() external payable {
    //     /// custom function code
    // }
}

/**
 * @dev Returns an URI for a given token ID
 */
// function tokenURI(uint256 _tokenId) public view returns (string) {
//   return Strings.strConcat(
//       baseTokenURI(),
//       Strings.uint2str(_tokenId)
//   );
// }

//  function _baseURI() override internal view virtual returns (string memory) {
//         return "ipfs://bafybeifgxh2lo3jpx6xg2bl3wlnifgpahcdvmktl42jz7d7m7x7y6yap3i/";
//     }


// Bulk upload PNG files to IPFS.
// Generate JSON files containing metadata for our NFTs.
// Bulk upload JSON files to IPFS.
// Bulk mint NFTs.
// Display minted NFTs on OpenSea.
