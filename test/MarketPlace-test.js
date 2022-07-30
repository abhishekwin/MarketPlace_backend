const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");

let seller,
  marketPlace,
  buyer,
  add1,
  add2,
  add4,
  myToken,
  decimalPrecision = 100,
  royality = 20,
  bidTime = 200;

describe("marketPlace", () => {
  before(async () => {
    accounts = await hre.ethers.getSigners();
    [
      seller,
      buyer,
      add1,
      add2,
      marketPlace,
      tokenId,
      add3,
      add4,
      userA,
      userB,
      userC,
      userD,
      userE,
      _,
    ] = accounts;

    // NFT721 Deployed
    let ERC721Token = await hre.ethers.getContractFactory("ERC721Token");

    myNFT = await upgrades.deployProxy(ERC721Token, [500], {
      initializer: "initialize",
    });
    await myNFT.deployed();

    // Weth Deployed
    WETH = await hre.ethers.getContractFactory("WETH");
    weth = await WETH.deploy();
    await weth.deployed();

    //ERC20Token DEPLOYED
    ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
    myToken = await ERC20Token.deploy("10000000000000000000000000");
    await myToken.deployed();

    //  We get the contract to deploy
    MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
    marketPlace = await upgrades.deployProxy(MarketPlace, [], {
      initializer: "initialize",
    });
    await marketPlace.deployed();
  });

  describe("lazy buy function success cases", () => {
    it("Lazybuy Function", async () => {
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, 0, "abhi", weth.address, 200]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);
      let nonce = 0;
      await weth.connect(buyer).deposit({ value: "1000000000000" });

      await myNFT.connect(seller).setApprovalForAll(marketPlace.address, true);

      await weth.connect(buyer).approve(marketPlace.address, 2000);

      LAZY = await marketPlace
        .connect(buyer)
        .lazyBuy([
          nonce,
          seller.address,
          myNFT.address,
          weth.address,
          0,
          royality,
          200,
          sign,
          "abhi",
          block.timestamp,
          block.timestamp + 100,
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(buyer.address);
      expect(await myNFT.balanceOf(buyer.address)).to.be.equal(1);
    });
    it("it should buy minted nft with weth", async () => {
      let nonce = 1;

      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "abhi", weth.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, buyer.address);
      expect(await marketPlace.getSigner(messageHash, sign)).to.be.equal(
        buyer.address
      );

      await weth.connect(add1).deposit({ value: "1000000000000" });

      await myNFT.connect(buyer).setApprovalForAll(marketPlace.address, true);

      await weth.connect(add1).approve(marketPlace.address, 2000);

      LAZY = await marketPlace
        .connect(add1)
        .lazyBuy([
          nonce,
          buyer.address,
          myNFT.address,
          weth.address,
          "1",
          "400",
          200,
          sign,
          "abhi",
          block.timestamp,
          block.timestamp + 100,
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(add1.address);
      expect(await myNFT.balanceOf(add1.address)).to.be.equal(1);
    });
    it("it should buy minted nft with myToken", async () => {
      let nonce = 7;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "abhi", myToken.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, add1.address);

      await myToken.transfer(add2.address, 10000);

      await myNFT.connect(add1).setApprovalForAll(marketPlace.address, true);

      await myToken.connect(add2).approve(marketPlace.address, 2000);

      LAZY = await marketPlace
        .connect(add2)
        .lazyBuy([
          nonce,
          add1.address,
          myNFT.address,
          myToken.address,
          "1",
          "400",
          200,
          sign,
          "abhi",
          block.timestamp,
          block.timestamp + 100,
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(add2.address);
      expect(await myNFT.balanceOf(add2.address)).to.be.equal(1);
    });
  });
  describe("lazzy buy function negative cases", () => {
    it("cheaking isnonce already process", async () => {
      let nonce = 0;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "abhi", weth.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);
      await weth.connect(buyer).deposit({ value: "1000000000000" });

      await myNFT.connect(seller).setApprovalForAll(marketPlace.address, true);

      await weth.connect(buyer).approve(marketPlace.address, 2000);

      await expect(
        marketPlace
          .connect(buyer)
          .lazyBuy([
            nonce,
            seller.address,
            myNFT.address,
            weth.address,
            "0",
            "400",
            200,
            sign,
            "abhi",
            block.timestamp,
            block.timestamp + 100,
          ])
      ).to.be.revertedWith("MarketPlace: nonce already process");
    });
    it("it should checking collection must be approved.", async () => {
      let nonce = 2;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "abhi", weth.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, buyer.address);
      expect(await marketPlace.getSigner(messageHash, sign)).to.be.equal(
        buyer.address
      );

      await weth.connect(add1).deposit({ value: "1000000000000" });

      await myNFT.connect(buyer).setApprovalForAll(marketPlace.address, false);

      await weth.connect(add1).approve(marketPlace.address, 2000);

      await expect(
        marketPlace
          .connect(add1)
          .lazyBuy([
            nonce,
            buyer.address,
            myNFT.address,
            weth.address,
            "0",
            "400",
            200,
            sign,
            "abhi",
            block.timestamp,
            block.timestamp + 100,
          ])
      ).to.be.revertedWith("MarketPlace: Collection must be approved.");
    });
    it(" Should Check the token allowance", async () => {
      let nonce = 3;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "abhi", weth.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, add2.address);

      await weth.connect(add1).transfer(add2.address, 1000);
      await myNFT.connect(add2).setApprovalForAll(marketPlace.address, true);

      await weth.connect(add1).approve(marketPlace.address, 1000);

      await expect(
        marketPlace
          .connect(add2)
          .lazyBuy([
            nonce,
            add2.address,
            myNFT.address,
            weth.address,
            "0",
            "400",
            200,
            sign,
            "abhi",
            block.timestamp,
            block.timestamp + 100,
          ])
      ).to.be.revertedWith("MarketPlace: Check the token allowance.");
    });
    it(" Should check Insufficient Amount", async () => {
      let nonce = 4;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [
          myNFT.address,
          "0",
          "abhi",
          weth.address,
          ethers.utils.parseEther("100"),
        ]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, buyer.address);
      expect(await marketPlace.getSigner(messageHash, sign)).to.be.equal(
        buyer.address
      );
      await myNFT.connect(buyer).setApprovalForAll(marketPlace.address, true);

      await weth.connect(add1).approve(marketPlace.address, 2000);

      await expect(
        marketPlace
          .connect(add1)
          .lazyBuy([
            nonce,
            buyer.address,
            myNFT.address,
            weth.address,
            "0",
            "400",
            ethers.utils.parseEther("100"),
            sign,
            "abhi",
            block.timestamp,
            block.timestamp + 100,
          ])
      ).to.be.revertedWith("MarketPlace: Insufficient Amount");
    });
    it("cheaking seller sign verification failed", async () => {
      let nonce = 5;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "abhi", weth.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);
      await weth.connect(buyer).deposit({ value: "1000000000000" });

      await myNFT.connect(seller).setApprovalForAll(marketPlace.address, true);

      await weth.connect(buyer).approve(marketPlace.address, 2000);

      await expect(
        marketPlace
          .connect(buyer)
          .lazyBuy([
            nonce,
            seller.address,
            myNFT.address,
            weth.address,
            "0",
            "400",
            2000,
            sign,
            "abhi",
            block.timestamp,
            block.timestamp + 100,
          ])
      ).to.be.revertedWith("MarketPlace: seller sign verification failed");
    });
    it("cheaking invalid signature length", async () => {
      let nonce = 5;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "abhi", weth.address, "200"]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);

      await weth.connect(buyer).deposit({ value: "1000000000000" });

      await myNFT.connect(seller).setApprovalForAll(marketPlace.address, true);

      await weth.connect(buyer).approve(marketPlace.address, 2000);

      await expect(
        marketPlace
          .connect(buyer)
          .lazyBuy([
            nonce,
            seller.address,
            myNFT.address,
            weth.address,
            "0",
            "400",
            2000,
            "0xaa2fe5bd50daa6b9adc22a3aff601f52c3b81649a250106d49e96594e6772264c9bf638289a158113f6def1cccfb7369599039e6221b9d6b5970496431ae3a",
            "abhi",
            block.timestamp,
            block.timestamp + 100,
          ])
      ).to.be.revertedWith("MarketPlace: invalid signature length.");
    });
  });
  describe("lazy buy function brokerage.", () => {
    it("should check lazy buy brokerage", async () => {
      let amount = ethers.utils.parseEther("1");
      let platFormFeePercent = 250;

      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "abhi", weth.address, amount]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, add2.address);
      let nonce = 9;

      await weth.connect(add4).deposit({ value: amount });
      await myNFT.connect(add2).setApprovalForAll(marketPlace.address, true);

      await weth.connect(add4).approve(marketPlace.address, amount);
      let oldAmountmarketPlace = await weth.balanceOf(marketPlace.address);
      let oldAmountSeller = await weth.balanceOf(add2.address);

      LAZY = await marketPlace
        .connect(add4)
        .lazyBuy([
          nonce,
          add2.address,
          myNFT.address,
          weth.address,
          "1",
          "400",
          amount,
          sign,
          "abhi",
          block.timestamp,
          block.timestamp + 100,
        ]);

      let platFormFee = amount
        .mul(new ethers.BigNumber.from(platFormFeePercent))
        .div(new ethers.BigNumber.from("100") * decimalPrecision);
      let remaining_amount = amount.sub(platFormFee);

      expect(await weth.balanceOf(marketPlace.address)).to.be.equal(
        oldAmountmarketPlace.add(platFormFee)
      );

      expect(await weth.balanceOf(add2.address)).to.be.equal(
        oldAmountSeller.add(remaining_amount)
      );
    });
  });
  describe("lazyAuction success cases", () => {
    it("testing lazy marketPlace with new nft mint ", async () => {
      let nonce = 10;
      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      //  sellerSign(userA)
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, 0, "uri", weth.address, 300]
      );
      let messageHash = ethers.utils.keccak256(message);

      sellerSign = await web3.eth.sign(messageHash, seller.address);

      // userB sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [userB.address, "300", "200"]
      );

      let messageHash1 = ethers.utils.keccak256(message1);
      let winnerSign = await web3.eth.sign(messageHash1, userB.address);

      await myNFT.connect(seller).setApprovalForAll(marketPlace.address, true);
      await weth.connect(userB).deposit({ value: "1000000000000" });
      await weth.connect(userB).approve(marketPlace.address, 3000);
      // console.log(await myNFT.balanceOf(add2.address),"kckandkn")

      let sellerStruct = [
        nonce,
        seller.address,
        myNFT.address,
        weth.address,
        0,
        royality,
        300,
        sellerSign,
        "uri",
        block.timestamp,
        block.timestamp + 100,
      ];
      let winnerStruct = [userB.address, 300, winnerSign, bidTime];

      await marketPlace.connect(userB).lazyAuction(sellerStruct, winnerStruct);
      expect(await myNFT.ownerOf(2)).to.be.equal(userB.address);
    });
    it("it should buy minted nft with WETH", async () => {
      let nonce = 11;
      // platformFee
      let nftPrice = ethers.utils.parseEther("1");
      let plaFormFee = 100;

      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      // sellerSign(userB)
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "2", "uri", weth.address, nftPrice]
      );
      messageHash = ethers.utils.keccak256(message);
      sellerSign = await web3.eth.sign(messageHash, userB.address);
      expect(await marketPlace.getSigner(messageHash, sellerSign)).to.be.equal(
        userB.address
      );

      //  userC sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [userC.address, nftPrice, "200"]
      );

      let messageHash1 = ethers.utils.keccak256(message1);
      let winnerSign = await web3.eth.sign(messageHash1, userC.address);

      await myNFT.connect(userB).setApprovalForAll(marketPlace.address, true);
      await weth.connect(userC).deposit({ value: nftPrice });
      let oldwinnerBal = await weth.balanceOf(userB.address);
      let oldauctionBal = await weth.balanceOf(marketPlace.address);

      await weth
        .connect(userC)
        .approve(marketPlace.address, ethers.utils.parseEther("4"));
      let platFormFee = nftPrice
        .mul(new ethers.BigNumber.from("200"))
        .div(new ethers.BigNumber.from("10000"));

      let sellerStruct = [
        nonce,
        userB.address,
        myNFT.address,
        weth.address,
        "2",
        royality,
        nftPrice,
        sellerSign,
        "uri",
        block.timestamp,
        block.timestamp + 100,
      ];
      let winnerStruct = [userC.address, nftPrice, winnerSign, bidTime];

      await marketPlace.connect(userC).lazyAuction(sellerStruct, winnerStruct);

      expect(await myNFT.ownerOf(2)).to.be.equal(userC.address);

      expect(await weth.balanceOf(userB.address)).to.be.equals(
        nftPrice.sub(platFormFee).add(oldwinnerBal)
      );
      expect(await weth.balanceOf(marketPlace.address)).to.be.equals(
        platFormFee.add(oldauctionBal)
      );
    });
    it("it should buy minted nft myToken", async () => {
      let nonce = 13;
      // platformFee
      let nftPrice = ethers.utils.parseEther("1");
      let plaFormFee = 100;

      // Get current block.timestamp
      let blockNumber = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNumber);

      // sellerSign(userC)
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "2", "uri", myToken.address, nftPrice]
      );
      messageHash = ethers.utils.keccak256(message);
      sellerSign = await web3.eth.sign(messageHash, userC.address);
      expect(await marketPlace.getSigner(messageHash, sellerSign)).to.be.equal(
        userC.address
      );

      //  userD sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [userD.address, nftPrice, "200"]
      );

      let messageHash1 = ethers.utils.keccak256(message1);
      let winnerSign = await web3.eth.sign(messageHash1, userD.address);
      await myNFT.connect(userC).setApprovalForAll(marketPlace.address, true);
      await myToken.transfer(userD.address, nftPrice);
      let oldwinnerBal = await myToken.balanceOf(userC.address);
      let oldauctionBal = await myToken.balanceOf(marketPlace.address);

      await myToken
        .connect(userD)
        .approve(marketPlace.address, ethers.utils.parseEther("4"));
      let platFormFee = nftPrice
        .mul(new ethers.BigNumber.from("200"))
        .div(new ethers.BigNumber.from("10000"));

      let sellerStruct = [
        nonce,
        userC.address,
        myNFT.address,
        myToken.address,
        "2",
        royality,
        nftPrice,
        sellerSign,
        "uri",
        block.timestamp,
        block.timestamp + 100,
      ];
      let winnerStruct = [userD.address, nftPrice, winnerSign, bidTime];

      await marketPlace.connect(userD).lazyAuction(sellerStruct, winnerStruct);

      expect(await myNFT.ownerOf(2)).to.be.equal(userD.address);

      expect(await myToken.balanceOf(userC.address)).to.be.equals(
        nftPrice.sub(platFormFee).add(oldwinnerBal)
      );
      expect(await myToken.balanceOf(marketPlace.address)).to.be.equals(
        platFormFee.add(oldauctionBal)
      );
    });
    describe("lazyAuction Negetive Cases", () => {
      it("nonce already process", async () => {
        let nonce = 1;

        // Get current block.timestamp
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);

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
        await myNFT.connect(userA).setApprovalForAll(marketPlace.address, true);
        await weth.connect(userB).deposit({ value: "1000000000000" });
        await weth.connect(userB).approve(marketPlace.address, 3000);

        let sellerStruct = [
          nonce,
          userA.address,
          myNFT.address,
          weth.address,
          "0",
          royality,
          300,
          sellerSign,
          "uri",
          block.timestamp,
          block.timestamp + 100,
        ];
        let winnerStruct = [userB.address, 300, winnerSign, bidTime];

        await expect(
          marketPlace.connect(userB).lazyAuction(sellerStruct, winnerStruct)
        ).to.be.revertedWith("MarketPlace: nonce already process");
      });
      it("address not approve", async () => {
        let nonce = 2;
        // Get current block.timestamp
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);

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
        await myNFT
          .connect(userA)
          .setApprovalForAll(marketPlace.address, false);
        await weth.connect(userB).deposit({ value: "1000000000000" });
        await weth.connect(userB).approve(marketPlace.address, 3000);

        let sellerStruct = [
          nonce,
          userA.address,
          myNFT.address,
          weth.address,
          "0",
          royality,
          300,
          sellerSign,
          "uri",
          block.timestamp,
          block.timestamp + 100,
        ];
        let winnerStruct = [userB.address, 300, winnerSign, bidTime];

        await expect(
          marketPlace.connect(userB).lazyAuction(sellerStruct, winnerStruct)
        ).to.be.revertedWith("MarketPlace: address not approve");
      });
      it("Should check Insufficient Amount", async () => {
        let nonce = 14;
        //  userA sign
        // Get current block.timestamp
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);

        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [
            myNFT.address,
            "0",
            "uri",
            weth.address,
            ethers.utils.parseEther("100"),
          ]
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
        await myNFT.connect(userA).setApprovalForAll(marketPlace.address, true);
        await weth.connect(userB).approve(marketPlace.address, 3000);

        let sellerStruct = [
          nonce,
          userA.address,
          myNFT.address,
          weth.address,
          "0",
          royality,
          ethers.utils.parseEther("100"),
          sellerSign,
          "uri",
          block.timestamp,
          block.timestamp + 100,
        ];
        let winnerStruct = [
          userB.address,
          ethers.utils.parseEther("100"),
          winnerSign,
          bidTime,
        ];

        await expect(
          marketPlace.connect(userB).lazyAuction(sellerStruct, winnerStruct)
        ).to.be.revertedWith("MarketPlace: Insuficent fund");
      });
      it("Should check  seller sign verification", async () => {
        let nonce = 3;
        //  userA sign
        // Get current block.timestamp
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);

        let message = ethers.utils.solidityPack(
          ["address", "uint256", "string", "address", "uint256"],
          [
            myNFT.address,
            "0",
            "uri",
            weth.address,
            ethers.utils.parseEther("100"),
          ]
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
        await weth.connect(userB).deposit({ value: "1000000000000" });

        await myNFT.connect(userA).setApprovalForAll(marketPlace.address, true);
        await weth.connect(userB).approve(marketPlace.address, 3000);

        let sellerStruct = [
          nonce,
          userA.address,
          myNFT.address,
          weth.address,
          "0",
          royality,
          ethers.utils.parseEther("100"),
          sellerSign,
          "uri",
          block.timestamp,
          block.timestamp + 100,
        ];
        let winnerStruct = [
          userB.address,
          ethers.utils.parseEther("100"),
          winnerSign,
          bidTime,
        ];

        await expect(
          marketPlace.connect(userB).lazyAuction(sellerStruct, winnerStruct)
        ).to.be.revertedWith("MarketPlace: seller sign verification failed");
      });
      it("Should Check the token allowance.", async () => {
        let nonce = 4;
        //  userA sign
        // Get current block.timestamp
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);

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
        await weth.connect(userB).deposit({ value: "1000000" });

        await myNFT.connect(userA).setApprovalForAll(marketPlace.address, true);
        await weth.connect(userB).approve(marketPlace.address, 3000);

        let sellerStruct = [
          nonce,
          userA.address,
          myNFT.address,
          weth.address,
          "0",
          royality,
          300,
          sellerSign,
          "uri",
          block.timestamp,
          block.timestamp + 100,
        ];
        let winnerStruct = [userB.address, "300", winnerSign, bidTime];

        await expect(
          marketPlace.connect(userA).lazyAuction(sellerStruct, winnerStruct)
        ).to.be.revertedWith("MarketPlace: Check the token allowance.");
      });
      it("cheaking invalid signature length.", async () => {
        let nonce = 15;
        //  userA sign
        // Get current block.timestamp
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);
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
        await weth.connect(userB).deposit({ value: "1000000" });

        await myNFT.connect(userA).setApprovalForAll(marketPlace.address, true);
        await weth.connect(userB).approve(marketPlace.address, 3000);

        let sellerStruct = [
          nonce,
          userA.address,
          myNFT.address,
          weth.address,
          "0",
          royality,
          300,
          "0xf115cfbf0589119b0c6f12191c23a7842d309284419c774077b3c49c0c80a0d51dfeeea40a13d26149217d72e497a8d255a28e45a0df43f792574fddb7c12223",
          "uri",
          block.timestamp,
          block.timestamp + 100,
        ];
        let winnerStruct = [userB.address, "300", winnerSign, bidTime];

        await expect(
          marketPlace.connect(userA).lazyAuction(sellerStruct, winnerStruct)
        ).to.be.revertedWith("MarketPlace: invalid signature length");
      });
    });
  });
});
