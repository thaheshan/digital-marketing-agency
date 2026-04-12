'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Calculator, CheckCircle2, ShieldCheck, Info, Search, TrendingUp, Users, Heart, Lightbulb, Rocket, Star, ChevronRight, Download, FileText, Table } from 'lucide-react';

type Step = 1 | 2 | 3;

export default function ROICalculatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [showResults, setShowResults] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    industry: '',
    revenue: 50000,
    conversionRateStep1: '',
    trafficStep1: '',
    budgetStep1: '',
    
    targetConversion: 5.0,
    timeframe: '',
    primaryPriority: 'Increase Revenue',
    additionalBudget: 2000,
    
    fullName: '',
    email: '',
    phone: ''
  });

  // Persistence: Load from localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem('roi_form');
    const savedResults = localStorage.getItem('roi_show_results');
    const savedStep = localStorage.getItem('roi_step');

    if (savedForm) setForm(JSON.parse(savedForm));
    if (savedResults === 'true') setShowResults(true);
    if (savedStep) setStep(Number(savedStep) as Step);

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persistence: Save to localStorage
  useEffect(() => {
    localStorage.setItem('roi_form', JSON.stringify(form));
    localStorage.setItem('roi_show_results', showResults.toString());
    localStorage.setItem('roi_step', step.toString());
  }, [form, showResults, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const setNumberVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  }

  const calculateMetrics = () => {
    const traffic = parseInt(form.trafficStep1) || 12000;
    const currentConv = parseFloat(form.conversionRateStep1) || 2.4;
    const targetConv = form.targetConversion;
    const currentRev = form.revenue;
    const currentAdSpend = parseInt(form.budgetStep1) || 4500;
    const extraBudget = form.additionalBudget;
    
    const aov = currentRev / (traffic * (currentConv / 100));
    const currentCustomers = traffic * (currentConv / 100);
    const targetCustomers = traffic * (targetConv / 100);
    const newCustomers = targetCustomers - currentCustomers;
    const newRevenue = newCustomers * aov;
    const totalNewSpend = extraBudget || 2000; 
    const roi = (newRevenue / (currentAdSpend + extraBudget)) * 100;
    
    return {
      newRevenue,
      roi,
      newCustomers,
      timeframe: form.timeframe || '6',
      aov,
      currentCustomers,
      traffic,
      currentConv,
      targetConv,
      totalNewSpend
    };
  };

  const metrics = calculateMetrics();

  const handleDownloadCSV = () => {
    const m = calculateMetrics();
    const headers = ['Metric', 'Current Value', 'Projected Increase', 'Total Projected'];
    const rows = [
      ['Monthly Revenue', `$${form.revenue.toLocaleString()}`, `$${m.newRevenue.toLocaleString()}`, `$${(form.revenue + m.newRevenue).toLocaleString()}`],
      ['Conversion Rate', `${m.currentConv}%`, `${(m.targetConv - m.currentConv).toFixed(1)}%`, `${m.targetConv}%`],
      ['Monthly Customers', Math.round(m.currentCustomers).toString(), Math.round(m.newCustomers).toString(), Math.round(m.currentCustomers + m.newCustomers).toString()],
      ['ROI', '-', '-', `${m.roi.toFixed(0)}%`],
    ];

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ROI_Report_${form.fullName.replace(/\s+/g, '_') || 'Assessment'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloadOpen(false);
  };

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `ROI_Report_${form.fullName.replace(/\s+/g, '_') || 'DigitalPulse'}`;
    window.print();
    document.title = originalTitle;
    setIsDownloadOpen(false);
  };

  const steps = ['Business Info', 'Performance', 'Your Goals'];

  if (showResults) {
    return (
      <div className={styles.page} style={{paddingBottom: '0'}}>
        {/* Global Print Overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            nav, footer, header { display: none !important; }
          }
        ` }} />

        {/* Printable Header */}
        <div className={styles.printHeader}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>DigitalPulse</div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748B' }}>
            <strong>ROI Assessment Report</strong><br />
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Dark Hero Results */}
        <div className={styles.resultsHero}>
          <div className={styles.resultsHeroInner}>
            <div>
              <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <ChevronRight size={14} />
                <Link href="/portfolio">Success Stories</Link>
                <ChevronRight size={14} />
                <span onClick={() => setShowResults(false)} style={{ cursor: 'pointer' }}>ROI Calculator</span>
                <ChevronRight size={14} />
                <span className={styles.activeBreadcrumb}>Results</span>
              </nav>
              <h1 className={styles.resultsHeroTitle}>Your Projected ROI Results</h1>
              <p className={styles.resultsHeroSub}>Based on your {form.industry || 'Business'} at ${form.revenue.toLocaleString()} monthly revenue</p>
              <div className={styles.resultsHeroMetrics}>
                <div className={styles.rhMetricCard}>
                  <div className={styles.rhMetricValue}>+${metrics.newRevenue.toLocaleString()}</div>
                  <div className={styles.rhMetricLabel}>Monthly Growth</div>
                </div>
                <div className={styles.rhMetricCard}>
                  <div className={styles.rhMetricValue}>{metrics.roi.toFixed(0)}%</div>
                  <div className={styles.rhMetricLabel}>Expected ROI</div>
                </div>
                <div className={styles.rhMetricCard}>
                  <div className={styles.rhMetricValue}>{metrics.timeframe} months</div>
                  <div className={styles.rhMetricLabel}>Timeframe</div>
                </div>
              </div>
            </div>
            <div>
              <div className={styles.circularChart}>
                <div className={styles.circularChartInner}>
                  <div className={styles.circValue}>{metrics.roi.toFixed(0)}%</div>
                  <div className={styles.circLabel}>Projected ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.resultsBody}>
          {/* Projected Scenarios */}
          <h2 className={styles.sectionHeading}>Projected Scenarios</h2>
          <p className={styles.sectionSub}>These potential outcomes based on your selected business scenario.</p>
          <div className={styles.scenariosGrid}>
            <div className={styles.scenarioCard}>
              <div className={styles.scenarioName}>Conservative</div>
              <div className={styles.scenarioROI}>{(metrics.roi * 0.6).toFixed(0)}%</div>
              <div className={styles.scenarioRev}>+${(metrics.newRevenue * 0.6).toLocaleString()}</div>
              <div className={styles.scenarioDivider}></div>
              <div className={styles.scenarioRow}><span>Traffic Volume</span><span>{Math.round(metrics.traffic * 0.8).toLocaleString()}</span></div>
              <div className={styles.scenarioRow}><span>Mktg Leads (MQLs)</span><span>{Math.round(metrics.newCustomers * 0.7).toLocaleString()}</span></div>
              <div className={styles.scenarioRow}><span>New Customers</span><span>{Math.round(metrics.newCustomers * 0.6).toLocaleString()}</span></div>
            </div>
            
            <div className={`${styles.scenarioCard} ${styles.scenarioCardActive}`}>
              <div className={styles.scenarioBadge}>RECOMMENDED</div>
              <div className={styles.scenarioName}>Realistic</div>
              <div className={styles.scenarioROI}>{metrics.roi.toFixed(0)}%</div>
              <div className={styles.scenarioRev}>+${metrics.newRevenue.toLocaleString()}</div>
              <div className={styles.scenarioDivider}></div>
              <div className={styles.scenarioRow}><span>Traffic Volume</span><span>{metrics.traffic.toLocaleString()}</span></div>
              <div className={styles.scenarioRow}><span>Mktg Leads (MQLs)</span><span>{Math.round(metrics.newCustomers * 1.5).toLocaleString()}</span></div>
              <div className={styles.scenarioRow}><span>New Customers</span><span>{Math.round(metrics.newCustomers).toLocaleString()}</span></div>
            </div>

            <div className={`${styles.scenarioCard}`}>
              <div className={styles.scenarioName}>Aggressive</div>
              <div className={styles.scenarioROI}>{(metrics.roi * 1.4).toFixed(0)}%</div>
              <div className={styles.scenarioRev}>+${(metrics.newRevenue * 1.4).toLocaleString()}</div>
              <div className={styles.scenarioDivider}></div>
              <div className={styles.scenarioRow}><span>Traffic Volume</span><span>{Math.round(metrics.traffic * 1.2).toLocaleString()}</span></div>
              <div className={styles.scenarioRow}><span>Mktg Leads (MQLs)</span><span>{Math.round(metrics.newCustomers * 2.2).toLocaleString()}</span></div>
              <div className={styles.scenarioRow}><span>New Customers</span><span>{Math.round(metrics.newCustomers * 1.4).toLocaleString()}</span></div>
            </div>
          </div>

          {/* 12-Month Projection */}
          <h2 className={styles.sectionHeading}>12-Month Revenue Projection</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <div></div>
              <div className={styles.chartLegend}>
                <span><span style={{color: '#94A3B8'}}>──</span> Current Revenue</span>
                <span><span style={{color: '#06B6D4'}}>──</span> Projected Revenue</span>
              </div>
            </div>
            <div className={styles.chartFakeSvg}>
               <div className={styles.chartLine}></div>
               <div style={{position: 'absolute', bottom: '20%', left: 0, width: '100%', height: '1px', borderTop: '1px dashed #94A3B8'}}></div>
               <div style={{display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-24px', width: '100%', fontSize: '11px', color: '#94A3B8'}}>
                 <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
               </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <h2 className={styles.sectionHeading}>Estimated Growth Breakdown</h2>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Monthly Growth</th>
                <th>Marketing Spend</th>
                <th>New Customers</th>
                <th>Estimated ROI</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5,6].map(m => {
                const growthFactor = (m / 6);
                const monthlyRev = form.revenue + (metrics.newRevenue * growthFactor);
                const monthlyROI = (metrics.roi * growthFactor);
                return (
                  <tr key={m}>
                    <td>Month {m}</td>
                    <td>${Math.round(monthlyRev).toLocaleString()}</td>
                    <td className={styles.dataGreen}>↑ {Math.round((metrics.newRevenue * growthFactor / form.revenue)*100)}%</td>
                    <td>${form.budgetStep1 || '5,000'}</td>
                    <td>{Math.round(metrics.newCustomers * growthFactor)}</td>
                    <td>{Math.round(monthlyROI)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Investment Breakdown */}
          <h2 className={styles.sectionHeading}>Estimated Investment Allocation</h2>
          <div className={styles.breakdownGrid}>
            <div className={styles.breakChartCard}>
               <div className={styles.donutSvg}>
                 <div className={styles.donutInner}>
                   <div className={styles.donutValue}>${(metrics.totalNewSpend * 12).toLocaleString()}</div>
                   <div className={styles.donutLabel}>Total Invested (1yr)</div>
                 </div>
               </div>
               <div className={styles.legendList}>
                 <div className={styles.legendItem}>
                   <span><span className={styles.legendColor} style={{background: '#06B6D4'}}></span>SEO/Organic</span>
                   <strong>${(metrics.totalNewSpend * 0.4 * 12).toLocaleString()}</strong>
                 </div>
                 <div className={styles.legendItem}>
                   <span><span className={styles.legendColor} style={{background: '#3B82F6'}}></span>Content/Creative</span>
                   <strong>${(metrics.totalNewSpend * 0.25 * 12).toLocaleString()}</strong>
                 </div>
                 <div className={styles.legendItem}>
                   <span><span className={styles.legendColor} style={{background: '#F59E0B'}}></span>Paid Ads Budget</span>
                   <strong>${(metrics.totalNewSpend * 0.2 * 12).toLocaleString()}</strong>
                 </div>
                 <div className={styles.legendItem}>
                   <span><span className={styles.legendColor} style={{background: '#10B981'}}></span>Analytics/CRO</span>
                   <strong>${(metrics.totalNewSpend * 0.15 * 12).toLocaleString()}</strong>
                 </div>
               </div>
            </div>
            <div className={styles.includedCard}>
              <h3 style={{fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px'}}>Service Strategy</h3>
              
              <div className={styles.includedGroup}>
                <h4>Strategy</h4>
                <div className={styles.includedItem}><CheckCircle2 size={14} color="#06B6D4"/> Data-driven market audit</div>
                <div className={styles.includedItem}><CheckCircle2 size={14} color="#06B6D4"/> Competitor gap analysis</div>
                <div className={styles.includedItem}><CheckCircle2 size={14} color="#06B6D4"/> Growth channel mapping</div>
              </div>
              
              <div className={styles.includedGroup}>
                <h4>Execution</h4>
                <div className={styles.includedItem}><CheckCircle2 size={14} color="#06B6D4"/> End-to-end campaign management</div>
                <div className={styles.includedItem}><CheckCircle2 size={14} color="#06B6D4"/> Performance asset production</div>
                <div className={styles.includedItem}><CheckCircle2 size={14} color="#06B6D4"/> Real-time analytics tracking</div>
              </div>
            </div>
          </div>

          <div className={styles.resultsCta}>
             <h2 className={styles.ctaHeading}>Ready to Achieve These Results?</h2>
             <p className={styles.ctaSubhead}>Download your report or schedule a strategy session to get started.</p>
             <div className={styles.ctaBtns}>
               <button className={styles.btnCyan} onClick={() => alert('Strategy call scheduling...')}>Schedule a Strategy Call</button>
               
               <div className={styles.downloadWrapper} ref={dropdownRef}>
                 <button 
                   className={styles.btnDarkOut} 
                   onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                   style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                 >
                   <Download size={18} /> Download Full Report
                 </button>
                 
                 {isDownloadOpen && (
                   <div className={styles.downloadDropdown}>
                     <button onClick={handleDownloadPDF} className={styles.dropdownItem}>
                       <FileText size={16} /> PDF Report (Print-Optimized)
                     </button>
                     <button onClick={handleDownloadCSV} className={styles.dropdownItem}>
                       <Table size={16} /> Data Export (CSV)
                     </button>
                   </div>
                 )}
               </div>
             </div>
          </div>

          {/* Printable Footer (Hidden on screen) */}
          <div className={styles.printFooter}>
            © {new Date().getFullYear()} DigitalPulse Marketing Agency. Internal ROI Projection. Confidential document.
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      
      {/* Hero */}
      <section className={styles.heroBanner}>
        <div className={styles.heroIcon}>
          <Calculator size={28} />
        </div>
        <h1 className={styles.heroTitle}>Calculate Your Potential ROI</h1>
        <p className={styles.heroSub}>Get personalized projections based on your business data in minutes</p>
      </section>

      <section className={styles.layout}>
        
        {/* Left: Interactive Form */}
        <div className={styles.calcCard}>
          
          {/* Progress Indicator */}
          <div className={styles.stepsTracker}>
            <div className={styles.stepConnector}>
               <div className={styles.stepConnectorFill} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            </div>
            
            {steps.map((label, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isComplete = step > num;
              
              return (
                <div key={label} className={styles.stepItem}>
                  <div className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ''} ${isComplete ? styles.stepCircleComplete : ''}`}>
                    {isComplete ? <CheckCircle2 size={18} /> : num}
                  </div>
                  <div className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''} ${isComplete ? styles.stepLabelComplete : ''}`}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Step 1: Tell Us About Your Business (Match Screenshot 2) */}
          {step === 1 && (
            <div>
              <h2 className={styles.formTitle}>Tell Us About Your Business</h2>
              
              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Your Industry <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                </div>
                <select name="industry" value={form.industry} onChange={handleChange} className={styles.input}>
                  <option value="">Select your industry</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="agency">Agency / B2B</option>
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Monthly Revenue <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                  <span className={styles.labelVal}>${form.revenue.toLocaleString()}</span>
                </div>
                <input type="range" name="revenue" min={10000} max={200000} step={5000} value={form.revenue} onChange={setNumberVal} className={styles.sliderTrack} />
              </div>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Current Conversion Rate (%) <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                </div>
                <input type="text" name="conversionRateStep1" value={form.conversionRateStep1} onChange={handleChange} placeholder="e.g., 2.5" className={styles.input} />
              </div>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Monthly Website Traffic <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                </div>
                <input type="text" name="trafficStep1" value={form.trafficStep1} onChange={handleChange} placeholder="e.g., 10,000" className={styles.input} />
                <p style={{fontSize: '12px', color: '#94A3B8', marginTop: '8px'}}>Find this in Google Analytics or your website dashboard</p>
              </div>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Current Monthly Marketing Budget <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                </div>
                <input type="text" name="budgetStep1" value={form.budgetStep1} onChange={handleChange} placeholder="$ e.g., 5,000" className={styles.input} />
              </div>

            </div>
          )}

          {/* Form Step 2: What Are Your Growth Goals (Match Screenshot 1, wait, prompt called it screenshot 1 but step 2 is "Current Performance", actually Screenshot 1 shows Step 2 is active "What Are Your Growth Goals?") */}
          {step === 2 && (
            <div>
              <h2 className={styles.formTitle}>What Are Your Growth Goals?</h2>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Target Revenue Increase (%) <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                  <span className={styles.labelVal}>+{Math.round((form.revenue / 200000) * 100)}%</span>
                </div>
                <input type="range" min={10} max={200} defaultValue={25} className={styles.sliderTrack} />
                <div className={styles.sliderLimits}><span>10%</span><span>100%</span><span>200%</span></div>
              </div>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Conversion Rate Goal (%) <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                  <span className={styles.labelVal}>{form.targetConversion.toFixed(1)}%</span>
                </div>
                <input type="range" name="targetConversion" min={1} max={15} step={0.5} value={form.targetConversion} onChange={setNumberVal} className={styles.sliderTrack} />
                <div className={styles.sliderLimits}><span>1%</span><span>8%</span><span>15%</span></div>
                <p style={{fontSize: '12px', color: '#F59E0B', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  <Lightbulb size={14} /> Current conversion rate: {form.conversionRateStep1 || '2.5'}% (from Step 1)
                </p>
              </div>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Timeframe for Results <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                </div>
                <div className={styles.boxGrid}>
                  <div className={`${styles.boxBtn} ${form.timeframe === '3' ? styles.boxBtnActive : ''}`} onClick={() => setForm(p=>({...p, timeframe: '3'}))}>
                    <strong>3</strong> Months
                  </div>
                  <div className={`${styles.boxBtn} ${form.timeframe === '6' ? styles.boxBtnActive : ''}`} onClick={() => setForm(p=>({...p, timeframe: '6'}))}>
                    <strong>6</strong> Months
                  </div>
                  <div className={`${styles.boxBtn} ${form.timeframe === '12' ? styles.boxBtnActive : ''}`} onClick={() => setForm(p=>({...p, timeframe: '12'}))}>
                    <strong>12</strong> Months
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Step 3: Set Your Growth Goals / Report (Match Screenshot 3) */}
          {step === 3 && (
            <div>
              <h2 className={styles.formTitle}>Set Your Growth Targets?</h2>

              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Primary Business Priority <span style={{color: '#E11D48'}}>*</span> <Info size={14} color="#CBD5E1"/></label>
                </div>
                <div className={styles.priorityGrid}>
                  <div className={`${styles.priorityBtn} ${form.primaryPriority === 'Increase Revenue' ? styles.priorityBtnActive : ''}`} onClick={() => setForm(p=>({...p, primaryPriority: 'Increase Revenue'}))}>
                    <TrendingUp size={24} />
                    <div><h4>Increase Revenue</h4><p>Focus on sales growth</p></div>
                  </div>
                  <div className={`${styles.priorityBtn} ${form.primaryPriority === 'Generate Leads' ? styles.priorityBtnActive : ''}`} onClick={() => setForm(p=>({...p, primaryPriority: 'Generate Leads'}))}>
                    <Users size={24} />
                    <div><h4>Generate Leads</h4><p>Build pipeline volume</p></div>
                  </div>
                  <div className={`${styles.priorityBtn} ${form.primaryPriority === 'Build Brand' ? styles.priorityBtnActive : ''}`} onClick={() => setForm(p=>({...p, primaryPriority: 'Build Brand'}))}>
                    <Search size={24} />
                    <div><h4>Build Brand</h4><p>Increase awareness</p></div>
                  </div>
                  <div className={`${styles.priorityBtn} ${form.primaryPriority === 'Retain Customers' ? styles.priorityBtnActive : ''}`} onClick={() => setForm(p=>({...p, primaryPriority: 'Retain Customers'}))}>
                    <Heart size={24} />
                    <div><h4>Retain Customers</h4><p>Improve loyalty</p></div>
                  </div>
                </div>
              </div>

              <div className={styles.field} style={{marginTop: '32px'}}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>Additional Budget Investment <Info size={14} color="#CBD5E1"/></label>
                  <span className={styles.labelVal}>+${form.additionalBudget.toLocaleString()}</span>
                </div>
                <input type="range" name="additionalBudget" min={0} max={10000} step={500} value={form.additionalBudget} onChange={setNumberVal} className={styles.sliderTrack} />
                <div className={styles.sliderLimits}><span>$0</span><span>$10,000</span></div>
              </div>

              <h2 className={styles.formTitle} style={{marginTop: '48px', marginBottom: '24px'}}>Get Your Personalized ROI Report</h2>
              
              <div className={styles.gridTo2}>
                <div className={styles.field}>
                  <label className={styles.label} style={{marginBottom: '8px', display: 'block'}}>Full Name <span style={{color: '#E11D48'}}>*</span></label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Smith" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} style={{marginBottom: '8px', display: 'block'}}>Email Address <span style={{color: '#E11D48'}}>*</span></label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" className={styles.input} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label} style={{marginBottom: '8px', display: 'block'}}>Phone Number (Optional)</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={styles.input} />
              </div>
            </div>
          )}

          {/* Navigation Floor */}
          <div className={styles.navRow}>
            {step === 1 ? (
              <div className={styles.btnBack} style={{visibility: 'hidden'}}>← Back</div>
            ) : (
              <button className={styles.btnBack} onClick={() => setStep(s => (s - 1) as Step)}>← Previous Step</button>
            )}
            
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              {step === 1 && <span style={{color: '#10B981', fontSize: '13px', fontWeight: 600}}>✓ Progress auto-saved</span>}
              {step < 3 ? (
                <button className={styles.btnNext} onClick={() => setStep(s => (s + 1) as Step)}>Next Step <span style={{marginLeft: '8px'}}>➔</span></button>
              ) : (
                <button className={styles.btnNext} onClick={() => setShowResults(true)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Calculate My ROI <Rocket size={18} /></button>
              )}
            </div>
          </div>

        </div>

        {/* Right: Dynamic Sidebar Layouts */}
        <div className={styles.sidebar}>
          
          {step === 1 && (
            <>
              <div className={styles.darkCard}>
                <h3>Why Calculate ROI?</h3>
                <ul className={styles.checkList}>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> Data-driven projections tailored to your industry</li>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> See potential revenue growth in real numbers</li>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> Free personalized strategy report</li>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> No commitment or credit card required</li>
                </ul>
              </div>

              <div className={styles.lightCard}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <div className={styles.quote}>"The ROI calculator gave us clear insights into what to expect. We saw results within 3 months!"</div>
                <div className={styles.author}>
                  Sarah Johnson
                  <span>CEO, TechFlow Solutions</span>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.darkCard}>
                <h3>Expected Results</h3>
                <ul className={styles.checkList}>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> Data-driven projections tailored to your industry</li>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> Month-by-month revenue growth forecast</li>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> Personalized marketing strategy recommendations</li>
                  <li><CheckCircle2 size={16} className={styles.listIcon}/> Downloadable PDF report with visual charts</li>
                </ul>
              </div>

              <div className={styles.lightCard}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <div className={styles.quote}>"The ROI calculator gave us clear insights into what to expect. We saw a 180% increase in conversions within 4 months!"</div>
                <div className={styles.author}>
                  Michael Chen
                  <span>CMO, GrowthTech Inc.</span>
                </div>
              </div>
              
              <div className={styles.trustBlock}>
                <div className={styles.trustLabel}>Trusted By</div>
                <div className={styles.trustGrid}>
                  <div className={styles.trustIcon}>Google</div>
                  <div className={styles.trustIcon}>Meta</div>
                  <div className={styles.trustIcon}>HubSpot</div>
                  <div className={styles.trustIcon}>Shopify</div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className={styles.darkCard}>
                <h3>Projected Results</h3>
                <div className={styles.statBlock}>
                  <div className={styles.statBlockLabel}>Estimated Revenue Increase</div>
                  <div className={styles.statBlockValue}>+${(form.revenue * 2.5).toLocaleString()}</div>
                  <div className={styles.statBlockSub}>Over {form.timeframe || 6} months</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statBlockLabel}>Expected ROI</div>
                  <div className={styles.statBlockValue}>285%</div>
                  <div className={styles.statBlockSub}>Return on investment</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statBlockLabel}>New Customers</div>
                  <div className={styles.statBlockValue}>+340</div>
                  <div className={styles.statBlockSub}>Projected conversions</div>
                </div>
                <div className={styles.statDisclaimer}>
                  <Info size={14} style={{flexShrink: 0}} /> Calculations based on your inputs and industry benchmarks
                </div>
              </div>

              <div className={styles.guaranteeCard}>
                <div className={styles.guaranteeTitle}>
                  <ShieldCheck size={20} color="#10B981" /> Our Guarantee
                </div>
                <div className={styles.guaranteeText}>
                  If we don't achieve at least 80% of your projected ROI within the agreed timeline, we'll work for free until we do.
                </div>
                <div className={styles.guaranteeCheck}>
                  <CheckCircle2 size={14} /> Performance-based partnership
                </div>
              </div>

              <div className={styles.trustBlock} style={{marginTop: '24px'}}>
                <div className={styles.trustLabel}>Trusted By</div>
                <div className={styles.trustGrid}>
                  <div className={styles.trustIcon}>Google</div>
                  <div className={styles.trustIcon}>Meta</div>
                  <div className={styles.trustIcon}>HubSpot</div>
                  <div className={styles.trustIcon}>Shopify</div>
                </div>
              </div>
            </>
          )}

        </div>

      </section>
    </div>
  );
}
