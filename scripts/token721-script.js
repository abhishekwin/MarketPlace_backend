const hre = require("hardhat");

async function main() {
    const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
    const myToken = await ERC721Token.deploy()

    await myToken.deployed();

    console.log("ERC721Token deployed to:",myToken.address);

}

main()
.then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
