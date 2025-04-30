import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  
  
  return (
    <div className="header">
      <h1>Customer Churn Prediction</h1>
      <p>Predict customer churn risk and understand key factors</p>
      
    
        <nav className="navigation">
          <Link to="/" className="nav-link">
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/single-predict" className="nav-link">
            <i className="fas fa-user"></i> Single Prediction
          </Link>
          <Link to="/batch-predict" className="nav-link">
            <i className="fas fa-users"></i> Batch Prediction
          </Link>
          <Link to="/model-management" className="nav-link">
            <i className="fas fa-cogs"></i> Model Management
          </Link>
        </nav>
      
    </div>
  );
};

export default Header;