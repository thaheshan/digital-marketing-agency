'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Download, ChevronDown, Filter, FileText, X, Info, Zap, Activity, ClipboardList } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import { useAuthStore } from '@/store';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';

export default function PortalAnalyticsPage() {
  const { user } = useAuthStore();
  const { dateRange } = usePortalDateRange();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true);
      try {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        const res = await api.get<any>(`/portal/analytics?from=${from}&to=${to}`);
        if (res.analytics) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, [dateRange]);

  const handleExport = (type: 'CSV' | 'PDF') => {
    setShowPreview(type);
  };

  const confirmDownload = () => {
    const type = showPreview;
    if (!type) return;

    if (type === 'PDF') {
      setShowPreview(null);
      // Re-use logic from dashboard
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const kpisHtml = data.performanceData.map((k: any) => `
          <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">${k.label}</div>
            <div style="font-size:20px; font-weight:800; color:#0f172a; margin:5px 0;">${k.value}</div>
            <div style="font-size:10px; color:#16a34a;">${k.change}</div>
          </div>
        `).join('');

        const tableRows = data.channelPerformance.map((row: any) => `
          <tr>
            <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.channel}</td>
            <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.sessions}</td>
            <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.bounce}</td>
            <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.goals}</td>
            <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.cvr}</td>
          </tr>
        `).join('');

        printWindow.document.write(`
          <html>
            <head><title>Analytics Report - ${user?.name}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #0f172a; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; }
              .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 20px; }
              .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; }
            </style></head>
            <body>
              <div class="header"><h1>DigitalPulse Analytics</h1><div>Client: ${user?.name}<br>Period: ${dateRange.label}</div></div>
              <div class="section"><h3>1. Key Performance Indicators</h3><div class="grid">${kpisHtml}</div></div>
              <div class="section"><h3>2. Channel Performance</h3><table><thead><tr><th>Channel</th><th>Sessions</th><th>Bounce</th><th>Goals</th><th>CVR</th></tr></thead><tbody>${tableRows}</tbody></table></div>
              <script>window.onload = () => { window.print(); window.close(); };</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }

    setExporting(type);
    setShowPreview(null);
    setTimeout(() => {
      const csv = "Channel,Sessions,Bounce,Goals,CVR\n" + data.channelPerformance.map((r: any) => `${r.channel},${r.sessions},${r.bounce},${r.goals},${r.cvr}`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `Analytics_${new Date().getTime()}.csv`;
      a.click();
      setExporting(null);
    }, 1500);
  };

  if (isLoading) return <div className={styles.page}>Loading analytics...</div>;
  if (!data) return <div className={styles.page}>No analytics data available.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Detailed Analytics</h1>
          <p className={styles.sub}>Deep dive into your campaign performance and traffic metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <PortalExportAction 
            title="Analytics Report" 
            data={data}
            onExportPDF={() => {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                const kpisHtml = data.performanceData.map((k: any) => `
                  <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;">
                    <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">${k.label}</div>
                    <div style="font-size:20px; font-weight:800; color:#0f172a; margin:5px 0;">${k.value}</div>
                    <div style="font-size:10px; color:#16a34a;">${k.change}</div>
                  </div>
                `).join('');

                const tableRows = data.channelPerformance.map((row: any) => `
                  <tr>
                    <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.channel}</td>
                    <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.sessions}</td>
                    <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.bounce}</td>
                    <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.goals}</td>
                    <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${row.cvr}</td>
                  </tr>
                `).join('');

                printWindow.document.write(`
                  <html>
                    <head><title>Analytics Report - ${user?.name}</title>
                    <style>
                      body { font-family: sans-serif; padding: 40px; color: #0f172a; }
                      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; }
                      .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 20px; }
                      .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
                      table { width: 100%; border-collapse: collapse; font-size: 12px; }
                      th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; }
                    </style></head>
                    <body>
                      <div class="header"><h1>DigitalPulse Analytics</h1><div>Client: ${user?.name}<br>Period: ${dateRange.label}</div></div>
                      <div class="section"><h3>1. Key Performance Indicators</h3><div class="grid">${kpisHtml}</div></div>
                      <div class="section"><h3>2. Channel Performance</h3><table><thead><tr><th>Channel</th><th>Sessions</th><th>Bounce</th><th>Goals</th><th>CVR</th></tr></thead><tbody>${tableRows}</tbody></table></div>
                      <script>window.onload = () => { window.print(); window.close(); };</script>
                    </body>
                  </html>
                `);
                printWindow.document.close();
              }
            }}
            onExportCSV={() => {
              const csv = "Channel,Sessions,Bounce,Goals,CVR\n" + data.channelPerformance.map((r: any) => `${r.channel},${r.sessions},${r.bounce},${r.goals},${r.cvr}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `Analytics_${new Date().getTime()}.csv`;
              a.click();
            }}
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className={styles.performanceGrid}>
        {data.performanceData.map((item: any) => (
          <div key={item.label} className={styles.perfCard}>
            <div className={styles.perfLabel}>{item.label}</div>
            <div className={styles.perfValue} style={{ color: item.color }}>{item.value}</div>
            <div className={`${styles.perfChange} ${item.change.startsWith('+') ? styles.plus : styles.minus}`}>
              {item.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Trend Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Traffic Trends</h3>
            <div className={styles.legend}>
              <span className={styles.dot} style={{ background: 'var(--color-secondary)' }}></span>
              Total Sessions
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.yAxis}>
              <span>100K</span>
              <span>75K</span>
              <span>50K</span>
              <span>25K</span>
              <span>0</span>
            </div>
            <div className={styles.bars}>
              {data.chartBars.map((bar: any) => (
                <div key={bar.label} className={styles.barItem}>
                  <div className={styles.barWrapper}>
                    <div 
                      className={styles.barFill} 
                      style={{ height: `${bar.value}%` }}
                    >
                      <span className={styles.tooltip}>{bar.value}K</span>
                    </div>
                  </div>
                  <span className={styles.barLabel}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Traffic Sources</h3>
          </div>
          <div className={styles.sourcesList}>
            {data.trafficSources.map((src: any) => (
              <div key={src.source} className={styles.sourceItem}>
                <div className={styles.sourceInfo}>
                  <span className={styles.sourceName}>{src.source}</span>
                  <span className={styles.sourcePct}>{src.percentage}%</span>
                </div>
                <div className={styles.progressBg}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${src.percentage}%`, background: src.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.donutPlaceholder}>
             <div className={styles.donut}>
                <div className={styles.segment} style={{ '--deg': '0deg', '--pct': '35%', '--color': data.trafficSources[0].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '126deg', '--pct': '40%', '--color': data.trafficSources[1].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '270deg', '--pct': '15%', '--color': data.trafficSources[2].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '324deg', '--pct': '10%', '--color': data.trafficSources[3].color } as any}></div>
                <div className={styles.donutCenter}>
                    <strong>{data.performanceData[0].value}</strong>
                    <span>Sessions</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Top Performing Channels */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Channel Performance Breakdown</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Sessions</th>
                <th>Bounce Rate</th>
                <th>Avg. Session Duration</th>
                <th>Goal Completions</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.channelPerformance.map((row: any, i: number) => (
                <tr key={i}>
                  <td className={styles.bold}>{row.channel}</td>
                  <td>{row.sessions}</td>
                  <td>{row.bounce}</td>
                  <td>{row.duration}</td>
                  <td>{row.goals}</td>
                  <td className={styles.positive}>{row.cvr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportModal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <FileText size={20} color="#06B6D4" />
                <div>
                  <h3 className={styles.modalTitle}>Preview Analytics Report</h3>
                  <p className={styles.modalSub}>Target Format: {showPreview}</p>
                </div>
              </div>
              <button className={styles.closeModal} onClick={() => setShowPreview(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
               <div className={styles.previewPaper}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
                    <div style={{ fontWeight: 900, fontSize: '20px' }}>DigitalPulse Analytics</div>
                    <div style={{ textAlign: 'right', fontSize: '12px' }}>Period: {dateRange.label}</div>
                  </div>
                  <h4 style={{ textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', marginBottom: '15px' }}>1. Key Stats</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                     {data.performanceData.slice(0, 4).map((p: any, i: number) => (
                       <div key={i} style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>{p.label}</div>
                          <div style={{ fontSize: '16px', fontWeight: 800 }}>{p.value}</div>
                       </div>
                     ))}
                  </div>
                  <h4 style={{ textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', marginBottom: '15px' }}>2. Channel Breakdown</h4>
                  <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8fafc' }}><th style={{ textAlign: 'left', padding: '8px' }}>Channel</th><th style={{ textAlign: 'left', padding: '8px' }}>Sessions</th></tr></thead>
                    <tbody>
                      {data.channelPerformance.map((r: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '8px' }}>{r.channel}</td><td style={{ padding: '8px' }}>{r.sessions}</td></tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
            <div className={styles.modalFooter}>
               <button className={styles.cancelBtn} onClick={() => setShowPreview(null)}>Cancel</button>
               <button className={styles.downloadConfirmBtn} onClick={confirmDownload}>
                 <Download size={16} /> Confirm & Download
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
