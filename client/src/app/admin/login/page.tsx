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
  Users, 
  BarChart2, 
  ChevronLeft,
  AlertCircle,
  Shield,
  Zap,
  Fingerprint
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/common/Button/Button';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please verify your email and password.');
      return;
    }
    router.push('/admin/dashboard');
  };

  const handleSampleAccess = async () => {
    setError('');
    // Demo shortcut — uses the seeded admin account
    const result = await login('admin@agency.com', 'Admin@1234');
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || 'Demo login failed.');
    }
  };

  const features = [
    { icon: Users, title: 'Lead Intelligence', desc: 'Predictive lead scoring and automated pipeline management.' },
    { icon: TrendingUp, title: 'Agency Analytics', desc: 'Holistic performance tracking across every active campaign.' },
    { icon: BarChart2, title: 'Command Center', desc: 'Real-time resource allocation and team workload insights.' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        {/* Absolute Header Logo */}
        <Link href="/" className={styles.headerLogo}>
          <div className={styles.logoIcon}><Zap size={18} /></div>
          <span className={styles.logoText}>Digital <span className={styles.logoAccent}>Pulse</span></span>
        </Link>

        <div className={styles.inner}>
          <>
              <header className={styles.heading}>
                <h1>Admin Command</h1>
                <p>Secure authentication for agency leadership</p>
              </header>

              {error && (
                <div className={styles.errorBox}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.inputGroup}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@digitalpulse.com" 
                      className={styles.input} 
                      required 
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.inputGroup}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••"
                      className={styles.input} 
                      required 
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formMeta}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" /> Remember me
                  </label>
                  <Link href="#" className={styles.forgotLink}>Forgot password?</Link>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? 'Authenticating...' : 'Sign In to Command Center'}
                </button>
              </form>

              <div className={styles.sampleAccess}>
                <p>Sample Access:</p>
                <button className={styles.sampleBadge} onClick={handleSampleAccess}>
                  <Shield size={16} color="#06B6D4" />
                  <strong>Priya Nanthakumar</strong>
                  <span className={styles.role}>Founder & CEO</span>
                </button>
              </div>

              <div className={styles.switchLink}>
                Client access? <Link href="/portal/login">Log in to Portal</Link>
              </div>
            </>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightInner}>
          <h2>The Agency<br />Command Center</h2>
          <p>Orchestrate client campaigns, monitor agency health, and lead your team with data-driven intelligence.</p>
          
          <div className={styles.featureList}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Icon size={22} />
                  </div>
                  <div className={styles.featureText}>
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
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
