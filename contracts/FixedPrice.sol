// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/interfaces/IERC721.sol";
pragma solidity ^0.8.12;

contract FixedSaleMarketPlace {
    struct SaleNftDetails {
        uint256 price; // The Price to buy NFTs.
        address payable fundsRecipient; // The address that should receive funds once the NFT is sold.
        address owner; // The address will be owner of NFT
    }
    mapping(address => mapping(uint256 => SaleNftDetails)) public NftonSale;

    // ============ Events ============
    event OnSale(
        uint256 indexed tokenId,
        address indexed nftContractAddress,
        address indexed owner,
        uint256 price
    );

    event OffSale(
        uint256 indexed tokenId,
        address indexed nftContractAddress,
        address indexed owner
    );

    event Sold(
        uint256 indexed tokenId,
        address indexed nftContractAddress,
        address indexed owner,
        address buyer,
        uint256 price
    );

    function putOnSale(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public {
        IERC721 instance = IERC721(nftContract);
        require(
            instance.isApprovedForAll(
                instance.ownerOf(tokenId),
                address(this)
            ) || instance.getApproved(tokenId) == address(this),
            "address not approve for putOnsale the NFT"
        );
    }
}
