'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Search, Smartphone, Shield, AlertTriangle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

type AuditStep = 'input' | 'loading' | 'results';

const MOCK_ISSUES = [
  { severity: 'Critical', category: 'Performance', desc: 'Render-blocking resources delay page load', impact: 'High impact on speed', detail: 'JavaScript and CSS files are blocking the first paint. Move scripts to the bottom and inline critical CSS.' },
  { severity: 'High', category: 'SEO', desc: 'Missing meta descriptions on 12 pages', impact: 'Medium impact on SEO ranking', detail: 'Meta descriptions should be between 150-160 characters and include primary keywords for each page.' },
  { severity: 'Critical', category: 'Performance', desc: 'Unoptimised images increase page weight by 2.4MB', impact: 'High impact on speed', detail: 'Use modern formats (WebP/AVIF) and add width/height attributes. Consider lazy loading for below-fold images.' },
  { severity: 'Medium', category: 'Mobile', desc: 'Tap targets too small on mobile navigation', impact: 'Medium impact on UX', detail: 'Minimum 44×44px tap targets recommended. Some navigation links measure 32×18px on mobile devices.' },
  { severity: 'Low', category: 'SEO', desc: 'No structured data markup detected', impact: 'Low impact on SEO', detail: 'Add Schema.org structured data to improve rich snippet appearance in search results.' },
];

const CATEGORY_SCORES = [
  { label: 'Performance', score: 72, icon: Globe, color: '#06B6D4', issues: 3 },
  { label: 'SEO', score: 58, icon: Search, color: '#F97316', issues: 5 },
  { label: 'Mobile', score: 67, icon: Smartphone, color: '#F97316', issues: 2 },
  { label: 'Security', score: 85, icon: Shield, color: '#22C55E', issues: 1 },
];

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const pct = (score / 100) * circ;
  return (
    <svg width={80} height={80} viewBox="0 0 80 80">
      <circle cx={40} cy={40} r={r} fill="none" stroke="#e5e7eb" strokeWidth={7} />
      <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${pct} ${circ}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      <text x={40} y={44} textAnchor="middle" fontSize={16} fontWeight={800} fill={color}>{score}</text>
    </svg>
  );
}

const LOADING_STEPS = ['Crawling website pages…', 'Analysing performance…', 'Checking SEO metadata…', 'Running mobile tests…', 'Calculating final scores…'];

export default function AuditPage() {
  const [step, setStep] = useState<AuditStep>('input');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setLoadingStep(0);
    const advance = (i: number) => {
      if (i < LOADING_STEPS.length) {
        setTimeout(() => { setLoadingStep(i); advance(i + 1); }, 700);
      } else {
        setTimeout(() => setStep('results'), 600);
      }
    };
    advance(0);
  };

  const overallScore = 68;
  const scoreColor = '#F97316';

  return (
    <div className={styles.page}>
      {/* Hero bar */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Audit Tool</span>
            {step === 'results' && <><span>/</span><span>Results</span></>}
          </div>
          {step === 'results' && (
            <div className={styles.heroActions}>
              <button className={styles.heroBtn}>📄 Download PDF Report</button>
              <button className={styles.heroBtn2} onClick={() => setStep('input')}>Run New Audit</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.main}>
        {/* Input */}
        {step === 'input' && (
          <div className={styles.inputSection}>
            <div className={styles.inputCard}>
              <div className={styles.inputHeading}>
                <h1>Free Website Audit</h1>
                <p>Get an instant breakdown of your website's performance, SEO, mobile-friendliness, and security score.</p>
              </div>
              <form className={styles.auditForm} onSubmit={handleRun}>
                <div className={styles.field}>
                  <label className={styles.label}>Website URL</label>
                  <div className={styles.inputRow}>
                    <Globe size={16} className={styles.fieldIcon} />
                    <input value={url} onChange={e => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com" className={styles.input} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email (to receive your report)</label>
                  <div className={styles.inputRow}>
                    <Search size={16} className={styles.fieldIcon} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com" className={styles.input} />
                  </div>
                </div>
                <button type="submit" className={styles.runBtn}>Run Free Audit <ArrowRight size={16} /></button>
              </form>
            </div>
            <div className={styles.inputBenefits}>
              {['Instant results in under 30 seconds', 'No account required', 'Checks 20+ performance metrics', 'Free PDF report included'].map(b => (
                <div key={b} className={styles.benefit}><span className={styles.tick}>✓</span>{b}</div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {step === 'loading' && (
          <div className={styles.loadingSection}>
            <div className={styles.loadingCard}>
              <div className={styles.spinner} />
              <h2>Auditing {url}</h2>
              <div className={styles.loadingSteps}>
                {LOADING_STEPS.map((s, i) => (
                  <div key={i} className={`${styles.loadStep} ${i <= loadingStep ? styles.loadDone : ''} ${i === loadingStep ? styles.loadActive : ''}`}>
                    <span className={styles.loadDot} />
                    {s}
                  </div>
                ))}
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill}
                  style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && (
          <div className={styles.resultsSection}>
            {/* Overview header */}
            <div className={styles.resultsHero}>
              <div className={styles.resultsMeta}>
                <h1 className={styles.resultsTitle}>Audit Results</h1>
                <div className={styles.resultsUrl}>
                  <Globe size={14} />{url || 'www.example-website.com'}
                </div>
                <div className={styles.resultsDate}>Scanned on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                <div className={styles.statsRow}>
                  <div className={styles.statBox}><strong>18</strong><span>Issues Found</span></div>
                  <div className={styles.statBox}><strong>5</strong><span>Critical Issues</span></div>
                  <div className={styles.statBox}><strong>3.8s</strong><span>Page Load Time</span></div>
                  <div className={styles.statBox}><strong>67%</strong><span>Mobile Score</span></div>
                </div>
              </div>
              <div className={styles.overallRing}>
                <svg width={140} height={140} viewBox="0 0 140 140">
                  <circle cx={70} cy={70} r={56} fill="none" stroke="#e5e7eb" strokeWidth={10} />
                  <circle cx={70} cy={70} r={56} fill="none" stroke={scoreColor} strokeWidth={10}
                    strokeDasharray={`${(overallScore / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                    strokeDashoffset={2 * Math.PI * 56 * 0.25} strokeLinecap="round" />
                  <text x={70} y={65} textAnchor="middle" fontSize={32} fontWeight={800} fill={scoreColor}>{overallScore}</text>
                  <text x={70} y={82} textAnchor="middle" fontSize={11} fill="#94a3b8">/100</text>
                </svg>
                <span className={styles.overallLabel} style={{ background: `${scoreColor}20`, color: scoreColor }}>Needs Improvement</span>
              </div>
            </div>

            {/* Category cards */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Performance by Category</h2>
              <p className={styles.sectionSub}>Detailed scores across {MOCK_ISSUES.length} total issues · {MOCK_ISSUES.filter(i => i.severity === 'Critical').length} critical</p>
              <div className={styles.catGrid}>
                {CATEGORY_SCORES.map(cat => {
                  const Icon = cat.icon;
                  const catColor = cat.score >= 80 ? '#22c55e' : cat.score >= 60 ? '#06b6d4' : '#f97316';
                  return (
                    <div key={cat.label} className={styles.catCard}>
                      <div className={styles.catIcon} style={{ background: `${catColor}15` }}>
                        <Icon size={20} color={catColor} />
                      </div>
                      <span className={styles.catLabel}>{cat.label}</span>
                      <ScoreRing score={cat.score} color={catColor} />
                      <span className={styles.catMeta}>{cat.issues} {cat.issues === 1 ? 'issue' : 'issues'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Issues */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Issues Found</h2>
              <p className={styles.sectionSub}>{MOCK_ISSUES.length} total issues across all categories — prioritised by impact</p>
              <div className={styles.issueTabs}>
                <button className={`${styles.issueTab} ${styles.issueTabActive}`}>All Issues {MOCK_ISSUES.length}</button>
                <button className={styles.issueTab}>Critical {MOCK_ISSUES.filter(i => i.severity === 'Critical').length}</button>
                <button className={styles.issueTab}>High Priority {MOCK_ISSUES.filter(i => i.severity === 'High').length}</button>
                <button className={styles.issueTab}>Medium {MOCK_ISSUES.filter(i => i.severity === 'Medium').length}</button>
                <button className={styles.issueTab}>Low {MOCK_ISSUES.filter(i => i.severity === 'Low').length}</button>
              </div>
              <div className={styles.issueList}>
                {MOCK_ISSUES.map((issue, i) => {
                  const sevColor = issue.severity === 'Critical' ? '#ef4444' : issue.severity === 'High' ? '#f97316' : issue.severity === 'Medium' ? '#f59e0b' : '#94a3b8';
                  return (
                    <div key={i} className={styles.issueRow}>
                      <div className={styles.issueMain} onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}>
                        <span className={styles.sevBadge} style={{ background: `${sevColor}15`, color: sevColor }}>{issue.severity}</span>
                        <span className={styles.issueDesc}>{issue.desc}</span>
                        <span className={styles.catBadge}>{issue.category}</span>
                        <span className={styles.impactLabel}>{issue.impact}</span>
                        {expandedIssue === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      {expandedIssue === i && (
                        <div className={styles.issueDetail}>{issue.detail}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <h2>Need Help Fixing These Issues?</h2>
              <p>Our team of experts can optimise your website and fix all {MOCK_ISSUES.length} identified issues.</p>
              <div className={styles.ctaBenefits}>
                {['Fixes in 7–14 days', 'Guaranteed score improvement', '30-day money-back guarantee'].map(b => (
                  <div key={b} className={styles.ctaBenefit}><span>✓</span>{b}</div>
                ))}
              </div>
              <div className={styles.ctaActions}>
                <Link href="/contact" className={styles.ctaBtn}>Get Professional Help</Link>
                <button className={styles.ctaBtnOutline}>📄 Download Full Report</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
