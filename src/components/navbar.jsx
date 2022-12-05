import { ethers } from "ethers";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { formatAddress } from "../utils";

export default function Navbar() {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    function handleAccountsChanged(accounts) {
      setAccounts(accounts);
    }

    provider.provider.on("accountsChanged", handleAccountsChanged);

    async function getAccounts() {
      const accounts = await provider.listAccounts();
      setAccounts(accounts);
    }

    getAccounts();

    return () => {
      provider.provider.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  return (
    <nav className="border-b p-6">
      <p className="text-4xl font-bold">Metaverse Marketplace</p>
      <div className="flex mt-4">
        <Link href="/" className="mr-4 text-pink-500">
          Home
        </Link>
        <Link href="/create-nft" className="mr-6 text-pink-500">
          Sell NFT
        </Link>
        <Link href="/my-nfts" className="mr-6 text-pink-500">
          My NFTs
        </Link>
        <Link href="/dashboard" className="mr-6 text-pink-500">
          Dashboard
        </Link>
        <div className="ml-auto">
          {accounts.length ? formatAddress(accounts[0]) : "not connected"}
        </div>
      </div>
    </nav>
  );
}
