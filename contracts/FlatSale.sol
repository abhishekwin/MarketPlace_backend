// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "contracts/interface/IERC721Mint.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract FlatSale is Initializable, OwnableUpgradeable {
    //Creating Seller Details Struct.
    struct SellerDetails {
        uint256 nonce; //set the nonce.
        address sellerAddress; //set the seller address.
        address assetAddress; //set the nft address.
        address paymentAssetAddress; //set the token address.
        uint256 tokenId; //set the token id.
        uint96 royality; //set the royality.
        uint256 amount; //set the amount.
        bytes sellerSignature; //set the seller signature.
        string tokenUri; //set the token URI.
    }

    //Events
    event flatSale(
        uint256 nonce,
        address seller,
        uint256 tokenId,
        address assetAddress,
        uint256 amount
    );

    mapping(uint256 => bool) public isNonceProcessed; //mapping for nonce.

    uint256 platFormFeePercent; /// State variable for PlatFormFeePercent.

    uint256 public constant decimalPrecision = 100;

    /**
     * @dev Method to set platFormFeePercent.
     * @notice This method initializes the PlatFormFee.
     */
    function initialize() public initializer {
        __Ownable_init();
        platFormFeePercent = 250;
    }
    
    /**
     *@dev Method to update/reset platFormFeePercent.
     * @notice This method is used to update Plateform Fee.
     *@param _newPlatFormFeePercent: the new platform fee will be given.
     */
    function setPlatFormFeePercent(uint256 _newPlatFormFeePercent) public {
        platFormFeePercent = _newPlatFormFeePercent;
    }

    /**
     *@dev Method to Buy NFT and Mint NFT.
     *@notice This method is used to Buy NFT.
     *@param sellerDetails: the seller details provide all the necessary detail for the seller.
     */
    function lazyBuy(SellerDetails calldata sellerDetails) external {
        require(
            !isNonceProcessed[sellerDetails.nonce],
            "FlatSale: nonce already process"
        );
        // validate seller
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

        // creating instance
        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);

        // cheking nft is minted or not.
        if (sellerDetails.tokenId > 0) {
            require(
                instance.isApprovedForAll(
                    sellerDetails.sellerAddress,
                    address(this)
                ),
                "FlatSale: Collection must be approved."
            );
            /// transfer the nft.
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

            require(
                instance.isApprovedForAll(
                    sellerDetails.sellerAddress,
                    address(this)
                ),
                "FlatSale: Collection must be approved."
            );

            instance.transferFrom(
                sellerDetails.sellerAddress,
                msg.sender,
                tokenId
            );
        }
        // Write Fund Tranfer Code
        // creating IERC20 instance
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

        // transfer seller amount - platformfee
        uint256 feeOnPlatform = (sellerDetails.amount * platFormFeePercent) /
            (100 * decimalPrecision);

        instanceERC20.transferFrom(msg.sender, address(this), feeOnPlatform);

        uint256 remaining_amount = sellerDetails.amount - feeOnPlatform;

        instanceERC20.transferFrom(
            msg.sender,
            sellerDetails.sellerAddress,
            remaining_amount
        );

        emit flatSale(
            sellerDetails.nonce,
            sellerDetails.sellerAddress,
            sellerDetails.tokenId,
            sellerDetails.assetAddress,
            sellerDetails.amount
        );
        
        /// nonce is ture
        isNonceProcessed[sellerDetails.nonce] = true;
    }

    /**
    *@dev Method to genrate signer.
    * @notice This method is used to provide signer.
    *@param hash: Name of hash is used to generate the signer.
    *@param _signature: Name of _signature is used to generate the signer.
    @return Signer address.
    */
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

    /**
    *@dev Method is used to provide signer.
    *@param tokenId: signer NFT tokenid.
    *@param tokenUri: signer tokenUri.
    *@param amount: signer amount of nft.
    *@param paymentAssetAddress: signer erc20 token address.
    *@param assetAddress: signer nft address.
    *@param _signature: seller signature. 
    @return Signer.
    */
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

    /**
     *@dev Method to split the seller signature.
     *@param sig: Name of _signature is used to generate the signer.
     */
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "FlatSale: invalid signature length.");

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
