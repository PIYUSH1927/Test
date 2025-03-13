import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { DarkModeProvider, useDarkMode } from '../contexts/DarkModeContext';
import ValueCard from '../components/ValueCard';
import FeatureCard from '../components/FeatureCard';
import './AboutUs.css';

// Define prop types for InfoCard component
interface InfoCardProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
  delay?: number;
  className?: string; 
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon, color = "text-blue-600", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="about-card"
    
  >
    <div className="card-header">
      <span className={`text-3xl mb-4 block ${color}`}>{icon}</span>
      <h3 className="card-title">{title}</h3>
    </div>
    <p className="card-description">{description}</p>
  </motion.div>
);

// Define prop types for SectionTitle component
interface SectionTitleProps {
  children: React.ReactNode;
  delay?: number;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, delay = 0 }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="section-title"
  >
    {children}
  </motion.h2>
);

const AboutContent: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className={`${isDarkMode ? 'dark' : ''} about-container`}>
      {/* Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

      {/* Main Content */}
      <main className="about-content">
        {/* Who We Are Section */}
        <section className="about-section">
          <SectionTitle>About Us</SectionTitle>
          <InfoCard
            title="Who Are We?"
            icon=""
            description={`At Sooru.AI, we are a pioneering construction technology company committed to transforming the way homes are designed and built. Our platform empowers architects, designers, and homeowners with AI-driven tools that simplify the design process, foster creativity, and ensure precision at every stage.
                With cutting-edge technology and a passion for innovation, we bridge the gap between imagination and reality. Whether you're designing a cozy home or an architectural marvel, Sooru.AI provides the tools and insights to turn your vision into a beautifully crafted, functional space.
                Our approach is grounded in creating intuitive, customizable, and sustainable solutions that cater to both professionals and first-time designers. We aim to redefine the future of architectural design—one home at a time.`}
            delay={0.2}
          />
        </section>

        {/* Vision & Mission Section */}
        <section className="about-section">
          <div className="about-grid">
            <InfoCard
              title="Vision"
              icon="🔭"
              description="To revolutionize the architectural and construction industries by democratizing 
              access to intelligent design tools, enabling seamless creation, visualization, 
              and modification of residential and commercial spaces globally."
              color="text-purple-600"
              delay={0.3}
            />
            <InfoCard
              title="Mission"
              icon="🎯"
              description="Our mission is to empower architects, builders, and homeowners with AI-driven 
              design solutions that simplify architectural planning, enhance creativity, and 
              ensure regulatory compliance, fostering faster, more efficient, and cost-effective 
              construction projects."
              color="text-green-600"
              delay={0.4}
            />
          </div>
        </section>

        {/* Why Sooru.AI Section */}
        <section className="about-section" style={{maxWidth:"90%"}}>
          <SectionTitle>Why Sooru.AI?</SectionTitle>
          <div className="about-grid ">
            <FeatureCard
              icon="🔮"
              title="Innovative Technology"
              description="Leverage advanced AI to simplify complex design processes. At the heart of Sooru.AI lies innovation. We are committed to revolutionizing the way homes are designed, leveraging AI, AR/VR, and advanced technologies to bring groundbreaking solutions that redefine architectural creativity."
              delay={0.3}
              className='feature-card'
              
            />
            <FeatureCard
              icon="🎯"
              title="Personalized Solutions"
              description="Every design is tailored to your needs and preferences. At the heart of Sooru.AI lies innovation. We are committed to revolutionizing the way homes are designed, leveraging AI, AR/VR, and advanced technologies to bring groundbreaking solutions that redefine architectural creativity."
              delay={0.4}
              className='feature-card'
            />
            <FeatureCard
              icon="🔄"
              title="Comprehensive Features"
              description="From conceptualization to visualization, we cover every step. At the heart of Sooru.AI lies innovation. We are committed to revolutionizing the way homes are designed, leveraging AI, AR/VR, and advanced technologies to bring groundbreaking solutions that redefine architectural creativity."
              delay={0.5}
              className='feature-card'
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section" style={{maxWidth:"90%"}}>
          <SectionTitle>Our Values</SectionTitle>
          <div className="values-grid">
            <ValueCard
              icon="🔺"
              title=" Innovation"
              description="At the heart of Sooru.AI lies innovation. We are committed to revolutionizing the way homes are designed, leveraging AI, AR/VR, and advanced technologies to bring groundbreaking solutions that redefine architectural creativity."
              color="text-blue-600 dark:text-blue-400"
              delay={0.3}
              className='value-card'
              
            />
            <ValueCard
              icon="🟢"
              title=" Curiosity"
              description="Curiosity drives us to explore, learn, and adapt. We continuously seek out new possibilities, question traditional methods, and embrace creative problem-solving to deliver exceptional experiences for our users."
              color="text-purple-600 dark:text-purple-400"
              delay={0.4}
                className='value-card'
            />
            <ValueCard
              icon="🟦"
              title=" Collaboration"
              description="We believe great ideas thrive in collaboration. By fostering a culture of teamwork and open communication, we empower architects, designers, and homeowners to co-create extraordinary living spaces together."
              color="text-green-600 dark:text-green-400"
              delay={0.5}
                className='value-card'
            />
            <ValueCard
              icon="🔶"
              title=" Accountability"
              description="We hold ourselves accountable to our users and partners by delivering reliable, high-quality solutions. Integrity and responsibility guide every aspect of our work, ensuring trust and long-lasting relationships."
              color="text-red-600 dark:text-red-400"
              delay={0.6}
                className='value-card'
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const About: React.FC = () => (
  <DarkModeProvider>
    <AboutContent />
  </DarkModeProvider>
);

export default About;
