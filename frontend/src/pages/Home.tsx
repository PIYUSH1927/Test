import React from 'react';
import { motion } from 'framer-motion';
import About from './AboutUs';
import Features from './Features';
import Contact from './Contact';
import "./Home.css";

const HomeContent: React.FC = () => {
  return (
    <div>

      {/* Hero Section */}
      <div className="hero-container" style={{position:"relative", bottom:"70px"}}>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="hero-title">
              SOORU.AI
            </h1>
            <h2 className="hero-subtitle">
              Where Vision Meets Precision!
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Other sections */}
      <section id="about" className="min-h-screen">
        <About />
      </section>

      <section id="features" className="min-h-screen">
        <Features />
      </section>

      <section id="contact" className="min-h-screen">
        <Contact />
      </section>
    </div>
  );
};

export default HomeContent;
