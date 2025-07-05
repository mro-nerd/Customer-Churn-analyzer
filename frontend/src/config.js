const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default {
  API_URL,
  PREDICT_ENDPOINT: `${API_URL}/predict`,
  BATCH_PREDICT_ENDPOINT: `${API_URL}/batch-predict`,
  RETRAIN_MODEL_ENDPOINT: `${API_URL}/retrain-model`,
  GET_ACTIVE_MODEL_ENDPOINT: `${API_URL}/get-active-model`,
  SET_ACTIVE_MODEL_ENDPOINT: `${API_URL}/set-active-model`,
  // Authentication endpoints
  LOGIN_ENDPOINT: `${API_URL}/auth/login`,
  REGISTER_ENDPOINT: `${API_URL}/auth/register`,
  PROFILE_ENDPOINT: `${API_URL}/auth/profile`,
  VERIFY_TOKEN_ENDPOINT: `${API_URL}/auth/verify-token`,
};

