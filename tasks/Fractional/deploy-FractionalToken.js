const { types } = require("hardhat/config")
const { networks } = require("../../networks")
const fs = require('fs-extra');


task("functions-deploy-token", "Deploys the Token contract")
  .addOptionalParam("verify", "Set to true to verify token contract", false, types.boolean)
  .setAction(async (taskArgs) => {

    console.log(`Deploying Token contract to ${network.name}`)
  
    console.log("\n__Compiling Contracts__")
    await run("compile")

    const tokenContractFactory = await ethers.getContractFactory("FractionalToken")
    const tokenContract = await tokenContractFactory.deploy()

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        tokenContract.deployTransaction.hash
      } to be confirmed...`
    )
    await tokenContract.deployTransaction.wait(networks[network.name].confirmations)

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};
	env[hre.network.name].testnet.fractionalTokenContractAddress = tokenContract.address;
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });

    const verifyContract = taskArgs.verify

    if (verifyContract && !!networks[network.name].verifyApiKey && networks[network.name].verifyApiKey !== "UNSET") {
      try {
        console.log("\nVerifying contract...")
        await tokenContract.deployTransaction.wait(Math.max(6 - networks[network.name].confirmations, 0))
        await run("verify:verify", {
          address: tokenContract.address,
          constructorArguments: [],
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

    console.log(`\nFractional token contract deployed to ${tokenContract.address} on ${network.name}`)

  })














