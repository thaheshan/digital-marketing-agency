'use client';

import Link from 'next/link';
import { Shield, Users, ArrowRight, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

export default function RegisterSelectionPage() {
  return (
    <div className={styles.page}>
      {/* Absolute Header Logo */}
      <Link href="/" className={styles.headerLogo}>
        <span className={styles.logoText}>Digital <span className={styles.logoPulse}>Pulse</span></span>
      </Link>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Join DigitalPulse</h1>
          <p className={styles.subtitle}>Choose your account type to get started</p>
        </header>

        <div className={styles.selectionGrid}>
          <Link href="/register/client" className={styles.selectionCard}>
            <div className={styles.cardIcon}>
              <Users size={32} color="#06B6D4" />
            </div>
            <div className={styles.cardContent}>
              <h3>Register as Customer</h3>
              <p>Sign up to manage your marketing campaigns, track ROI, and view real-time performance analytics.</p>
            </div>
            <div className={styles.cardArrow}>
              <ArrowRight size={20} />
            </div>
          </Link>

          <Link href="/register/staff" className={styles.selectionCard}>
            <div className={styles.cardIcon}>
              <Shield size={32} color="#06B6D4" />
            </div>
            <div className={styles.cardContent}>
              <h3>Register as Staff</h3>
              <p>Create an employee account to manage client portfolios, generate reports, and use agency internal tools.</p>
            </div>
            <div className={styles.cardArrow}>
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        <footer className={styles.footer}>
          <p>Already have an account? <Link href="/portal/login" className={styles.loginLink}>Sign in here</Link></p>
        </footer>
      </div>
    </div>
  );
}
