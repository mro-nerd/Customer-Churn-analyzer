import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileSpreadsheet, BarChart2, BookOpen, 
  ChevronRight, ChevronDown, CreditCard, 
  Clock, AlertCircle, Search, UserCheck, Award,
  ArrowRight, CheckCircle, Activity, BarChart, ThumbsUp
} from 'lucide-react';
import Footer from './Footer';

// FAQs data
const faqs = [
  {
    question: "How accurate is the churn prediction model?",
    answer: "Our model typically achieves 70-90% accuracy depending on the quality and completeness of data. The model is regularly trained and validated to ensure optimal performance. You can view detailed model metrics in the Model Management section."
  },
  {
    question: "What customer data is required for predictions?",
    answer: "The model works best with a combination of demographic data (age, location), behavioral data (usage patterns, engagement), and transaction data (billing history, payment methods). For single predictions, you can input available data through our form. For batch predictions, we provide a template CSV file."
  },
  {
    question: "How often should I run churn predictions?",
    answer: "For most businesses, running predictions monthly aligns well with billing cycles and provides enough time to implement retention strategies. However, for businesses with high transaction volumes or fast-changing customer behaviors, weekly predictions may be more appropriate."
  },
  {
    question: "Can I use my own historical data to train the model?",
    answer: "Yes! In the Model Management section, you can upload your historical customer data (including churn outcomes) to train a custom model. The system will compare performance between the default model and your custom model, allowing you to choose the best performer."
  },
  {
    question: "How should I prioritize customers for retention efforts?",
    answer: "Focus primarily on high-value customers with elevated churn risk (70%+) but who haven't reached a point of no return (95%+). Also consider the key factors driving their churn risk – customers whose risk factors are more actionable should be prioritized."
  },
  {
    question: "What's the difference between the churn probability and confidence score?",
    answer: "Churn probability indicates the likelihood of a customer churning, expressed as a percentage. The confidence score reflects how certain the model is about its prediction, based on data completeness and pattern recognition. Higher confidence scores mean more reliable predictions."
  },
  {
    question: "Can the system predict when a customer is likely to churn?",
    answer: "The current model focuses on identifying which customers are at risk rather than exactly when they might churn. However, the prediction typically indicates churn risk within the next 30-90 days based on the patterns identified."
  },
  {
    question: "How can I export prediction results?",
    answer: "For batch predictions, results are automatically available as a downloadable CSV file."
  }
];

// Best practices data
const bestPractices = [
  {
    title: "Focus on High-Value Customers",
    description: "Prioritize retention efforts on customers with high lifetime value who are at risk of churning.",
    icon: <Award size={24} />
  },
  {
    title: "Act on Early Warning Signs",
    description: "Don't wait until churn risk is extreme. Implement interventions when customers first show warning signs.",
    icon: <AlertCircle size={24} />
  },
  {
    title: "Personalize Retention Strategies",
    description: "Use the key factors identified in predictions to create personalized retention approaches.",
    icon: <UserCheck size={24} />
  },
  {
    title: "Test and Measure",
    description: "Continuously test different retention strategies and measure their impact on reducing churn.",
    icon: <Activity size={24} />
  }
];

// Retention strategies data
const retentionStrategies = [
  {
    title: "Proactive Outreach",
    steps: [
      "Identify at-risk customers through predictions",
      "Segment based on value and risk level",
      "Personalize communication based on risk factors",
      "Offer targeted solutions to pain points"
    ]
  },
  {
    title: "Value Enhancement",
    steps: [
      "Analyze usage patterns of churning customers",
      "Develop additional value propositions",
      "Communicate underutilized features",
      "Create educational content for better product usage"
    ]
  },
  {
    title: "Loyalty Programs",
    steps: [
      "Design tiered rewards based on customer lifetime",
      "Offer benefits that address churn factors",
      "Create community around your product",
      "Provide exclusive perks for long-term customers"
    ]
  },
  {
    title: "Feedback Loops",
    steps: [
      "Collect feedback from at-risk customers",
      "Implement quick improvements to address concerns",
      "Follow up with customers after changes",
      "Document impact on retention metrics"
    ]
  }
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Customer Churn Prediction Platform</h1>
        <p>
          Make data-driven decisions to reduce customer churn with our AI-powered prediction tools.
          Identify at-risk customers and understand the key factors affecting churn.
        </p>
        
        <div className="prediction-options">
          <div className="prediction-option">
            <div className="option-icon">
              <Users size={40} />
            </div>
            <h3>Single Customer Prediction</h3>
            <p>
              Analyze individual customer data to predict churn risk and get
              personalized insights into key factors.
            </p>
            <Link to="/single-predict">
              <button className="option-button">Get Started</button>
            </Link>
          </div>
          
          <div className="prediction-option">
            <div className="option-icon">
              <FileSpreadsheet size={40} />
            </div>
            <h3>Batch Prediction</h3>
            <p>
              Upload a CSV file with multiple customers to get churn
              predictions at scale for your entire customer base.
            </p>
            <Link to="/batch-predict">
              <button className="option-button">Upload Data</button>
            </Link>
          </div>
          
          <div className="prediction-option">
            <div className="option-icon">
              <BarChart2 size={40} />
            </div>
            <h3>Model Management</h3>
            <p>
              Train and compare models using your own data,
              and select the best model for your predictions.
            </p>
            <Link to="/model-management">
              <button className="option-button">Manage Models</button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="knowledge-hub">
        <div className="knowledge-header">
          <h2>Knowledge Hub</h2>
          <p>Everything you need to know about customer churn and how to use this platform</p>
        </div>
        
        <div className="hub-tabs">
          <button 
            className={`hub-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen size={18} />
            <span>Churn Overview</span>
          </button>
          <button 
            className={`hub-tab ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-it-works')}
          >
            <Search size={18} />
            <span>How It Works</span>
          </button>
          <button 
            className={`hub-tab ${activeTab === 'best-practices' ? 'active' : ''}`}
            onClick={() => setActiveTab('best-practices')}
          >
            <Award size={18} />
            <span>Best Practices</span>
          </button>
          <button 
            className={`hub-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <AlertCircle size={18} />
            <span>FAQ</span>
          </button>
        </div>
        
        <div className="hub-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h3>Understanding Customer Churn</h3>
              
              <div className="info-cards">
                <div className="info-card">
                  <h4>What is Customer Churn?</h4>
                  <p>
                    Customer churn refers to when customers stop doing business with a company. 
                    This can be customers who cancel a subscription, close an account, or simply 
                    stop purchasing. Churn rate is the percentage of customers who leave during a 
                    given time period.
                  </p>
                </div>
                
                <div className="info-card">
                  <h4>Why Churn Matters</h4>
                  <p>
                    Acquiring new customers can cost 5-25x more than retaining existing ones. 
                    A 5% increase in customer retention can increase profits by 25-95%. 
                    Understanding and reducing churn is critical for sustainable business growth.
                  </p>
                </div>
                
                <div className="info-card">
                  <h4>Key Churn Indicators</h4>
                  <div className="indicator-list">
                    <div className="indicator-item">
                      <CreditCard size={20} />
                      <span>Declining usage or engagement</span>
                    </div>
                    <div className="indicator-item">
                      <Clock size={20} />
                      <span>Length of customer relationship</span>
                    </div>
                    <div className="indicator-item">
                      <Users size={20} />
                      <span>Demographics and customer segments</span>
                    </div>
                    <div className="indicator-item">
                      <UserCheck size={20} />
                      <span>Customer satisfaction metrics</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="churn-stats">
                <div className="stat-box">
                  <h4>5-25x</h4>
                  <p>Cost to acquire vs retain customers</p>
                </div>
                <div className="stat-box">
                  <h4>25-95%</h4>
                  <p>Profit increase with 5% better retention</p>
                </div>
                <div className="stat-box">
                  <h4>70%</h4>
                  <p>Of companies say it's cheaper to retain than acquire</p>
                </div>
              </div>
              
              <div className="case-study">
                <h4>Success Story: TechFusion SaaS</h4>
                <div className="case-content">
                  <p>
                    TechFusion reduced their monthly churn rate from 8% to 3.5% by implementing 
                    a AI-powered Churn predictions platform. They identified that users who didn't complete 
                    initial onboarding were 4x more likely to churn, and created targeted 
                    re-engagement campaigns that increased product adoption by 27%.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'how-it-works' && (
            <div className="tab-content">
              <h3>How Our Churn Prediction Platform Works</h3>
              
              <div className="process-flow">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Data Collection</h4>
                    <p>
                      The platform uses customer data like demographics, usage patterns, 
                      billing history, and engagement metrics to identify patterns.
                    </p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>AI Analysis</h4>
                    <p>
                      Our machine learning algorithms analyze historical data to identify 
                      patterns and factors that correlate with customer churn.
                    </p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Risk Prediction</h4>
                    <p>
                      The model generates a churn probability score for each customer, along with 
                      key factors contributing to that risk score.
                    </p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Actionable Insights</h4>
                    <p>
                      The platform provides specific recommendations for each customer segment to 
                      help you implement effective retention strategies.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="model-features">
                <h4>Model Features & Capabilities</h4>
                <div className="features-grid">
                  <div className="feature-item">
                    <h5>Multi-factor Analysis</h5>
                    <p>Considers 20+ data points to provide accurate predictions</p>
                  </div>
                  <div className="feature-item">
                    <h5>Confidence Scoring</h5>
                    <p>Indicates reliability of each prediction based on data quality</p>
                  </div>
                  <div className="feature-item">
                    <h5>Key Drivers</h5>
                    <p>Identifies top factors contributing to churn risk</p>
                  </div>
                  <div className="feature-item">
                    <h5>Segment Analysis</h5>
                    <p>Groups customers by common risk factors and behaviors</p>
                  </div>
                  {/* <div className="feature-item">
                    <h5>Custom Training</h5>
                    <p>Train on your own historical data for industry-specific accuracy</p>
                  </div>
                  <div className="feature-item">
                    <h5>API Integration</h5>
                    <p>Connect with your CRM and other business systems</p>
                  </div> todo!! develop later*/}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'best-practices' && (
            <div className="tab-content">
              <h3>Churn Reduction Best Practices</h3>
              
              <div className="practices-section">
                <h4>Implementation Strategies</h4>
                <div className="practices-list">
                  {bestPractices.map((practice, index) => (
                    <div className="practice-item" key={index}>
                      <div className="practice-icon">
                        {practice.icon}
                      </div>
                      <div className="practice-content">
                        <h5>{practice.title}</h5>
                        <p>{practice.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="strategy-cards">
                {retentionStrategies.map((strategy, index) => (
                  <div className="strategy-card" key={index}>
                    <h5>{strategy.title}</h5>
                    <ul>
                      {strategy.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="case-study">
                <h4>Real-World Application</h4>
                <div className="case-content">
                  <p>
                    MediaStream, a video subscription service, discovered through a Churn Prediction platform that 
                    customers who hadn't updated their viewing preferences in 60+ days were 3x more 
                    likely to churn. By implementing a preference refresh campaign with personalized 
                    content recommendations, they reduced churn by 22% in that segment.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'faq' && (
            <div className="tab-content">
              <h3>Frequently Asked Questions</h3>
              
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div className="faq-item" key={index}>
                    <div 
                      className="faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <h4>{faq.question}</h4>
                      {expandedFaq === index ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </div>
                    {expandedFaq === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <section className="quick-start-guide">
        <h3>Quick Start Guide</h3>
        
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-badge">1</div>
            <h4>Upload Data</h4>
            <p>Import your customer data using our CSV template</p>
          </div>
          
          <div className="guide-step">
            <div className="step-badge">2</div>
            <h4>Run Predictions</h4>
            <p>Generate churn risk scores for individual customers or in batch</p>
          </div>
          
          <div className="guide-step">
            <div className="step-badge">3</div>
            <h4>Analyze Results</h4>
            <p>Review risk factors and identify customer segments for intervention</p>
          </div>
          
          <div className="guide-step">
            <div className="step-badge">4</div>
            <h4>Take Action</h4>
            <p>Implement targeted retention strategies based on insights</p>
          </div>
        </div>
        {/* to do!! develop later */}
        {/* <div className="quick-links">
          <Link to="/documentation" className="quick-link">
            <span>Documentation</span>
          </Link>
          <Link to="/tutorials" className="quick-link">
            <span>Video Tutorials</span>
          </Link>
          <Link to="/templates" className="quick-link">
            <span>CSV Templates</span>
          </Link>
          <Link to="/api-docs" className="quick-link">
            <span>API Reference</span>
          </Link>
        </div> */}
        <Footer/>
      </section>
      
    </div>
    
  );
};

export default Home;