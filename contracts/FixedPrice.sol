// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "contracts/interface/IERC721Mint.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract FlatSale is Initializable, OwnableUpgradeable {
    ///creating seller details struct
    struct SellerDetails {
        uint256 nonce;
        address sellerAddress;
        address assetAddress;
        address paymentAssetAddress;
        uint256 tokenId;
        uint256 royality;
        uint256 amount;
        bytes sellerSignature;
        string tokenUri;
    }
    ///mapping for nonce
    mapping(uint256 => bool) public isNonceProcessed;
    uint256 platFormFeePercent = 2500;

    /**
     * @dev Method to update/reset platFormFeePercent
     * Name of _platFormFeePercent to update the PlatformFee
     */
    function initialize(uint256 _platFormFeePercent) public initializer {
        __Ownable_init();
        platFormFeePercent = _platFormFeePercent;
    }

    uint256 public constant decimalPrecision = 100;

    // function setPlatFormFee(uint256 newPlatFormFeePercent) public {
    //     platFormFeePercent = newPlatFormFeePercent;
    // }
    /**
     *@dev Method to  nft's
     */
    function lazyBuy(SellerDetails calldata sellerDetails) public {
        require(
            !isNonceProcessed[sellerDetails.nonce],
            "FlatSale: nonce already process"
        );

        address signer = verifySellerSign(
            sellerDetails.tokenId,
            sellerDetails.tokenUri,
            sellerDetails.amount,
            sellerDetails.paymentAssetAddress,
            sellerDetails.assetAddress,
            sellerDetails.sellerSignature
        );
        require(
            sellerDetails.sellerAddress == signer,
            "FlatSale: seller sign verification failed"
        );

        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);
        if (sellerDetails.tokenId > 0) {
            require(
                instance.isApprovedForAll(
                    sellerDetails.sellerAddress,
                    address(this)
                )
            );
            instance.transferFrom(
                sellerDetails.sellerAddress,
                msg.sender,
                sellerDetails.tokenId
            );
        } else {
            uint256 tokenId = instance.mint(
                sellerDetails.sellerAddress,
                sellerDetails.tokenUri,
                sellerDetails.royality
            );
            instance.transferFrom(
                sellerDetails.sellerAddress,
                msg.sender,
                tokenId
            );
        }
        /// Write Fund Tranfer Code
        IERC20 instanceERC20 = IERC20(sellerDetails.paymentAssetAddress);
        require(
            sellerDetails.amount <= instanceERC20.balanceOf(msg.sender),
            "FlatSale: Insufficient Amount"
        );
        require(
            instanceERC20.allowance(msg.sender, address(this)) >=
                sellerDetails.amount,
            "FlatSale: Check the token allowance."
        );
        /// transfer seller amount - platformfee
        uint256 feeOnPlatform = ((sellerDetails.amount * platFormFeePercent) /
            100) * decimalPrecision;

        instanceERC20.transferFrom(msg.sender, address(this), feeOnPlatform);
        uint256 remaining_amount = sellerDetails.amount - feeOnPlatform;
        instanceERC20.transferFrom(
            msg.sender,
            sellerDetails.sellerAddress,
            remaining_amount
        );
        isNonceProcessed[sellerDetails.nonce] = true;
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
        uint256 tokenId,
        string memory tokenUri,
        uint256 amount,
        address paymentAssetAddress,
        address assetAddress,
        bytes memory _signature
    ) public pure returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                assetAddress,
                tokenId,
                tokenUri,
                paymentAssetAddress,
                amount
            )
        );

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

    /// Fallback function must be declared as external.
    fallback() external payable {
        /// send / transfer (forwards 2300 gas to this fallback function)
        /// call (forwards all of the gas)
    }

    receive() external payable {
        /// custom function code
    }
}
