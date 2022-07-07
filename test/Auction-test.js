const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const Web3 = require("web3");

let seller, add2, auction, weth, myNFT, bidder, sellerSign, bidderSign, nick, amount, sign, sellerStruct, bidderStruct;
let royality = 20,
  nonce = 1,
  startTime = Math.floor(Date.now() / 1000);
let endTime = Math.floor(Date.now() / 1000) + 200,
  timeDuration = 100,
  bidTime = 200;
  

describe("Auction", () => {
  before(async () => {
    web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:8545");
    // solditypack = new solidityPack(solidityPack.givenProvider);

    accounts = await hre.ethers.getSigners();

    [seller, bidder, add2, auction, add3, add4, _] = accounts;

    // NFT721
    let MyToken = await hre.ethers.getContractFactory("MyNFT");

    myNFT = await upgrades.deployProxy(MyToken, [500], {
      initializer: "initialize",
    });
    await myNFT.deployed();
    console.log("MyNFT deployed to:", myNFT.address);

    // Weth
    WETH = await hre.ethers.getContractFactory("WETH");
    weth = await WETH.deploy();

    await weth.deployed();

 
    const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
     myToken = await ERC20Token.deploy("1000")

    await myToken.deployed();

    console.log("ERC20Token deployed to:",myToken.address);



    //Deployed Contract
    Auction = await hre.ethers.getContractFactory("Auction");
    auction = await Auction.deploy();
    await auction.deployed();
  });
  //
  describe("lazyAuction success cases", () => {
    it("testing lazy auction with new nft mint ", async () => {
      //  seller sign
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "uri", weth.address, "300"]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sellerSign = await web3.eth.sign(messageHash, accounts[0].address);

      // bidder sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "uri", weth.address, "300"]
      );

      let messageHash1 = ethers.utils.keccak256(message);
      let bidderSign = await web3.eth.sign(messageHash1, accounts[1].address);
      await weth.connect(bidder).deposit({ value: "1000000000000" });
      await weth.connect(bidder).approve(auction.address, 3000);

      let sellerStruct = [
        seller.address,
        myNFT.address,
        "0",
        300,
        weth.address,
        "uri",
        sellerSign,
        royality,
        nonce,
        startTime,
        endTime,
        timeDuration,
      ];
      let bidderStruct = [
        bidder.address,
        myNFT.address,
        "0",
        300,
        weth.address,
        "uri",
        bidderSign,
        bidTime,
      ];

      const lazy = await auction
        .connect(bidder)
        .lazyAuction(sellerStruct, bidderStruct);

      expect(await myNFT.ownerOf(1)).to.be.equal(bidder.address);
    });
    it("Mint with erc20 Token", async () => {
      //  seller sign
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "uri", myToken.address, "300"]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sellerSign = await web3.eth.sign(messageHash, accounts[0].address);

      // bidder sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "0", "uri", weth.address, "300"]
      );

      let messageHash1 = ethers.utils.keccak256(message);
      let bidderSign = await web3.eth.sign(messageHash1, accounts[1].address);
      await myToken.connect(bidder).deposit({ value: "1000000000000" });
      await myToken.connect(bidder).approve(auction.address, 3000);

      let sellerStruct = [
        seller.address,
        myNFT.address,
        "0",
        300,
        myToken.address,
        "uri",
        sellerSign,
        royality,
        nonce,
        startTime,
        endTime,
        timeDuration,
      ];
      let bidderStruct = [
        bidder.address,
        myNFT.address,
        "0",
        300,
        myToken.address,
        "uri",
        bidderSign,
        bidTime,
      ];

      const lazy = await auction
        .connect(bidder)
        .lazyAuction(sellerStruct, bidderStruct);

      expect(await myNFT.ownerOf(2)).to.be.equal(bidder.address);
      // expect(await myNFT.balanceOf(bidder.address)).to.be.equal(2);
    });
    it("it should buy minted nft", async () => {
      //  seller sign
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", myToken.address, "300"]
      );
      let messageHash = ethers.utils.keccak256(message);

      let add2Sign = await web3.eth.sign(messageHash, add2.address);

      // bidder sign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", weth.address, "300"]
      );

      let messageHash1 = ethers.utils.keccak256(message);
      let bidderSign = await web3.eth.sign(messageHash1, bidder.address);
      await weth.connect(bidder).transfer(add2.address, 1000000);
      await myNFT.connect(bidder).approve(auction.address, 1);

      await weth.connect(add2).approve(auction.address, 3000);

      let sellerStruct = [
        bidder.address,
        myNFT.address,
        "1",
        300,
        weth.address,
        "uri",
        bidderSign,
        royality,
        nonce,
        startTime,
        endTime,
        timeDuration,
      ];
      let bidderStruct = [
        add2.address,
        myNFT.address,
        "1",
        300,
        weth.address,
        "uri",
        add2Sign,
        bidTime,
      ];
      const lazyAuction = await auction.lazyAuction(sellerStruct, bidderStruct);
    });
   
  });
  describe("lazyAuction negative cases", () => {
     it("Address not approve", async () => {
    //   // sellerSign
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", weth.address, "300"]
      );
      let messageHash = ethers.utils.keccak256(message);
      let bidderSign = await web3.eth.sign(messageHash, bidder.address);

    //   // bidderSign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", weth.address, "300"]
      );
     
    let messageHash1 = ethers.utils.keccak256(message1);

      let add3Sign = await web3.eth.sign(messageHash1, add3.address);

      await weth.connect(bidder).transfer(add3.address, 1000000);

      await weth.connect(add3).approve(auction.address, 3000);


      let sellerStruct = [
        bidder.address,
        myNFT.address,
        "1",
        300,
        weth.address,
        "uri",
        bidderSign,
        royality,
        nonce,
        startTime,
        endTime,
        timeDuration,
      ];
      let bidderStruct = [
        add3.address,
        myNFT.address,
        "1",
        300,
        weth.address,
        "uri",
        add3Sign,
        bidTime,
      ];

      await expect(
      auction.connect(add3).lazyAuction(sellerStruct, bidderStruct)
    ).to.be.revertedWith("address not approve");

    })
  })

  it("Insuficent fund", async () => {
    //   // sellerSign
      let message = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", weth.address, "300"]
      );
      let messageHash = ethers.utils.keccak256(message);
      let bidderSign = await web3.eth.sign(messageHash, bidder.address);

    //   // bidderSign
      let message1 = ethers.utils.solidityPack(
        ["address", "uint256", "string", "address", "uint256"],
        [myNFT.address, "1", "uri", weth.address, "300"]
      );
     
    let messageHash1 = ethers.utils.keccak256(message1);

      let add3Sign = await web3.eth.sign(messageHash1, add3.address);
     console.log(await weth.balanceOf(bidder.address));
      // await weth.connect(bidder).transfer(add3.address, 1000);
      // await myNFT.connect(bidder).approve(auction.address, 1);
      // await weth.connect(add3).approve(auction.address, 300);

      let sellerStruct = [
        bidder.address,
        myNFT.address,
        "1",
        300,
        weth.address,
        "uri",
        bidderSign,
        royality,
        nonce,
        startTime,
        endTime,
        timeDuration,
      ];
      let bidderStruct = [
        add3.address,
        myNFT.address,
        "1",
        300,
        weth.address,
        "uri",
        add3Sign,
        bidTime,
      ];

    //   await expect(
    //   auction.connect(add3).lazyAuction(sellerStruct, bidderStruct)
    // ).to.be.revertedWith("Insuficent fund");
});
})
