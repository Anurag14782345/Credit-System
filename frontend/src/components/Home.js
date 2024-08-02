import React from "react";
import RECInteraction from "./RECInteraction";

const Home = () => {
  return (
    <div className="container">
      <h2>Renewable Energy Trading Platform</h2>
      <p>
        This platform simulates a renewable energy trading system within a village. Each household is allocated 1000 units of energy. Households can sell their unused energy units, while factories can buy additional energy units as they need more than the allotted 1000 units. The goal is to create a balanced and efficient energy usage system, leveraging blockchain technology for secure and transparent transactions.
      </p>
      <RECInteraction />
    </div>
  );
};

export default Home;
