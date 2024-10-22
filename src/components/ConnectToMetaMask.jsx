import { useSDK } from "@metamask/sdk-react";
import React, { useState } from "react";

export default function ConnectToMetaMask({ onConnect }) { // Accept a callback from the parent
  const [account, setAccount] = useState(null);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    if (!sdk) {
      console.warn("MetaMask SDK not initialized");
      return;
    }

    try {
      console.log("Attempting to connect to MetaMask...");
      const accounts = await sdk.connect();
      setAccount(accounts?.[0]);
      onConnect(accounts?.[0]); // Pass the account to the parent
      console.log("Connected account:", accounts?.[0]);
    } catch (err) {
      console.warn("Failed to connect:", err);
    }
  };

  return (
    <div className="App">
      <button
        className="bg-blue-500 shadow-md text-white rounded-full px-8 py-2 hover:bg-blue-700 active:bg-blue-900"
        onClick={connect}
        disabled={connecting}
      >
        {connecting ? "Connecting..." : "Connect"}
      </button>
      {connected && (
        <div>
          <>
            {chainId && <p>{`Connected chain: ${chainId}`}</p>}
            {account && <p>{`Connected account: ${account}`}</p>}
          </>
        </div>
      )}
    </div>
  );
}