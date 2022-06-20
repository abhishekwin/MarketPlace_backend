// 1 contract MarketPlaceAuctions
// 2 variables = Nonce, sellerDetails, buyerDetails, processNonce, privateVariable(WETH)
// 3 functions = LazyAuction, Cancel Auction
// 4 internal function = verifySeller, verifyBuyer, verifySystem

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract MarketplaceAuction {
   
   struct SellerDetails {
      
      address assetAddress;
      address collectionAddress; 
      address seller;
      string URI;
      uint256 Nonce;  
      uint256 highestBid;
      uint256 timeDuration;
      bytes32 seller_Signature;
      uint256 royality;
      uint256 amount;
   }
    
   struct BuyerDetails {
      
      address nftAddress;
      uint256 amount;
      uint256 startingTime;
      uint256 endTime;
      uint256 startingAmount;
      uint256 reserveAmount;
      uint256 decliningAmount;
      
   }
  
   function LazyAuction(
       address nftAddress,
       uint256 tokenID, 
       SellerDetails calldata _sellerDetails, BuyerDetails calldata _buyerDetails)
        external   {
   }
   
   function getSigner(
      bytes32 hash, 
      bytes memory 
      _signature
      )

      internal pure returns(address){
      (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
      return ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)), v, s, r);

   }
  
  
   function verifySignatureSign(
      address seller, 
      uint256 tokenID, 
      uint256 amount, 
      address paymentAssetAddress, 
      address assetAddress
      )
      internal pure {
         bytes32 hash = keccak256(abi.encodePacked(assetAddress,tokenID, paymentAssetAddress, amount));
         require(seller == getSigner(hash, "sign"), "seller sign verificaction failed");
   }  

   function splitSignature(bytes memory sig)
        public
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
}