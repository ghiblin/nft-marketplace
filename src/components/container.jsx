import { ethers } from "ethers";
import { useEffect } from "react";

export default function Container({ children }) {
  // Force page refreshes on network changes
  useEffect(() => {
    // Check if MM is installed
    if (!window.ethereum) {
      return;
    }

    // The "any" network will allow spontaneous network changes
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    function handleNetwork(_newNetwork, oldNetwork) {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    }

    provider.on("network", handleNetwork);

    return () => {
      provider.off("network", handleNetwork);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div className="px-4 w-full" style={{ maxWidth: "1600px" }}>
        {children}
      </div>
    </div>
  );
}
