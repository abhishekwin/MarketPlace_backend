// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Token is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256=>bool) public mintedNonce;
    mapping(uint256=>uint256) public tokenToNonce;

    uint256 public totalCount;
     //     tokeni=>royality%
    mapping(uint256=>uint256) public royalities;
    mapping(uint256=>address payable) public creators;
      // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

     uint256 public maximumRoyality;
     uint256 public brokerage;
     address public brokerAddress;
     uint256 public tokenCount;
    
    constructor() ERC721("Abhi", "Shake") {
        _tokenIds.increment();
    }
    struct NFTvoucher{
        uint256 vNonce;
        uint256 minPrice;
        string tokenUri;
        bytes signature;
        uint256 royality;
    }

     function setMaximumRoyality(uint256 _maxroyality) public onlyOwner{
        maximumRoyality = _maxroyality;
         
     } 

     function Lazymint(address payable creator, NFTvoucher calldata voucher) public payable returns(uint256){
          require(
            mintedNonce[voucher.vNonce] == false,
            "This nonce already done"
        );

         bytes32 messageHash=getMessageHash(
             voucher.vNonce,
             voucher.minPrice,
             voucher.tokenUri,
             voucher.royality
         );

         bytes32 ethSignedMessageHash = ethSignedMessageHash(messageHash);
         address signer = recoverSigner(ethSignedMessageHash, voucher.signature);
         tokenCount = tokenCount + 1;
         creators[tokenCount] = creator;

         require(creator==signer,"Signature Unvalid"); //Make sure signer is access to mint NFT

         require(msg.value >= voucher.minPrice,"Insufficient Funds");  //Mke sure reedem is paying enough money

            require(
            voucher.royality <= maximumRoyality,"Royality is too high");
        
        

        _safeMint(signer,tokenCount);
        royalities[tokenCount] = voucher.royality;
        _setTokenURI(tokenCount,voucher.tokenUri);

        _transfer(signer,msg.sender,tokenCount);
        uint amount = msg.value;

        uint256 brokerAmount=((amount * brokerage)/100)/100;
        payable(brokerAddress).transfer(brokerAmount);

        amount = amount - brokerAmount;
        payable(creator).transfer(amount);
        mintedNonce[voucher.vNonce] =true;
             tokenToNonce[tokenCount] = voucher.vNonce;
        
        return tokenCount;
     }
        function getMessageHash(uint256 _nonce,uint256 minPrice,string memory tokenUri,uint256 royality) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_nonce, minPrice, tokenUri,royality));
    }

    function ethSignedMessageHash(bytes32 _messageHash) public pure returns(bytes32){
        keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",_messageHash));

    }
      function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
                  r := mload(add(sig, 32))
      
                  s := mload(add(sig, 64))
            
                  v := byte(0, mload(add(sig, 96)))
        }

      
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual override
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }
}



     
   

   


