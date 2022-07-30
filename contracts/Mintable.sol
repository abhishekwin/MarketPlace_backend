// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./utils/Iblacklist.sol";

contract Mintable is ERC721URIStorage, ERC721Royalty, AccessControl, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private _totalSupply;
    uint96 public royality;
    uint256 public maxSupply;
    string baseURIPrefix;

    IblackList blacklist;


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor( string memory _name, string memory
     symbol_, uint256 
     _maxSupply,
      string memory _baseURIPrefix,
      uint96 _royality,
      address _minter,
     IblackList _blacklist

       ) ERC721(_name, symbol_) {
        _setupRole(MINTER_ROLE, _minter);
        maxSupply = _maxSupply;
        baseURIPrefix=_baseURIPrefix;
        royality = _royality;
        _tokenIds.increment();
        blacklist=_blacklist;
    }

    function setMinter(address minter) public onlyOwner {
        _setupRole(MINTER_ROLE, minter);
    }

    function mint(address to, string memory _tokenURI, uint96 _royality) public returns (uint256) {
        require(blacklist._isPermitted(msg.sender),"user is blacklisted");
        uint256 newItemId = _tokenIds.current();
        _totalSupply += 1;
        require( _royality <= royality, "ERC721Token: Royality should be less");
        require(_totalSupply <=maxSupply , "Max supply should be less");
        require(hasRole(MINTER_ROLE,msg.sender), "Caller is not a minter");
        _tokenIds.increment();

        _mint(to, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        _setTokenRoyalty(newItemId, to, _royality);
        

        return newItemId;
    }

    function totalSupply()view public returns(uint256){
        return _totalSupply;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl,ERC721Royalty)
        returns (bool)
    {
        return
            ERC721.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) override internal {
      _tokenURIs[tokenId] = string(abi.encodePacked(baseURIPrefix,'',_tokenURI));
    }
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721,ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721Royalty,ERC721URIStorage)
    {
        return super._burn(tokenId);
    }
}

