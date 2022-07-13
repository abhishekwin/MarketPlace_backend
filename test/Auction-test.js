const { expect } = require("chai");
const { ethers,web3 } = require("hardhat");
const hre = require("hardhat");
// const Web3 = require("web3"); 
require("@nomiclabs/hardhat-web3");

let userA, userC, userD, auction, weth, myNFT, sellerSign, winnerSign;
let royality = 20, nonce = 1, startTime = Math.floor(Date.now() / 1000);
let endTime = Math.floor(Date.now() / 1000) + 200, bidTime = 200;


describe("Auction", () => {
  before(async () => {

  
    accounts = await hre.ethers.getSigners();

    [userA, userB, userC, userD, userE, _] = accounts;


    // NFT721
    let ERC721Token = await hre.ethers.getContractFactory("ERC721Token");

    myNFT = await upgrades.deployProxy(ERC721Token, [500], {
      initializer: "initialize",
    });
    await myNFT.deployed();

    // WETH deployed
    WETH = await hre.ethers.getContractFactory("WETH");
    weth = await WETH.deploy();

    await weth.deployed();


    // myToken token deployed
    const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
    myToken = await ERC20Token.deploy("4000000000000000000")
    await myToken.deployed();


    //Deployed Contract
    Auction = await hre.ethers.getContractFactory("Auction");
    auction = await upgrades.deployProxy(Auction, [], {
      initializer: "initialize",
    });
    await auction.deployed();
    console.log("auction deployed to:", auction.address);
  });
 
  // test cases lazyAuction success cases.
  describe("lazyAuction success cases", () => {
    it("testing lazy auction with new nft mint ", async () => {
      let nonce = 0;
      //  sellerSign(userA)
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "uri", weth.address, "300"]
      );
      let messageHash = ethers.utils.keccak256(message);

      sellerSign = await web3.eth.sign(messageHash, userA.address);

      // userB sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [userB.address, "300", "200"]
      );

      let messageHash1 = ethers.utils.keccak256(message1);
      let winnerSign = await web3.eth.sign(messageHash1, userB.address);
      await myNFT.connect(userA).setApprovalForAll(auction.address, true)
      await weth.connect(userB).deposit({ value: "1000000000000" });
      await weth.connect(userB).approve(auction.address, 3000);


      let sellerStruct = [
        userA.address,
        myNFT.address,
        "0",
        300,
        weth.address,
        "uri",
        sellerSign,
        royality,
        nonce,
        startTime,
        endTime

      ];
      let winnerStruct = [
        userB.address,
        300,
        winnerSign,
        bidTime
      ];


      await auction
        .connect(userB)
        .lazyAuction(sellerStruct, winnerStruct);
      expect(await myNFT.ownerOf(1)).to.be.equal(userB.address);
    });

    it("it should buy minted nft with WETH", async () => {
      let nonce = 1;
      // platformFee
      let nftPrice = ethers.utils.parseEther('1');
      let plaFormFee = 100;

      // sellerSign(userB)
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", weth.address, nftPrice]
      );
      messageHash = ethers.utils.keccak256(message);
      sellerSign = await web3.eth.sign(messageHash, userB.address);
      expect(await auction.getSigner(messageHash, sellerSign)).to.be.equal(
        userB.address
      );


      //  userC sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [userC.address, nftPrice, "200"]
      );

      let messageHash1 = ethers.utils.keccak256(message1);
      let winnerSign = await web3.eth.sign(messageHash1, userC.address);
      await myNFT.connect(userB).setApprovalForAll(auction.address, true);
      await weth.connect(userC).deposit({ value: nftPrice });
      let oldwinnerBal = await weth.balanceOf(userB.address);
      let oldauctionBal = await weth.balanceOf(auction.address);


      await weth.connect(userC).approve(auction.address, ethers.utils.parseEther('4'));
      let platFormFee = ((nftPrice.mul(new ethers.BigNumber.from("200"))).div(new ethers.BigNumber.from("10000")));

      let sellerStruct = [
        userB.address,
        myNFT.address,
        "1",
        nftPrice,
        weth.address,
        "uri",
        sellerSign,
        royality,
        nonce,
        startTime,
        endTime

      ];
      let winnerStruct = [
        userC.address,
        nftPrice,
        winnerSign,
        bidTime
      ];

      await auction
        .connect(userC)
        .lazyAuction(sellerStruct, winnerStruct);

      expect(await myNFT.ownerOf(1)).to.be.equal(userC.address);

      expect(await weth.balanceOf(userB.address)).to.be.equals(nftPrice.sub(platFormFee).add(oldwinnerBal));
      expect(await weth.balanceOf(auction.address)).to.be.equals(platFormFee.add(oldauctionBal));
    });

    it("it should buy minted nft myToken", async () => {
      let nonce = 7;
      // platformFee
      let nftPrice = ethers.utils.parseEther('1');
      let plaFormFee = 100;

      // sellerSign(userC)
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", myToken.address, nftPrice]
      );
      messageHash = ethers.utils.keccak256(message);
      sellerSign = await web3.eth.sign(messageHash, userC.address);
      expect(await auction.getSigner(messageHash, sellerSign)).to.be.equal(
        userC.address
      );


      //  userD sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [userD.address, nftPrice, "200"]
      );

      let messageHash1 = ethers.utils.keccak256(message1);
      let winnerSign = await web3.eth.sign(messageHash1, userD.address);
      await myNFT.connect(userC).setApprovalForAll(auction.address, true);
      await myToken.transfer(userD.address, nftPrice);
      let oldwinnerBal = await myToken.balanceOf(userC.address);
      let oldauctionBal = await myToken.balanceOf(auction.address);


      await myToken.connect(userD).approve(auction.address, ethers.utils.parseEther('4'));
      let platFormFee = ((nftPrice.mul(new ethers.BigNumber.from("200"))).div(new ethers.BigNumber.from("10000")));


      let sellerStruct = [
        userC.address,
        myNFT.address,
        "1",
        nftPrice,
        myToken.address,
        "uri",
        sellerSign,
        royality,
        nonce,
        startTime,
        endTime

      ];
      let winnerStruct = [
        userD.address,
        nftPrice,
        winnerSign,
        bidTime
      ];

      await auction
        .connect(userD)
        .lazyAuction(sellerStruct, winnerStruct);

      expect(await myNFT.ownerOf(1)).to.be.equal(userD.address);

      expect(await myToken.balanceOf(userC.address)).to.be.equals(nftPrice.sub(platFormFee).add(oldwinnerBal));
      expect(await myToken.balanceOf(auction.address)).to.be.equals(platFormFee.add(oldauctionBal));
    });

    //  test cases lazyAuction Negetive cases.
    describe("lazyAuction Negetive Cases", () => {
      it('nonce already process', async () => {
        let nonce = 1;

        //  userA sign
        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [myNFT.address, "0", "uri", weth.address, "300"]
        );
        let messageHash = ethers.utils.keccak256(message);

        sellerSign = await web3.eth.sign(messageHash, userA.address);

        // userB sign
        let message1 = ethers.utils.solidityPack(
          ["address", "uint256", "uint256"],
          [userB.address, "300", "200"]
        );

        let messageHash1 = ethers.utils.keccak256(message1);
        let winnerSign = await web3.eth.sign(messageHash1, userB.address);
        await myNFT.connect(userA).setApprovalForAll(auction.address, true)
        await weth.connect(userB).deposit({ value: "1000000000000" });
        await weth.connect(userB).approve(auction.address, 3000);


        let sellerStruct = [
          userA.address,
          myNFT.address,
          "0",
          300,
          weth.address,
          "uri",
          sellerSign,
          royality,
          nonce,
          startTime,
          endTime

        ];
        let winnerStruct = [
          userB.address,
          300,
          winnerSign,
          bidTime]


        await expect(auction
          .connect(userB)
          .lazyAuction(sellerStruct, winnerStruct)).to.be.revertedWith("Auction: nonce already process");
      });

      it('address not approve', async () => {
        let nonce = 2;
        //  userA sign
        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [myNFT.address, "0", "uri", weth.address, "300"]
        );
        let messageHash = ethers.utils.keccak256(message);

        sellerSign = await web3.eth.sign(messageHash, userA.address);

        // userB sign
        let message1 = ethers.utils.solidityPack(
          ["address", "uint256", "uint256"],
          [userB.address, "300", "200"]
        );

        let messageHash1 = ethers.utils.keccak256(message1);
        let winnerSign = await web3.eth.sign(messageHash1, userB.address);
        await myNFT.connect(userA).setApprovalForAll(auction.address, false)
        await weth.connect(userB).deposit({ value: "1000000000000" });
        await weth.connect(userB).approve(auction.address, 3000);


        let sellerStruct = [
          userA.address,
          myNFT.address,
          "0",
          300,
          weth.address,
          "uri",
          sellerSign,
          royality,
          nonce,
          startTime,
          endTime

        ];
        let winnerStruct = [
          userB.address,
          300,
          winnerSign,
          bidTime]

        await expect(auction
          .connect(userB)
          .lazyAuction(sellerStruct, winnerStruct)).to.be.revertedWith("Auction: address not approve");

      });

      it('Should check Insufficient Amount', async () => {
        let nonce = 3;
        //  userA sign
        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [myNFT.address, "0", "uri", weth.address, ethers.utils.parseEther("100")]
        );
        let messageHash = ethers.utils.keccak256(message);

        sellerSign = await web3.eth.sign(messageHash, userA.address);

        // userB sign
        let message1 = ethers.utils.solidityPack(
          ["address", "uint256", "uint256"],
          [userB.address, ethers.utils.parseEther("100"), "200"]
        );

        let messageHash1 = ethers.utils.keccak256(message1);
        let winnerSign = await web3.eth.sign(messageHash1, userB.address);
        // await weth.connect(userB).deposit({ value: "1000000000000" });
        await myNFT.connect(userA).setApprovalForAll(auction.address, true)
        await weth.connect(userB).approve(auction.address, 3000);


        let sellerStruct = [
          userA.address,
          myNFT.address,
          "0",
          ethers.utils.parseEther("100"),
          weth.address,
          "uri",
          sellerSign,
          royality,
          nonce,
          startTime,
          endTime

        ];
        let winnerStruct = [
          userB.address,
          ethers.utils.parseEther("100"),
          winnerSign,
          bidTime]

        await expect(auction
          .connect(userB)
          .lazyAuction(sellerStruct, winnerStruct)).to.be.revertedWith("Auction: Insuficent fund");

      });

      it('Should check  seller sign verification', async () => {
        let nonce = 3;
        //  userA sign
        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [myNFT.address, "0", "uri", weth.address, ethers.utils.parseEther("100")]
        );
        let messageHash = ethers.utils.keccak256(message);

        sellerSign = await web3.eth.sign(messageHash, userA.address);

        // userB sign
        let message1 = ethers.utils.solidityPack(
          ["address", "uint256", "uint256"],
          [userB.address, '300', "200"]
        );

        let messageHash1 = ethers.utils.keccak256(message1);
        let winnerSign = await web3.eth.sign(messageHash1, userB.address);
        await weth.connect(userB).deposit({ value: "1000000000000" });

        await myNFT.connect(userA).setApprovalForAll(auction.address, true)
        await weth.connect(userB).approve(auction.address, 3000);


        let sellerStruct = [
          userA.address,
          myNFT.address,
          "0",
          ethers.utils.parseEther("100"),
          weth.address,
          "uri",
          sellerSign,
          royality,
          nonce,
          startTime,
          endTime

        ];
        let winnerStruct = [
          userB.address,
          ethers.utils.parseEther("100"),
          winnerSign,
          bidTime]

        await expect(auction
          .connect(userB)
          .lazyAuction(sellerStruct, winnerStruct)).to.be.revertedWith("Auction: seller sign verification failed");

      });

      it('Should Check the token allowance.', async () => {
        let nonce = 4;
        //  userA sign
        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [myNFT.address, "0", "uri", weth.address, '300']
        );
        let messageHash = ethers.utils.keccak256(message);

        sellerSign = await web3.eth.sign(messageHash, userA.address);

        // userB sign
        let message1 = ethers.utils.solidityPack(
          ["address", "uint256", "uint256"],
          [userB.address, '300', "200"]
        );

        let messageHash1 = ethers.utils.keccak256(message1);
        let winnerSign = await web3.eth.sign(messageHash1, userB.address);
        await weth.connect(userB).deposit({ value: "1000000" });

        await myNFT.connect(userA).setApprovalForAll(auction.address, true)
        await weth.connect(userB).approve(auction.address, 3000);


        let sellerStruct = [
          userA.address,
          myNFT.address,
          "0",
          '300',
          weth.address,
          "uri",
          sellerSign,
          royality,
          nonce,
          startTime,
          endTime

        ];
        let winnerStruct = [
          userB.address,
          '300',
          winnerSign,
          bidTime]

        await expect(auction
          .connect(userA)
          .lazyAuction(sellerStruct, winnerStruct)).to.be.revertedWith("Auction: Check the token allowance.");

      });

      it('cheaking invalid signature length.', async () => {
        let nonce = 4;
        //  userA sign
        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [myNFT.address, "0", "uri", weth.address, '300']
        );
        let messageHash = ethers.utils.keccak256(message);

        sellerSign = await web3.eth.sign(messageHash, userA.address);

        // userB sign
        let message1 = ethers.utils.solidityPack(
          ["address", "uint256", "uint256"],
          [userB.address, '300', "200"]
        );

        let messageHash1 = ethers.utils.keccak256(message1);
        let winnerSign = await web3.eth.sign(messageHash1, userB.address);
        await weth.connect(userB).deposit({ value: "1000000" });

        await myNFT.connect(userA).setApprovalForAll(auction.address, true)
        await weth.connect(userB).approve(auction.address, 3000);


        let sellerStruct = [
          userA.address,
          myNFT.address,
          "0",
          '300',
          weth.address,
          "uri",
          "0xf115cfbf0589119b0c6f12191c23a7842d309284419c774077b3c49c0c80a0d51dfeeea40a13d26149217d72e497a8d255a28e45a0df43f792574fddb7c12223",
          royality,
          nonce,
          startTime,
          endTime

        ];
        let winnerStruct = [
          userB.address,
          '300',
          winnerSign,
          bidTime]

        await expect(auction
          .connect(userA)
          .lazyAuction(sellerStruct, winnerStruct)).to.be.revertedWith("Auction: invalid signature length");

      });
    });
  });
})
