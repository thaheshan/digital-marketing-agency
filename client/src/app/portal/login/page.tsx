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
  AlertCircle,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/common/Button/Button';
import styles from './page.module.css';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'client' | 'staff'>('client');

  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please try again.');
      return;
    }

    const { user } = useAuthStore.getState();
    
    // Smart Routing based on role and mode
    if (user?.role === 'admin' || user?.role === 'content_manager') {
      router.push('/admin/dashboard');
    } else {
      router.push('/portal/dashboard');
    }
  };



  const features = [
    { icon: TrendingUp, title: 'Real-Time Analytics', desc: 'Live campaign metrics updated every 15 minutes', color: '#06B6D4' },
    { icon: FileText, title: 'Comprehensive Reports', desc: 'Download detailed performance reports anytime', color: '#3B82F6' },
    { icon: MessageSquare, title: 'Direct Communication', desc: 'Message your account manager instantly', color: '#0891B2' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <Link href="/" className={styles.headerLogo}>
          <span className={styles.logoText}>Digital <span className={styles.logoPulse}>Pulse</span></span>
        </Link>

        <div className={styles.formContainer}>
          <div className={styles.modeToggle}>
            <button 
              className={`${styles.modeBtn} ${loginMode === 'client' ? styles.activeMode : ''}`}
              onClick={() => setLoginMode('client')}
            >
              Client Portal
            </button>
            <button 
              className={`${styles.modeBtn} ${loginMode === 'staff' ? styles.activeMode : ''}`}
              onClick={() => setLoginMode('staff')}
            >
              Agency Staff
            </button>
          </div>

          <>
              <header className={styles.formHeader}>
                <h1 className={styles.headline}>
                  {loginMode === 'client' ? 'Client Access' : 'Command Center'}
                </h1>
                <p className={styles.subheadline}>
                  {loginMode === 'client' 
                    ? 'Sign in to view your campaign performance' 
                    : 'Authorized staff entry only. 2FA required.'}
                </p>
              </header>

              {error && (
                <div className={styles.errorAlert}>
                  <div className={styles.errorContent}>
                    <AlertCircle size={20} className={styles.errorIcon} />
                    <div className={styles.errorText}>{error}</div>
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
                      <AlertCircle size={14} /> Please check your credentials and try again.
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

                <Button type="submit" variant="primary" size="large" fullWidth className={styles.signInBtn} disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
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
            </>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <h2 className={styles.welcomeTitle}>
            {loginMode === 'client' 
              ? 'Your Marketing Command Center' 
              : 'Digital Pulse Operations Gate'}
          </h2>
          <p className={styles.welcomeText}>
            {loginMode === 'client'
              ? 'Track performance, access reports, and communicate with your dedicated team—all in one place.'
              : 'Manage clients, analyze lead behavior, and coordinate agency campaigns from a single unified interface.'}
          </p>

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
