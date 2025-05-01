import React, { useState } from 'react';
import axios from 'axios';
import config from '../config'

const BatchPredictionForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //const navigate = useNavigate();

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const validateFile = (file) => {
    if (!file) {
      setError('Please select a file');
      return false;
    }

    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported');
      return false;
    }

    return true;
  };

  const processFile = async () => {
    if (!validateFile(selectedFile)) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        config.BATCH_PREDICT_ENDPOINT,
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Create a download link for the returned file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'churn_predictions.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      link.remove();
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      
      // Handle error response blob
      if (error.response && error.response.data instanceof Blob) {
        // Convert blob to text to read the error message
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            setError(errorData.error || 'An error occurred during processing');
          // eslint-disable-next-line no-unused-vars
          } catch (err) {
            setError('An error occurred during processing');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        setError('An error occurred during file upload');
      }
    }
  };

  return (
    <div className="batch-prediction-container">
      <h2>Batch Customer Churn Prediction</h2>
      <p>Upload a CSV file containing customer data for batch prediction.</p>
      
      <div className="upload-section">
        <input 
          type="file" 
          onChange={onFileChange} 
          accept=".csv"
          className="file-input" 
        />
        
        {selectedFile && (
          <div className="file-info">
            <p>Selected file: {selectedFile.name}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="button-group">
          <button 
            onClick={processFile} 
            disabled={!selectedFile || isLoading}
            className="primary-button"
          >
            {isLoading ? 'Processing...' : 'Process File'}
          </button>
          
          {/* <button 
            onClick={() => navigate('/')}
            className="secondary-button"
          >
            Back
          </button> */}
        </div>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Processing your file. This might take a moment...</p>
        </div>
      )}

      <div className="instructions">
        <h3>Instructions</h3>
        <p>Your CSV file should include the following columns:</p>
        <ul>
          <li>⦿ SeniorCitizen (0 or 1)</li>
          <li>⦿ MonthlyCharges (numeric)</li>
          <li>⦿ TotalCharges (numeric)</li>
          <li>⦿ gender (Male/Female)</li>
          <li>⦿ Partner (Yes/No)</li>
          <li>⦿ Dependents (Yes/No)</li>
          <li>⦿ PhoneService (Yes/No)</li>
          <li>⦿ MultipleLines (Yes/No/No phone service)</li>
          <li>⦿ InternetService (DSL/Fiber optic/No)</li>
          <li>⦿ OnlineSecurity (Yes/No/No internet service)</li>
          <li>⦿ OnlineBackup (Yes/No/No internet service)</li>
          <li>⦿ DeviceProtection (Yes/No/No internet service)</li>
          <li>⦿ TechSupport (Yes/No/No internet service)</li>
          <li>⦿ StreamingTV (Yes/No/No internet service)</li>
          <li>⦿ StreamingMovies (Yes/No/No internet service)</li>
          <li>⦿ Contract (Month-to-month/One year/Two year)</li>
          <li>⦿ PaperlessBilling (Yes/No)</li>
          <li>⦿ PaymentMethod (Electronic check/Mailed check/Bank transfer/Credit card)</li>
          <li>⦿ tenure (numeric, months)</li>
        </ul>
      </div>
    </div>
  );
};

export default BatchPredictionForm;