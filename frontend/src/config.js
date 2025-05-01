const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default {
  API_URL,
  PREDICT_ENDPOINT: `${API_URL}/predict`,
  BATCH_PREDICT_ENDPOINT: `${API_URL}/batch-predict`,
  RETRAIN_MODEL_ENDPOINT: `${API_URL}/retrain-model`,
  GET_ACTIVE_MODEL_ENDPOINT: `${API_URL}/get-active-model`,
  SET_ACTIVE_MODEL_ENDPOINT: `${API_URL}/set-active-model`,
};

// Then in your components, import and use this config
// Example:
/*
import config from '../config';

async function predictChurn(customerData) {
  try {
    const response = await fetch(config.PREDICT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error predicting churn:', error);
    throw error;
  }
}
*/