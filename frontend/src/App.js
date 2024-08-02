import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Buy from "./components/Buy";
import Sell from "./components/Sell";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" component={Home} />
          <Route path="/buy" component={Buy} />
          <Route path="/sell" component={Sell} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
