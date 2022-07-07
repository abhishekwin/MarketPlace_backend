const { expect } = require('chai');
const Web3 = require('web3');
const hre = require('hardhat');
const { ethers } = require('ethers');
let seller, flatSale, web3, buyer, add1, add2, tokenId;

describe('FlatSale', () => {
  before(async () => {
    web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:8545');

    accounts = await hre.ethers.getSigners();
    [seller, buyer, add1, add2, flatSale, tokenId, add3, _] = accounts;

    // NFT721 Deployed
    MyNFT = await hre.ethers.getContractFactory('MyNFT');
    myNFT = await MyNFT.deploy(500);
    await myNFT.deployed();
    // console.log('MyNFT deployed to:', myNFT.address);

    // Weth Deployed
    WETH = await hre.ethers.getContractFactory('WETH');
    weth = await WETH.deploy();
    await weth.deployed();
    // console.log('WETH deployed to:', weth.address);

    //SANJU DEPLOYED
    SANJU = await hre.ethers.getContractFactory('SANJU');
    sanju = await SANJU.deploy();
    await sanju.deployed();
    // console.log('SANJU deployed to:', sanju.address);

    //Deployed Token
    let FlatSale = await hre.ethers.getContractFactory('FlatSale');
    flatSale = await FlatSale.deploy();
    await flatSale.deployed();
    // console.log('FlatSale deployed to:', flatSale.address);
  });

  describe('lazy buy success cases', () => {
    it('Lazybuy Function', async () => {
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);
      const getMessageHash = await flatSale.getEthSignedMessageHash(
        messageHash
      );
      let sign = await web3.eth.sign(getMessageHash, accounts[0].address);
      await weth.connect(buyer).deposit({ value: '1000000000000' });

      await weth.connect(buyer).approve(flatSale.address, 2000);

      const LAZY = await flatSale
        .connect(buyer)
        .lazyBuy([
          seller.address,
          myNFT.address,
          weth.address,
          '0',
          '2500',
          200,
          sign,
          'abhi',
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(buyer.address);
      expect(await myNFT.balanceOf(buyer.address)).to.be.equal(1);
    });
    // it('Mint With Different Token', async () => {
    //   let message = ethers.utils.solidityPack(
    //     ['address', 'uint256', 'string', 'address', 'uint256'],
    //     [myNFT.address, '0', 'abhi', sanju.address, '200']
    //   );
    //   let messageHash = ethers.utils.keccak256(message);
    //   const getMessageHash = await flatSale.getEthSignedMessageHash(
    //     messageHash
    //   );
    //   let sign = await web3.eth.sign(getMessageHash, accounts[0].address);

    //   expect(await flatSale.getSigner(getMessageHash, sign)).to.be.equal(
    //     seller.address
    //   );

    //   await sanju.connect(buyer).deposit({ value: '1000000000000' });

    //   await sanju.connect(buyer).approve(flatSale.address, 2000);

    //   const LAZY = await flatSale
    //     .connect(buyer)
    //     .lazyBuy([
    //       seller.address,
    //       myNFT.address,
    //       sanju.address,
    //       '0',
    //       '2500',
    //       200,
    //       sign,
    //       'abhi',
    //     ]);

    //   expect(await myNFT.ownerOf(2)).to.be.equal(buyer.address);
    //   expect(await myNFT.balanceOf(buyer.address)).to.be.equal(2);
    // });
    // it('it should buy minted nft with weth', async () => {
    //   let message = ethers.utils.solidityPack(
    //     ['address', 'uint256', 'string', 'address', 'uint256'],
    //     [myNFT.address, '1', 'abhi', weth.address, '200']
    //   );
    //   let messageHash = ethers.utils.keccak256(message);
    //   const getMessageHash = await flatSale.getEthSignedMessageHash(
    //     messageHash
    //   );
    //   let sign = await web3.eth.sign(getMessageHash, accounts[1].address);

    //   await weth.connect(buyer).transfer(add2.address, 100000);

    //   await myNFT.connect(buyer).approve(flatSale.address, 1);

    //   await weth.connect(add2).approve(flatSale.address, 2000);

    //   const lazyy = await flatSale
    //     .connect(add2)
    //     .lazyBuy([
    //       buyer.address,
    //       myNFT.address,
    //       weth.address,
    //       '1',
    //       '2500',
    //       200,
    //       sign,
    //       'abhi',
    //     ]);

    //   expect(await myNFT.ownerOf(1)).to.be.equal(add2.address);
    // });
    // it('it should buy minted nft with Sanju', async () => {
    //   let message = ethers.utils.solidityPack(
    //     ['address', 'uint256', 'string', 'address', 'uint256'],
    //     [myNFT.address, '2', 'abhi', sanju.address, '200']
    //   );
    //   let messageHash = ethers.utils.keccak256(message);
    //   const getMessageHash = await flatSale.getEthSignedMessageHash(
    //     messageHash
    //   );
    //   let sign = await web3.eth.sign(getMessageHash, accounts[1].address);
    //   await sanju.connect(buyer).transfer(add2.address, 100000);
    //   await myNFT.connect(buyer).approve(flatSale.address, 2);

    //   await sanju.connect(add2).approve(flatSale.address, 2000);

    //   const LAZY = await flatSale
    //     .connect(add2)
    //     .lazyBuy([
    //       buyer.address,
    //       myNFT.address,
    //       sanju.address,
    //       '2',
    //       '2500',
    //       200,
    //       sign,
    //       'abhi',
    //     ]);

    //   expect(await myNFT.ownerOf(2)).to.be.equal(add2.address);
    //   expect(await myNFT.balanceOf(add2.address)).to.be.equal(2);
    // });
  });
  // describe('lazzy buy negative cases', () => {

  //   it(' buyer does not have enough token to buy nft', async () => {
  //     let message = ethers.utils.solidityPack(
  //       ['address', 'uint256', 'string', 'address', 'uint256'],
  //       [myNFT.address, '2', 'abhi', sanju.address, '200']
  //     );
  //     let messageHash = ethers.utils.keccak256(message);
  //     const getMessageHash = await flatSale.getEthSignedMessageHash(
  //       messageHash
  //     );
  //     let sign = await web3.eth.sign(getMessageHash, add2.address);
  //     await sanju.connect(add2).transfer(add1.address, 200);
  //     await myNFT.connect(add2).approve(flatSale.address, 2);

  //     await sanju.connect(add1).approve(flatSale.address, 200);
  //     console.log(await flatSale.verifySellerSign(add2.address, '2', 'abhi', '200', sanju.address, myNFT.address, sign), add2.address)

  //     await expect(
  //       flatSale
  //         .connect(add1)
  //         .lazyBuy([
  //           add2.address,
  //           myNFT.address,
  //           sanju.address,
  //           '2',
  //           '2500',
  //           2000,
  //           sign,
  //           'abhi',
  //         ])
  //     ).to.be.revertedWith('Insufficient Amount');
  //   });
  //   it(' Should check the token allowance', async () => {
  //     let message = ethers.utils.solidityPack(
  //       ['address', 'uint256', 'string', 'address', 'uint256'],
  //       [myNFT.address, '2', 'abhi', sanju.address, '200']
  //     );
  //     let messageHash = ethers.utils.keccak256(message);
  //     const getMessageHash = await flatSale.getEthSignedMessageHash(
  //       messageHash
  //     );
  //     let sign = await web3.eth.sign(getMessageHash, add2.address);

  //     await sanju.connect(add2).transfer(add1.address, 50000);
  //     await myNFT.connect(add2).approve(flatSale.address, 2);

  //     await expect(
  //       flatSale
  //         .connect(add1)
  //         .lazyBuy([
  //           add2.address,
  //           myNFT.address,
  //           sanju.address,
  //           '2',
  //           '2500',
  //           2000,
  //           sign,
  //           'abhi',
  //         ])
  //     ).to.be.revertedWith('Check the token allowance.');
  //   });
  //   it(' Should check account not approve', async () => {
  //     let message = ethers.utils.solidityPack(
  //       ['address', 'uint256', 'string', 'address', 'uint256'],
  //       [myNFT.address, '2', 'abhi', sanju.address, '200']
  //     );
  //     let messageHash = ethers.utils.keccak256(message);
  //     const getMessageHash = await flatSale.getEthSignedMessageHash(
  //       messageHash
  //     );
  //     let sign = await web3.eth.sign(getMessageHash, add2.address);

  //     await sanju.connect(add2).transfer(add1.address, 30000);
  //     await myNFT.connect(add2).approve(add1.address, 2);

  //     await sanju.connect(add1).approve(add2.address, 2000);

  //     await expect(
  //       flatSale
  //         .connect(add1)
  //         .lazyBuy([
  //           add2.address,
  //           myNFT.address,
  //           sanju.address,
  //           '2',
  //           '2500',
  //           2000,
  //           sign,
  //           'abhi',
  //         ])
  //     ).to.be.revertedWith('address not approve');
  //   });
  //   it(' seller sign verification failed', async () => {
  //     let message = ethers.utils.solidityPack(
  //       ['address', 'uint256', 'string', 'address', 'uint256'],
  //       [myNFT.address, '2', 'abhi', sanju.address, '200']
  //     );
  //     const signer = accounts[3]
  //     let messageHash = ethers.utils.keccak256(message);
  //     const getMessageHash = await flatSale.getEthSignedMessageHash(
  //       messageHash
  //     );
  //     const sign = await signer.signMessage(ethers.utils.arrayify(messageHash))
  //     // let sign = await web3.eth.sign(getMessageHash, buyer.address);

  //     await sanju.connect(add2).transfer(add1.address, 200);
  //     await myNFT.connect(add2).approve(flatSale.address, 2);

  //     await sanju.connect(add1).approve(flatSale.address, 200);
  //     expect(await flatSale.getSigner(getMessageHash, sign)).to.be.equal(
  //       add2.address
  //     );
  //     // await expect(
  //     //   flatSale
  //     //     .connect(add1)
  //     //     .lazyBuy([
  //     //       add2.address,
  //     //       myNFT.address,
  //     //       sanju.address,
  //     //       '2',
  //     //       '2500',
  //     //       2000,
  //     //       sign,
  //     //       'abhi',
  //     //     ])
  //     // ).to.be.revertedWith("seller sign verification failed");
  //   });
  // });
});

