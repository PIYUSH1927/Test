import React from 'react';
import { motion } from 'framer-motion';
import { DarkModeProvider, useDarkMode } from '../contexts/DarkModeContext';
import './Features.css';

interface FeatureCardProps {
  title: string;
  description: string;
  items: string[];
  icon: string;
  delay?: number;
}

// FeatureCard Component
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, items, icon, delay = 0 }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="feature-card"
    >
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      <ul className="feature-list">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + index * 0.1 }}
            className="feature-list-item"
          >
            <span className="feature-check">✓</span>
            <span className="feature-text">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

// FeatureSection Component
const FeatureSection: React.FC<{ title: string; description?: string; children: React.ReactNode; dark?: boolean }> = ({
  title,
  description,
  children,
  dark = false,
}) => (
  <section className={`feature-section ${dark ? 'feature-section-dark' : ''}`}>
    <div className="feature-section-content">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="feature-section-header "
      >
        <h2 className="feature-section-title upcoming-title">{title}</h2>
        {description && <p className="feature-section-description">{description}</p>}
      </motion.div>
      {children}
    </div>
  </section>
);

// Define types for the feature data
interface Feature {
  title: string;
  description: string;
  icon: string;
  items: string[];
}

// FeaturesContent Component
const FeaturesContent: React.FC = () => {
  const features: Feature[] = [
    {
      title: 'Prompt-Based Design Input',
      description: 'A user-friendly prompt box for architects and customers to input house preferences.',
      icon: '💭',
      items: [
        'Natural language input for design specifications',
        'Real-time suggestions and guidance',
        'Intuitive interface for design requirements',
        'Smart interpretation of user preferences',
      ],
    },
    {
      title: 'Customizable Components',
      description: 'Mix and match different design elements to create your perfect space.',
      icon: '🏗️',
      items: [
        'Select individual components from different sets',
        'Real-time modifications to components',
        'Mix and match to create personalized layouts',
        'Component-level customization options',
      ],
    },
    {
      title: '2D and 3D Diagram Generation',
      description: 'Seamlessly generate and switch between 2D and 3D visualizations.',
      icon: '📐',
      items: ['Automatic 2D and 3D diagram generation', 'Synchronized updates across views', 'Interactive viewing perspectives', 'Real-time visualization updates'],
    },
    {
      title: 'AI Integration',
      description: 'Intelligent design suggestions powered by advanced AI technology.',
      icon: '🤖',
      items: ['AI-powered design optimization', 'Smart space utilization suggestions', 'Adaptive customization', 'Aesthetic enhancement recommendations'],
    },
    {
      title: 'Export and Sharing Options',
      description: 'Multiple export formats and seamless sharing capabilities.',
      icon: '📤',
      items: ['Export to PDF, CAD, and STL formats', 'Shareable project links', 'Collaborative review system', 'Multi-format support'],
    },
    {
      title: 'Cloud Storage',
      description: 'Secure cloud storage with comprehensive version control.',
      icon: '☁️',
      items: ['Secure project cloud storage', 'Automatic version control', 'Cross-device accessibility', 'Backup and recovery options'],
    },
  ];

  const upcomingFeatures: Feature[] = [
    {
      title: 'AR/VR Integration',
      description: 'Experience architectural designs in augmented and virtual reality.',
      icon: '🕶️',
      items: ['Immersive 3D walkthroughs', 'Real-time AR overlay of designs', 'VR support for an interactive experience', 'Enhanced spatial understanding'],
    },
    {
      title: 'Automated Cost Estimation',
      description: 'Instant budget estimates based on design specifications.',
      icon: '💰',
      items: ['Dynamic cost calculation', 'Material and labor cost breakdowns', 'Real-time updates as designs change', 'Budget optimization suggestions'],
    },
    {
      title: 'Smart Energy Efficiency Analysis',
      description: 'Evaluate and optimize energy efficiency in architectural plans.',
      icon: '⚡',
      items: ['AI-powered energy consumption analysis', 'Sustainability recommendations', 'Renewable energy integration insights', 'Cost-saving efficiency strategies'],
    },
    {
      title: 'Collaborative Multi-User Editing',
      description: 'Work on projects simultaneously with real-time collaboration tools.',
      icon: '👥',
      items: ['Live multi-user editing', 'Real-time change tracking', 'User-specific permissions and roles', 'Integrated team communication'],
    },
  ];

  return (
    <div className="features-container">
      {/* Header */}
      <div className="features-header">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="features-title">
          Features
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="features-subtitle">
          Transforming architectural design through AI innovation
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} delay={0.2 + index * 0.1} />
        ))}
      </div>

      <br />

      {/* Upcoming Features Section */}
      <FeatureSection title="">
      <div className="features-header">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="features-title">
          Upcoming Features
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="features-subtitle">
        Exciting new functionalities coming soon!
        </motion.p>
      </div>

        <div className="features-grid">
          {upcomingFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={0.2 + index * 0.1} />
          ))}
        </div>
      </FeatureSection>
    </div>
  );
};

// Main Features Component
const Features: React.FC = () => (
  <DarkModeProvider>
    <FeaturesContent />
  </DarkModeProvider>
);

export default Features;
