import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { DarkModeProvider, useDarkMode } from '../contexts/DarkModeContext';
import { Email, Phone, LocationOn, Instagram, LinkedIn } from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import './Contact.css';

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface SubmitStatus {
  type: 'info' | 'success' | 'error';
  message: string;
}

const ContactContent = () => {
  const { isDarkMode } = useDarkMode();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: 'info', message: '' });

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    // Updated Phone validation - exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      message: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setSubmitStatus({ type: 'info', message: 'Sending...' });

        const templateParams = {
          to_email: 'info@sooru.ai',
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          phone: formData.phone,
          company: formData.companyName,
          message: formData.message,
        };

        await emailjs.send(
          'service_omj9n43', // Replace with your EmailJS service ID
          'template_noht5me', // Replace with your EmailJS template ID
          templateParams,
          'JIpt30NTnrd439pGk' // Replace with your EmailJS public key
        );

        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message. We will get back to you soon!'
        });
        clearForm();
      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message. Please try again later.'
        });
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if exists
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value
      }));
      if (errors.phone) {
        setErrors((prev) => ({
          ...prev,
          phone: ''
        }));
      }
    }
  };

  const StatusMessage = ({ status }: { status: SubmitStatus }) => {
    if (!status.message) return null;
    return (
      <div className={`status-message ${status.type}`}>
        {status.message}
      </div>
    );
  };

  return (
    <div className={`contact-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="contact-wrapper">
        {/* Header */}
        <motion.h1
          className="contact-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          GET IN TOUCH!!!
        </motion.h1>

        <div className="contact-content">
          {/* Contact Form */}
          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2  style={{textAlign:"center", marginBottom:"20px"}}>Contact Us</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                    required
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                    required
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder='email@company.com'
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className={errors.phone ? 'error' : ''}
                  required
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <StatusMessage status={submitStatus} />
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="info-item">
              <Email className="info-icon" />
              <div>
                <h3>Email</h3>
                <a href="mailto:info@sooru.ai">info@sooru.ai</a>
              </div>
            </div>

            <div className="info-item">
              <Phone className="info-icon" />
              <div>
                <h3>Phone</h3>
                <a href="tel:+919743810910">+91 97438 10910</a>
              </div>
            </div>

            <div className="info-item">
              <LocationOn className="info-icon" />
              <div>
                <h3>Location</h3>
                <a href="https://maps.app.goo.gl/944JEquL11N1oANYA">
                  <p>No. 816, 27th Main Road,<br />Sector - 1, H S R Layout,<br />Bengaluru 560 102</p>
                </a>
              </div>
            </div>

            <div className="social-links" style={{display:"flex", justifyContent:"center"}}>
              <a href="https://instagram.com/sooru.ai" target="_blank" rel="noopener noreferrer">
                <Instagram className="social-icon" />
              </a>
              <a href="https://linkedin.com/company/sooruai" target="_blank" rel="noopener noreferrer">
                <LinkedIn className="social-icon" />
              </a>
              <a href="https://x.com/Sooru_AI" target="_blank" rel="noopener noreferrer">
                <XIcon className="social-icon" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => (
  <DarkModeProvider>
    <ContactContent />
  </DarkModeProvider>
);

export default Contact;
