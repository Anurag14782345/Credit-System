import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../context/Web3Context";
import { ethers } from "ethers";
import { js2xml } from "xml-js";
import './RECInteraction.css'; 

const RECInteraction = () => {
  const { recContract } = useContext(Web3Context);
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0");
  const [xmlData, setXmlData] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then(accounts => setWalletAddress(accounts[0]))
        .catch(error => console.error(error));
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  }, []);

  const getBalance = async () => {
    if (recContract) {
      const balance = await recContract.balanceOf(walletAddress);
      setBalance(ethers.utils.formatUnits(balance, 18));
    }
  };

  const handleExchange = async () => {
    if (recContract && recipient && amount) {
      try {
        // Parse amount to the correct units
        const tx = await recContract.exchange(recipient, ethers.utils.parseUnits(amount, 18));
        // Wait for transaction confirmation
        await tx.wait();
        alert("Exchange successful");
        getBalance();
      } catch (error) {
        // Log and display the error message
        console.error("Error during exchange:", error);
        alert(`Exchange failed: ${error.message || error}`);
      }
    } else {
      alert("Please provide recipient address and amount.");
    }
  };

  const createIdAndStoreXml = () => {
    const id = ethers.utils.hexlify(ethers.utils.randomBytes(16));
    const xmlObject = {
      WalletAddress: {
        _text: walletAddress
      },
      ID: {
        _text: id
      }
    };
    const xmlString = js2xml(xmlObject, { compact: true, spaces: 4 });
    setXmlData(xmlString);
    alert("ID created and stored in XML format");
  };

  return (
    <div>
      <h2>Renewable Energy Certificate (REC) Interaction</h2>
      <div>
        <h3>Wallet Information</h3>
        <p>Connected Wallet: {walletAddress}</p>
        <button onClick={getBalance}>Get Balance</button>
        <p>Balance: {balance} REC</p>
      </div>
      <div>
        <h3>Exchange Credits</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleExchange}>Exchange</button>
      </div>
      <div>
        <h3>Create ID and Store in XML</h3>
        <button onClick={createIdAndStoreXml}>Create ID</button>
        <pre>{xmlData}</pre>
      </div>
    </div>
  );
};

export default RECInteraction;
