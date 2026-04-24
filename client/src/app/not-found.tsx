'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store';
import styles from './not-found.module.css';

export default function NotFound() {
  const { user } = useAuthStore();
  const homeLink = user ? '/admin/dashboard' : '/';

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.message}>The page you're looking for doesn't exist or has been moved.</p>
        <div className={styles.actions}>
          <Link href={homeLink} className={styles.homeBtn}>← Go Home</Link>
          <Link href="/contact" className={styles.contactBtn}>Contact Us</Link>
        </div>
        <div className={styles.suggestions}>
          <p>You might be looking for:</p>
          <div className={styles.links}>
            <Link href="/services">Our Services</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/portal/login">Client Portal</Link>
            <Link href="/audit">Free Audit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
