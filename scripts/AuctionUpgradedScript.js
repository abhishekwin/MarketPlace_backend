// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { upgrades } = require("hardhat");

async function main() {
  const Auction = await hre.ethers.getContractFactory("Auction");

  const auction     = await upgrades.upgradeProxy(
    "0xFbBe1373998230182ed22534215c70EE501A2fe5",
    Auction
  );
  await auction.deployed();
  console.log("Auction Updated");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });