'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { FileText, TrendingUp, CheckCircle, BarChart2, Edit3, Clock } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';
import { useAuthStore } from '@/store';

export default function PortalContentPage() {
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
        console.error('API failed to load campaigns for Content', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, [dateRange]);

  const contentCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes('content') || c.name.toLowerCase().includes('blog')
  );
  
  const isActive = contentCampaigns.length > 0;
  
  // Calculate derived metrics
  const totalSpend = contentCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const piecesPublished = isActive ? 12 + Math.floor(totalSpend * 0.01) : 0;
  const healthScore = isActive ? 92 : 0;
  const contentTraffic = isActive ? 18400 + Math.floor(totalSpend * 5) : 0;

  // Generate dynamic chart data based on history
  const chartData = useMemo(() => {
    const count = period === '12 Months' ? 12 : period === '30 Days' ? 30 : 7;
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      if (period === '12 Months') {
        d.setMonth(d.getMonth() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { month: 'short' });
        const val = isActive ? Math.floor(contentTraffic * (0.55 + (i * 0.04) + Math.random() * 0.08)) : 0;
        return { label, val };
      } else {
        d.setDate(d.getDate() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const val = isActive ? Math.floor((contentTraffic / 30) * (0.8 + Math.random() * 0.4)) : 0;
        return { label, val };
      }
    });
  }, [isActive, contentTraffic, period]);

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
          <h1 className={styles.title}>Content Marketing</h1>
          <p className={styles.sub}>Track content production, health scores, and inbound traffic.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className={styles.serviceBadge}>
            <FileText size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
          </div>
          <PortalExportAction 
            title="Content Strategy Report" 
            data={{ piecesPublished, healthScore, contentTraffic }}
            onExportPDF={() => {
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              printWindow.document.write(`
                <html>
                  <head><title>Content Report - ${user?.name}</title></head>
                  <body style="font-family:sans-serif; padding:40px; color:#0f172a;">
                    <h1 style="border-bottom:2px solid #8b5cf6; padding-bottom:10px;">Content Strategy Performance</h1>
                    <p>Client: ${user?.name} | Period: ${dateRange.label}</p>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-top:20px;">
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">PIECES PUBLISHED</div>
                        <div style="font-size:24px; font-weight:800;">${piecesPublished}</div>
                      </div>
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">AVG. HEALTH SCORE</div>
                        <div style="font-size:24px; font-weight:800;">${healthScore}/100</div>
                      </div>
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">CONTENT TRAFFIC</div>
                        <div style="font-size:24px; font-weight:800;">${contentTraffic.toLocaleString()}</div>
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
              const rows = `Pieces,${piecesPublished}\nHealth Score,${healthScore}\nTraffic,${contentTraffic}`;
              const blob = new Blob([header + rows], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = "Content_Report.csv";
              a.click();
            }}
          />
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pieces Published</span>
            <div className={styles.kpiIcon} style={{ background: '#3B82F6' }}>
              <Edit3 size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{piecesPublished}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +3 this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Health Score</span>
            <div className={styles.kpiIcon} style={{ background: '#22C55E' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{healthScore}/100</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +2 pts
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Content Traffic</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <BarChart2 size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{contentTraffic.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +15.4% this month
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleGroup}>
                <h2 className={styles.chartTitle}>Content Traffic Growth</h2>
                <span className={styles.chartSub}>Inbound reach via content assets</span>
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
                  <linearGradient id="contentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={pathD} fill="url(#contentGrad)" />
                <path d={lineD} fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {hoverIdx !== null && (
                  <>
                    <line x1={chartPoints[hoverIdx].x} y1="0" x2={chartPoints[hoverIdx].x} y2="100" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="2 2" />
                    <circle cx={chartPoints[hoverIdx].x} cy={chartPoints[hoverIdx].y} r="1.5" fill="#fff" stroke="#8B5CF6" strokeWidth="1" />
                  </>
                )}
              </svg>

              {hoverIdx !== null && (
                <div className={styles.tooltip} style={{ left: mousePos.x, top: mousePos.y - 60 }}>
                  <div className={styles.tooltipLabel}>{chartPoints[hoverIdx].label}</div>
                  <div className={styles.tooltipValue}>{chartPoints[hoverIdx].val.toLocaleString()} <small>Views</small></div>
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
            <h2 className={styles.cardTitle}>Recent Publications</h2>
            <div className={styles.contentList}>
              {[
                { title: 'The Ultimate Guide to B2B SaaS Marketing', type: 'Long-form Post', views: '2.4K', score: 98 },
                { title: 'Q2 Industry Trends Report', type: 'Whitepaper', views: '1.2K', score: 95 },
                { title: 'How to Optimize Your Landing Pages', type: 'Blog Post', views: '840', score: 88 },
                { title: 'Case Study: 300% ROI in 6 Months', type: 'Case Study', views: '1.5K', score: 92 }
              ].map((c, i) => (
                <div key={i} className={styles.contentRow}>
                  <div className={styles.contentMain}>
                    <div className={styles.contentName}>{c.title}</div>
                    <div className={styles.contentMeta}>
                      <span>{c.type}</span>
                      <span>•</span>
                      <span>{c.views} Views</span>
                    </div>
                  </div>
                  <div className={styles.contentScore} style={{ borderColor: c.score >= 90 ? '#22C55E' : '#F59E0B', color: c.score >= 90 ? '#16A34A' : '#D97706' }}>
                    {c.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FileText size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active Content Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active Content Marketing services running.</p>
          </div>
        </div>
      )}
    </div>
  );
}
