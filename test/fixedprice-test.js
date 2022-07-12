const { expect } = require('chai');
const Web3 = require('web3');
const hre = require('hardhat');
const { ethers } = require('ethers');
let seller, flatSale, web3, buyer, add1, add2,add4, myToken, decimalPrecision = 100;

describe('FlatSale', () => {
  before(async () => {
    web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:8545');

    accounts = await hre.ethers.getSigners();
    [seller, buyer, add1, add2, flatSale, tokenId, add3, add4, _] = accounts;

    // NFT721 Deployed
    let MyNFT = await hre.ethers.getContractFactory("MyNFT");

    myNFT = await upgrades.deployProxy(MyNFT, [500], {
      initializer: "initialize",
    });
    await myNFT.deployed();

    // Weth Deployed
    WETH = await hre.ethers.getContractFactory('WETH');
    weth = await WETH.deploy();
    await weth.deployed();

    //ERC20Token DEPLOYED
    ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
    myToken = await ERC20Token.deploy("10000000000000000000000000")
    await myToken.deployed();

// We get the contract to deploy
    FlatSale = await hre.ethers.getContractFactory('FlatSale');
    flatSale = await upgrades.deployProxy(FlatSale, [], {
      initializer: "initialize",
    });
    await flatSale.deployed();

  });

  describe('lazy buy success cases', () => {
    it('Lazybuy Function', async () => {
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);
      let nonce = 0;
      await weth.connect(buyer).deposit({ value: '1000000000000' });

      await myNFT.connect(seller).setApprovalForAll(flatSale.address, true);

      await weth.connect(buyer).approve(flatSale.address, 2000);

      LAZY = await flatSale
        .connect(buyer)
        .lazyBuy([
          nonce,
          seller.address,
          myNFT.address,
          weth.address,
          '0',
          '400',
          200,
          sign,
          'abhi',
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(buyer.address);
      expect(await myNFT.balanceOf(buyer.address)).to.be.equal(1);
    });
    it('it should buy minted nft with weth', async () => {
      let nonce = 1;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '1', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, buyer.address);
      expect(await flatSale.getSigner(messageHash, sign)).to.be.equal(
        buyer.address
      );

      await weth.connect(add1).deposit({ value: '1000000000000' });

      await myNFT.connect(buyer).setApprovalForAll(flatSale.address, true);

      await weth.connect(add1).approve(flatSale.address, 2000);

      LAZY = await flatSale
        .connect(add1)
        .lazyBuy([
          nonce,
          buyer.address,
          myNFT.address,
          weth.address,
          '1',
          '400',
          200,
          sign,
          'abhi',
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(add1.address);
      expect(await myNFT.balanceOf(add1.address)).to.be.equal(1);
    });
    it('it should buy minted nft with myToken', async () => {
      let nonce = 7;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '1', 'abhi', myToken.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, add1.address);

      await myToken.transfer(add2.address, 10000);

      await myNFT.connect(add1).setApprovalForAll(flatSale.address, true);

      await myToken.connect(add2).approve(flatSale.address, 2000);

      LAZY = await flatSale
        .connect(add2)
        .lazyBuy([
          nonce,
          add1.address,
          myNFT.address,
          myToken.address,
          '1',
          '400',
          200,
          sign,
          'abhi',
        ]);

      expect(await myNFT.ownerOf(1)).to.be.equal(add2.address);
      expect(await myNFT.balanceOf(add2.address)).to.be.equal(1);
    });

  })
  describe('lazzy buy negative cases', () => {
    it('cheaking noncenonce already process', async () => {
      let nonce = 0;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);
      await weth.connect(buyer).deposit({ value: '1000000000000' });

      await myNFT.connect(seller).setApprovalForAll(flatSale.address, true);

      await weth.connect(buyer).approve(flatSale.address, 2000);

      await expect(flatSale
        .connect(buyer)
        .lazyBuy([
          nonce,
          seller.address,
          myNFT.address,
          weth.address,
          '0',
          '400',
          200,
          sign,
          'abhi',
        ])).to.be.revertedWith("FlatSale: nonce already process");
    });
    it('it should checking collection must be approved.', async () => {
      let nonce = 2;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, buyer.address);
      expect(await flatSale.getSigner(messageHash, sign)).to.be.equal(
        buyer.address
      );

      await weth.connect(add1).deposit({ value: '1000000000000' });

      await myNFT.connect(buyer).setApprovalForAll(flatSale.address, false);

      await weth.connect(add1).approve(flatSale.address, 2000);

      await expect(flatSale
        .connect(add1)
        .lazyBuy([
          nonce,
          buyer.address,
          myNFT.address,
          weth.address,
          '0',
          '400',
          200,
          sign,
          'abhi',
        ])).to.be.revertedWith("FlatSale: Collection must be approved.")
    });
    it(' Should Check the token allowance', async () => {
      let nonce = 3;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, add2.address);

      await weth.connect(add1).transfer(add2.address, 1000);
      await myNFT.connect(add2).setApprovalForAll(flatSale.address, true);

      await weth.connect(add1).approve(flatSale.address, 1000);

      await expect(
        flatSale
          .connect(add2)
          .lazyBuy([
            nonce,
            add2.address,
            myNFT.address,
            weth.address,
            '0',
            '400',
            200,
            sign,
            'abhi',
          ])
      ).to.be.revertedWith("FlatSale: Check the token allowance.");
    });
    it(' Should check Insufficient Amount', async () => {
      let nonce = 4;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, ethers.utils.parseEther("100")]
      );
      let messageHash = ethers.utils.keccak256(message);

      let sign = await web3.eth.sign(messageHash, buyer.address);
      expect(await flatSale.getSigner(messageHash, sign)).to.be.equal(
        buyer.address
      );
      await myNFT.connect(buyer).setApprovalForAll(flatSale.address, true);

      await weth.connect(add1).approve(flatSale.address, 2000);

      await expect(flatSale
        .connect(add1)
        .lazyBuy([
          nonce,
          buyer.address,
          myNFT.address,
          weth.address,
          '0',
          '400',
          ethers.utils.parseEther("100"),
          sign,
          'abhi',
        ])
      ).to.be.revertedWith("FlatSale: Insufficient Amount");
    });
    it('cheaking seller sign verification failed', async () => {
      let nonce = 5;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);
      await weth.connect(buyer).deposit({ value: '1000000000000' });

      await myNFT.connect(seller).setApprovalForAll(flatSale.address, true);

      await weth.connect(buyer).approve(flatSale.address, 2000);

      await expect(flatSale
        .connect(buyer)
        .lazyBuy([
          nonce,
          seller.address,
          myNFT.address,
          weth.address,
          '0',
          '400',
          2000,
          sign,
          'abhi',
        ])).to.be.revertedWith("FlatSale: seller sign verification failed");
    });
    it('cheaking invalid signature length', async () => {
      let nonce = 5;
      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '0', 'abhi', weth.address, '200']
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, seller.address);

      await weth.connect(buyer).deposit({ value: '1000000000000' });

      await myNFT.connect(seller).setApprovalForAll(flatSale.address, true);

      await weth.connect(buyer).approve(flatSale.address, 2000);

      await expect(flatSale
        .connect(buyer)
        .lazyBuy([
          nonce,
          seller.address,
          myNFT.address,
          weth.address,
          '0',
          '400',
          2000,
          "0xaa2fe5bd50daa6b9adc22a3aff601f52c3b81649a250106d49e96594e6772264c9bf638289a158113f6def1cccfb7369599039e6221b9d6b5970496431ae3a",
          'abhi',
        ])).to.be.revertedWith("FlatSale: invalid signature length.");
    });
  });
  describe('lazy buy brokerage.', () => {
    it('should check lazy buy brokerage', async () => {
      let amount = ethers.utils.parseEther("1")
      let platFormFeePercent = 250;
    

      let message = ethers.utils.solidityPack(
        ['address', 'uint256', 'string', 'address', 'uint256'],
        [myNFT.address, '1', 'abhi', weth.address, amount]
      );
      let messageHash = ethers.utils.keccak256(message);
      let sign = await web3.eth.sign(messageHash, add2.address);
      let nonce = 9;

      await weth.connect(add4).deposit({ value: amount });
      await myNFT.connect(add2).setApprovalForAll(flatSale.address, true);

      await weth.connect(add4).approve(flatSale.address, amount);
       let oldAmountFlatsale = await weth.balanceOf(flatSale.address)
       let oldAmountSeller = await weth.balanceOf(add2.address)

      LAZY = await flatSale
      .connect(add4)
      .lazyBuy([
        nonce,
        add2.address,
        myNFT.address,
        weth.address,
        '1',
        '400',
        amount,
        sign,
        'abhi',
      ]);
    
      let platFormFee = ((amount.mul(new ethers.BigNumber.from(platFormFeePercent))).div(new ethers.BigNumber.from("100")*decimalPrecision));
      let remaining_amount = amount.sub(platFormFee);
      
      expect(await weth.balanceOf(flatSale.address)).to.be.equal(oldAmountFlatsale.add(platFormFee));

      expect(await weth.balanceOf(add2.address)).to.be.equal(oldAmountSeller.add(remaining_amount));
    
      })
    });
});

