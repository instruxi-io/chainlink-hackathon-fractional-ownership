// All supported networks and related contract addresses are defined here.
//
// LINK token addresses: https://docs.chain.link/resources/link-token-contracts/
// Price feeds addresses: https://docs.chain.link/data-feeds/price-feeds/addresses
// Chain IDs: https://chainlist.org/?testnets=true

require("@chainlink/env-enc").config()

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2
const SHARED_DON_PUBLIC_KEY =
  "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c"

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

const accounts = process.env.NEXT_PRIVATE_KEY !== undefined ? [process.env.NEXT_PRIVATE_KEY] : [];

const chainIds = {
  	goerli: 5,
	sepolia: 11155111, 
	polygon: 137,
	mumbai: 80001,
	hardhat: 1337,
	kovan: 42,
	mainnet: 1,
	rinkeby: 4,
	ropsten: 3,
	edge: 808080,
	avalanche: 43114,
	fuji: 43113
};

const networks = {
		hardhat: {},
		ethereum: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_ETHEREUM,
			chainId: chainIds['mainnet'],
			accounts,
		},
		avalanche: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_AVALANCHE,
			chainId: chainIds['avalanche'],
			accounts,
			allowUnlimitedContractSize: true,
		},
		fuji: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_FUJI,
			chainId: chainIds['fuji'],
			accounts,
		},
		polygon: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_POLYGON,
			chainId: chainIds['polygon'],
			accounts,
		},
		mumbai: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_MUMBAI,
			chainId: chainIds['mumbai'],
			accounts,
		},
		sepolia: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_SEPOLIA,
			chainId: chainIds['sepolia'],
			accounts,
		},
		ethereumSepolia: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_SEPOLIA || "UNSET",
			gasPrice: undefined,
			accounts,
			verifyApiKey: process.env.ETHERSCAN_TOKEN_ETHEREUM || "UNSET",
			chainId: 11155111,
			confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
			nativeCurrencySymbol: "ETH",
			linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
			linkPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
			functionsOracleProxy: "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC",
			functionsBillingRegistryProxy: "0x3c79f56407DCB9dc9b852D139a317246f43750Cc",
			functionsPublicKey: SHARED_DON_PUBLIC_KEY,
		  },
		  polygonMumbai: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_MUMBAI || "UNSET",
			gasPrice: undefined,
			accounts,
			verifyApiKey: process.env.ETHERSCAN_TOKEN_POLYGON || "UNSET",
			chainId: 80001,
			confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
			nativeCurrencySymbol: "MATIC",
			linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
			linkPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528", // LINK/MATIC
			functionsOracleProxy: "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4",
			functionsBillingRegistryProxy: "0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039",
			functionsPublicKey: SHARED_DON_PUBLIC_KEY,
		  },
		  avalancheFuji: {
			url: process.env.NEXT_PUBLIC_WEB3_BASE_URL_FUJI || "UNSET",
			gasPrice: undefined,
			accounts: process.env.NEXT_PRIVATE_KEY !== undefined ? [process.env.NEXT_PRIVATE_KEY] : [],
			verifyApiKey: process.env.ETHERSCAN_TOKEN_AVALANCHE || "UNSET",
			chainId: 43113,
			confirmations: 2 * DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
			nativeCurrencySymbol: "AVAX",
			linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
			linkPriceFeed: "0x79c91fd4F8b3DaBEe17d286EB11cEE4D83521775", // LINK/AVAX
			functionsOracleProxy: "0xE569061eD8244643169e81293b0aA0d3335fD563",
			functionsBillingRegistryProxy: "0x452C33Cef9Bc773267Ac5F8D85c1Aca2bA4bcf0C",
			functionsPublicKey: SHARED_DON_PUBLIC_KEY,
		  },
}

module.exports = {
  networks,
  SHARED_DON_PUBLIC_KEY,
}
