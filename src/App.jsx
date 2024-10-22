import ConnectToMetaMask from "./components/ConnectToMetaMask";
import { useState, useEffect } from "react";
import Web3 from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x130B0143844d7aa0f90E5e974F9D222f09c957Ba";
  const abi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_message",
          type: "string",
        },
      ],
      name: "createMessage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "getMessages",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "messages",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  // This function is passed to ConnectToMetaMask to receive the connected account
  const handleConnect = (account) => {
    setAccounts([account]);
    initializeWeb3AndContract(account);
  };

  const initializeWeb3AndContract = async (account) => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
        setContract(contractInstance);
        console.log("Contract initialized:", contractInstance);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const sendMessage = async () => {
    if (!contract || accounts.length === 0) {
      console.warn("Contract or accounts not initialized");
      return;
    }

    try {
      setLoading(true);
      await contract.methods.createMessage(String(messageValue)).send({ from: accounts[0] });
      setMessageValue("");
      console.log("Message Sent", messageValue);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMessage = async () => {
    if (!contract || accounts.length === 0) {
      console.warn("Contract or accounts not initialized");
      return;
    }

    try {
      const message = await contract.methods.getMessages(accounts[0]).call();
      console.log("Message Received", message);
      setMessage(message);
    } catch (error) {
      console.error("Error getting message:", error);
    }
  };

  return (
    <div className="p-10">
      <ConnectToMetaMask onConnect={handleConnect} />
      <div className="my-4">
        <input
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          className="bg-gray-100 px-2 py-2 rounded-md shadow-md"
          type="text"
          placeholder="Enter Message Here..."
        />
        <button
          onClick={sendMessage}
          className="bg-red-500 p-2 rounded-md text-white shadow-md ml-2 active:scale-90 transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Create"}
        </button>
      </div>
      <button
        onClick={getMessage}
        className="bg-blue-500 p-2 rounded-md text-white shadow-md ml-2 active:scale-90 transition"
      >
        Get Message
      </button>
      {message && (
        <div className="mt-4 p-2 bg-gray-200 rounded-md">
          <p>Message: {message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
