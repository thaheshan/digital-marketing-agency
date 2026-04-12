'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield, TrendingUp, Users, BarChart2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, verifyTwoFA } = useAuthStore();

  const [step, setStep] = useState<'credentials' | 'twofa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, 'admin');
    setLoading(false);
    if (!result.success) {
      setError('Invalid credentials. Try admin@digitalpulse.com / admin123');
      return;
    }
    if (result.requiresTwoFA) {
      setStep('twofa');
    } else {
      router.push('/admin/dashboard');
    }
  };

  const handleCodeChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleTwoFA = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) { setError('Enter the 6-digit code'); return; }
    const ok = verifyTwoFA(fullCode);
    if (ok) { router.push('/admin/dashboard'); }
    else { setError('Invalid code. Use 123456 for demo.'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.inner}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to website
          </Link>

          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}><Shield size={20} /></div>
            <span>Admin <span className={styles.accent}>Panel</span></span>
          </Link>

          {step === 'credentials' ? (
            <>
              <div className={styles.heading}>
                <h1>Admin Sign In</h1>
                <p>Secure access for agency staff and administrators</p>
              </div>

              {error && <div className={styles.errorBox}>{error}</div>}

              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <div className={styles.inputGroup}>
                    <Mail size={17} className={styles.inputIcon} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="admin@digitalpulse.com" className={styles.input} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.inputGroup}>
                    <Lock size={17} className={styles.inputIcon} />
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      className={styles.input} required />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                <div className={styles.formMeta}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" /> Remember me
                  </label>
                  <Link href="#" className={styles.forgotLink}>Forgot password?</Link>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className={styles.switchLink}>
                Staff member? <Link href="/admin/register">Request access here</Link>
              </p>
              <p className={styles.switchLink}>
                Client? <Link href="/portal/login">Go to Client Portal</Link>
              </p>
            </>
          ) : (
            <>
              <div className={styles.heading}>
                <h1>Two-Factor Auth</h1>
                <p>Enter the 6-digit code from your authenticator app</p>
              </div>

              {error && <div className={styles.errorBox}>{error}</div>}

              <form className={styles.form} onSubmit={handleTwoFA}>
                <div className={styles.otpRow}>
                  {code.map((c, i) => (
                    <input
                      key={i} id={`otp-${i}`}
                      className={styles.otpBox}
                      maxLength={1} value={c}
                      onChange={e => handleCodeChange(e.target.value, i)}
                      onKeyDown={e => e.key === 'Backspace' && !c && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
                    />
                  ))}
                </div>
                <p className={styles.demoHint}>Demo hint: enter <strong>123456</strong></p>
                <button type="submit" className={styles.submitBtn}>Verify &amp; Continue</button>
                <button type="button" className={styles.backBtn} onClick={() => { setStep('credentials'); setError(''); setCode(['','','','','','']); }}>
                  ← Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightInner}>
          <h2>Agency Intelligence<br />Command Centre</h2>
          <p>Manage leads, portfolio, campaigns, and analytics from one secure dashboard.</p>
          <div className={styles.featureList}>
            {[
              { icon: Users, title: 'Lead Management', desc: 'Score and convert enquiries automatically' },
              { icon: TrendingUp, title: 'Campaign Analytics', desc: 'Real-time performance across all channels' },
              { icon: BarChart2, title: 'Content CMS', desc: 'Portfolio, blog, and AI content tools' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className={styles.featureItem}>
                <div className={styles.featureIcon}><Icon size={18} /></div>
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
