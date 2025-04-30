import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PredictionForm from "./components/PredictionForm";
import PredictionResults from "./components/PredictionResults";
import BatchPredictionForm from "./components/BatchPredictionForm";
import ModelManagement from "./components/ModelManagement";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content-wrapper">
          <Routes>
            {/* Home route to select prediction type */}
            <Route path="/" element={<Home />} />
            
            {/* Single prediction route */}
            <Route path="/single-predict" element={<PredictionForm />} />
            
            {/* Batch prediction route */}
            <Route path="/batch-predict" element={<BatchPredictionForm />} />
            
            {/* New model management route */}
            <Route path="/model-management" element={<ModelManagement />} />
            
            {/* Results route */}
            <Route path="/results" element={<PredictionResults />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;