const fs = require('fs-extra');

require('dotenv').config();
task("functions-mint", "Mint and set vault functions on smart contracts")
.addParam(
  "tokenid",
  "Token id to fractionalize",

  )
.setAction(async (taskArgs) => {
    if (network.name === "hardhat") {
      throw Error(
        'This command cannot be used on a local hardhat chain.  Specify a valid network or simulate an Fractional NFT request locally with "npx hardhat functions-simulate".'
      )
    }

	const [deployer] = await ethers.getSigners();
	console.log('Minting Token Using:', deployer.address);
	console.log('Account Balance:', (await deployer.getBalance()).toString());

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	const nftContract = await hre.ethers.getContractAt("FractionalNFT", env[hre.network.name].testnet.fractionalNftContractAddress);
	const vaultContract = await hre.ethers.getContractAt("NFTVault", env[hre.network.name].testnet.fractionalVaultContractAddress);
	const tokenContract = await hre.ethers.getContractAt("FractionalToken", env[hre.network.name].testnet.fractionalTokenContractAddress);

//testNFT contract
    console.log("Using contract at address: ",nftContract.address)
    const mintingTxn = await nftContract.mint(taskArgs.tokenid);
    console.log(hre.network.name,'Minted Token Trx Hash:', mintingTxn);

})
