'use client';

import { useState } from 'react';
import { Search, Activity, Globe, Zap, Smartphone, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

interface AuditResult {
  url: string;
  overallScore: number;
  loadTime: number;
  checks: {
    seo: { score: number; issues: string[] };
    performance: { score: number; issues: string[] };
    mobile: { score: number; issues: string[] };
    accessibility: { score: number; issues: string[] };
  };
  opportunityText: string;
}

export default function AuditPage() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const res = await api.post<any>('/tools/website-audit', { url, email });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to scan website. Please check the URL and try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.iconWrapper}>
            <Activity size={32} />
          </div>
          <h1>Free Website <span className={styles.highlight}>Audit</span></h1>
          <p>Instantly analyze your website's performance, SEO, and mobile-friendliness to uncover hidden growth opportunities.</p>
        </div>
      </header>

      <div className={styles.content}>
        {!result ? (
          <div className={styles.scannerCard}>
            <form onSubmit={handleScan} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}
              
              <div className={styles.inputGroup}>
                <label>Website URL</label>
                <div className={styles.urlInput}>
                  <Globe size={20} className={styles.inputIcon} />
                  <input 
                    type="url" 
                    placeholder="https://yourwebsite.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label>Email Address <span className={styles.optional}>(To receive full report)</span></label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.standardInput}
                  required
                />
              </div>

              <button type="submit" className={styles.scanBtn} disabled={isScanning}>
                {isScanning ? (
                  <>Scanning Website <span className={styles.loader}></span></>
                ) : (
                  <>Scan My Website <Search size={18} /></>
                )}
              </button>
            </form>

            <div className={styles.features}>
              <div className={styles.feature}>
                <Zap size={20} /> Performance Check
              </div>
              <div className={styles.feature}>
                <Search size={20} /> SEO Analysis
              </div>
              <div className={styles.feature}>
                <Smartphone size={20} /> Mobile Readiness
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>
              <div>
                <p className={styles.resultsUrl}>{result.url}</p>
                <h2>Audit Complete</h2>
              </div>
              <button className={styles.newScanBtn} onClick={() => setResult(null)}>
                New Scan
              </button>
            </div>

            <div className={styles.scoreGrid}>
              <div className={styles.scoreCard}>
                <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(result.overallScore) }}>
                  <span style={{ color: getScoreColor(result.overallScore) }}>{result.overallScore}</span>
                </div>
                <h3>Overall Quality Score</h3>
                <p>Based on performance and best practices</p>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricItem}>
                  <div className={styles.metricIcon} style={{ background: result.checks.mobile.score > 80 ? '#d1fae5' : '#fee2e2', color: result.checks.mobile.score > 80 ? '#10b981' : '#ef4444' }}>
                    {result.checks.mobile.score > 80 ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  </div>
                  <div className={styles.metricInfo}>
                    <h4>Mobile Friendly</h4>
                    <p>{result.checks.mobile.score > 80 ? 'Your site works well on mobile devices.' : 'Your site has mobile rendering issues.'}</p>
                  </div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricIcon} style={{ background: result.loadTime < 3.0 ? '#d1fae5' : '#fef3c7', color: result.loadTime < 3.0 ? '#10b981' : '#f59e0b' }}>
                    <Zap size={24} />
                  </div>
                  <div className={styles.metricInfo}>
                    <h4>Load Time: {result.loadTime.toFixed(2)}s</h4>
                    <p>{result.loadTime < 3.0 ? 'Excellent loading speed.' : 'Room for speed optimization.'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <h3 className={styles.detailTitle}><AlertTriangle size={20} color="#f59e0b" /> Critical Issues Detected</h3>
                <ul className={styles.issueList}>
                  {result.checks.seo.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                  {result.checks.performance.issues.map((issue, idx) => (
                    <li key={`p_${idx}`}>{issue}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.detailCard}>
                <h3 className={styles.detailTitle}><Activity size={20} color="#0ea5e9" /> AI Analysis</h3>
                <ul className={styles.recommendationList}>
                  <li><ArrowRight size={16} /> {result.opportunityText}</li>
                  {result.checks.seo.score < 80 && (
                    <li><ArrowRight size={16} /> Your SEO score is {result.checks.seo.score}/100. Fixing structural issues is highly recommended.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className={styles.ctaBox}>
              <h3>Need help fixing these issues?</h3>
              <p>Our technical SEO team can resolve these errors and improve your rankings within 30 days.</p>
              <button onClick={() => window.location.href='/contact'} className={styles.ctaBtn}>
                Talk to an Expert
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
