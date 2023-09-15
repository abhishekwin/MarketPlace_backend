const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");

let Seller, Buyer, marketPlace, add1, add2, add3;

describe("Deploying Contract", () => {
  before(async () => {
    accounts = await hre.ethers.getSigners();
    accounts = [Seller, Buyer, add1, add2, _,];

    let BlackList = await hre.ethers.getContractFactory("Blacklist");
    blackList = await BlackList.deploy();

    let ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
    erc721Token = await upgrades.deployProxy(
      ERC721Token,
      [500, blackList.address],
      {
        initializer: "initialize",
      }
    );
    await erc721Token.deployed();

    WETH = await hre.ethers.getContractFactory("WETH");
    weth = await WETH.deploy();
    await weth.deployed;
  });

  describe("LazyBuy Functionality", () => {
    it("LazyBuy a NFT", async () => {});
  });
});
