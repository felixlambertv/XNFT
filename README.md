# XNFT

Basic ERC721 (NFT) using hardhat framework </br>
Deployed here https://sepolia.etherscan.io/address/0x6bB7fED4bFF9f9ED211DD02Ed97d4ADf796b7Af4 (Already verified)

## Features

- ERC721 contract with minting and whitelist minting functionality
- Whitelist verification using OpenZeppelin MerkleProof
- Custom tasks for minting and transferring tokens

### Prerequisites

- Node.js
- Yarn or npm

### Installation

1. Clone the repository:

```shell
   git clone https://github.com/felixlambertv/XNFT
   cd XNFT
```

2. Install dependencies:

```shell
   npm install
```

3. Set env:

```shell
   npm run setVars SEPOLIA_API_KEY
   npm run setVars ETHERS_API_KEY
   npm run setVars DEPLOYER_PRIVATE_KEY
```

### Running the Project

```shell
  npm run start
```

### Custom Tasks (For easier testing all task transaction made by admin account)

- **Mint NFT:**

```shell
  npx hardhat mint --network <network> --mint-to <address>
```

- **Transfer NFT:**

```shell
  npx hardhat transfer --network <network> --nft-id <id> --transfer-to <address>
```

- **Whitelist Mint:** (Just passing user address, in behind we generate proof based on the address)

```shell
  npx hardhat whitelistMint --network <network> --user-address <address>
```

### Deployment

```shell
  npm run deploy --network <network> ignition/modules/XNFT.ts --deployment-id <generatedFolderName>
```

If we didnt passing `--deployment-id` than hardhat ignition will create based on the Chain ID

## Example Commands

- **Mint NFT:**

```shell
  npx hardhat mint --network sepolia --mint-to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

- **Transfer NFT:**

```shell
  npx hardhat transfer --network sepolia --nft-id 1 --transfer-to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

- **Whitelist Mint:**

```shell
  npx hardhat whitelistMint --network sepolia --user-address 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

- **Deploy to Sepolia**

```shell
  npm run deploy --network sepolia ignition/modules/XNFT.ts --deployment-id sepolia
```

## Improved

- Use OpenZeppelin MerkleProof to verify the whitelist proof. (More reliable).
- Remove `balanceOf` and `_balances` as they are already handled by ERC721.
- Add a flag to track users who have already minted using the whitelist.

## What can be Improved

- Set the token URI for your NFTs and store the assets on IPFS.
- Move the whitelist minting functionality to a separate contract for better modularity.
- For `whitelistMint` no need to pass address param, so only the user can mint their own whitelist NFT.
