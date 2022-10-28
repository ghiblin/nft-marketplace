import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMetadata, resellToken } from "../api/marketplace";

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    let stale = false;
    async function fetchMetadata(uri) {
      const meta = await getMetadata(uri);

      if (!stale) {
        updateFormInput((state) => ({
          ...state,
          image: meta.image,
        }));
      }
    }

    fetchMetadata(tokenURI).catch(console.error);

    return function () {
      stale = true;
    };
  }, [tokenURI]);

  async function listNFTForSale() {
    try {
      await resellToken(id, price);

      // redirect user to homepage
      router.push("/");
    } catch (error) {
      // TODO: notify the user about this error
      console.error("Failed to resell token:", error);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && <img className="rounded mt-4" width="350" src={image} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
