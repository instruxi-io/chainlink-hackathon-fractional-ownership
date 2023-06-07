## Isntruxi and ION Digital's Chainlink Hackathon Submission 
### Real World Asset Ownership Fractionalization Powered by Chainlink Functions and Space and Time

[Solution Design and Submission Pack](https://docs.google.com/presentation/d/1xBJLH-ex_KknDGKJCoek4rDco13qPFPQWELAWgcR5T4/edit#slide=id.g247af4fc729_0_90)

Welcome to the repository for the NFT Fractionalization project developed for the Chainlink Hackathon. This project allows users to deposit an NFT into a vault that fetches the fractional reserve associated with the deposited token ID. Here, we provide the necessary instructions and commands to set up and run the stack. Make sure to follow the steps below to get started.

Instruxi Wallet holds 180 Fractional Tokens - https://testnet.snowtrace.io/address/0x39a7a58ee69b0568927110a7342ef771c6d3e21b#tokentxns

ION.au Token - https://testnet.snowtrace.io/address/0xB03DA1512bA44c9F19eb92E8Df492DFcF5bc57c6

IONx Claim NFT - https://testnet.snowtrace.io/address/0x48CE420b9c7aE71785a108b6c89F9Ed03D1bb06D

Vault - https://testnet.snowtrace.io/address/0x7eA0FA09bCf8A01Bf94350a2E7FfEBaf3c7C0b3C

Dashboard - https://query-anywhere-staging.instruxi.dev/

<img src="https://gateway.pinata.cloud/ipfs/QmPSPuTsWDD2nXNhDwAD4nvF3bAB86zenDZ2cLtYDJ1x8v" alt= "fractional-process" width="50%">

Note that Proof of Reserve (PoR) is a future-state integration.

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
Note: Replace ```<vault_address>``` with the actual address of the deployed vault contract.

8. Mint the NFT:
```
npx hardhat functions-mint --network avalancheFuji --tokenid 1
```
Note: Replace ```1``` with the desired token ID.

9. Approve the NFT for deposit:
```
npx hardhat functions-approve --tokenid 1 --network avalancheFuji
```

10. Simulate fractionalization (optional): 
```
npx hardhat functions-simulate --tokenid 1
```

11. Deposit the NFT into the vault:
```
npx hardhat functions-deposit --subid 7 --network avalancheFuji --tokenid 1 --gaslimit 300000
```
   
   Note: Replace ```<subid>``` with the Chainlink Functions subscription ID associated with your wallet. For more information on setting up a Chainlink Functions subscription, follow their tutorial here https://docs.chain.link/chainlink-functions.

That's it! You have now successfully fractionalized the NFT

## Additional Information

Our reporting data model and SxT Cloudflare worker were all also developed for the Chainlink Hackathon

[Configure Cloudflare Workers and Space and Time Integration](https://github.com/instruxi-io/cloudfare-sxt-functions)
Space and Time reporting data model [here](https://github.com/instruxi-io/fractional-token-data-model) and the reporting dashboard [here](https://query-anywhere-staging.instruxi.dev/). 

Hackathon judges can use the temporary username and password to login to the dashboard. Note that you may need to refresh charts manually. Space and Time and Instruxi are working hard to support concurrent JDBC requests. Contact **austin@instruxi.io** with any issues or concerns.

**Username:**  hackathon2023
**Password:**  Hackathon@2023