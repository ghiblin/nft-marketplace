import { useRouter } from "next/router";
import { uploadMetadataToIPFS } from "../api/ipfs";
import { createToken } from "../api/marketplace";
import NFTForm from "../components/nft-form";

export default function CreateItem() {
  const router = useRouter();

  async function listNFTForSale(formInput) {
    try {
      const { name, description, price, fileUrl } = formInput;
      const url = await uploadMetadataToIPFS(name, description, fileUrl);
      await createToken(url, price);

      // NFT created => redirect to homepage
      router.push("/");
    } catch (error) {
      console.error("Failed to list NFT for sale:", error);
    }
  }

  return <NFTForm onCreate={listNFTForSale} />;
}
