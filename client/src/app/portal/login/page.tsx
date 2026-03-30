'use client';

import { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/portal/dashboard';
    }, 1500);
  };

  const features = [
    { icon: TrendingUp, title: 'Real-Time Analytics', desc: 'Track your campaign performance with live, data-driven insights.' },
    { icon: FileText, title: 'Detailed Reports', desc: 'Download comprehensive monthly summaries of your ROI and reach.' },
    { icon: MessageSquare, title: 'Direct Access', desc: 'Communicate instantly with your dedicated account management team.' },
  ];

  return (
    <div className={styles.page}>
      {/* Left Panel — Form */}
      <div className={styles.leftPanel}>
        <div className={styles.formContainer}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}><TrendingUp size={22} color="#06B6D4" /></div>
            <span className={styles.logoText}>Digital<span className={styles.logoAccent}>Pulse</span></span>
          </Link>

          <header className={styles.formHeader}>
            <h1 className={styles.headline}>Client Portal</h1>
            <p className={styles.subheadline}>Welcome back! Sign in to manage your campaigns.</p>
          </header>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.icon} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles.input}
                  required
                />
                <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span>Keep me signed in</span>
              </label>
              <Link href="#" className={styles.forgot}>Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          <div className={styles.divider}><span>or continue with</span></div>

          <div className={styles.socialAuth}>
             <button className={styles.socialBtn}>Google</button>
             <button className={styles.socialBtn}>GitHub</button>
          </div>

          <div className={styles.securityNote}>
            <ShieldCheck size={14} />
            <span>Secure 256-bit SSL encrypted connection</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Brand Showcase */}
      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <div className={styles.rightBadge}>New Platform Features v2.4</div>
          <h2 className={styles.welcomeTitle}>Manage Your Marketing ROI Like Never Before</h2>
          <p className={styles.welcomeText}>The DigitalPulse portal gives you total transparency into every dollar spent and every lead generated.</p>

          <div className={styles.featuresList}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={styles.featureItem}>
                  <div className={styles.featureIcon}><Icon size={20} /></div>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.testimonial}>
            <p>&ldquo;Providing this level of transparency for our clients is why we chose DigitalPulse. The portal is a game changer.&rdquo;</p>
            <div className={styles.author}>
               <div className={styles.authorImg}>AL</div>
               <div>
                  <strong>Alex Linden</strong>
                  <span>Head of Marketing, Solas</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
