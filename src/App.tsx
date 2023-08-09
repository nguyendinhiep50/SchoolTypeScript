import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LayoutComponent from "./Pages/Management/LayOutManagement";

import { Layout } from "antd";

function App() {
  return ( 
    <Router>
      <LayoutComponent />
    </Router> 
  );
}

export default App;
