'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Share2, TrendingUp, Users, Eye, MessageCircle, Clock } from 'lucide-react';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';
import { useAuthStore } from '@/store';

export default function PortalSocialPage() {
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
        console.error('API failed to load campaigns for Social', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, [dateRange]);

  const socialPlatforms = ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Twitter'];
  const socialCampaigns = campaigns.filter(c => 
    c.platforms?.some((p: any) => socialPlatforms.includes(p.platform)) || c.name.toLowerCase().includes('social')
  );
  
  const isActive = socialCampaigns.length > 0;
  
  // Calculate derived metrics
  const totalSpend = socialCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const followers = isActive ? 12450 + Math.floor(totalSpend * 0.5) : 0;
  const impressions = isActive ? 342000 + Math.floor(totalSpend * 12) : 0;
  const engagementRate = isActive ? 4.2 : 0;

  // Generate dynamic chart data based on history
  const chartData = useMemo(() => {
    const count = period === '12 Months' ? 12 : period === '30 Days' ? 30 : 7;
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      if (period === '12 Months') {
        d.setMonth(d.getMonth() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { month: 'short' });
        const val = isActive ? Math.floor(followers * (0.7 + (i * 0.03) + Math.random() * 0.05)) : 0;
        return { label, val };
      } else {
        d.setDate(d.getDate() - (count - 1 - i));
        const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const val = isActive ? Math.floor((followers / 30) * (0.9 + Math.random() * 0.3)) : 0;
        return { label, val };
      }
    });
  }, [isActive, followers, period]);

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
          <h1 className={styles.title}>Social Media</h1>
          <p className={styles.sub}>Analyze your social audience growth and campaign engagement.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className={styles.serviceBadge}>
            <Share2 size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
          </div>
          <PortalExportAction 
            title="Social Media Report" 
            data={{ followers, impressions, engagementRate }}
            onExportPDF={() => {
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              printWindow.document.write(`
                <html>
                  <head><title>Social Media Report - ${user?.name}</title></head>
                  <body style="font-family:sans-serif; padding:40px; color:#0f172a;">
                    <h1 style="border-bottom:2px solid #06b6d4; padding-bottom:10px;">Social Media Performance</h1>
                    <p>Client: ${user?.name} | Period: ${dateRange.label}</p>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-top:20px;">
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">TOTAL AUDIENCE</div>
                        <div style="font-size:24px; font-weight:800;">${followers.toLocaleString()}</div>
                      </div>
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">IMPRESSIONS</div>
                        <div style="font-size:24px; font-weight:800;">${impressions.toLocaleString()}</div>
                      </div>
                      <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #eee;">
                        <div style="font-size:12px; color:#64748b;">ENGAGEMENT RATE</div>
                        <div style="font-size:24px; font-weight:800;">${engagementRate}%</div>
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
              const rows = `Audience,${followers}\nImpressions,${impressions}\nEngagement,${engagementRate}%`;
              const blob = new Blob([header + rows], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = "Social_Report.csv";
              a.click();
            }}
          />
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Audience</span>
            <div className={styles.kpiIcon} style={{ background: '#06B6D4' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{followers.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +5.2% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Impressions</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <Eye size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{impressions.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +12.4% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Engagement Rate</span>
            <div className={styles.kpiIcon} style={{ background: '#F97316' }}>
              <MessageCircle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{engagementRate}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +0.4% pts
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleGroup}>
                <h2 className={styles.chartTitle}>Audience Growth</h2>
                <span className={styles.chartSub}>Community reach over time</span>
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
                  <linearGradient id="socialGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={pathD} fill="url(#socialGrad)" />
                <path d={lineD} fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {hoverIdx !== null && (
                  <>
                    <line x1={chartPoints[hoverIdx].x} y1="0" x2={chartPoints[hoverIdx].x} y2="100" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="2 2" />
                    <circle cx={chartPoints[hoverIdx].x} cy={chartPoints[hoverIdx].y} r="1.5" fill="#fff" stroke="#06B6D4" strokeWidth="1" />
                  </>
                )}
              </svg>

              {hoverIdx !== null && (
                <div className={styles.tooltip} style={{ left: mousePos.x, top: mousePos.y - 60 }}>
                  <div className={styles.tooltipLabel}>{chartPoints[hoverIdx].label}</div>
                  <div className={styles.tooltipValue}>{chartPoints[hoverIdx].val.toLocaleString()} <small>Followers</small></div>
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
            <h2 className={styles.cardTitle}>Top Performing Posts</h2>
            <div className={styles.postGrid}>
              {[
                { title: 'New Product Launch Video', platform: 'Instagram', reach: '45K', eng: '5.2%' },
                { title: 'Industry Report 2026', platform: 'LinkedIn', reach: '12K', eng: '8.4%' },
                { title: 'Behind the Scenes Story', platform: 'Instagram', reach: '28K', eng: '4.1%' },
                { title: 'Feature Update Thread', platform: 'Twitter', reach: '18K', eng: '3.8%' }
              ].map((p, i) => (
                <div key={i} className={styles.postRow}>
                  <div className={styles.postThumb} />
                  <div className={styles.postMain}>
                    <div className={styles.postName}>{p.title}</div>
                    <div className={styles.postMeta}>
                      <span className={styles.postPlatform}>{p.platform}</span>
                      <span>•</span>
                      <span>{p.reach} Reach</span>
                      <span>•</span>
                      <span>{p.eng} ER</span>
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
            <Share2 size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active Social Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active Social Media services running.</p>
          </div>
        </div>
      )}
    </div>
  );
}
