'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

type Step = 1 | 2 | 3;

const industries = [
  'E-commerce & Retail', 'SaaS & Technology', 'Professional Services',
  'Healthcare & Medical', 'Real Estate', 'Education & Training',
  'Finance & Insurance', 'Other',
];

export default function ROICalculatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [showResults, setShowResults] = useState(false);

  const [form, setForm] = useState({
    industry: '',
    revenue: 50000,
    conversionRate: 2.5,
    monthlyTraffic: 10000,
    marketingBudget: 5000,
    targetGrowth: 30,
    timeframe: '6 months',
    primaryGoal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'revenue' || name === 'conversionRate' || name === 'monthlyTraffic' || name === 'marketingBudget' || name === 'targetGrowth' ? Number(value) : value }));
  };

  // Simple ROI projections
  const projectedNewRevenue = Math.round(form.revenue * (1 + (form.targetGrowth / 100)));
  const projectedNewLeads = Math.round((form.monthlyTraffic * (form.conversionRate / 100)) * (1 + (form.targetGrowth / 100)));
  const estimatedROI = Math.round(((projectedNewRevenue - form.revenue - form.marketingBudget) / form.marketingBudget) * 100);

  const steps = ['Business Info', 'Current Performance', 'Your Goals'];

  const isStep1Valid = form.industry !== '' && form.revenue >= 10000 && form.marketingBudget >= 500;
  const isStep2Valid = form.conversionRate >= 0.1 && form.monthlyTraffic >= 100;
  const isStep3Valid = form.primaryGoal !== '';

  const canProceed = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

  if (showResults) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroIcon}>📊</div>
          <h1 className={styles.heroTitle}>Your ROI Projection</h1>
          <p className={styles.heroSub}>Based on your inputs, here&apos;s what we project.</p>
        </section>
        <section className={styles.resultsSection}>
          <div className={styles.container}>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>💰</div>
                <div className={styles.metricValue}>${projectedNewRevenue.toLocaleString()}</div>
                <div className={styles.metricLabel}>Projected Monthly Revenue</div>
                <div className={styles.metricSub}>vs current ${form.revenue.toLocaleString()}</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>🎯</div>
                <div className={styles.metricValue}>{projectedNewLeads}</div>
                <div className={styles.metricLabel}>Estimated New Leads/Mo</div>
                <div className={styles.metricSub}>with optimized conversion</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>📈</div>
                <div className={styles.metricValue}>{estimatedROI > 0 ? '+' : ''}{estimatedROI}%</div>
                <div className={styles.metricLabel}>Projected ROI</div>
                <div className={styles.metricSub}>on your marketing investment</div>
              </div>
            </div>

            <div className={styles.resultsCta}>
              <h3>Ready to Achieve These Results?</h3>
              <p>Our experts will create a custom strategy backed by these projections.</p>
              <div className={styles.resultsBtns}>
                <Button variant="primary" size="large">Get Your Free Strategy Call</Button>
                <Button variant="outline" size="medium" onClick={() => { setShowResults(false); setStep(1); }}>Recalculate</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>🧮</div>
        <h1 className={styles.heroTitle}>Calculate Your Potential ROI</h1>
        <p className={styles.heroSub}>Get personalized projections based on your business data in minutes</p>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.layout}>
          {/* Calculator Card */}
          <div className={styles.calcCard}>
            {/* Step Indicator */}
            <div className={styles.steps}>
              {steps.map((label, i) => {
                const n = (i + 1) as Step;
                const isComplete = step > n;
                const isActive = step === n;
                return (
                  <div key={label} className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${isActive ? styles.stepActive : ''} ${isComplete ? styles.stepComplete : ''}`}>
                      {isComplete ? '✓' : n}
                    </div>
                    <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''} ${isComplete ? styles.stepLabelComplete : ''}`}>{label}</span>
                    {i < steps.length - 1 && <div className={`${styles.stepConnector} ${isComplete ? styles.stepConnectorFilled : ''}`} />}
                  </div>
                );
              })}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Tell Us About Your Business</h3>
                <div className={styles.field}>
                  <label className={styles.label}>Your Industry <span className={styles.req}>*</span></label>
                  <select name="industry" value={form.industry} onChange={handleChange} className={styles.input}>
                    <option value="">Select your industry...</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>

                <div className={styles.field}>
                  <div className={styles.sliderHeader}>
                    <label className={styles.label}>Monthly Revenue <span className={styles.req}>*</span></label>
                    <span className={styles.sliderValue}>${form.revenue.toLocaleString()}</span>
                  </div>
                  <input type="range" name="revenue" min={10000} max={1000000} step={10000} value={form.revenue} onChange={handleChange} className={styles.slider} />
                  <div className={styles.sliderRange}><span>$10k</span><span>$1M</span></div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Monthly Marketing Budget <span className={styles.req}>*</span></label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>$</span>
                    <input type="number" name="marketingBudget" min={500} step={100} value={form.marketingBudget} onChange={handleChange} className={`${styles.input} ${styles.inputPrefixed}`} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Current Performance</h3>
                <div className={styles.field}>
                  <div className={styles.sliderHeader}>
                    <label className={styles.label}>Current Conversion Rate</label>
                    <span className={styles.sliderValue}>{form.conversionRate}%</span>
                  </div>
                  <input type="range" name="conversionRate" min={0.1} max={20} step={0.1} value={form.conversionRate} onChange={handleChange} className={styles.slider} />
                  <div className={styles.sliderRange}><span>0.1%</span><span>20%</span></div>
                  <p className={styles.helperText}>Industry average is 2–5%</p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Monthly Website Traffic</label>
                  <input type="number" name="monthlyTraffic" min={100} step={100} value={form.monthlyTraffic} onChange={handleChange} className={styles.input} placeholder="e.g. 10,000" />
                  <p className={styles.helperText}>Find this in Google Analytics or your website dashboard</p>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Define Your Goals</h3>
                <div className={styles.field}>
                  <div className={styles.sliderHeader}>
                    <label className={styles.label}>Target Revenue Growth</label>
                    <span className={styles.sliderValue}>{form.targetGrowth}%</span>
                  </div>
                  <input type="range" name="targetGrowth" min={10} max={200} step={5} value={form.targetGrowth} onChange={handleChange} className={styles.slider} />
                  <div className={styles.sliderRange}><span>10%</span><span>200%</span></div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Primary Goal <span className={styles.req}>*</span></label>
                  <div className={styles.goalGrid}>
                    {['Increase brand awareness', 'Generate more leads', 'Boost sales revenue', 'Improve customer retention'].map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        className={`${styles.goalBtn} ${form.primaryGoal === goal ? styles.goalBtnActive : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, primaryGoal: goal }))}
                      >{goal}</button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Desired Timeframe</label>
                  <select name="timeframe" value={form.timeframe} onChange={handleChange} className={styles.input}>
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                    <option>24 months</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className={styles.navBtns}>
              {step > 1 && <Button variant="outline" size="medium" onClick={() => setStep(prev => (prev - 1) as Step)}>← Back</Button>}
              <div className={styles.navRight}>
                <p className={styles.autoSave}>✓ Progress auto-saved</p>
                {step < 3
                  ? <Button variant="primary" size="medium" disabled={!canProceed} onClick={() => setStep(prev => (prev + 1) as Step)}>Next Step →</Button>
                  : <Button variant="primary" size="medium" disabled={!canProceed} onClick={() => setShowResults(true)}>Calculate My ROI 🚀</Button>
                }
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.whyCard}>
              <h4 className={styles.whyTitle}>Why Calculate ROI?</h4>
              <ul className={styles.whyList}>
                {['Data-driven projections tailored to your industry', 'See potential revenue growth in real numbers', 'Free personalized strategy report', 'No commitment or credit card required'].map(item => (
                  <li key={item} className={styles.whyItem}><span className={styles.whyCheck}>✓</span>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.stars}>{'★'.repeat(5)}</div>
              <p className={styles.testimonialQuote}>&ldquo;The ROI calculator gave us clear insights. We saw results within 3 months!&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <strong>Sarah Johnson</strong>
                <span>CEO, TechFlow Solutions</span>
              </div>
            </div>

            <div className={styles.badgesCard}>
              <p className={styles.badgesLabel}>TRUSTED BY</p>
              <div className={styles.badges}>
                {['Google Partner', 'Meta Partner', 'HubSpot Certified', 'Shopify Partner'].map(b => (
                  <span key={b} className={styles.badge}>{b}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
