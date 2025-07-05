import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PredictionForm from "./components/PredictionForm";
import PredictionResults from "./components/PredictionResults";
import BatchPredictionForm from "./components/BatchPredictionForm";
import ModelManagement from "./components/ModelManagement";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <div className="content-wrapper">
            <Routes>
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/single-predict" element={
                <ProtectedRoute>
                  <PredictionForm />
                </ProtectedRoute>
              } />
              
              <Route path="/batch-predict" element={
                <ProtectedRoute>
                  <BatchPredictionForm />
                </ProtectedRoute>
              } />
              
              <Route path="/model-management" element={
                <ProtectedRoute>
                  <ModelManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/results" element={
                <ProtectedRoute>
                  <PredictionResults />
                </ProtectedRoute>
              } />
              
              {/* Redirect any unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;