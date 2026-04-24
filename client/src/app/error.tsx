'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store';
import styles from './error.module.css';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const { user } = useAuthStore();
  const homeLink = user ? '/admin/dashboard' : '/';

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon}>⚠</div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>
          An unexpected error occurred. Our team has been notified.
        </p>
        <p className={styles.detail}>{error?.message}</p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.retryBtn}>Try Again</button>
          <Link href={homeLink} className={styles.homeBtn}>← Go Home</Link>
        </div>
      </div>
    </div>
  );
}
