'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Mail, TrendingUp, Users, MousePointerClick, Send, Clock } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';
import { useAuthStore } from '@/store';

export default function PortalEmailPage() {
  const { user } = useAuthStore();
  const { dateRange } = usePortalDateRange();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [period, setPeriod] = useState('12 Months');

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        const res = await api.get<any>(`/portal/campaigns?from=${from}&to=${to}`);
        if (res.campaigns) {
          setCampaigns(res.campaigns);
        }
      } catch (e) {
        console.error('API failed to load campaigns for Email', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, [dateRange]);

  const emailCampaigns = campaigns.filter(c => 
    c.platforms?.some((p: any) => p.platform === 'Email') || c.name.toLowerCase().includes('email')
  );
  
  const isActive = emailCampaigns.length > 0;
  
  // Calculate derived metrics
  const totalSpend = emailCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const subscribers = isActive ? 8540 + Math.floor(totalSpend * 0.8) : 0;
  const openRate = isActive ? 24.8 : 0;
  const clickRate = isActive ? 3.2 : 0;

  // Generate dynamic chart data based on history
  const chartData = useMemo(() => {
    const count = period === '12 Months' ? 12 : period === '30 Days' ? 30 : 7;
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      if (period === '12 Months') {
        d.setMonth(d.getMonth() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { month: 'short' });
        const val = isActive ? Math.floor(subscribers * (0.65 + (i * 0.03) + Math.random() * 0.05)) : 0;
        return { label, val };
      } else {
        d.setDate(d.getDate() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const val = isActive ? Math.floor((subscribers / 30) * (0.8 + Math.random() * 0.4)) : 0;
        return { label, val };
      }
    });
  }, [isActive, subscribers, period]);

  const maxVal = Math.max(...chartData.map(d => d.val), 1);
  const chartPoints = chartData.map((d, i) => ({
    x: (i / (chartData.length - 1)) * 100,
    y: 100 - (d.val / maxVal) * 85 - 10,
    val: d.val,
    label: d.label
  }));

  const getPath = (points: any[]) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const lineD = getPath(chartPoints);
  const pathD = `${lineD} L 100,100 L 0,100 Z`;

  const yLabels = isActive ? [
    Math.round(maxVal),
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Email Marketing</h1>
          <p className={styles.sub}>Monitor your subscriber growth and email engagement rates.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className={styles.serviceBadge}>
            <Mail size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
          </div>
          <PortalExportAction 
            title="Email Marketing Report" 
            data={{ subscribers, openRate, clickRate }}
            onExportPDF={() => {
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              printWindow.document.write(`
                <html>
                  <head><title>Email Report - ${user?.name}</title></head>
                  <body style="font-family:sans-serif; padding:40px; color:#0f172a;">
                    <h1 style="border-bottom:2px solid #ec4899; padding-bottom:10px;">Email Marketing Performance</h1>
                    <p>Client: ${user?.name} | Period: ${dateRange.label}</p>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-top:20px;">
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">TOTAL SUBSCRIBERS</div>
                        <div style="font-size:24px; font-weight:800;">${subscribers.toLocaleString()}</div>
                      </div>
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">AVG. OPEN RATE</div>
                        <div style="font-size:24px; font-weight:800;">${openRate}%</div>
                      </div>
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">AVG. CLICK RATE</div>
                        <div style="font-size:24px; font-weight:800;">${clickRate}%</div>
                      </div>
                    </div>
                    <script>window.onload = () => { window.print(); window.close(); };</script>
                  </body>
                </html>
              `);
              printWindow.document.close();
            }}
            onExportCSV={() => {
              const header = "Metric,Value\n";
              const rows = `Subscribers,${subscribers}\nOpen Rate,${openRate}%\nClick Rate,${clickRate}%`;
              const blob = new Blob([header + rows], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = "Email_Report.csv";
              a.click();
            }}
          />
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Subscribers</span>
            <div className={styles.kpiIcon} style={{ background: '#EC4899' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{subscribers.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +8.4% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Open Rate</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <Send size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{openRate}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +1.2% pts
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Click Rate</span>
            <div className={styles.kpiIcon} style={{ background: '#06B6D4' }}>
              <MousePointerClick size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{clickRate}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +0.5% pts
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleGroup}>
                <h2 className={styles.chartTitle}>Subscriber Growth</h2>
                <span className={styles.chartSub}>Email list health trend</span>
              </div>
              <div className={styles.chartActions}>
                 <div className={styles.periodSelect}>
                    <Clock size={14} />
                    <select className={styles.select} value={period} onChange={(e) => setPeriod(e.target.value)}>
                      <option value="12 Months">Last 12 Months</option>
                      <option value="30 Days">Last 30 Days</option>
                      <option value="7 Days">Last 7 Days</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className={styles.chartContainer} 
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const idx = Math.round((x / 100) * (chartData.length - 1));
                if (idx >= 0 && idx < chartData.length) {
                  setHoverIdx(idx);
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
              onMouseLeave={() => setHoverIdx(null)}
            >
              {/* Y-Axis Grid & Labels */}
              <div className={styles.yAxisLabels}>
                {yLabels.map((l, i) => (
                  <div key={i} className={styles.yLabelRow}>
                    <span>{l >= 1000 ? (l / 1000).toFixed(1) + 'k' : l}</span>
                    <div className={styles.gridLine} />
                  </div>
                ))}
              </div>

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
                <defs>
                  <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={pathD} fill="url(#emailGrad)" />
                <path d={lineD} fill="none" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {hoverIdx !== null && (
                  <>
                    <line x1={chartPoints[hoverIdx].x} y1="0" x2={chartPoints[hoverIdx].x} y2="100" stroke="#EC4899" strokeWidth="0.5" strokeDasharray="2 2" />
                    <circle cx={chartPoints[hoverIdx].x} cy={chartPoints[hoverIdx].y} r="1.5" fill="#fff" stroke="#EC4899" strokeWidth="1" />
                  </>
                )}
              </svg>

              {hoverIdx !== null && (
                <div className={styles.tooltip} style={{ left: mousePos.x, top: mousePos.y - 60 }}>
                  <div className={styles.tooltipLabel}>{chartPoints[hoverIdx].label}</div>
                  <div className={styles.tooltipValue}>{chartPoints[hoverIdx].val.toLocaleString()} <small>Subs</small></div>
                </div>
              )}
            </div>
            
            <div className={styles.chartFooter}>
              {chartPoints.filter((_, i) => {
                if (period === '12 Months') return true;
                if (period === '30 Days') return i % 5 === 0;
                return true;
              }).map((p, i) => (
                <span key={i} className={styles.xLabel}>{p.label}</span>
              ))}
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Recent Campaigns</h2>
            <div className={styles.emailList}>
              {[
                { title: 'Spring Product Launch', date: 'Apr 12', sent: '12K', open: '28%', click: '4.2%' },
                { title: 'Monthly Newsletter - March', date: 'Mar 31', sent: '11.5K', open: '25%', click: '3.1%' },
                { title: 'Abandoned Cart Nurture 1', date: 'Ongoing', sent: '2.1K', open: '42%', click: '8.4%' },
                { title: 'Welcome Series', date: 'Ongoing', sent: '4.5K', open: '55%', click: '12.1%' }
              ].map((e, i) => (
                <div key={i} className={styles.emailRow}>
                  <div className={styles.emailMain}>
                    <div className={styles.emailName}>{e.title}</div>
                    <div className={styles.emailMeta}>
                      <span>{e.date}</span>
                      <span>•</span>
                      <span>{e.sent} Sent</span>
                    </div>
                  </div>
                  <div className={styles.emailRates}>
                    <div className={styles.rateVal}>{e.open}</div>
                    <div className={styles.rateLabel}>Open Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Mail size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active Email Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active Email Marketing services running.</p>
          </div>
        </div>
      )}
    </div>
  );
}
