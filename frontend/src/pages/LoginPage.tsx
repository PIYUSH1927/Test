import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoginPage.css';
import SooruAILogo from '../SooruAI.png';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => (
  
  
  <motion.div 
    className="form-wrapper"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.5 }}
  >
    <div className="form-header">
      <h2>Sign In</h2>
    </div>

    <form>
      <div className="form-group">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-input"
          placeholder="johndoe@gmail.com"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          required
        />
      </div>

      <a href="/forgot-password" className="forgot-password">
        Forgot password?
      </a>

      <button type="submit" className="submit-button">
        Sign In
      </button>
    </form>

    <div className="register-section">
      Don't have an account?{' '}
      <button onClick={onRegisterClick} className="register-link">
        Register here
      </button>
    </div>
  </motion.div>
);

interface RegisterFormProps {
  onBackToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToLogin }) => (

  
  <motion.div 
    className="form-wrapper fmw "
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.5 }}
    style={{maxWidth:"36rem"}}
  >
    <div className="form-header">
      <h2>Create Account</h2>
    </div>

    <form >
      <div className="form-group">
        <label className="form-label">Company Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Your Company Name"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">First Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="First Name"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Last Name"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="email@company.com"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          className="form-input"
          placeholder="555 000 0000"
          pattern="[0-9]{10}"
          maxLength={10}
          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid 10-digit phone number')}
  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="Create a strong password"
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Create Account
      </button>
    </form>

    <div className="register-section">
      Already have an account?{' '}
      <button onClick={onBackToLogin} className="register-link">
        Sign in here
      </button>
    </div>
  </motion.div>
);

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  return (
    <div className="auth-container">
      {/* Left Section */}
      <div className="left-section">
        <motion.div className="logo-wrapper">
          <motion.img
            src={SooruAILogo}
            alt="SOORU.AI Logo"
            className="logo-image"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.h1 
            className="brand-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SOORU.AI
          </motion.h1>
          <motion.h2 
            className="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Where Vision Meets Precision!
          </motion.h2>
          <motion.div className="slogans">
            <motion.p 
              className="slogan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Build Your Dreams with Our AI!
            </motion.p>
            <motion.p 
              className="slogan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Effortless. Precise.. Limitless...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <AnimatePresence mode="wait">
          {!isRegistering ? (
            <LoginForm 
              key="login"
              onRegisterClick={() => setIsRegistering(true)} 
            />
          ) : (
            <RegisterForm 
              key="register"
              onBackToLogin={() => setIsRegistering(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;

