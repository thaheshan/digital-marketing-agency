'use client';

import React from 'react';
import Link from 'next/image';
import NextLink from 'next/link';
import { TrendingUp, CheckCircle2, Star } from 'lucide-react';
import styles from './RegistrationLayout.module.css';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  leftTitle?: string;
  leftSubtitle?: string;
  benefits?: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
    avatar: string;
  };
}

export const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  children,
  leftTitle = "Join the Marketing Command Center",
  leftSubtitle = "Transform your digital presence with ROI-driven marketing and real-time insights.",
  benefits = [
    "Professional Campaign Dashboards",
    "Real-Time Analytics & Reporting",
    "Direct Messaging with Your Team",
    "Automated Performance KPI Alerts"
  ],
  testimonial = {
    text: "The DigitalPulse portal has completely changed how we track our growth. Everything we need is in one place.",
    author: "Michael Chen",
    role: "Marketing Director, Growth Solutions",
    avatar: "https://i.pravatar.cc/150?u=michael"
  }
}) => {
  return (
    <div className={styles.page}>
      {/* Left Panel: Social Proof & Marketing */}
      <div className={styles.leftPanel}>
        <div className={styles.leftInner}>
          <NextLink href="/" className={styles.logo}>
            <div className={styles.logoIcon}><TrendingUp size={24} color="#fff" /></div>
            <span className={styles.logoText}>Digital<span className={styles.logoPulse}>Pulse</span></span>
          </NextLink>

          <h1 className={styles.heroTitle}>{leftTitle}</h1>
          <p className={styles.heroSub}>{leftSubtitle}</p>

          <div className={styles.benefitsList}>
            {benefits.map((benefit, idx) => (
              <div key={idx} className={styles.benefitItem}>
                <div className={styles.benefitTick}>
                  <CheckCircle2 size={18} />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#06B6D4" color="#06B6D4" />)}
            </div>
            <p className={styles.quote}>&ldquo;{testimonial.text}&rdquo;</p>
            <div className={styles.author}>
              <img src={testimonial.avatar} alt={testimonial.author} className={styles.avatar} />
              <div>
                <div className={styles.authorName}>{testimonial.author}</div>
                <div className={styles.authorRole}>{testimonial.role}</div>
              </div>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>500+</div>
              <div className={styles.statLabel}>Active Clients</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statValue}>98%</div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>Live Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: The Wizard Form */}
      <div className={styles.rightPanel}>
        <div className={styles.rightInner}>
          {children}
        </div>
      </div>
    </div>
  );
};
