const hre = require("hardhat");

async function main() {
  signers = await ethers.getSigners();
  const CollectionArray = await ethers.getContractFactory("CollectionArray");
  const collectionArray = await CollectionArray.deploy();
  await collectionArray.deployed();

  const contractFactory = await ethers.getContractFactory("CollectionFactory", {
    signer: signers[0],
    libraries: {
        CollectionArray: collectionArray.address,
    },
  });
  contract = await contractFactory.deploy();
  console.log("CollectionArray deployed to:", collectionArray.address);
  console.log("CollectionFactory deployed to:", contract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
