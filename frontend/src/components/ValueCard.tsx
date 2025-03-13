import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import clsx from 'clsx';


// Define types for the props
interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
  color: string;
  className?: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, delay = 0, color , className = "", }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={clsx(`p-8 rounded-2xl 
        ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} 
        backdrop-blur-lg shadow-lg 
        hover:-translate-y-1 transition-all duration-300`, className)}
    >
      <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
        <span className={color}>{icon}</span>
        {title}
      </h3>
      <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>
    </motion.div>
  );
};

export default ValueCard;
