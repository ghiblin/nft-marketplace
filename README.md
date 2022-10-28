# Simple NFT Marketplace

This is a small DApp project that show you how to setup a small Marketplace to create and sell NFTs. To implement it, I used:

- [Solidity](https://docs.soliditylang.org/en/v0.8.14/): the principal language used to develop Smart Contracts
- [Open Zeppelin](https://www.openzeppelin.com/): a battle-tested suite to develop your Smart Contracts
- [Truffle Suite](https://trufflesuite.com/): a suite of tools for Smart Contract development
- [Ganache](https://trufflesuite.com/ganache/): a local personal Blockchain used to deploy and test your Smart Contracts
- [Infura](https://infura.io/): the Web3 backend Infrastructure-as-a-Service that allow your to interact with multiple blockchains and IPFS
- [NextJS](https://nextjs.org/): a ReactJS-based framework that allows your quickly develop web applications
- and much more.

## Before to begin

You will need an Infura account to uplaod NFT images and Metadata to IPFS. As the Infura IPFS public gateway was deprecated on August 10, 2022 and is no longer accessible, you need to use [dedicated gateways](https://docs.infura.io/infura/networks/ipfs/how-to/access-ipfs-content/dedicated-gateways) and that requires you enter a Credit Card in your profile, but don't worry: Infura give you a 5GB free IPFS storage, quite enough to start and experiment with your project.

## Disclaimer

This project is not _production ready_, and it uses your Project ID and your API Secret in order to upload images and metadata on IPFS through `ipfs-http-client` from the end user's browser (check `./src/api/ipfs.js`), so that secret will be in the final bundle (if you don't trust me, try to build your project with `npm run build` and look for your API secret).

If you want a more secure solution, you can create an API endpoint in order to call Infura IPFS API and not reveal your secrets.

## Setup the project

### 1. Installation

Start by cloning this repo:

```bash
  git clone https://github.com/ghiblin/nft-marketplace.git
```

Go to the project directory

```bash
  cd nft-marketplace
```

Install dependencies

```bash
  npm install
```

### 2. Environment Variables

If you don't already have one, create an Infura account follow the instruction in the [official documentation](https://docs.infura.io/infura/getting-started) and create a new IPFS project.

Setup your .env file:

```
INFURA_IPFS_PROJECT_ID=<your Infura IPFS Project ID>
INFURA_IPFS_API_SECRET=<your Infura IPFS API Secret>
INFURA_IPFS_SUBDOMAIN=<Your subdomani>
```

### 3. Run the project

Before to run any code, you need to compile the Smart Contracts and deploy it on your Ganache client.

Run your Ganache client:

```bash
  ganache
```

Compile and deploy the Smart Contracts:

```bash
  npm run deploy
```

Start your development environment:

```bash
  npm run dev
```

Pay attention: this command will start a Ganache instance, so you can:

- stop your previous instance
- start only the frontend through:

```bash
  npm run dev:next
```
