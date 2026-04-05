'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Key, ArrowLeft, Shield } from 'lucide-react';
import { useAuthStore } from '@/store';
import styles from './page.module.css';

const STAFF_ROLES = ['Content Manager', 'Account Manager', 'Analyst'] as const;
type StaffRoleType = typeof STAFF_ROLES[number];

export default function StaffRegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', staffRole: '' as StaffRoleType | '', inviteCode: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.inviteCode !== 'STAFF2026') { setError('Invalid invite code. Use STAFF2026 for demo.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!form.staffRole) { setError('Please select a role'); return; }
    setLoading(true);
    await register({ name: form.name, email: form.email, role: 'staff', staffRole: form.staffRole as StaffRoleType, password: form.password });
    setLoading(false);
    router.push('/admin/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.inner}>
          <Link href="/admin/login" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to admin login
          </Link>

          <div className={styles.logo}>
            <div className={styles.logoIcon}><Shield size={18} /></div>
            <span>Staff <span className={styles.accent}>Registration</span></span>
          </div>

          <div className={styles.heading}>
            <h1>Join the Team</h1>
            <p>Create your staff account with an invite code from your administrator</p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputGroup}>
                <User size={16} className={styles.inputIcon} />
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Tom Bradley" className={styles.input} required />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Work Email</label>
              <div className={styles.inputGroup}>
                <Mail size={16} className={styles.inputIcon} />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@digitalpulse.com" className={styles.input} required />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <select value={form.staffRole} onChange={e => set('staffRole', e.target.value)} className={styles.select} required>
                <option value="">Select role</option>
                {STAFF_ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Invite Code</label>
              <div className={styles.inputGroup}>
                <Key size={16} className={styles.inputIcon} />
                <input value={form.inviteCode} onChange={e => set('inviteCode', e.target.value)}
                  placeholder="STAFF2026" className={styles.input} required />
              </div>
              <span className={styles.hint}>Demo code: <strong>STAFF2026</strong></span>
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
              {loading ? 'Creating account...' : 'Create Staff Account'}
            </button>
          </form>

          <p className={styles.switchLink}>Already have an account? <Link href="/admin/login">Sign in</Link></p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightInner}>
          <h2>Agency Staff Access</h2>
          <p>Your role determines what you can access in the admin panel.</p>
          <div className={styles.roleCards}>
            {[
              { role: 'Content Manager', desc: 'Portfolio CMS, Blog editor, Testimonials, AI tools', color: '#06B6D4' },
              { role: 'Account Manager', desc: 'Client accounts, Campaigns, Reports, Messages', color: '#22C55E' },
              { role: 'Analyst', desc: 'Analytics, Campaign data, Report generation', color: '#F97316' },
            ].map(({ role, desc, color }) => (
              <div key={role} className={styles.roleCard}>
                <div className={styles.roleChip} style={{ background: `${color}20`, color }}>{role}</div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
