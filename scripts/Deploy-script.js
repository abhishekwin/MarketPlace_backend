// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, upgrades, network } = require("hardhat");

async function main() {


  if(network !== 'rinkeby'){
// ERC20
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const myToken = await ERC20Token.deploy("1000");

  await myToken.deployed();

  console.log("ERC20Token deployed to:", myToken.address);

  }

  // ERC721
  const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
  const erc721Token = await upgrades.deployProxy(ERC721Token, [500], {
    initializer: "initialize",
  });

  await erc721Token.deployed();
  console.log("ERC721Token deployed to:", erc721Token.address);

    // MarketPlace
    const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
    const marketPlace = await upgrades.deployProxy(MarketPlace, [], {
      initializer: "initialize",
    });
  
    await flatSale.deployed();
    console.log("MarketPlace deployed to:", marketPlace.address);
  
  
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
