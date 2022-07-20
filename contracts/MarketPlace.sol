// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "contracts/mocks/interfaces/IERC721Mint.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract MarketPlace is Initializable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;
    uint256 public platFormFeePercent;  /// State variable for PlatFormFeePercent.
    uint256 public constant decimalPrecision = 100;


    //Creating Seller Details Struct.
    struct SellerDetails {
        uint256 nonce; //set the nonce.
        address seller; //set the seller address.
        address assetAddress; //set the nft address.
        address paymentAssetAddress; //set the token address.
        uint256 tokenId; //set the token id.
        uint96 royality; //set the royality.
        uint256 amount; //set the amount.
        bytes seller_signature; //set the seller signature.
        string tokenUri; //set the token URI.
        uint256 startTime;//set the startTime
        uint256 endTime;//set the endTime.
    }

    //Creating Bidder Details Struct.
    struct WinnerDetails {
        address winnerAddress;
        uint256 amount;
        bytes winnerSignature;
        uint256 bidTime;
    }
    //Events
    event flatSale(
        uint256 nonce,
        address seller,
        uint256 tokenId,
        address assetAddress,
        uint256 amount
    );

    //Events
    event lazy_Auction(
        uint256 tokenId,
        address assetAddress,
        uint256 startTime,
        uint256 amount,
        address winner,
        address seller,
        uint256 endTime
    );

    mapping(uint256 => bool) public isNonceProcessed; //mapping for nonce.

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
            "MarketPlace: nonce already process"
        );
        // validate seller
        address signer = verifySellerSign(
            sellerDetails);

        require(
            sellerDetails.seller == signer,
            "MarketPlace: seller sign verification failed"
        );

        // creating instance
        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);

        // cheking nft is minted or not.
        if (sellerDetails.tokenId > 0) {
            require(
                instance.isApprovedForAll(
                    sellerDetails.seller,
                    address(this)
                ),
                "MarketPlace: Collection must be approved."
            );
            /// transfer the nft.
            instance.transferFrom(
                sellerDetails.seller,
                msg.sender,
                sellerDetails.tokenId
            );
        } else {
            uint256 tokenId = instance.mint(
                sellerDetails.seller,
                sellerDetails.tokenUri,
                sellerDetails.royality
            );

            require(
                instance.isApprovedForAll(
                    sellerDetails.seller,
                    address(this)
                ),
                "MarketPlace: Collection must be approved."
            );

            instance.transferFrom(
                sellerDetails.seller,
                msg.sender,
                tokenId
            );
        }
        // Write Fund Tranfer Code
        // creating IERC20 instance
        IERC20 instanceERC20 = IERC20(sellerDetails.paymentAssetAddress);

        require(
            sellerDetails.amount <= instanceERC20.balanceOf(msg.sender),
            "MarketPlace: Insufficient Amount"
        );

        require(
            instanceERC20.allowance(msg.sender, address(this)) >=
                sellerDetails.amount,
            "MarketPlace: Check the token allowance."
        );

        // transfer seller amount - platformfee
        uint256 feeOnPlatform = (sellerDetails.amount * platFormFeePercent) /
            (100 * decimalPrecision);

        instanceERC20.transferFrom(msg.sender, address(this), feeOnPlatform);

        uint256 remaining_amount = sellerDetails.amount - feeOnPlatform;

        instanceERC20.transferFrom(
            msg.sender,
            sellerDetails.seller,
            remaining_amount
        );

        emit flatSale(
            sellerDetails.nonce,
            sellerDetails.seller,
            sellerDetails.tokenId,
            sellerDetails.assetAddress,
            sellerDetails.amount
        );
        
        /// nonce is ture
        isNonceProcessed[sellerDetails.nonce] = true;
    }
    
   /**
     * @dev This method allows authorised users to MINT/SELL the NFT through lazyAuction.
     * @notice This method allows authorised users to sell/buy NFT on MARKETPLACE
     * @param sellerDetails: Details of Seller.
     * @param winnerDetails: Details of Winner.
     */
    function lazyAuction(
        SellerDetails calldata sellerDetails,
        WinnerDetails calldata winnerDetails
    ) external {
        require(
            !isNonceProcessed[sellerDetails.nonce],
            "MarketPlace: nonce already process"
        );

        address sellerSigner = verifySellerSign(sellerDetails);

        require(
            sellerDetails.seller == sellerSigner,
            "MarketPlace: seller verification failed"
        );

        address winnerSigner = verifyWinnerSign(winnerDetails);

        require(
            winnerDetails.winnerAddress == winnerSigner,
            "MarketPlace: seller sign verification failed"
        );

        // Mint
        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);
        require(
            instance.isApprovedForAll(sellerDetails.seller, address(this)),
            "MarketPlace: address not approve"
        );
        uint256 tokenId = sellerDetails.tokenId;
        if (tokenId == 0) {
            tokenId = instance.mint(
                sellerDetails.seller,
                sellerDetails.tokenUri,
                sellerDetails.royality
            );
        }

        instance.transferFrom(
            sellerDetails.seller,
            winnerDetails.winnerAddress,
            tokenId
        );

        // FundTranfer
        IERC20 instanceERC20 = IERC20(sellerDetails.paymentAssetAddress);

        require(
            instanceERC20.balanceOf(winnerDetails.winnerAddress) >=
                winnerDetails.amount,
            "MarketPlace: Insuficent fund"
        );

        require(
            instanceERC20.allowance(msg.sender, address(this)) >=
                sellerDetails.amount,
            "MarketPlace: Check the token allowance."
        );

        // platformfee/ServiceFee
        uint256 platFormFee = (winnerDetails.amount.mul(200)).div(10000);

        instanceERC20.transferFrom(
            winnerDetails.winnerAddress,
            address(this),
            platFormFee
        );

        uint256 remaining_amount = winnerDetails.amount.sub(platFormFee);

        instanceERC20.transferFrom(
            winnerDetails.winnerAddress,
            sellerDetails.seller,
            remaining_amount
        );

        isNonceProcessed[sellerDetails.nonce] = true;

        emit lazy_Auction(
            sellerDetails.tokenId,
            sellerDetails.assetAddress,
            sellerDetails.startTime,
            sellerDetails.amount,
            winnerDetails.winnerAddress,
            sellerDetails.seller,
            sellerDetails.endTime
        );
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
     *@dev Method: is used to provide signer.
     *@param sellerDetails: Details about seller of the NFT Auction.
     */
    function verifySellerSign(
       SellerDetails calldata sellerDetails ) public pure returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                sellerDetails.assetAddress,
                sellerDetails.tokenId,
                sellerDetails.tokenUri,
                sellerDetails.paymentAssetAddress,
                sellerDetails.amount
            )
        );
        return getSigner(hash, sellerDetails.seller_signature);
    }

    /**
     *@dev Method: is used to provide signer.
     *@param winnerDetails: Details about winner of the NFT Auction.
     */
    function verifyWinnerSign(WinnerDetails calldata winnerDetails)
        public
        pure
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                winnerDetails.winnerAddress,
                winnerDetails.amount,
                winnerDetails.bidTime
            )
        );
        return getSigner(hash, winnerDetails.winnerSignature);
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
        require(sig.length == 65, "MarketPlace: invalid signature length.");

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