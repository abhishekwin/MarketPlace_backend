// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/mocks/interfaces/IERC721Mint.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract Auction is Initializable, OwnableUpgradeable{
    // mapping for nonce
    mapping(uint256 => bool) public isNonceProcessed;

    uint256 public platFormFeePercent;
    uint256 constant public decimalPrecision = 100;

    struct SellerDetails {
        address seller;
        address assetAddress;
        // address collectionAddress;
        uint256 tokenId;
        uint256 amount;
        address paymentAssetAddress;
        string  URI;
        bytes seller_signature;
        uint256 royality;
        uint256 nonce;
        uint256 startTime;
        uint256 endTime;
        uint256 timeDuration;
    }

    struct BidderDetails {
        address bidderAddress;
        address assetAddress;
        uint256 tokenId;
        uint256 amount;
        address paymentAssetAddress;
        string URI;
        bytes bidderSignature;
        uint256 bidTime;
    }
    
    function initialize(uint256 _platFormFeePercent) public initializer {
        __Ownable_init();
        platFormFeePercent = _platFormFeePercent;
    }
    
    function setPlatFormFeePercent(uint256 _newPlatFormFeePercent) public {
        platFormFeePercent = _newPlatFormFeePercent;
    }
    
    function lazyAuction(
   
       SellerDetails calldata sellerDetails, BidderDetails calldata bidderDetails)
        external {

            require(
            !isNonceProcessed[sellerDetails.nonce],
            "Auction: nonce already process"
        );
        
        address sellerSigner = verifySellerSign(
            sellerDetails.seller,
            sellerDetails.assetAddress,
            sellerDetails.tokenId,
            sellerDetails.amount,
            sellerDetails.paymentAssetAddress,
            sellerDetails.URI,
            sellerDetails.seller_signature
        );
        require(sellerDetails.seller == sellerSigner);
           
           require(
            !isNonceProcessed[sellerDetails.nonce],
            "Auction: nonce already process"
        );
        
        address bidderSigner = verifyBidderSign(
            bidderDetails.bidderAddress,
            bidderDetails.assetAddress,
            bidderDetails.tokenId,
            bidderDetails.amount,
            bidderDetails.paymentAssetAddress,
            bidderDetails.URI,
            bidderDetails.bidderSignature
        );
      
        require(
            sellerDetails.seller == sellerSigner,
            "seller sign verification failed"
        );

        // Mint
        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);
        if (
            sellerDetails.tokenId > 0
        ) {
            require(
                instance.isApprovedForAll(
                    sellerDetails.seller,
                    address(this)
                )||
                    instance.getApproved(sellerDetails.tokenId) ==
                    address(this),
                "Auction: address not approve"
            );
            instance.transferFrom(
                sellerDetails.seller,
                bidderDetails.bidderAddress,
                sellerDetails.tokenId
            );
        } 
        
        else {

             instance.mint(
                bidderDetails.bidderAddress,
                // sellerDetails.seller,
                sellerDetails.URI,
                sellerDetails.royality
            );
        }


      // Fund Tranfer 
        IERC20 instanceERC20 = IERC20(
            sellerDetails.paymentAssetAddress
        );

        require(
            instanceERC20.balanceOf(bidderDetails.bidderAddress)>= 
            bidderDetails.amount,
            "Auction: Insuficent fund"
        );
       
        require(
            instanceERC20.allowance(msg.sender, address(this)) >=
                sellerDetails.amount,
            "Auction: Check the token allowance."
        );


        // platformfee/ServiceFee
         uint256 platFormFee = ((sellerDetails.amount * platFormFeePercent) /
            100) * decimalPrecision;

        instanceERC20.transferFrom(bidderDetails.bidderAddress, address(this), platFormFee);
        uint256 remaining_amount = sellerDetails.amount - platFormFee;
        instanceERC20.transferFrom(
            bidderDetails.bidderAddress,
            sellerDetails.seller,
            remaining_amount
        );
    }

    function getSigner(bytes32 hash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return
            ecrecover(
                keccak256(
                    abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
                ),
                v,
                r,
                s
            );
    }
    
    function verifySellerSign(
        address assetAddress, 
        address seller, 
        uint256 tokenId, 
        uint amount, 
        address paymentAssetAddress, 
        string memory URI,
        bytes memory _signature
        ) public pure returns (address){
        bytes32 hash = keccak256(abi.encodePacked(assetAddress,tokenId,URI, paymentAssetAddress,amount));
        return  getSigner(hash, _signature);
    }


    function verifyBidderSign(
        address assetAddress, 
        address bidder, 
        uint256 tokenId, 
        uint amount, 
        address paymentAssetAddress, 
        string memory URI,
        bytes memory _signature
        ) public pure returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(assetAddress,tokenId, URI, paymentAssetAddress,amount));
        return getSigner(hash, _signature);
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

     // Fallback function must be declared as external.
    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
    }
    receive() external payable {
    }
}












