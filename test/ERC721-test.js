const { expect } = require("chai");

describe("MyNFT", () => {
  let deployer, add1, add2, add3, add4, add5;
  let myNFT;
  before(async () => {
    accounts = await ethers.getSigners();
    [deployer, add1, add2, add3, add4, add5, _] = accounts;

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy("500");

    await myNFT.deployed();

    console.log("MyNFT deployed to:", myNFT.address);
  });

  describe("Checking Royality", () => {
    it("Should check that Maximum Royalty is ", async () => {

      expect(await myNFT.maximumRoyality()).to.be.equals(500);
    });
  });

  describe("Cheking  mint function ", () => {
    it("Should check that NFT is mint ", async () => {
      await myNFT.mint(deployer.address, "hello world", 400);
      expect(await myNFT.ownerOf(1)).to.be.equal(deployer.address);
    });
  });

  describe("Cheking  mint function ", () => {
    it("Should check that royality", async () => {
      
     await expect(myNFT.mint(deployer.address, "hello world", 600)).to.be.revertedWith('Royality should be less');
    });
  });

  describe("Cheking  mint function ", () => {
    it("Should check that Address", async () => {
      
     await expect(myNFT.mint("0x0000000000000000000000000000000000000000", "hello world", 400)).to.be.revertedWith("Token contract: to address can't be 0x0");
    });
  });

  

  describe("Checking that transferFrom function is working or not", () => {
    it("Should transfer token betwen accounts", async () => {
      await myNFT
        .connect(deployer)
        .transferFrom(deployer.address, add1.address, 1);
      const add1balance = await myNFT.balanceOf(add1.address);
      console.log("balance", add1balance);
      // expect( await myNFT.balanceOf(add1balance)).to.be.equal(1);
    });
  });

  // describe("Checkinhg transfer negative", () =>{
  //   it("Should check the token is transfer or not", async ()=>{
  //     await expect(myNFT.transferFrom(deployer.address,add1.address,1)).to.be.revertedWith("ERC721: transfer caller is not owner napproved");
  //   });
  // });



 



  describe("Checking that balanceOf function", () => {
    it("Should return balance of the acoount", async () => {
      const abc = await myNFT.balanceOf(add1.address);
      console.log("balance", abc);
      //expect( await myNFT.balanceOf(deployer.address)).to.be.equal(deployer.address);
    });
  });

 

  describe("Checking that approve function", () => {
    it("Should approve the account", async () => {
      await myNFT.connect(add1).approve(add2.address, 1);

      expect(await myNFT.getApproved(1)).to.be.equal(add2.address);
    });
  });

  describe("Checking that negative type", () => {
    it("Should check account not approve", async () => {
      await expect (myNFT.approve(add1.address,1)).to.be.revertedWith('ERC721: approval to current owner')
    });
  });

  
  

  describe("Checking that setApprovalForAll function", () => {
    it("Should Approved for all", async () => {
      await myNFT.setApprovalForAll(add2.address, true);
      expect(
        await myNFT.isApprovedForAll(deployer.address, add2.address)
      ).to.be.equal(true);
    });
  });

 
});
