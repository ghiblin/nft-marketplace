import { useEffect, useState } from "react";
import { buyNFT, loadNFTs } from "../api/marketplace";
import Grid from "../components/grid";
import NFTCard from "../components/nft-card";
import { LoadingStates } from "../utils";

export default function Home() {
  // Using an empty array is much better then using a falsy value (null/undefined)
  const [nfts, setNfts] = useState([]);
  // instead of using a string, we choice to opt in for an enum
  const [loadingState, setLoadingState] = useState(LoadingStates.NotLoaded);
  // After user bought an NFT, we should force a reload of NFTs, so we use a reload state
  // variable in the useEffect dependency array to achieve it
  const [reload, setReload] = useState(0);

  // Fetch NFTs on component mounted
  // TODO: move to useQuery to prevent double fetch with react18 strict mode
  useEffect(() => {
    // We should not use useState when the component is not mounted to prevent memory leak,
    // so we track when the component unmount with this variable
    let stale = false;

    async function fetchNFTs() {
      const nfts = await loadNFTs();
      if (!stale) {
        setNfts(nfts);
        setLoadingState(LoadingStates.Loaded);
      }
    }
    fetchNFTs()
      // we need to catch any error that may araise
      .catch(console.error);

    // invalidate api call
    return function () {
      stale = true;
    };
  }, [reload]);

  async function callBuyNft(nft) {
    try {
      // call Marketplace contract function
      await buyNFT(nft);

      // force NFT array to reload
      setReload(reload + 1);
    } catch (error) {
      // TODO: Notify user in case of error
      console.error("Failed to buy NFT:", error);
    }
  }

  if (loadingState === LoadingStates.Loaded && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <Grid>
      {nfts.map((nft) => (
        <NFTCard
          key={nft.tokenId}
          {...nft}
          onBuy={() => buyNFT(nft)}
          action={
            <button
              className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
              onClick={() => callBuyNft(nft)}
            >
              List
            </button>
          }
        />
      ))}
    </Grid>
  );
}
