import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import clsx from 'clsx';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number; 
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0,className = "", }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={clsx(
        "p-6 rounded-lg backdrop-blur-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out",
        isDarkMode ? "bg-gray-800/80 text-white" : "bg-white/80 text-gray-900",
        className // Merge with external classes
      )}
    >
      <div className="text-2xl mb-4">{icon}</div>
      <h3 className={`text-xl md:text-2xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
