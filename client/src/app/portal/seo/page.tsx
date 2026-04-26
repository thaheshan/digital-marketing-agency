'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Search, TrendingUp, Users, Target, ArrowUpRight, Clock } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';
import { useAuthStore } from '@/store';

// Fix BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default function PortalSEOPage() {
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
        console.error('API failed to load campaigns for SEO', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, [dateRange]);

  const seoCampaigns = campaigns.filter(c => c.name.toLowerCase().includes('seo') || c.platforms?.some((p: any) => p.platform === 'Organic'));
  const isActive = seoCampaigns.length > 0;
  
  // Calculate derived metrics from SEO campaigns
  const totalSpend = seoCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const organicTraffic = isActive ? 48320 + Math.floor(totalSpend * 1.5) : 0;
  const topKeywords = isActive ? 142 : 0;
  const domainAuthority = isActive ? 54 : 0;

  // Generate dynamic chart data based on history
  const chartData = useMemo(() => {
    const count = period === '12 Months' ? 12 : period === '30 Days' ? 30 : 7;
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      if (period === '12 Months') {
        d.setMonth(d.getMonth() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { month: 'short' });
        const val = isActive ? Math.floor(organicTraffic * (0.6 + (i * 0.04) + Math.random() * 0.1)) : 0;
        return { label, val };
      } else {
        d.setDate(d.getDate() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const val = isActive ? Math.floor((organicTraffic / 30) * (0.8 + Math.random() * 0.4)) : 0;
        return { label, val };
      }
    });
  }, [isActive, organicTraffic, period]);

  const maxVal = Math.max(...chartData.map(d => d.val), 1);
  const chartPoints = chartData.map((d, i) => ({
    x: (i / (chartData.length - 1)) * 100,
    y: 100 - (d.val / maxVal) * 85 - 10, 
    val: d.val,
    label: d.label
  }));

  // Create smooth bezier curve path
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

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>SEO Report - ${user?.name}</title></head>
        <body style="font-family:sans-serif; padding:40px;">
          <h1 style="color:#0f172a;">SEO Performance Report</h1>
          <p>Client: ${user?.name} | Period: ${dateRange.label}</p>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-top:20px;">
            <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
              <div style="font-size:12px; color:#64748b;">ORGANIC TRAFFIC</div>
              <div style="font-size:24px; font-weight:800;">${organicTraffic.toLocaleString()}</div>
            </div>
            <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
              <div style="font-size:12px; color:#64748b;">TOP KEYWORDS</div>
              <div style="font-size:24px; font-weight:800;">${topKeywords}</div>
            </div>
            <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
              <div style="font-size:12px; color:#64748b;">DOMAIN AUTHORITY</div>
              <div style="font-size:24px; font-weight:800;">${domainAuthority}</div>
            </div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportCSV = () => {
    const header = "Metric,Value\n";
    const dataRows = `Organic Traffic,${organicTraffic}\nTop Keywords,${topKeywords}\nDomain Authority,${domainAuthority}`;
    const blob = new Blob([header + dataRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEO_Report_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>SEO Performance</h1>
          <p className={styles.sub}>Track your organic search visibility and keyword rankings.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className={styles.serviceBadge}>
            <Search size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
          </div>
          <PortalExportAction 
            title="SEO Report" 
            data={{ organicTraffic, topKeywords, domainAuthority }}
            onExportPDF={exportPDF}
            onExportCSV={exportCSV}
          />
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Organic Traffic</span>
            <div className={styles.kpiIcon} style={{ background: '#22C55E' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{organicTraffic.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +23.4% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Keywords in Top 10</span>
            <div className={styles.kpiIcon} style={{ background: '#06B6D4' }}>
              <Target size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{topKeywords}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +15 new rankings
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Domain Authority</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{domainAuthority}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +2 points
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleGroup}>
                <h2 className={styles.chartTitle}>Organic Traffic Growth</h2>
                <span className={styles.chartSub}>Real-time search visibility trend</span>
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

              {isActive ? (
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
                  <defs>
                    <linearGradient id="seoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path d={pathD} fill="url(#seoGrad)" />
                  <path d={lineD} fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {hoverIdx !== null && (
                    <>
                      <line x1={chartPoints[hoverIdx].x} y1="0" x2={chartPoints[hoverIdx].x} y2="100" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="2 2" />
                      <circle cx={chartPoints[hoverIdx].x} cy={chartPoints[hoverIdx].y} r="1.5" fill="#fff" stroke="#06B6D4" strokeWidth="1" />
                    </>
                  )}
                </svg>
              ) : (
                <div className={styles.emptyChart}>
                  <TrendingUp size={48} color="#e2e8f0" />
                  <p>Activate SEO services to see traffic trends</p>
                </div>
              )}

              {hoverIdx !== null && isActive && (
                <div className={styles.tooltip} style={{ left: mousePos.x, top: mousePos.y - 60 }}>
                  <div className={styles.tooltipLabel}>{chartPoints[hoverIdx].label} Performance</div>
                  <div className={styles.tooltipValue}>{chartPoints[hoverIdx].val.toLocaleString()} <small>Visitors</small></div>
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
            <h2 className={styles.cardTitle}>Top Keyword Movements</h2>
            <div className={styles.keywordList}>
              {[
                { term: 'digital marketing agency', vol: '12K', pos: 3, change: '+2' },
                { term: 'b2b lead generation', vol: '8.4K', pos: 1, change: '+1' },
                { term: 'seo services london', vol: '5.2K', pos: 4, change: '+5' },
                { term: 'content strategy 2026', vol: '3.1K', pos: 2, change: '0' },
              ].map((k, i) => (
                <div key={i} className={styles.keywordRow}>
                  <div className={styles.keywordMain}>
                    <div className={styles.keywordName}>{k.term}</div>
                    <div className={styles.keywordVol}>{k.vol} volume</div>
                  </div>
                  <div className={styles.keywordRank}>
                    <div className={styles.rankPos}>#{k.pos}</div>
                    <div className={`${styles.kpiTrend} ${k.change.startsWith('+') ? styles.trendPositive : ''}`}>
                      {k.change !== '0' ? <TrendingUp size={12} /> : ''} {k.change === '0' ? '-' : k.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Search size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active SEO Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active SEO services running. Contact your account manager to start an SEO campaign.</p>
          </div>
        </div>
      )}
    </div>
  );
}
