// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/IERC721A.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "./utils/Iblacklist.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";


contract BulkMintNFT is ERC721A, ERC2981,AccessControl, Ownable {
    uint256 public maxSupply;
    string baseURI;
    string baseURISuffix;
    uint96 royality;
    IblackList blacklist;
    uint256 mintFee = 400;


  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    //    constructor() ERC721A("BulkMintNFT", "BMN", _maxSupply ) {}
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _baseURIs,
        string memory _baseURISuffixs,
        uint96 _royality,
        address _creator,
        IblackList _blacklistAddress
    ) ERC721A(_name, _symbol) {
        maxSupply = _maxSupply;
        baseURI = _baseURIs;
        baseURISuffix = _baseURISuffixs;
        royality = _royality;
        _setupRole(MINTER_ROLE, _creator);
        blacklist = _blacklistAddress;
        _setDefaultRoyalty(_creator, _royality);
        transferOwnership(_creator);
    }

    function setMinter(address minter) public onlyOwner {
        _setupRole(MINTER_ROLE, minter);
    }
    function mint(uint256 quantity) external payable {
        require(blacklist._isPermitted(msg.sender),"user is blacklisted");
        require(
            totalSupply() + quantity <= maxSupply,
            "Max supply should be less"
        );
        require(hasRole(MINTER_ROLE,msg.sender), "Caller is not a minter");
        require(msg.value == mintFee*quantity, "you don't have enough amonnt to mint");
        _mint(msg.sender, quantity);
        
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _baseURISuffix()
        internal
        view
        virtual
        returns (string memory)
    {
        return baseURISuffix;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A,AccessControl, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }
}
