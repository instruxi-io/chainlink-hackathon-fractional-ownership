const { types } = require("hardhat/config")
const { networks } = require("../../networks")
const fs = require('fs-extra');

require('dotenv').config();
task("functions-withdraw", "Withdraw tokenid from vault back to owner")
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
	console.log('Withdrawing Token Using:', deployer.address);
	console.log('Account Balance:', (await deployer.getBalance()).toString());

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	const vaultContract = await hre.ethers.getContractAt("NFTVault", env[hre.network.name].testnet.fractionalVaultContractAddress);


//testNFT contract
    console.log("Using contract at address: ",vaultContract.address)
    const withdrawTxn = await vaultContract.withdrawNFT(taskArgs.tokenid);
    console.log("Withdrew to this address: ",deployer.address)
    console.log(hre.network.name,'Withdraw Token Trx Hash:', withdrawTxn);
})
