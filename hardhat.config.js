require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

require("@nomiclabs/hardhat-web3");

// task action function receives the Hardhat Runtime Environment as second argument
task("accounts", "Prints accounts", async (_, { web3 }) => {
  console.log(await web3.eth.getAccounts());
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const Private_Key =
  "13b110e7ac194d2827d04f17c11726068bb2dc19b595b5a33acaf7fc15604e1b";
const rinkeby_api_key = "K63V19BYNUEP2EEIKIZYE1CGWY85SCRF41";
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
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
      accounts: [`0x${Private_Key}`],
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: rinkeby_api_key,

      
    },
  },
};
