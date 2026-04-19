'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      companyName: formData.get('companyName'),
      serviceInterest: formData.get('serviceInterest'),
      budgetRange: formData.get('budgetRange'),
      timeline: formData.get('timeline'),
      message: formData.get('message'),
      source: 'Website Contact Form',
    };

    try {
      // In a real app, track sessionToken from cookie/localstorage
      await api.post('/contact', data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/contact/thank-you');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Let's build something <span className={styles.highlight}>extraordinary</span>.</h1>
        <p>Whether you need a full digital transformation or targeted growth strategies, our team of experts is ready to help you scale.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCol}>
          <div className={styles.infoCard}>
            <h3>Contact Information</h3>
            <p>Fill out the form and our team will get back to you within 24 hours.</p>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <Phone size={20} className={styles.icon} />
                <span>+44 20 7123 4567</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={20} className={styles.icon} />
                <span>hello@digitalpulse.agency</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={20} className={styles.icon} />
                <span>124 Innovation Way, London, UK</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          {success ? (
            <div className={styles.successState}>
              <CheckCircle size={48} className={styles.successIcon} />
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. A specialist will be in touch shortly.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.errorBanner}>{error}</div>}
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name *</label>
                  <input type="text" id="firstName" name="firstName" required placeholder="Jane" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name *</label>
                  <input type="text" id="lastName" name="lastName" required placeholder="Doe" />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required placeholder="jane@company.com" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" placeholder="+44 7123 456789" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="companyName">Company Name</label>
                <input type="text" id="companyName" name="companyName" placeholder="Your Company Ltd" />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="serviceInterest">Service of Interest *</label>
                  <select id="serviceInterest" name="serviceInterest" required>
                    <option value="">Select a service...</option>
                    <option value="Social Media Marketing">Social Media Marketing</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="PPC Advertising">PPC Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Brand Strategy">Brand Strategy</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="budgetRange">Monthly Budget *</label>
                  <select id="budgetRange" name="budgetRange" required>
                    <option value="">Select budget range...</option>
                    <option value="£500 - £1,000">£500 - £1,000</option>
                    <option value="£1,000 - £2,000">£1,000 - £2,000</option>
                    <option value="£2,000 - £4,000">£2,000 - £4,000</option>
                    <option value="£4,000 - £8,000">£4,000 - £8,000</option>
                    <option value="£8,000+">£8,000+</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">How can we help you?</label>
                <textarea id="message" name="message" rows={4} placeholder="Tell us about your project goals or specific challenges..."></textarea>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
