import { useRouter } from "next/router";
import { useState } from "react";
import { uploadFileToIPFS, uploadMetadataToIPFS } from "../api/ipfs";
import { createToken } from "../api/marketplace";

export default function CreateItem() {
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [fileUrl, setFileUrl] = useState("");
  // We use router hook to redirect to homepage after NFT creation
  const router = useRouter();

  function onInputChange(e) {
    updateFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  }

  async function onFileChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    const url = await uploadFileToIPFS(file);
    setFileUrl(url);
  }

  async function listNFTForSale() {
    const { name, description, price } = formInput;
    const url = await uploadMetadataToIPFS(name, description, fileUrl);
    await createToken(url, price);

    // NFT created => redirect to homepage
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          name="name"
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={onInputChange}
          value={formInput.name}
        />
        <textarea
          name="description"
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={onInputChange}
          value={formInput.description}
        />
        <input
          name="price"
          type="number"
          placeholder="Asset Price in Eth"
          className="mt-8 border rounded p-4"
          onChange={onInputChange}
          value={formInput.price}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onFileChange}
        />
        {fileUrl ? (
          <img className="rounded mt-4" width="350" src={fileUrl} />
        ) : null}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
