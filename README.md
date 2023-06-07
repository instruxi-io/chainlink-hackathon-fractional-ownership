# Chainlink Hackathon - NFT Fractionalization Powered by Chainlink Functions and Space and Time

Welcome to the repository for the NFT Fractionalization project developed for the Chainlink Hackathon. This project allows you to deposit an NFT into a vault that fetches the total fractional reserve associated with the deposited token. Here, we provide the necessary instructions and commands to set up and run the stack. Make sure to follow the steps below to get started.

## Prerequisites

Before proceeding, ensure that you have the following set up:

- Node.js and npm (Node Package Manager) installed on your machine.

## Installation and Setup

1. Clone this repository to your local machine:
	```
	git clone <repository_url>
	```

2. Change into the project's directory:
	```
	cd <project_directory>
	```

3. Install project dependencies using npm:
	```
	npm install
	```

## Usage

Follow the steps below to fractionalize an NFT and interact with the system:

4. Deploy the NFT smart contract:
	```
	npx hardhat functions-deploy-NFT --verify true --network avalancheFuji
	```

5. Deploy the token contract:
	```
	npx hardhat functions-deploy-token --verify true --network avalancheFuji
	```

6. Deploy the vault contract:
	```
	npx hardhat functions-deploy-vault --verify true --network avalancheFuji
	```

7. Add a subscription to the vault contract:
	```
	npx hardhat functions-sub-add --contract <vault_address> --subid 7 --network avalancheFuji
	```
	Note: Replace `<vault_address>` with the actual address of the deployed vault contract.

8. Mint the NFT:
	```
	npx hardhat functions-mint --network avalancheFuji --tokenid 1
	```
	Note: Replace `1` with the desired token ID.

9 Approve the NFT for deposit:
	```
	npx hardhat functions-approve --tokenid 1 --network avalancheFuji
	```

10. Simulate and calculate fractional reserve:
	a. Simulate fractionalization (optional):
   ```
   npx hardhat functions-simulate --tokenid 1
   ```
	b. Deposit the NFT into the vault:
   ```
   npx hardhat functions-deposit --subid 7 --network avalancheFuji --tokenid 1 --gaslimit 300000
   ```
   Note: Replace `<subid>` with the Chainlink Functions subscription ID associated with your wallet. For more information on setting up a Chainlink Functions subscription, follow their tutorial here https://docs.chain.link/chainlink-functions.

That's it! You have now successfully fractionalized the NFT

## Additional Information

Our reporting data model and SxT Cloudflare worker were all also developed for the Chainlink Hackathon

Configure Cloudflare Workers and Space and Time Integration: https://github.com/instruxi-io/cloudfare-sxt-functions
Space and Time reporting data model here https://github.com/instruxi-io/fractional-token-data-model and the reporting dashboard here https://query-anywhere-staging.instruxi.dev/. 

Hackathon judges can use the temporary username and password to login to the dashboard

**Username:**  hackathon2023
**Password:**  hackathon2023


  
