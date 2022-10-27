import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../build/contracts/NFTMarketplace.json";

/**
 * Utility: retrieve signer from ehters provider
 *
 * @returns {Promise<ethers.providers.JsonRpcSigner>} signer
 */
async function getSigner() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  return signer;
}

/**
 * Utility: retrieve contract for Marketplace
 *
 * @returns {Promise<ethers.Contract>} marketplace contract
 */
async function getContract(readonly = false) {
  // if (readonly) {
  // create a generic provider and query for unsold market items
  const provider = new ethers.providers.JsonRpcProvider();
  // retrieve the deployed contract
  const contract = new ethers.Contract(
    marketplaceAddress,
    NFTMarketplace.abi,
    provider
  );

  return contract;
  // }

  // const signer = await getSigner();
  // const contract = new ethers.Contract(
  //   marketplaceAddress,
  //   NFTMarketplace.abi,
  //   signer
  // );

  // return contract;
}

export async function getMetadata(tokenURI) {
  if (!tokenURI) return;
  const meta = await axios.get(tokenURI);

  return meta.data;
}

async function itemsToNFTs(data, contract) {
  const items = await Promise.all(
    data.map(async (i) => {
      try {
        // retrieve tokenURI for the NFT
        const tokenUri = await contract.tokenURI(i.tokenId);
        // retrieve metadata
        const meta = await getMetadata(tokenUri);

        // convert price to ether
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        // create an object for the NFT
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      } catch (error) {
        // we need to handle error because if any of the promises reject, the result is
        // no longer available, so the whole await expression throws.
        console.error("Failed to retrieve NFT item:", error);
        return null;
      }
    })
  );

  // we filter the NFT for which we handle an error
  return items.filter((item) => item !== null);
}

export async function loadNFTs() {
  const contract = await getContract(true);

  // call fetchMaketItems on deployed contract
  const data = await contract.fetchMarketItems();

  // convert data into a list of items
  const nfts = await itemsToNFTs(data, contract);

  return nfts;
}

export async function loadMyNfts() {
  const contract = await getContract(true);

  // call fetchMyNFTs on deployed contract
  const data = await contract.fetchMyNFTs();

  // convert data into a list of items
  const nfts = await itemsToNFTs(data, contract);

  return nfts;
}

export async function loadListedNfts() {
  const contract = await getContract(true);

  // call fetchItemsListed on deployed contract
  const data = await contract.fetchItemsListed();

  // convert data into a list of items
  const nfts = await itemsToNFTs(data, contract);

  return nfts;
}

export async function buyNFT(nft) {
  const contract = await getContract();

  // user will be prompted to pay the asking proces to complete the transaction
  const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
  const transaction = await contract.createMarketSale(nft.tokenId, {
    value: price,
  });
  await transaction.wait();
}

export async function createToken(tokenURI, price) {
  const contract = await getContract();

  // convert price in ethers
  price = ethers.utils.parseUnits(price, "ether");

  // retrieve listing price from contract
  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();

  // call method
  const transaction = await contract.createToken(tokenURI, price, {
    value: listingPrice,
  });
  // wait for transaction to complete
  await transaction.wait();
}

export async function resellToken(id, price) {
  if (!price) return;

  const contract = await getContract();
  const priceFormatted = ethers.utils.parseUnits(price, "ether");
  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();

  // resell NFT
  const transaction = await contract.resellToken(id, priceFormatted, {
    value: listingPrice,
  });
  await transaction.wait();
}