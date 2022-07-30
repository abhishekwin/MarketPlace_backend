const hre = require("hardhat");

async function main() {
  //   if (network !== "rinkeby") {
  const BlackList = await hre.ethers.getContractFactory("BlackList");
  const blacklist = await BlackList.deploy();

  await blacklist.deployed();

  console.log("BlackList deployed to:", blacklist.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//   0x5FbDB2315678afecb367f032d93F642f64180aa3 deployed address
