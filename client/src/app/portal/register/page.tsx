'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Building2, Phone, ArrowLeft, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store';
import styles from './page.module.css';

const PLANS = ['Starter — £999/mo', 'Professional — £2,499/mo', 'Enterprise — Contact us'];

export default function ClientRegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', plan: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    await register({ name: form.name, email: form.email, company: form.company, phone: form.phone, role: 'client', password: form.password });
    setLoading(false);
    router.push('/portal/dashboard');
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e'];

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.inner}>
          <Link href="/register" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to selection
          </Link>

          <div className={styles.logo}>
            <div className={styles.logoIcon}><TrendingUp size={20} color="#06B6D4" /></div>
            <span>Digital<span className={styles.accent}>Pulse</span></span>
          </div>

          <div className={styles.heading}>
            <h1>Create Account</h1>
            <p>Set up your client portal to track campaigns and performance</p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputGroup}>
                  <User size={16} className={styles.inputIcon} />
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Sarah Thompson" className={styles.input} required />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Company</label>
                <div className={styles.inputGroup}>
                  <Building2 size={16} className={styles.inputIcon} />
                  <input value={form.company} onChange={e => set('company', e.target.value)}
                    placeholder="Glow Skincare" className={styles.input} />
                </div>
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputGroup}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="you@company.com" className={styles.input} required />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <div className={styles.inputGroup}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+44 7700 900123" className={styles.input} />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Service Plan</label>
              <select value={form.plan} onChange={e => set('plan', e.target.value)} className={styles.select}>
                <option value="">Select a plan</option>
                {PLANS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputGroup}>
                <Lock size={16} className={styles.inputIcon} />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 8 characters" className={styles.input} required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className={styles.strengthRow}>
                  {[1, 2, 3].map(n => (
                    <div key={n} className={styles.strengthBar}
                      style={{ background: n <= strength ? strengthColor[strength] : '#e5e7eb' }} />
                  ))}
                  <span style={{ color: strengthColor[strength], fontSize: 12 }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputGroup}>
                <Lock size={16} className={styles.inputIcon} />
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Repeat password" className={styles.input} required />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchLink}>Already have an account? <Link href="/portal/login">Sign in</Link></p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightInner}>
          <h2>Track Your ROI in Real Time</h2>
          <p>Your client portal gives you full transparency into every campaign we run for you.</p>
          <ul className={styles.benefitList}>
            {['Live campaign dashboards', 'Downloadable PDF reports', 'Direct messaging with your team', 'Invoice history and payments', 'Goal tracking and KPI alerts'].map(b => (
              <li key={b}><span className={styles.tick}>✓</span>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
