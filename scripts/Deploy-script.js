// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs')

const { ethers, upgrades, network } = require("hardhat");
const { log } = require("console");

async function main() {

  let contractList = [];


   fs.readFile("Deployment/deployed.json",(err,data)=>{
    if (err) console.log(err,"errr");
    console.log("data ......",  JSON.parse(data));
    contractList.push(JSON.parse(data))
  })


  if(network.name === 'localhost'){
// ERC20
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const myToken = await ERC20Token.deploy("1000");

  await myToken.deployed();
  console.log("ERC20Token deployed to:", myToken.address);

  }
 

  //BlackList
  const BlackList = await hre.ethers.getContractFactory("BlackList");
  let blacklist;
  if((contractList[0].blacklist !== "") && (network.name === 'rinkeby')){

    blacklist =   BlackList.attach(contractList[0].blacklist)
    console.log("BlackList already deployed to:",contractList[0].blacklist);
   
  }else{
     blacklist = await BlackList.deploy();
  
    await blacklist.deployed();
    console.log("BlackList deployed to:", blacklist.address);
  }
 
 
   

  // ERC721
  const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
  
  let erc721Token ;
  if((contractList[0].erc721Token !== "") && (network.name === 'rinkeby')){
   
    erc721Token =   ERC721Token.attach(contractList[0].erc721Token)
  
  console.log("ERC721Token already  deployed to:", erc721Token.address);

}else{

  erc721Token = await upgrades.deployProxy(ERC721Token, [500, blacklist.address], {
    initializer: "initialize",
  });
  await erc721Token.deployed();
  console.log("ERC721Token   deployed to:", erc721Token.address);

}

    // MarketPlace
    const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
    let marketPlace;
    if((contractList[0].marketPlace !== "") && (network.name === 'rinkeby')){
      marketPlace =   MarketPlace.attach(contractList[0].marketPlace)
  
  console.log("MarketPlace already  deployed to:", marketPlace.address);

}else{

    marketPlace = await upgrades.deployProxy(MarketPlace, [ blacklist.address], {
      initializer: "initialize",
    });

   
  
    await marketPlace.deployed();
    console.log("MarketPlace deployed to:", marketPlace.address);
  }
   
  //ContractFactory

    signers = await ethers.getSigners();
  const CollectionArray = await ethers.getContractFactory("CollectionArray");
  let collectionArray;
  if ((contractList[0].collectionArray !== "") && (network.name === 'rinkeby')){
   
    collectionArray =   CollectionArray.attach(contractList[0].collectionArray)
  
  console.log("CollectionArray already  deployed to:", collectionArray.address);

}else{
   collectionArray = await CollectionArray.deploy();
  
  await collectionArray.deployed();
  console.log("CollectionArray deployed to:", collectionArray.address);
}

  const ContractFactory = await ethers.getContractFactory("CollectionFactory", {
    signer: signers[0],
    libraries: {
        CollectionArray: collectionArray.address,
    },
  });
  let contractFactory;
  if ((contractList[0].contractFactory !== "") && (network.name === 'rinkeby')){
   
    contractFactory =   ContractFactory.attach(contractList[0].contractFactory)
  
  console.log("ContractFactory already  deployed to:", contractFactory.address);

}else{

  contractFactory = await ContractFactory.deploy(blacklist.address);
  console.log("CollectionFactory deployed to:", contractFactory.address);
}



  if(network.name === 'rinkeby'){
  const contracts = {
    blacklist: blacklist.address,
    collectionArray:collectionArray.address,
    contractFactory:contractFactory.address,
    marketPlace: marketPlace.address,
    erc721Token: erc721Token.address
  }
  
const json = JSON.stringify(contracts)
fs.writeFileSync("Deployment/deployed.json",json )
}

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
