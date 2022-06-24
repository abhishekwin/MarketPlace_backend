const { expect } = require('chai');
const Web3 = require('web3');
const hre = require('hardhat');




let seller,
  buyer,
  add2,
  flatSale,
  tokenId,
  web3,
  paymentAssetAddress,
  assetAddress,
  _signature,
  amount,
  account,
  weth,
  myNFT;

describe('FlatSale', () => {
  before(async () => {
    web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:8545');
    // solditypack = new solidityPack(solidityPack.givenProvider);

    accounts = await hre.ethers.getSigners();

    [seller, add2, add5, _] = accounts;

    // NFT721
    MyNFT = await hre.ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy(500);

    await myNFT.deployed();

    console.log("MyNFT deployed to:", myNFT.address);
    // Weth
    WETH = await hre.ethers.getContractFactory('WETH');
    weth = await WETH.deploy();

    await weth.deployed();

    console.log('WETH deployed to:', weth.address);

    //Deployed Token
    FlatSale = await hre.ethers.getContractFactory('FlatSale');
    flatSale = await FlatSale.deploy();
    await flatSale.deployed();

    console.log('FlatSale deployed to:', flatSale.address);
  });


  it('Generate the seller signature', async () => {

    let messageHashBytes = hre.ethers.utils.arrayify(hre.ethers.utils.id("0x5FbDB2315678afecb367f032d93F642f64180aa3",
      '0',
      'abhi',
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 100))

    let flatSig = await seller.signMessage(messageHashBytes);
    console.log('signature', flatSig);
    console.log("fghfgfhfhhhhhh", await flatSale.getSigner(messageHashBytes, flatSig))
    // await flatSale.lazyBuy([])
    // expect(await myNFT.ownerOf(1)).to.be.equal(seller.address)

  });
});



