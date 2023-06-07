require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require("./tasks")
require("@nomicfoundation/hardhat-toolbox")
require("hardhat-contract-sizer")
require("@openzeppelin/hardhat-upgrades")
require("hardhat/config")
const { networks } = require("./networks")

// Enable gas reporting (optional)
const REPORT_GAS = process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

module.exports = {
	solidity: {
		compilers: [
		  {
			version: "0.8.7",
			settings: SOLC_SETTINGS,
		  },
		  {
			version: "0.7.0",
			settings: SOLC_SETTINGS,
		  },
		  {
			version: "0.6.6",
			settings: SOLC_SETTINGS,
		  },
		  {
			version: "0.4.24",
			settings: SOLC_SETTINGS,
		  },
		],
	},	
	gasReporter: {
		enabled: REPORT_GAS,
		currency: "USD",
		outputFile: "gas-report.txt",
		noColors: true,
	},
	contractSizer: {
		runOnCompile: false,
		only: ["FractionalVault", "FunctionsConsumer", "AutomatedFunctionsConsumer", "FunctionsBillingRegistry"],
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHERSCAN_TOKEN_ETHEREUM,
			sepolia: process.env.ETHERSCAN_TOKEN_ETHEREUM,
			avalancheFujiTestnet: process.env.ETHERSCAN_TOKEN_AVALANCHE,
			avalancheMainnet: process.env.ETHERSCAN_TOKEN_AVALANCHE,
			polygonMumbai: process.env.ETHERSCAN_TOKEN_POLYGON,	
			polygonMainnet: process.env.ETHERSCAN_TOKEN_POLYGON
		},
	},
	defaultNetwork: 'hardhat',
	networks: {
		...networks
	}
};