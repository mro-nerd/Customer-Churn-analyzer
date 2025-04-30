// components/PredictionResults.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
  PieChart, Pie, Cell, Legend
} from 'recharts';

function PredictionResults() {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    // Retrieve prediction data from localStorage
    const storedPrediction = localStorage.getItem("predictionResults");
    if (storedPrediction) {
      setPrediction(JSON.parse(storedPrediction));
    } else {
      // Navigate back to form if no prediction data exists
      navigate("/");
    }
  }, [navigate]);

  const handleNewPrediction = () => {
    // Clear stored prediction and navigate back to form
    localStorage.removeItem("predictionResults");
    navigate("/");
  };

  // Prepare all insights data for visualization
  const prepareAllInsightsData = () => {
    if (!prediction) return [];
    
    const allInsights = [];
    
    // Process numeric insights
    if (prediction.numeric_insights) {
      prediction.numeric_insights.forEach(insight => {
        allInsights.push({
          name: insight.feature,
          value: Math.abs(insight.shap_value) * 100, // Scale for better visualization
          impact: insight.shap_value,
          // Positive SHAP = increase churn risk
          isPositive: (prediction.prediction === 1 && insight.shap_value > 0) || 
                      (prediction.prediction === 0 && insight.shap_value < 0),
          explanation: insight.explanation,
          type: 'numeric',
          actualValue: insight.value,
          category: insight.category
        });
      });
    }
    
    // Process categorical insights
    if (prediction.categorical_insights) {
      prediction.categorical_insights.forEach(insight => {
        // Calculate visualization value based on difference from average
        const diffFromAverage = insight.churn_rate - insight.average_rate;
        allInsights.push({
          name: insight.feature,
          value: Math.abs(diffFromAverage) * 100, // Scale for better visualization
          impact: diffFromAverage, 
          isPositive: (prediction.prediction === 1 && insight.impact === 'negative') ||
                      (prediction.prediction === 0 && insight.impact === 'positive'),
          explanation: insight.explanation,
          type: 'categorical',
          featureValue: insight.value,
          churnRate: insight.churn_rate,
          averageRate: insight.average_rate
        });
      });
    }
    
    // Sort by absolute impact and take top insights
    return allInsights
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
      .slice(0, 5); // Take top 5 insights
  };
  
  // Color scheme for charts
  const COLORS = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3'];
  
  // Prepare pie chart data
  const preparePieChartData = () => {
    const impactData = prepareAllInsightsData();
    const totalImpact = impactData.reduce((sum, item) => sum + Math.abs(item.impact), 0);
    
    return impactData.map(item => {
      // Truncate feature names that are too long for better display
      const shortenedName = item.name.length > 15 
        ? item.name.substring(0, 15) + '...' 
        : item.name;
        
      return {
        name: shortenedName,
        value: (Math.abs(item.impact) / totalImpact) * 100,
        isPositive: item.isPositive,
        explanation: item.explanation,
        fullName: item.name // Keep full name for tooltip
      };
    });
  };

  // Custom tooltip for the bar chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value" style={{ color: data.isPositive ? '#d32f2f' : '#2e7d32' }}>
            {data.explanation}
          </p>
          {data.type === 'numeric' && (
            <p className="tooltip-detail">
              Value: {data.actualValue} ({data.category})
            </p>
          )}
          {data.type === 'categorical' && (
            <p className="tooltip-detail">
              {data.featureValue}: {(data.churnRate * 100).toFixed(1)}% churn rate 
              (avg: {(data.averageRate * 100).toFixed(1)}%)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.fullName || data.name}</p>
          <p className="tooltip-value">{data.value.toFixed(2)}% of total impact</p>
          <p className="tooltip-effect">{data.explanation}</p>
        </div>
      );
    }
    return null;
  };

  if (!prediction) {
    return (
      <div className="loading-container">
        <p>Loading prediction results...</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className={`prediction-result ${prediction.prediction === 1 ? "will-churn" : "wont-churn"}`}>
        <h2>Prediction Result</h2>
        <div className="prediction-content">
          <div className="prediction-icon">
            {prediction.prediction === 1 ? "⚠" : "✅"}
          </div>
          <div className="prediction-text">
            <p className="prediction-main">
              {prediction.prediction === 1 ? "Customer likely to churn" : "Customer likely to stay"}
            </p>
            <p className="prediction-confidence">
              Churn Probability: <span>{(prediction.probability * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>

        {/* Insights visualization section */}
        <div className="visualization-container">
          <h3>{prediction.insight_summary}</h3>
          
          <div className="chart-container">
            <div className="chart-section">
              <h4>Impact Strength</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={prepareAllInsightsData()}
                  layout="vertical"
                  margin={{ top: 20, right: 50, left: 100, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    tickFormatter={(tick) => `${tick.toFixed(1)}%`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: '#333', fontSize: 11 }}
                    width={100}
                    tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="value" fill="#8884d8" isAnimationActive={true} barSize={25}>
                    {
                      prepareAllInsightsData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isPositive ? '#f44336' : '#4caf50'} />
                      ))
                    }
                    <LabelList 
                      dataKey="value" 
                      position="right" 
                      formatter={(value) => `${value.toFixed(1)}%`} 
                      fill="#333"
                      style={{ fontWeight: 'bold', fontSize: 11 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-section">
              <h4>Relative Contribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={preparePieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {preparePieChartData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    formatter={(value) => <span style={{fontSize: '0.8rem', color: '#333'}}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="factors-explanation">
            <h4>Key Insights</h4>
            
            {/* Numeric Insights */}
            {prediction.numeric_insights && prediction.numeric_insights.length > 0 && (
              <div className="insights-section">
                <h5>Numeric Features</h5>
                <ul className="factors-list">
                  {prediction.numeric_insights.map((insight, idx) => (
                    <li key={idx} className={insight.shap_value > 0 ? "factor-negative" : "factor-positive"}>
                      <span className="factor-name">{insight.feature} ({insight.value} - {insight.category}):</span> 
                      <span className="factor-impact">{insight.explanation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Categorical Insights */}
            {prediction.categorical_insights && prediction.categorical_insights.length > 0 && (
              <div className="insights-section">
                <h5>Categorical Features</h5>
                <ul className="factors-list">
                  {prediction.categorical_insights.map((insight, idx) => (
                    <li key={idx} className={insight.impact === 'negative' ? "factor-negative" : "factor-positive"}>
                      <span className="factor-name">{insight.feature} ({insight.value}):</span> 
                      <span className="factor-impact">{insight.explanation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="results-actions">
          <button onClick={handleNewPrediction} className="new-prediction-btn">
            Make New Prediction
          </button>
        </div>
      </div>
    </div>
  );
}

export default PredictionResults;