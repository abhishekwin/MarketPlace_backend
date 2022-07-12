// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { upgrades } = require("hardhat");

async function main() {
  const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");

  const erc721Token = await upgrades.upgradeProxy(
    "0x4d1FC9702Df160A5f91ba968FC084fb014112649",
    ERC721Token
  );
  await erc721Token.deployed();
  console.log("ERC721Token Updated");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
