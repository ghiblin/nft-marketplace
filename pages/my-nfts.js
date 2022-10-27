import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadMyNfts } from "../api/marketplace";
import { LoadingStates } from "../utils";

export default function MyNFTS() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(LoadingStates.NotLoaded);
  // use router for programmatically redirect to resell-nft page
  const router = useRouter();
  // Fetch user NFTs
  useEffect(() => {
    // We should not use useState when the component is not mounted to prevent memory leak,
    // so we track when the component unmount with this variable
    let stale = false;

    async function fetchNFTs() {
      const nfts = await loadMyNfts();
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

  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === LoadingStates.Loaded && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
