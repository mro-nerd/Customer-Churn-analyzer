import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectPredictionType = () => {
  const navigate = useNavigate();

  return (
    <div className="prediction-type-container">
      <h2>Customer Churn Prediction Dashboard</h2>
      <p>Select a prediction mode or manage your machine learning models</p>

      <div className="prediction-options">
        <div className="prediction-option">
          <div className="option-icon">
            <i className="fas fa-user"></i>
          </div>
          <h3>Single Customer Prediction</h3>
          <p>
            Predict churn probability for a single customer by entering their details.
            Get detailed insights into factors affecting their likelihood to churn.
          </p>
          <button 
            className="option-button"
            onClick={() => navigate('/single-predict')}
          >
            Single Prediction
          </button>
        </div>

        <div className="prediction-option">
          <div className="option-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Batch Prediction</h3>
          <p>
            Upload a CSV file with multiple customer records to generate 
            churn predictions for your entire customer base at once.
          </p>
          <button 
            className="option-button"
            onClick={() => navigate('/batch-predict')}
          >
            Batch Prediction
          </button>
        </div>

        <div className="prediction-option">
          <div className="option-icon">
            <i className="fas fa-cogs"></i>
          </div>
          <h3>Model Management</h3>
          <p>
            Retrain the churn prediction model with your own data to improve accuracy
            and switch between different model versions.
          </p>
          <button 
            className="option-button"
            onClick={() => navigate('/model-management')}
          >
            Manage Models
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPredictionType;