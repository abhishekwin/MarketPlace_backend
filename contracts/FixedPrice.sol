// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IERC721Mint is IERC721 {
    function mint(
        address creator,
        address to,
        string memory tokenURI,
        uint256 _royality
    ) external returns (uint256);
}

interface IERC20Token is IERC20 {
    function balanceOf(address msg_sender) external view returns (uint256);
}

contract FlatSale {
    struct SellerDetails {
        address seller;
        address collectionAddress;
        address assetAddress;
        address paymentAssetAddress;
        uint256 tokenId;
        uint256 royality;
        uint256 amount;
        bytes seller_signature;
        string URI;
        uint256 nonce;
    }
    uint256 nonce;
    uint256 platformfeepercent = 2500;

    function lazyBuy(SellerDetails calldata sellerDetails) public {
        verifySellerSign(
            sellerDetails.seller,
            sellerDetails.tokenId,
            sellerDetails.amount,
            sellerDetails.paymentAssetAddress,
            sellerDetails.assetAddress,
            sellerDetails.seller_signature
        );
        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);
        if (
            instance.ownerOf(sellerDetails.tokenId) == sellerDetails.seller ||
            sellerDetails.tokenId > 0
        ) {
            require(
                instance.isApprovedForAll(
                    sellerDetails.seller,
                    address(this)
                ) &&
                    instance.getApproved(sellerDetails.tokenId) ==
                    address(this),
                "address not approve"
            );
            instance.transferFrom(
                sellerDetails.seller,
                msg.sender,
                sellerDetails.tokenId
            );
        } else {
            instance.mint(
                msg.sender,
                sellerDetails.seller,
                sellerDetails.URI,
                sellerDetails.royality
            );
        }
        // Write Fund Tranfer Code
        IERC20Token instanceERC20 = IERC20Token(
            sellerDetails.paymentAssetAddress
        );
        require(
            sellerDetails.amount <= instanceERC20.balanceOf(msg.sender),
            "Insufficient Amount"
        );
        require(
            instanceERC20.allowance(msg.sender, address(this)) >=
                sellerDetails.amount,
            "Check the token allowance."
        );
        // transfer seller amount - platformfee
        uint256 feeonplatform = (sellerDetails.amount * platformfeepercent) /
            10000;
        instanceERC20.transferFrom(msg.sender, address(this), feeonplatform);
        uint256 remaining_amount = sellerDetails.amount - feeonplatform;
        instanceERC20.transferFrom(
            msg.sender,
            sellerDetails.seller,
            remaining_amount
        );
    }

    function getSigner(bytes32 hash, bytes memory _signature)
        internal
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
