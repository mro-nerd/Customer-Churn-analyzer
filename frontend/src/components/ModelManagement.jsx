import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
//import config from '../config'

const ModelManagement = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrainingResults, setRetrainingResults] = useState(null);
  const [activeModel, setActiveModel] = useState("original");
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    fetchActiveModel();
  }, []);

  const fetchActiveModel = async () => {
    try {
      const response = await axios.get(config.GET_ACTIVE_MODEL_ENDPOINT);
      const data = response.data;

      if (data.success) {
        setActiveModel(data.active_model);
        setModelInfo(data.models);
      } else {
        setError("Failed to fetch model information: " + data.error);
      }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleRetrainModel = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a CSV file for retraining");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(config.RETRAIN_MODEL_ENDPOINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.success) {
        setRetrainingResults(data);
        fetchActiveModel(); // Refresh model info
      } else {
        setError("Retraining failed: " + data.error);
      }
    } catch (err) {
      setError("Error during model retraining: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActiveModel = async (modelType) => {
    setLoading(true);

    try {
      const response = await axios.post(config.SET_ACTIVE_MODEL_ENDPOINT, { model: modelType });

      const data = response.data;

      if (data.success) {
        setActiveModel(data.active_model);
        fetchActiveModel(); // Refresh model info
      } else {
        setError("Failed to set active model: " + data.error);
      }
    } catch (err) {
      setError("Error setting active model: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="model-management-container">
      <h2>Model Management</h2>
      
      <div className="model-info-card">
        <h3>Active Model Information</h3>
        <div className="model-status">
          <div className={`model-badge ${activeModel === "original" ? "active" : ""}`}>
            <div className="model-badge-header">
              <span className="model-name">Original Model</span>
              {activeModel === "original" && (
                <span className="active-indicator">Active</span>
              )}
            </div>
            <div className="model-badge-content">
              {modelInfo && (
                <p>Last Modified: {formatDate(modelInfo.original.last_modified)}</p>
              )}
            </div>
          </div>
          
          <div className={`model-badge ${activeModel === "retrained" ? "active" : ""}`}>
            <div className="model-badge-header">
              <span className="model-name">Retrained Model</span>
              {activeModel === "retrained" && (
                <span className="active-indicator">Active</span>
              )}
            </div>
            <div className="model-badge-content">
              {modelInfo && (
                <>
                  {modelInfo.retrained.exists ? (
                    <p>Last Modified: {formatDate(modelInfo.retrained.last_modified)}</p>
                  ) : (
                    <p>No retrained model available</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="model-controls">
          <button 
            className={`control-btn ${activeModel === "original" ? "selected" : ""}`}
            onClick={() => handleSetActiveModel("original")}
            disabled={loading || activeModel === "original"}
          >
            Use Original Model
          </button>
          
          <button 
            className={`control-btn ${activeModel === "retrained" ? "selected" : ""}`}
            onClick={() => handleSetActiveModel("retrained")}
            disabled={loading || activeModel === "retrained" || !modelInfo?.retrained.exists}
          >
            Use Retrained Model
          </button>
        </div>
      </div>
      
      <div className="retrain-section">
        <h3>Retrain Model</h3>
        <p>Upload a new dataset to retrain the churn prediction model with your own data.</p>
        
        <form onSubmit={handleRetrainModel}>
          <div className="upload-section">
            <label htmlFor="file-upload">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Select a CSV file for retraining</span>
            </label>
            <input
              id="file-upload"
              type="file"
              className="file-input"
              accept=".csv"
              onChange={handleFileChange}
            />
            
            {file && (
              <div className="file-info">
                <strong>Selected file:</strong> {file.name}
              </div>
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading || !file}
          >
            {loading ? "Retraining..." : "Retrain Model"}
          </button>
        </form>
        
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p className="loading-text">Retraining model. This may take a few minutes...</p>
          </div>
        )}
      </div>
      
      {retrainingResults && (
        <div className="results-section">
          <h3>Retraining Results</h3>
          
          <div className="results-comparison">
            <div className="model-metrics">
              <h4>New Model Metrics</h4>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Accuracy</span>
                  <span className="metric-value">{retrainingResults.new_model.accuracy}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Precision</span>
                  <span className="metric-value">{retrainingResults.new_model.precision}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Recall</span>
                  <span className="metric-value">{retrainingResults.new_model.recall}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">F1 Score</span>
                  <span className="metric-value">{retrainingResults.new_model.f1}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Training Time</span>
                  <span className="metric-value">{retrainingResults.new_model.training_time}s</span>
                </div>
              </div>
            </div>
            
            <div className="model-metrics">
              <h4>Original Model Metrics</h4>
              {retrainingResults.original_model.error ? (
                <div className="metric-error">
                  {retrainingResults.original_model.error}
                </div>
              ) : (
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Accuracy</span>
                    <span className="metric-value">{retrainingResults.original_model.accuracy}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Precision</span>
                    <span className="metric-value">{retrainingResults.original_model.precision}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Recall</span>
                    <span className="metric-value">{retrainingResults.original_model.recall}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">F1 Score</span>
                    <span className="metric-value">{retrainingResults.original_model.f1}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={() => handleSetActiveModel("retrained")}
              disabled={activeModel === "retrained"}
            >
              Use Retrained Model
            </button>
            <button 
              className="secondary-button"
              onClick={() => navigate("/")}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
      
      <div className="instructions">
        <h3>Model Retraining Guidelines</h3>
        <ul>
        <li>⦿ <strong>Compare Datasets:</strong> Before retraining, compare your new dataset with the original to evaluate potential performance.</li>
          <li>⦿ <strong>Upload Requirements:</strong> CSV files should have the same structure as the original dataset with a 'Churn' column ('Yes'/'No' or 1/0).</li>
          <li>⦿ <strong>Data Quality:</strong> For best results, include at least 500 records with a balanced mix of churned and non-churned customers.</li>
          <li>⦿ <strong>Cross-Performance:</strong> The system now evaluates how each model performs on both datasets for comprehensive comparison.</li>
          <li>⦿ <strong>Model Switching:</strong> You can toggle between models even after leaving this page.</li>
          <li>⦿ <strong>Model Replacement:</strong> A new retrained model will replace any existing retrained model.</li>
        </ul>
      </div>
    </div>
  );
};

export default ModelManagement;