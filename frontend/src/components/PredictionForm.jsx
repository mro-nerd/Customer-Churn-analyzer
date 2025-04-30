// components/PredictionForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PredictionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    SeniorCitizen: "0",
    MonthlyCharges: "",
    TotalCharges: "",
    gender: "Male",
    Partner: "No",
    Dependents: "No",
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "DSL",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    tenure: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      // Store prediction data in localStorage to pass between routes
      localStorage.setItem("predictionResults", JSON.stringify(res.data));
      // Navigate to results page
      navigate("/results");
    } catch (error) {
      console.error(error);
      alert("An error occurred while making the prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const personalFields = ["gender", "SeniorCitizen", "Partner", "Dependents"];
  const serviceFields = [
    "PhoneService", "MultipleLines", "InternetService", "OnlineSecurity",
    "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies"
  ];
  const accountFields = [
    "Contract", "PaperlessBilling", "PaymentMethod", "tenure", "MonthlyCharges", "TotalCharges"
  ];

  const renderInput = (field) => {
    const booleanOptions = ["Yes", "No"];
    const fieldSpecificOptions = {
      gender: ["Male", "Female"],
      SeniorCitizen: ["0", "1"],
      InternetService: ["DSL", "Fiber optic", "No"],
      Contract: ["Month-to-month", "One year", "Two year"],
      PaymentMethod: ["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"]
    };

    if (field === "tenure" || field === "MonthlyCharges" || field === "TotalCharges") {
      return (
        <input
          type="number"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="form-input"
          required
        />
      );
    } else if (fieldSpecificOptions[field] || ["MultipleLines", "OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies"].includes(field)) {
      const options = fieldSpecificOptions[field] || booleanOptions;
      return (
        <select
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="form-select"
          required
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {field === "SeniorCitizen" ? (option === "0" ? "No" : "Yes") : option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        name={field}
        value={formData[field]}
        onChange={handleChange}
        className="form-input"
        required
      />
    );
  };

  const formatLabel = (field) => {
    if (field === "SeniorCitizen") return "Senior Citizen";
    return field.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <>
      <div className="form-intro">
        <p>Enter customer information to predict likelihood of churn</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          <div className="form-section">
            <h2>Personal Information</h2>
            {personalFields.map((field) => (
              <div className="form-group" key={field}>
                <label>{formatLabel(field)}</label>
                {renderInput(field)}
              </div>
            ))}
          </div>

          <div className="form-section">
            <h2>Service Details</h2>
            {serviceFields.map((field) => (
              <div className="form-group" key={field}>
                <label>{formatLabel(field)}</label>
                {renderInput(field)}
              </div>
            ))}
          </div>

          <div className="form-section">
            <h2>Account Information</h2>
            {accountFields.map((field) => (
              <div className="form-group" key={field}>
                <label>{formatLabel(field)}</label>
                {renderInput(field)}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Predict Churn"}
        </button>
      </form>
    </>
  );
}

export default PredictionForm;
