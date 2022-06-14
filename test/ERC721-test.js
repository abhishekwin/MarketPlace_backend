const { expect } = require("chai");

describe("MyNFT", function () {
  let deployer, add1, add2, add3, add4, add5;
  before(async () => {
    accounts = await ethers.getSigners();
    [deployer, add1, add2, add3, add4, add5, _] = accounts;

    const MyNFT = await hre.ethers.getContractFactory("ERC721Token");
    const myToken = await MyNFT.deploy();
    await myToken.deployed();
  });
});

describe("Check that royaly is added or not", async ()=> {

})