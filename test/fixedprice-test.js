const { expect } = require('chai');
let seller, buyer, add2, flatSale, tokenId;

describe('FlatSale', () => {
  before(async () => {
    accounts = await ethers.getSigners();
    [seller, buyer, add2, flatSale, tokenId, add5, _] = accounts;

    //Deployed Token
    const FlatSale = await hre.ethers.getContractFactory('FlatSale');
    flatSale = await FlatSale.deploy();
    await flatSale.deployed();

    console.log('FlatSale deployed to:', flatSale.address);
  });
});
