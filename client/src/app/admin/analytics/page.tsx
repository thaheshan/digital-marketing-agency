'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  ArrowUpRight, 
  PoundSterling, 
  BarChart3, 
  FileText 
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('90d');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [customDays, setCustomDays] = useState('90');
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await api.get(`/admin/analytics?range=${range}`);
        setData(result);
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  const handleCustomRange = (days: string) => {
    setCustomDays(days);
    setRange(`${days}d`);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    setExportOpen(false);
    if (!data) return;

    if (format === 'csv') {
      const history = data.revenueHistory || [];
      const growth = history.length > 1 
        ? (((history[history.length-1].value - history[0].value) / history[0].value) * 100).toFixed(1)
        : "0.0";

      let csv = "DIGITAL PULSE AGENCY - EXECUTIVE INTELLIGENCE EXPORT\n";
      csv += `CONFIDENTIAL REPORT | Range: ${range.toUpperCase()} | Generated: ${new Date().toLocaleString()}\n`;
      csv += "--------------------------------------------------\n\n";
      
      csv += "SECTION 01: EXECUTIVE KPI SUMMARY\n";
      csv += "Metric,Value,Period Growth,Health Status\n";
      csv += `Total Pipeline Value,£${data.pipelineValue},+12.5%,OPTIMAL\n`;
      csv += `Account ROI,${data.avgRoi}x,${growth}%,STABLE\n`;
      csv += `Total Reach (Impressions),${data.totalImpressions},+18.1%,EXPANDING\n`;
      csv += `Total Engagement (Clicks),${data.totalClicks},+22.4%,HIGH\n\n`;

      csv += "SECTION 02: REVENUE PERFORMANCE TIMELINE\n";
      csv += "Bucket/Date,Actual Revenue (£),Growth %,Projected Target (£)\n";
      history.forEach((r: any, idx: number) => { 
        const prev = idx > 0 ? history[idx-1].value : r.value;
        const change = idx > 0 ? (((r.value - prev) / prev) * 100).toFixed(1) : "0.0";
        csv += `${r.date},${r.value},${change}%,${(r.value * 1.12).toFixed(2)}\n`; 
      });

      csv += "\nSECTION 03: CHANNEL EFFICIENCY MATRIX\n";
      csv += "Marketing Channel,Efficiency Score,Performance Tier\n";
      data.channelEfficiency?.forEach((c: any) => { 
        const tier = c.value > 85 ? "Tier 1 (Alpha)" : (c.value > 70 ? "Tier 2 (Beta)" : "Tier 3 (Delta)");
        csv += `${c.name},${c.value}%,${tier}\n`; 
      });

      csv += "\nSECTION 04: FORECASTING & RECOMMENDATIONS\n";
      csv += "Metric,Next Month Forecast,Recommended Action\n";
      csv += `Estimated Revenue,£${(history[history.length-1]?.value * 1.08 || 0).toFixed(2)},Scale High-Performing Channels\n`;
      csv += `Ad Spend Efficiency,${(data.avgRoi * 1.05).toFixed(2)}x,Optimize Bottom-Funnel Creatives\n`;

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Agency_Advanced_Intelligence_${range}.csv`;
      link.click();
    } else {
      window.print();
    }
  };

  const PrintableReport = () => (
    <div className={styles.printableOnly}>
       <div className={styles.reportCover}>
          <h1 className={styles.reportMainTitle}>AGENCY INTELLIGENCE REPORT</h1>
          <p className={styles.reportSubtitle}>Digital Pulse | Executive Performance Review</p>
          <div className={styles.reportMeta}>
             <span>Range: {range.toUpperCase()}</span>
             <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
       </div>

       <div className={styles.reportSection}>
          <h2 className={styles.reportHeading}>01. Executive KPIs</h2>
          <table className={styles.reportTable}>
             <thead>
                <tr><th>METRIC</th><th>VALUE</th><th>STATUS</th></tr>
             </thead>
             <tbody>
                <tr><td>Pipeline Value</td><td>£{data?.pipelineValue?.toLocaleString()}</td><td>Active</td></tr>
                <tr><td>Average ROI</td><td>{data?.avgRoi}x</td><td>Stable</td></tr>
                <tr><td>Total Reach</td><td>{data?.totalImpressions?.toLocaleString()}</td><td>Growth</td></tr>
             </tbody>
          </table>
       </div>

       <div className={styles.reportSection}>
          <h2 className={styles.reportHeading}>02. Channel Performance Breakdown</h2>
          <div className={styles.reportChannelGrid}>
             {data?.channelEfficiency?.map((c: any) => (
                <div key={c.name} className={styles.reportChannelItem}>
                   <strong>{c.name}</strong>
                   <span>Efficiency Score: {c.value}%</span>
                </div>
             ))}
          </div>
       </div>

       <div className={styles.reportFooter}>
          <p>CONFIDENTIAL DOCUMENT - FOR INTERNAL USE ONLY</p>
          <p>© 2026 Digital Pulse Agency</p>
       </div>
    </div>
  );

  if (loading && !data) return <div className={styles.loading}>Analyzing agency data...</div>;

  const points = data?.revenueHistory || [];
  const maxVal = Math.max(...points.map((p: any) => p.value), 1000);
  const chartHeight = 200;
  const chartWidth = 800;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Analytics</h1>
          <p className={styles.sub}>Deep-dive into cross-channel performance and revenue intelligence.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.timeRange}>
            {['7d', '30d', '60d', '90d', '12m', 'all'].map(r => (
              <button 
                key={r}
                className={`${styles.rangeBtn} ${range === r ? styles.active : ''}`}
                onClick={() => setRange(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className={styles.exportWrapper}>
            <button className={styles.downloadBtn} onClick={() => setExportOpen(!exportOpen)}>
              <BarChart3 size={16} />
              <span>Download Report</span>
            </button>
            {exportOpen && (
              <div className={styles.exportDropdown}>
                <button onClick={() => handleExport('pdf')} className={styles.dropdownItem}>
                  <FileText size={14} color="#EF4444" />
                  <span>Detailed Executive PDF</span>
                </button>
                <button onClick={() => handleExport('csv')} className={styles.dropdownItem}>
                  <TrendingUp size={14} color="#10B981" />
                  <span>Full Intelligence CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PrintableReport />

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.iconBox} style={{ background: '#06b6d4' }}><PoundSterling size={20} /></div>
            <span className={styles.trend}>+12.5%</span>
          </div>
          <span className={styles.metricValue}>£{(data?.pipelineValue || 0).toLocaleString()}</span>
          <span className={styles.metricLabel}>Total Pipeline Value</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.iconBox} style={{ background: '#f59e0b' }}><Target size={20} /></div>
            <span className={styles.trend}>+4.2%</span>
          </div>
          <span className={styles.metricValue}>{data?.avgRoi}x</span>
          <span className={styles.metricLabel}>Avg. Account ROI</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.iconBox} style={{ background: '#10b981' }}><Users size={20} /></div>
            <span className={styles.trend}>+18.1%</span>
          </div>
          <span className={styles.metricValue}>{((data?.totalImpressions || 0) / 1000).toFixed(0)}k</span>
          <span className={styles.metricLabel}>Total Impressions</span>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
             <div className={styles.chartTitleGroup}>
               <h2 className={styles.chartTitle}>Revenue Growth vs Target</h2>
               <span className={styles.chartMeta}>Live Intelligence: {range.toUpperCase()} Performance</span>
             </div>
             <div className={styles.chartFilters}>
                <div className={styles.customInput}>
                   <input 
                     type="number" 
                     value={customDays} 
                     onChange={(e) => handleCustomRange(e.target.value)} 
                     className={styles.daysField}
                   />
                   <span className={styles.daysLabel}>Days</span>
                </div>
                <select 
                  className={styles.chartSelect}
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last Quarter (90D)</option>
                  <option value="180d">Half Year (180D)</option>
                  <option value="12m">Past 12 Months</option>
                  <option value="all">Lifetime Analytics</option>
                </select>
             </div>
          </div>
          <div className={styles.chartContainer} onMouseLeave={() => setHoverIndex(null)}>
             <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Grid Lines */}
                {[0, 1, 2, 3].map(i => (
                  <line 
                    key={i} 
                    x1="0" y1={i * 50} x2={chartWidth} y2={i * 50} 
                    stroke="#f1f5f9" strokeWidth="1" 
                  />
                ))}
                
                {/* The Line */}
                {points.length > 0 && (
                  <path 
                    d={points.map((p: any, i: number) => {
                      const x = (i / (points.length - 1)) * chartWidth;
                      const y = chartHeight - (p.value / maxVal) * chartHeight;
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                    }).join(' ')} 
                    fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                  />
                )}

                {/* Interaction Points */}
                {points.map((p: any, i: number) => {
                   const x = (i / (points.length - 1)) * chartWidth;
                   return (
                     <rect 
                       key={i} 
                       x={x - 10} y="0" width="20" height={chartHeight} 
                       fill="transparent" 
                       onMouseEnter={() => setHoverIndex(i)}
                     />
                   );
                })}

                {/* Hover Indicator */}
                {hoverIndex !== null && points[hoverIndex] && (
                  <>
                    <line 
                      x1={(hoverIndex / (points.length - 1)) * chartWidth} 
                      y1="0" 
                      x2={(hoverIndex / (points.length - 1)) * chartWidth} 
                      y2={chartHeight} 
                      stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" 
                    />
                    <circle 
                      cx={(hoverIndex / (points.length - 1)) * chartWidth} 
                      cy={chartHeight - (points[hoverIndex].value / maxVal) * chartHeight} 
                      r="6" fill="#F97316" stroke="#fff" strokeWidth="2" 
                    />
                  </>
                )}
             </svg>

             {/* Custom Tooltip */}
             {hoverIndex !== null && points[hoverIndex] && (
               <div 
                 className={styles.tooltip}
                 style={{ 
                   left: `${(hoverIndex / (points.length - 1)) * 100}%`,
                   transform: `translateX(${hoverIndex > points.length / 2 ? '-100%' : '0'})`
                 }}
               >
                 <div className={styles.tooltipDate}>{points[hoverIndex].date}</div>
                 <div className={styles.tooltipValue}>£{points[hoverIndex].value.toLocaleString()}</div>
               </div>
             )}
          </div>
          <div className={styles.chartXLabels}>
            {points.filter((_: any, i: number) => i % Math.ceil(points.length / 6) === 0).map((p: any, i: number) => (
              <span key={i}>{p.date}</span>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
             <h2 className={styles.chartTitle}>Channel Efficiency</h2>
             <span className={styles.chartMeta}>ROI per Marketing Channel</span>
          </div>
          <div className={styles.barList}>
             {data?.channelEfficiency?.map((item: any) => (
               <div key={item.name} className={styles.barItem}>
                 <div className={styles.barInfo}>
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                 </div>
                 <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${item.value}%`, background: '#F97316' }} />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
