// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";



contract MyNFT is ERC721URIStorageUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;
     
    mapping(uint256 => uint256) public royality; //tokenId=>royality
    mapping(uint256=> address) public creator; //tokenId=>address creator
    uint256 public maximumRoyality;    //Set the maximum Royality.

    function initialize(uint256 _maxRoyality)  initializer  public{
        __ERC721_init("Abhi" ,"Shake");
      
        _tokenIds.increment();
        maximumRoyality = _maxRoyality;
    }
    //    /**
    //  * @dev Abhishek Kothiya
    //  * @notice This Function is used to Mint NFT.
    //  * @param to: Address who get NFT.
    //  * @param tokenURI: NFT String URI.
    //  * @param royality: Percentage of creator.
    //  **/
   
    function mint(
        address to,
        address _creator,
        string memory tokenURI,
        uint256 _royality
    )   public returns (uint256) {
        
        require( _royality<=maximumRoyality,"Royality should be less" );
        require(address(to)!=address(0),"Token contract: to address can't be 0x0");
        uint256 newItemId = _tokenIds.current();
        
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setCreator(_creator,newItemId);
        _tokenIds.increment();
        royality[newItemId] = _royality;

        return newItemId;
    }

    function setCreator(address _creator,uint256 tokenId)  internal {
        creator[tokenId] =_creator;
    }
}
