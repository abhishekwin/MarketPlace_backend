// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { upgrades } = require("hardhat");

async function main() {
  const FlatSale = await hre.ethers.getContractFactory("FlatSale");

  const flatSale = await upgrades.upgradeProxy(
    "0x3D2b9F0A4A92f976467cd5BA6711E11ED97Ee0Be",
    FlatSale
  );
  await flatSale.deployed();
  console.log("FlatSale Updated");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });