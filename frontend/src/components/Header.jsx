import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div className="header">
      <div className="flex justify-between items-center">
        <div>
          <h1>Customer Churn Prediction</h1>
          <p>Predict customer churn risk and understand key factors</p>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    
      {isAuthenticated ? (
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
      ) : (
        <nav className="navigation">
          <Link to="/login" className="nav-link">
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
          <Link to="/signup" className="nav-link">
            <i className="fas fa-user-plus"></i> Sign Up
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Header;