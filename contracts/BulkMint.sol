// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/IERC721A.sol";

contract BulkMintNFT is ERC721A {
    uint256 private _totalSupply;

//    constructor() ERC721A("BulkMintNFT", "BMN", _maxSupply ) {}
     constructor(uint256 _maxSupply) ERC721A("BulkMintNFT", "BMN") {
        _totalSupply = _maxSupply;
    }
    function mint(uint256 quantity,uint256 _maxSupply) external payable {
         require(_maxSupply <= _totalSupply, "Max supply should be less");
        // `_mint's second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return
            "ipfs://bafybeiaf7sp2d7j6jzyantmdn6lbkqgyhh3yu7chyiilclhtiulygvhure/";
    }
}


