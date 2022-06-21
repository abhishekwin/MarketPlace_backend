require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
const Private_Key = "13b110e7ac194d2827d04f17c11726068bb2dc19b595b5a33acaf7fc15604e1b"
const ropsten_api_key = "K63V19BYNUEP2EEIKIZYE1CGWY85SCRF41"
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
 


  solidity: "0.8.4",
  networks: {
  	ropsten: {
  		url: `https://ropsten.infura.io/v3/328ff9ac7ccf4b8b98de2b55b4047bd6`,
  		accounts: [`0x${Private_Key}`]
  	},
  },
  etherscan: {
    apiKey: {
      ropsten: ropsten_api_key,
    }
  }
}

  

//0x52D9D282A3bA3B4D7cFe68ad385041D24d23B04f  ropsten
// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0   localhost