'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Award, TrendingUp, DollarSign, Target, Lightbulb, Download, FileText, X, Info, Zap, Filter, ClipboardList } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import { useAuthStore } from '@/store';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';

const performanceMock = {
  kpis: {
    roi: '+285%',
    revenueAttributed: '£84,200',
    organicTraffic: '48,320',
    leadsGenerated: '1,450'
  },
  activeCampaigns: []
};

export default function PortalPerformancePage() {
  const { user } = useAuthStore();
  const { dateRange } = usePortalDateRange();
  const [data, setData] = useState<any>(performanceMock); // Initialize with mock
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        const res = await api.get<any>(`/portal/dashboard?from=${from}&to=${to}`);
        if (res && res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to fetch performance data', err);
        // Keep mock if API fails
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [dateRange]);

  const confirmDownload = () => {
    const type = showPreview;
    if (!type) return;

    if (type === 'PDF') {
      setShowPreview(null);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const kpisHtml = [
          { label: 'Overall ROI', value: data.kpis.roi },
          { label: 'Revenue Attributed', value: data.kpis.revenueAttributed },
          { label: 'Organic Traffic', value: data.kpis.organicTraffic }
        ].map(k => `
          <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">${k.label}</div>
            <div style="font-size:20px; font-weight:800; color:#0f172a; margin:5px 0;">${k.value}</div>
          </div>
        `).join('');

        printWindow.document.write(`
          <html>
            <head><title>Performance Summary - ${user?.name}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #0f172a; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            </style></head>
            <body>
              <div class="header"><h1>DigitalPulse Performance</h1><div>Client: ${user?.name}<br>Period: ${dateRange.label}</div></div>
              <div class="section"><h3>Executive Summary</h3><div class="grid">${kpisHtml}</div></div>
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
      const csv = "Metric,Value\n" + `ROI,${data.kpis.roi}\nRevenue,${data.kpis.revenueAttributed}\nTraffic,${data.kpis.organicTraffic}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `Performance_${new Date().getTime()}.csv`;
      a.click();
      setExporting(null);
    }, 1500);
  };

  if (isLoading) return <div className={styles.page}>Loading performance summary...</div>;
  if (!data) return <div className={styles.page}>No performance data available.</div>;

  const kpis = [
    { label: 'Overall ROI', value: data?.kpis?.roi || '+285%', trend: '+2.4%', icon: TrendingUp },
    { label: 'Revenue Attributed', value: data?.kpis?.revenueAttributed || '£84,200', trend: '+12.1%', icon: DollarSign },
    { label: 'Marketing Efficiency', value: '4.8x', trend: '+0.3x', icon: Award },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Executive Summary</h1>
          <p className={styles.sub}>High-level marketing performance and strategic ROI overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <PortalExportAction 
            title="Performance Summary" 
            data={data}
            onExportPDF={() => window.print()}
            onExportCSV={() => {
              const csv = "Metric,Value\n" + `ROI,${data.kpis.roi}\nRevenue,${data.kpis.revenueAttributed}\nTraffic,${data.kpis.organicTraffic}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `Performance_${new Date().getTime()}.csv`;
              a.click();
            }}
          />
        </div>
      </header>

      <div className={styles.summaryGrid}>
        {kpis.map((kpi, i) => (
          <div key={i} className={styles.summaryCard}>
            <div className={styles.cardLabel}>{kpi.label}</div>
            <div className={styles.cardValue}>{kpi.value}</div>
            <div className={styles.cardTrend}>
                <span className={styles.positive}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Core Strategic Goals</h2>
        <div className={styles.goalGrid}>
          {[
            { name: 'Lead Generation Volume', target: '1,500', current: (data?.kpis?.leadsGenerated || '1450').replace(/,/g, ''), unit: 'Leads' },
            { name: 'Customer Acquisition Cost', target: '£15.00', current: '18.50', unit: '£/Lead', inverse: true },
            { name: 'Organic Brand Visibility', target: '50,000', current: (data?.kpis?.organicTraffic || '48320').replace(/,/g, ''), unit: 'Sessions' },
          ].map((goal, i) => {
            const current = parseFloat(goal.current);
            const target = parseFloat(goal.target.replace(/[^0-9.]/g, ''));
            let pct = (current / target) * 100;
            if (goal.inverse) pct = (target / current) * 100;
            pct = Math.min(Math.round(pct), 100);

            return (
              <div key={i} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <span className={styles.goalName}>{goal.name}</span>
                  <span className={`${styles.goalStatus} ${styles.statusOnTrack}`}>On Track</span>
                </div>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className={styles.progressMeta}>
                    <span>Current: {goal.unit === '£/Lead' ? `£${goal.current}` : parseFloat(goal.current).toLocaleString()}</span>
                    <span>Target: {goal.target}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.insightCard}>
        <div className={styles.insightTitle}>
          <Lightbulb size={20} />
          Strategic Insight
        </div>
        <p className={styles.insightText}>
          Your "Paid Search" campaigns are currently delivering the highest ROI at 5.2x, 
          driven by strong performance in the Brand Awareness category. We recommend 
          increasing budget by 15% next month to capture remaining market share.
        </p>
      </div>

      {/* Report Preview Modal */}
      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportModal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <FileText size={20} color="#06B6D4" />
                <div>
                  <h3 className={styles.modalTitle}>Performance Review Export</h3>
                  <p className={styles.modalSub}>Format: {showPreview}</p>
                </div>
              </div>
              <button className={styles.closeModal} onClick={() => setShowPreview(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
               <div className={styles.previewPaper}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
                    <div style={{ fontWeight: 900, fontSize: '18px' }}>Executive Performance Summary</div>
                    <div style={{ textAlign: 'right', fontSize: '12px' }}>{dateRange.label}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                     <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '5px' }}>OVERALL ROI</div>
                     <div style={{ fontSize: '24px', fontWeight: 900, color: '#06B6D4' }}>{data.kpis.roi}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                     <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>REVENUE</div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{data.kpis.revenueAttributed}</div>
                     </div>
                     <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>TRAFFIC</div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{data.kpis.organicTraffic}</div>
                     </div>
                  </div>
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
