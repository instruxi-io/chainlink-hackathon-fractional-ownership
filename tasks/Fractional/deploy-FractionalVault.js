const { types } = require("hardhat/config")
const { networks } = require("../../networks")
const fs = require('fs-extra');


task("functions-deploy-vault", "Deploys the VaultFunctionsConsumer contract")
  .addOptionalParam("verify", "Set to true to verify client contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    if (network.name === "hardhat") {
      throw Error(
        'This command cannot be used on a local hardhat chain.  Specify a valid network or simulate an VaultFunctionsConsumer request locally with "npx hardhat functions-simulate".'
      )
    }

    console.log(`Deploying VaultFunctionsConsumer contract to ${network.name}`)
    const env = JSON.parse(fs.readFileSync('contracts.json').toString());
    const nftContractAddress = env[network.name].testnet.fractionalNftContractAddress
    const fractionalTokenContractAddress = env[network.name].testnet.fractionalTokenContractAddress
    const priceFeedAddress = process.env.LINK_ETH_PRICE_FEED_FUJI
    const oracleAddress = networks[network.name]["functionsOracleProxy"]

    console.log("\n__Compiling Contracts__")
    await run("compile")

    const vaultContractFactory = await ethers.getContractFactory("VaultFunctionsConsumer")
    const vaultContract = await vaultContractFactory.deploy(nftContractAddress, fractionalTokenContractAddress, priceFeedAddress, oracleAddress)

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        vaultContract.deployTransaction.hash
      } to be confirmed...`
    )
    await vaultContract.deployTransaction.wait(networks[network.name].confirmations)


	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};
	env[hre.network.name].testnet.fractionalVaultContractAddress = vaultContract.address;
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });

    const verifyContract = taskArgs.verify

    if (verifyContract && !!networks[network.name].verifyApiKey && networks[network.name].verifyApiKey !== "UNSET") {
      try {
        console.log("\nVerifying contract...")
        await vaultContract.deployTransaction.wait(Math.max(6 - networks[network.name].confirmations, 0))
        await run("verify:verify", {
          address: vaultContract.address,
          constructorArguments: [nftContractAddress, fractionalTokenContractAddress, priceFeedAddress,oracleAddress],
        })
        console.log("Contract verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log("Error verifying contract.  Delete the build folder and try again.")
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract) {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      )
    }

    const tokenContract = await ethers.getContractAt("FractionalToken",fractionalTokenContractAddress);
    const setVaultTxn = await tokenContract.setVault(vaultContract.address)
    console.log("Set Vault at for token contract", setVaultTxn);
    
    console.log(`\nFractional Vault contract deployed to ${vaultContract.address} on ${network.name}`)
  })















