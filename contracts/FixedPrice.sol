// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract FlatSale {
    struct SellerDetails {
        address seller;
        address collectionAddress;
        address assetAddress;
        uint256 tokenId;
        uint256 royality;
        uint256 amount;
        bytes32 seller_signature;
        string URI;
        uint256 nonce;
    }
    uint256 nonce;

    function lazyBuy(SellerDetails calldata sellerDetails) {
        verifySellerSign(
            sellerDetails.seller,
            sellerDetails.tokenId,
            sellerDetails.amount,
            sellerDetails.paymentAssetAddress,
            sellerDetails.assetAddress,
            sellerDetails.seller_signature
        );
        IERC721 instance = IERC721(nftContract);
        if (instance.ownerOf(tokenId) == sellerDetails.seller || tokenId > 0) {
            require(
                instance.isApprovedForAll(
                    sellerDetails.seller,
                    address(this) &&
                        instance.getApproved(tokenId) == address(this),
                    "address not approve"
                )
            );
            instance.transferFrom(sellerDetails.seller, msg.sender, tokenID);
        } else {}
    }

    function getSigner(bytes32 hash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        (bytes32 v, bytes32 s, uint8 v) = splitSignature(_signature);
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
        address seller,
        uint256 tokenId,
        uint256 amount,
        address paymentAssetAddress,
        address assetAddress,
        bytes memory _signature
    ) internal pure {
        bytes32 hash = keccak256(
            abi.encodePacked(assetAddress, tokenId, paymentAssetAddress, amount)
        );

        require(
            seller == getSigner(hash, _signature),
            "seller sign verification failed"
        );
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
}
