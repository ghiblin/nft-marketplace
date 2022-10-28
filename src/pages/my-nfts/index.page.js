import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadMyNfts } from "../../api/marketplace";
import NFTCard from "../../components/nft-card";
import { LoadingStates } from "../../utils";

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
    console.log("listNFT:", nft);
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === LoadingStates.Loaded && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.tokenId}
              image={nft.image}
              name={nft.name}
              action={
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
