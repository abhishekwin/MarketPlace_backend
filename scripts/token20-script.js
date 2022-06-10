const hre = require("hardhat");

async function main() {
    const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
    const myToken = await ERC20Token.deploy("1000")

    await myToken.deployed();

    console.log("ERC20Token deployed to:",myToken.address);

}

main()
.then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });