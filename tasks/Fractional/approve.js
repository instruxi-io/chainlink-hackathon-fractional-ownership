const fs = require('fs-extra');

require('dotenv').config();
task("functions-approve", "Approve the vault contract on the NFT Contract")
.addParam(
  "tokenid",
  "Token id",

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

    console.log("Using contract at address: ",nftContract.address)
    console.log("Setting approval for vault address: ", vaultContract.address);
    const setApprovalTxn = await nftContract.approve(vaultContract.address, taskArgs.tokenid);
    console.log("Set approval txn: ", setApprovalTxn);
})
