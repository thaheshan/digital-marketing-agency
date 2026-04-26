'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Target } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import { useAuthStore } from '@/store';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';

export default function PortalGoalsPage() {
  const { user } = useAuthStore();
  const { dateRange } = usePortalDateRange();
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      setIsLoading(true);
      try {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        const res = await api.get<any>(`/portal/goals?from=${from}&to=${to}`);
        if (res.goals) {
          setGoals(res.goals);
        }
      } catch (e) {
        console.error('API failed to load goals', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadGoals();
  }, [dateRange]);

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'on_track': return styles.statusOnTrack;
      case 'needs_attention': return styles.statusNeedsAttention;
      case 'missed': return styles.statusMissed;
      case 'exceeding': return styles.statusExceeding;
      default: return styles.statusNotStarted;
    }
  };

  const getProgressColor = (status: string) => {
    switch(status) {
      case 'on_track': return '#22C55E';
      case 'needs_attention': return '#F59E0B';
      case 'missed': return '#EF4444';
      case 'exceeding': return '#3B82F6';
      default: return '#94A3B8';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Goals & KPIs</h1>
          <p className={styles.sub}>Track performance targets across all active campaigns.</p>
        </div>
        <PortalExportAction 
          title="Goals & KPIs Report" 
          data={goals}
          onExportPDF={() => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) return;
            const goalsHtml = goals.map(g => `
              <tr>
                <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${g.metricName}</td>
                <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${g.campaign?.name || 'N/A'}</td>
                <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${g.currentValue}</td>
                <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${g.targetValue}</td>
                <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${g.status.replace('_', ' ')}</td>
              </tr>
            `).join('');

            printWindow.document.write(`
              <html>
                <head><title>Goals Report - ${user?.name}</title></head>
                <body style="font-family:sans-serif; padding:40px; color:#0f172a;">
                  <h1 style="border-bottom:2px solid #06b6d4; padding-bottom:10px;">Goals & KPIs Performance</h1>
                  <p>Client: ${user?.name} | Period: ${dateRange.label}</p>
                  <table style="width:100%; border-collapse:collapse; margin-top:20px; font-size:12px;">
                    <thead><tr style="background:#f8fafc; text-align:left;">
                      <th style="padding:12px;">Metric</th>
                      <th style="padding:12px;">Campaign</th>
                      <th style="padding:12px;">Current</th>
                      <th style="padding:12px;">Target</th>
                      <th style="padding:12px;">Status</th>
                    </tr></thead>
                    <tbody>${goalsHtml}</tbody>
                  </table>
                  <script>window.onload = () => { window.print(); window.close(); };</script>
                </body>
              </html>
            `);
            printWindow.document.close();
          }}
          onExportCSV={() => {
            const header = "Metric,Campaign,Current,Target,Status\n";
            const rows = goals.map(g => `"${g.metricName}","${g.campaign?.name}",${g.currentValue},${g.targetValue},${g.status}`).join('\n');
            const blob = new Blob([header + rows], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = "Goals_Report.csv";
            a.click();
          }}
        />
      </div>

      <div className={styles.goalsGrid}>
        {isLoading ? (
          <div>Loading goals...</div>
        ) : goals.length === 0 ? (
          <div>No goals found for your active campaigns.</div>
        ) : goals.map(g => {
          const current = Number(g.currentValue);
          const target = Number(g.targetValue);
          const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
          
          return (
            <div key={g.id} className={styles.goalCard}>
              <div className={styles.goalTop}>
                <div>
                  <div className={styles.goalTitle}>{g.metricName}</div>
                  <div className={styles.goalCampaign}>{g.campaign?.name}</div>
                </div>
                <span className={`${styles.statusPill} ${getStatusClass(g.status)}`}>
                  {formatStatus(g.status)}
                </span>
              </div>
              
              <div className={styles.goalMetrics}>
                <div className={styles.goalCurrent}>
                  {g.unit === '£' ? `£${current.toLocaleString()}` : g.unit === '%' ? `${current}%` : current.toLocaleString()}
                </div>
                <div className={styles.goalTarget}>
                  Target: {g.unit === '£' ? `£${target.toLocaleString()}` : g.unit === '%' ? `${target}%` : target.toLocaleString()}
                </div>
              </div>

              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${percent}%`, background: getProgressColor(g.status) }} 
                />
              </div>

              <div className={styles.goalPeriod}>
                <Target size={14} /> {g.period}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
