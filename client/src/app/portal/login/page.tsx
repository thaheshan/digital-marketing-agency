'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/common/Button/Button';
import styles from './page.module.css';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(5);

  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    // Basic validation / Mock failure check
    if (email !== 'client@example.com' || password !== 'success') {
      const nextAttempts = attempts - 1;
      setAttempts(nextAttempts > 0 ? nextAttempts : 0);
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    login({
      id: 'c_mock_1',
      name: 'Michael',
      email: email,
      role: 'client',
      company: 'Growth Dynamics',
    });

    router.push('/portal/dashboard');
    setLoading(false);
  };

  const features = [
    { icon: TrendingUp, title: 'Real-Time Analytics', desc: 'Live campaign metrics updated every 15 minutes', color: '#06B6D4' },
    { icon: FileText, title: 'Comprehensive Reports', desc: 'Download detailed performance reports anytime', color: '#3B82F6' },
    { icon: MessageSquare, title: 'Direct Communication', desc: 'Message your account manager instantly', color: '#0891B2' },
  ];

  return (
    <div className={styles.page}>
      {/* Absolute Header Logo */}
      <Link href="/" className={styles.headerLogo}>
        <span className={styles.logoText}>Digital <span className={styles.logoPulse}>Pulse</span></span>
      </Link>

      <div className={styles.leftPanel}>
        <div className={styles.formContainer}>
          <header className={styles.formHeader}>
            <h1 className={styles.headline}>Client Portal</h1>
            <p className={styles.subheadline}>Welcome back! Sign in to view your campaigns</p>
          </header>

          {error && (
            <div className={styles.errorAlert}>
              <div className={styles.errorContent}>
                <AlertCircle size={20} className={styles.errorIcon} />
                <div className={styles.errorText}>
                  {error}
                </div>
              </div>
              <button className={styles.closeError} onClick={() => setError('')}><X size={16} /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
                <Mail size={18} className={styles.icon} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
                <Lock size={18} className={styles.icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={styles.input}
                  required
                />
                <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <div className={styles.attemptsWarn}>
                  <AlertCircle size={14} /> Attempts remaining: {attempts}/5
                </div>
              )}
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <Link href="#" className={styles.forgot}>Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" size="large" fullWidth className={styles.signInBtn} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <button className={styles.googleBtn}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
            Sign in with Google
          </button>

          <div className={styles.securityNote}>
            <ShieldCheck size={16} />
            <span>256-bit SSL Encrypted</span>
          </div>

          <div className={styles.signupBox}>
            Don&apos;t have an account? <Link href="/register">Sign up here</Link>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <h2 className={styles.welcomeTitle}>Welcome to Your Marketing Command Center</h2>
          <p className={styles.welcomeText}>Track performance, access reports, and communicate with your dedicated team—all in one place.</p>

          <div className={styles.featuresList}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={styles.featureItem}>
                  <div className={styles.featureIcon} style={{ color: f.color }}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.featureText}>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
