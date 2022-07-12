// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/mocks/interfaces/IERC721Mint.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract Auction is Initializable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;
    uint256 public platFormFeePercent;
    uint256 public constant decimalPrecision = 100;

    // mapping for nonce
    mapping(uint256 => bool) public isNonceProcessed;

    struct SellerDetails {
        address seller;
        address assetAddress;
        uint256 tokenId;
        uint256 amount;
        address paymentAssetAddress;
        string URI;
        bytes seller_signature;
        uint96 royality;
        uint256 nonce;
        uint256 startTime;
        uint256 endTime;
    }

    struct WinnerDetails {
        address winnerAddress;
        uint256 amount;
        bytes winnerSignature;
        uint256 bidTime;
    }

    event lazy_Auction(
        uint256 tokenId,
        address assetAddress,
        uint256 startTime,
        uint256 amount,
        address winner,
        address seller,
        uint256 endTime
    );

    function initialize() public initializer {
        __Ownable_init();
        platFormFeePercent = 1000;
    }

    /**
     * @dev This Method to update/reset platFormFeePercent.
     * @notice This method allows authorised users to set platform fee
     * @param _newPlatFormFeePercent: Setting the new platform fees.
     */
    function setPlatFormFeePercent(uint256 _newPlatFormFeePercent) public onlyOwner {
        platFormFeePercent = _newPlatFormFeePercent;
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
            "Auction: nonce already process"
        );

        address sellerSigner = verifySellerSign(sellerDetails);

        require(
            sellerDetails.seller == sellerSigner,
            "seller verification failed"
        );

        require(
            !isNonceProcessed[sellerDetails.nonce],
            "Auction: nonce already process"
        );

        address winnerSigner = verifyWinnerSign(winnerDetails);

        require(
            winnerDetails.winnerAddress == winnerSigner,
            "Auction: seller sign verification failed"
        );

        // Mint
        IERC721Mint instance = IERC721Mint(sellerDetails.assetAddress);
        require(
            instance.isApprovedForAll(sellerDetails.seller, address(this)),
            "Auction: address not approve"
        );
        uint256 tokenId = sellerDetails.tokenId;
        if (tokenId == 0) {
            tokenId = instance.mint(
                sellerDetails.seller,
                sellerDetails.URI,
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
            "Auction: Insuficent fund"
        );

        require(
            instanceERC20.allowance(msg.sender, address(this)) >=
                sellerDetails.amount,
            "Auction: Check the token allowance."
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
    function verifySellerSign(SellerDetails calldata sellerDetails)
        public
        pure
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                sellerDetails.assetAddress,
                sellerDetails.tokenId,
                sellerDetails.URI,
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
        require(sig.length == 65, "Auction: invalid signature length");
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

    receive() external payable {}
}
