import React from 'react';
import { 
  Mail, Phone, MapPin, Github, Twitter, Linkedin, 
  Facebook, Shield, Globe, HelpCircle, FileText, Book 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column company-info">
            <h3>Churn Predictor</h3>
            <p>
              Make data-driven decisions to reduce customer churn with our 
              AI-powered prediction tools and analytics platform.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="GitHub"><Github size={20} /></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Single Prediction</a></li>
              <li><a href="#">Batch Prediction</a></li>
              <li><a href="#">Model Management</a></li>
              <li><a href="#">Knowledge Hub</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#"><FileText size={16} />Documentation</a></li>
              <li><a href="#"><Book size={16} />Tutorials</a></li>
              <li><a href="#"><Globe size={16} />API Reference</a></li>
              <li><a href="#"><HelpCircle size={16} />Support Center</a></li>
            </ul>
          </div>
          
          <div className="footer-column contact-info">
            <h4>Contact Us</h4>
            <ul className="contact-details">
              <li><Mail size={16} /><span>support@churnpredictor.io</span></li>
              <li><Phone size={16} /><span>(123) 456-7890</span></li>
              <li><MapPin size={16} /><span>123 AI Street, Data City, 10101</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Churn Predictor. All rights reserved.</p>
          </div>
          <div className="legal-links">
            <a href="#"><Shield size={14} />Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;