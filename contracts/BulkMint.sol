// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/IERC721A.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract BulkMintNFT is ERC721A {
    uint256 public maxSupply;
    string baseURI;
    string baseURISuffix;
    uint96 royality;

    //    constructor() ERC721A("BulkMintNFT", "BMN", _maxSupply ) {}
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _baseURIs,
        string memory _baseURISuffixs,
        uint96 _royality
    ) ERC721A(_name, _symbol) {
        maxSupply = _maxSupply;
        baseURI = _baseURIs;
        baseURISuffix = _baseURISuffixs;
        royality = _royality;
    }

    function mint(uint256 quantity, uint96 _royality) external payable {
        require(
            totalSupply() + quantity <= maxSupply,
            "Max supply should be less"
        );

        require(_royality <= royality, "Royality should be less");
        // `_mint's second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _baseURISuffix()
        internal
        view
        virtual
        override
        returns (string memory)
    {
        return baseURISuffix;
    }
}
