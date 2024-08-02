import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import 'bootstrap/dist/css/bootstrap.min.css';

const Buy = () => {
  const { recContract } = useContext(Web3Context);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      // Placeholder: Fetch sellers from your smart contract
      const households = ["0x123...", "0x456...", "0x789..."];
      const fetchedSellers = await Promise.all(
        households.map(async (address) => {
          const balance = await recContract.balanceOf(address);
          if (balance.gt(0)) {
            return { address, balance: ethers.utils.formatUnits(balance, 18) };
          }
        })
      );
      setSellers(fetchedSellers.filter(seller => seller));
    };

    if (recContract) {
      fetchSellers();
    }
  }, [recContract]);

  return (
    <div className="container">
      <h2>Buy Energy Credits</h2>
      <div className="row">
        {sellers.map(({ address, balance }) => (
          <div key={address} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Household {address}</h5>
                <p className="card-text">{balance} units for sale</p>
                <button className="btn btn-primary">Buy Credits</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy;
