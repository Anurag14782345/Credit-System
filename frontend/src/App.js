import React from "react";
import { Web3Provider } from "./context/Web3Context";
import RECInteraction from "./components/RECInteraction";

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <header className="App-header">
          <h1>GreenTrade Platform</h1>
          <RECInteraction />
        </header>
      </div>
    </Web3Provider>
  );
}

export default App;
