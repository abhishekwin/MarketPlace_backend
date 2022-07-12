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
const rinkeby_api_key = "K63V19BYNUEP2EEIKIZYE1CGWY85SCRF41"
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {



  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      }
    ],
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/328ff9ac7ccf4b8b98de2b55b4047bd6`,
      accounts: [`0x${Private_Key}`]
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: rinkeby_api_key,
    }
  }
}




//0x3D2b9F0A4A92f976467cd5BA6711E11ED97Ee0Be rinkeby deploy flat
//0xC95DF6Da27b6D28AEFC3438d170e148EEA0e53B6 rinkeby implementaion
//0x8348750544C075b8c1F10d05dE2594FfCe6E3174 rinkeby weth