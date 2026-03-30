'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '', email: '', company: '', phone: '', service: '', budget: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Let&apos;s Grow Together</h1>
          <p className={styles.heroSub}>Tell us about your goals and we&apos;ll craft a strategy tailored to your business.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Form */}
            <div className={styles.formWrap}>
              {submitted ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✅</div>
                  <h2>Thank You!</h2>
                  <p>We&apos;ve received your message and will get back to you within 24 hours.</p>
                  <Button variant="primary" size="medium" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <h2 className={styles.formTitle}>Send Us a Message</h2>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Full Name *</label>
                      <input name="name" value={formState.name} onChange={handleChange} required placeholder="John Smith" className={styles.input} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email Address *</label>
                      <input name="email" type="email" value={formState.email} onChange={handleChange} required placeholder="john@company.com" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Company Name</label>
                      <input name="company" value={formState.company} onChange={handleChange} placeholder="Your Company" className={styles.input} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Phone Number</label>
                      <input name="phone" type="tel" value={formState.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Service Interested In</label>
                      <select name="service" value={formState.service} onChange={handleChange} className={styles.input}>
                        <option value="">Select a service...</option>
                        <option>Social Media Marketing</option>
                        <option>SEO Optimization</option>
                        <option>Content Marketing</option>
                        <option>PPC Advertising</option>
                        <option>Brand Strategy</option>
                        <option>Email Marketing</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Monthly Budget</label>
                      <select name="budget" value={formState.budget} onChange={handleChange} className={styles.input}>
                        <option value="">Select budget range...</option>
                        <option>Under $2,000/mo</option>
                        <option>$2,000 – $5,000/mo</option>
                        <option>$5,000 – $10,000/mo</option>
                        <option>$10,000+/mo</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Tell Us About Your Goals *</label>
                    <textarea name="message" value={formState.message} onChange={handleChange} required placeholder="What are you hoping to achieve? What challenges are you facing?" className={styles.textarea} rows={5} />
                  </div>
                  <Button type="submit" variant="primary" size="large" fullWidth>Send Message 🚀</Button>
                </form>
              )}
            </div>

            {/* Info Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Why Work With Us?</h3>
                <div className={styles.infoList}>
                  {[
                    { icon: '⚡', title: 'Fast Response', desc: 'We reply to all inquiries within 24 hours.' },
                    { icon: '🎯', title: 'Strategy First', desc: 'Every campaign starts with a data-driven roadmap.' },
                    { icon: '📈', title: 'Proven ROI', desc: 'Average 180% ROI across our client base.' },
                    { icon: '🤝', title: 'Dedicated Team', desc: 'Your own account manager from day one.' },
                  ].map((item) => (
                    <div key={item.title} className={styles.infoItem}>
                      <span className={styles.infoIcon}>{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.contactDetails}>
                <h4 className={styles.contactTitle}>Direct Contact</h4>
                {[
                  { icon: '📧', label: 'Email', value: 'hello@digitalagency.com' },
                  { icon: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: '📍', label: 'Office', value: '123 Marketing Lane, NY 10001' },
                  { icon: '⏰', label: 'Hours', value: 'Mon–Fri, 9am–6pm EST' },
                ].map((c) => (
                  <div key={c.label} className={styles.contactItem}>
                    <span>{c.icon}</span>
                    <div>
                      <span className={styles.contactLabel}>{c.label}</span>
                      <span className={styles.contactValue}>{c.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
