import { useEffect, useState } from "react";
import { buyNFT, loadNFTs } from "../api/marketplace";
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
      stale = false;
    };
  }, [reload]);

  async function buyNft(nft) {
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
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
