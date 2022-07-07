
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract ERC721Token is
    ERC721Upgradeable,
    OwnableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721PausableUpgradeable,
    ERC721RoyaltyUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    uint96 public maximumRoyality; //Set the maximum Royality.

    function initialize(uint96 _maxRoyality) public initializer {
        __ERC721_init("MarketPlace", "MKP");
        __Ownable_init();
        _tokenIds.increment();

        maximumRoyality = _maxRoyality;
    }

    /**
     * @dev Method to mint nft This Function is used to Mint NFT.
     * @notice  This method is used to Mint NFT.
     * @param to: Address who get NFT.
     * @param tokenURI: NFT String URI.
     * @param _royality: Percentage of creator.
     */

    function mint(
        address to,
        string memory tokenURI,
        uint96 _royality
    ) external returns (uint256) {
        require(_royality <= maximumRoyality, "ERC721Token: Royality should be less");
        require(address(to) != address(0), "ERC721Token: to address can't be 0x0");
        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _setTokenRoyalty(newItemId, to, _royality);
        _tokenIds.increment();

        return newItemId;
    }

    function setMaximumRoyality(uint96 _value) external onlyOwner {
        maximumRoyality = _value;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    )
        internal
        virtual
        override(
            ERC721EnumerableUpgradeable,
            ERC721PausableUpgradeable,
            ERC721Upgradeable
        )
    {}

    function _burn(uint256 tokenId)
        internal
        virtual
        override(
            ERC721RoyaltyUpgradeable,
            ERC721URIStorageUpgradeable,
            ERC721Upgradeable
        )
    {
        return super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            ERC721EnumerableUpgradeable,
            ERC721RoyaltyUpgradeable,
            ERC721Upgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721URIStorageUpgradeable, ERC721Upgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }


}
