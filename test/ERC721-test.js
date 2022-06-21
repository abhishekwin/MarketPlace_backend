const { expect } = require("chai");
let deployer, add1, add2, myNFT, tokenId;

describe("MyNFT", () => {
  before(async () => {
    accounts = await ethers.getSigners();
    [deployer, add1, add2, add3, add4, add5, _] = accounts;

    //Deployed Token
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy("500");
    await myNFT.deployed();

    console.log("MyNFT deployed to:", myNFT.address);
  });

  describe("Setter Methods ", () => {
    it("Should check that Maximum Royalty is ", async () => {
      expect(await myNFT.maximumRoyality()).to.be.equals(500);
    });

    it("Should check that NFT is mint ", async () => {
      await myNFT.mint(deployer.address, "hello world", 400);
      expect(await myNFT.ownerOf(1)).to.be.equal(deployer.address);
    });

    it("Should check that royality", async () => {
      await expect(
        myNFT.mint(deployer.address, "hello world", 600)
      ).to.be.revertedWith("Royality should be less");
    });

    it("Should check that Address", async () => {
      await expect(
        myNFT.mint(
          "0x0000000000000000000000000000000000000000",
          "hello world",
          400
        )
      ).to.be.revertedWith("Token contract: to address can't be 0x0");
    });
  });

  describe(" transferFrom Method ", () => {
    it("Should transfer token betwen accounts", async () => {
      await myNFT
        .connect(deployer)
        .transferFrom(deployer.address, add1.address, 1);
      const add1balance = await myNFT.balanceOf(add1.address);
      console.log("balance", add1balance);
    });
  });

  describe("balanceOf Method ", () => {
    it("Should return balance of the acoount", async () => {
      const abc = await myNFT.balanceOf(add1.address);
      console.log("balance", abc);
    });
    
  });

  describe("approve Method ", () => {
    it("Should approve the account", async () => {
      await myNFT.connect(add1).approve(add2.address, 1);

      expect(await myNFT.getApproved(1)).to.be.equal(add2.address);
    });

    it("Should check account not approve", async () => {
      await expect(myNFT.approve(add1.address, 1)).to.be.revertedWith(
        "ERC721: approval to current owner"
      );
    });
  });

  describe("setApprovalForAll Method ", () => {
    it("Should Approved for all", async () => {
      await myNFT.setApprovalForAll(add2.address, true);
      expect(
        await myNFT.isApprovedForAll(deployer.address, add2.address)
      ).to.be.equal(true);
    });
  });

  describe("Checking that getApproved function", () => {
    it("Should check tokenId address", async () => {
      await expect(myNFT.connect(add1.address).getApproved(2)).to.be.revertedWith("ERC721: approved query for nonexistent token")

    });
    })
  })
