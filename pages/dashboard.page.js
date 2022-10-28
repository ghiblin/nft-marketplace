import { useEffect, useState } from "react";
import { loadListedNfts } from "../api/marketplace";
import { LoadingStates } from "../utils";

export default function Dashboard() {
  // Using an empty array is much better then using a falsy value (null/undefined)
  const [nfts, setNfts] = useState([]);
  // instead of using a string, we choice to opt in for an enum
  const [loadingState, setLoadingState] = useState(LoadingStates.NotLoaded);

  useEffect(() => {
    // We should not use useState when the component is not mounted to prevent memory leak,
    // so we track when the component unmount with this variable
    let stale = false;

    async function fetchNFTs() {
      const nfts = await loadListedNfts();
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
  }, []);

  if (loadingState === LoadingStates.Loaded && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>;
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Listed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
