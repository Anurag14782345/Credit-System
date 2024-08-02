import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";

const Sell = () => {
  const { recContract } = useContext(Web3Context);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    const fetchBuyers = async () => {
      // Placeholder: Fetch buyers from your smart contract
      const factories = ["0xabc...", "0xdef...", "0xghi..."];
      const fetchedBuyers = await Promise.all(
        factories.map(async (address) => {
          const requested = await recContract.balanceOf(address); // Replace with actual request logic
          return { address, requested: ethers.utils.formatUnits(requested, 18) };
        })
      );
      setBuyers(fetchedBuyers);
    };

    if (recContract) {
      fetchBuyers();
    }
  }, [recContract]);

  return (
    <div className="container">
      <h2>Sell Energy Credits</h2>
      <ul>
        {buyers.map(({ address, requested }) => (
          <li key={address}>
            Factory {address} needs {requested} units
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sell;
