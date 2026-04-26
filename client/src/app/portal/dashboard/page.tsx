'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  PoundSterling,
  Calendar,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Plus,
  Settings,
  Megaphone,
  FileText,
  Mail,
  Share2,
  Award,
  AlertTriangle,
  Sparkles,
  Activity,
  ClipboardList,
  X,
  Info,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { api } from '@/lib/api';
import styles from './page.module.css';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';

// --- COMPONENTS ---

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const rangeValue = max - min;
  const width = 100;
  const height = 32;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (rangeValue || 1)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className={styles.kpiSparkline} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const DonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <svg className={styles.donutSvg} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
      {data.map((item, idx) => {
        const strokeDasharray = (item.value / 100) * circumference;
        const offset = currentOffset;
        currentOffset -= strokeDasharray;
        return (
          <circle
            key={idx}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={item.color}
            strokeWidth="12"
            strokeDasharray={`${strokeDasharray} ${circumference}`}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        );
      })}
    </svg>
  );
};

export default function PortalDashboard() {
  const { user } = useAuthStore();
  const { dateRange } = usePortalDateRange();
  const [firstName, setFirstName] = useState('Client');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const exportRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleExport = (type: 'CSV' | 'PDF') => {
    setShowExport(false);
    setShowPreview(type);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const kpisHtml = kpis.map(k => `
      <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">${k.label}</div>
        <div style="font-size:20px; font-weight:800; color:#0f172a; margin:5px 0;">${k.value}</div>
        <div style="font-size:10px; color:#16a34a;">${k.change}</div>
      </div>
    `).join('');

    const campaignsHtml = displayCampaigns.map((c: any) => `
      <tr>
        <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${c.name}</td>
        <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${c.platform}</td>
        <td style="padding:12px; border-bottom:1px solid #f1f5f9;">£${((c.spendPence || 0) / 100).toLocaleString()}</td>
        <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${c.roas}x</td>
        <td style="padding:12px; border-bottom:1px solid #f1f5f9;">${c.status}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Performance Report - ${user?.name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 900; }
            .meta { text-align: right; font-size: 12px; color: #64748b; }
            .section { margin-bottom: 40px; }
            .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; }
            .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">DigitalPulse</div>
            <div class="meta">
              <div>Client: ${user?.name}</div>
              <div>Period: April 2026</div>
              <div>Generated: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">1. Executive Summary</div>
            <div class="grid">${kpisHtml}</div>
          </div>
          <div class="section">
            <div class="section-title">2. Campaign Performance</div>
            <table>
              <thead><tr><th>Campaign</th><th>Platform</th><th>Spend</th><th>ROAS</th><th>Status</th></tr></thead>
              <tbody>${campaignsHtml}</tbody>
            </table>
          </div>
          <div class="footer">
            DigitalPulse Intelligence Core © 2026. This is a confidential performance report.
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const confirmDownload = () => {
    const type = showPreview;
    if (!type) return;
    
    if (type === 'PDF') {
      setShowPreview(null);
      printReport();
      return;
    }

    setExporting(type);
    setShowPreview(null);

    // Simulate generation and trigger real browser download for CSV
    setTimeout(() => {
      const fileName = `DigitalPulse_April_Report_${new Date().getTime()}.csv`;
      const content = "Section,Metric,Value,Change\n" + 
        kpis.map(k => `Executive,${k.label},${k.value},${k.change}`).join('\n');

      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExporting(null);
    }, 1500);
  };

  useEffect(() => {
    if (user?.name) setFirstName(user.name.split(' ')[0]);
  }, [user]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        const res = await api.get<any>(`/portal/dashboard?from=${from}&to=${to}`);
        setDashboardData(res);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [dateRange]);

  const kpis = [
    {
      id: 'traffic',
      label: 'Organic Traffic',
      value: dashboardData?.kpis?.organicTraffic || '48,320',
      change: '+23.4%',
      type: 'positive',
      icon: Users,
      color: '#22C55E',
      sparkline: [30, 45, 35, 55, 65, 58, 75]
    },
    {
      id: 'leads',
      label: 'Leads Generated',
      value: dashboardData?.kpis?.leadsGenerated || '312',
      change: '+18.7%',
      type: 'positive',
      icon: UserPlus,
      color: '#06B6D4',
      sparkline: [20, 25, 45, 40, 60, 75, 80]
    },
    {
      id: 'roi',
      label: 'Ad Spend ROI',
      value: dashboardData?.kpis?.roi || '285%',
      change: '+12.1%',
      type: 'positive',
      icon: TrendingUp,
      color: '#F97316',
      sparkline: [60, 55, 70, 65, 85, 80, 95]
    },
    {
      id: 'revenue',
      label: 'Revenue Attributed',
      value: dashboardData?.kpis?.revenueAttributed || '£84,200',
      change: '-3.2%',
      type: 'negative',
      icon: PoundSterling,
      color: '#8B5CF6',
      sparkline: [80, 90, 85, 75, 85, 70, 65]
    }
  ];

  const defaultCampaigns = [
    { name: 'Google Search — Brand', platform: 'Google', status: 'Live', spendPence: 284000, budgetPence: 400000, roas: 4.2 },
    { name: 'Meta — Retargeting', platform: 'Meta', status: 'Live', spendPence: 120000, budgetPence: 200000, roas: 3.8 },
    { name: 'Google Display', platform: 'Google', status: 'Paused', spendPence: 68000, budgetPence: 150000, roas: 2.1 },
  ];

  const displayCampaigns = (dashboardData?.activeCampaigns && dashboardData.activeCampaigns.length > 0)
    ? dashboardData.activeCampaigns.slice(0, 3)
    : defaultCampaigns;

  const channelMix = [
    { label: 'Google Search', value: dashboardData?.channelBreakdown?.paidSearch || 45, color: '#4285F4' },
    { label: 'Meta Ads', value: dashboardData?.channelBreakdown?.socialMedia || 32, color: '#1877F2' },
    { label: 'SEO Organic', value: dashboardData?.channelBreakdown?.organic || 18, color: '#22C55E' },
    { label: 'Other', value: dashboardData?.channelBreakdown?.other || 5, color: '#94A3B8' },
  ];

  const activities = [
    { icon: TrendingUp, color: '#22C55E', title: 'SEO ranking improved', sub: '15 keywords moved to page 1', time: '2m ago' },
    { icon: UserPlus, color: '#06B6D4', title: '12 new leads captured', sub: 'Via Google Ads landing page', time: '1h ago' },
    { icon: AlertTriangle, color: '#EAB308', title: 'Campaign budget alert', sub: 'LinkedIn B2B at 89% of budget', time: '3h ago' },
  ];

  const tasks = [
    { name: 'Review April SEO content calendar', due: 'Today', priority: 'High' },
    { name: 'Approve new ad creatives for Meta', due: 'Tomorrow', priority: 'High' },
    { name: 'Strategy call — Q2 planning', due: 'Apr 8', priority: 'Med' },
  ];

  return (
    <div className={styles.page}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className="animate">
          <h1 className={styles.welcomeTitle}>
            Welcome back, {firstName} <Sparkles size={28} className={styles.sparkleIcon} />
          </h1>
          <p className={styles.welcomeSub}>Here is what's happening with your agency performance right now.</p>
        </div>
        <div className={styles.headerActions}>
          <PortalExportAction 
            title="April Performance Report" 
            data={dashboardData}
            onExportPDF={printReport}
            onExportCSV={() => {
              const fileName = `DigitalPulse_April_Report_${new Date().getTime()}.csv`;
              const content = "Section,Metric,Value,Change\n" + 
                kpis.map(k => `Executive,${k.label},${k.value},${k.change}`).join('\n');

              const blob = new Blob([content], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = fileName;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }}
          />
        </div>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.id} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <div className={styles.kpiLabelGroup}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
              </div>
              <div className={styles.kpiIconBadge} style={{ background: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon size={20} />
              </div>
            </div>
            <h2 className={styles.kpiValue}>{kpi.value}</h2>
            <div className={styles.kpiBottom}>
              <div className={`${styles.kpiChangeBadge} ${styles[kpi.type]}`}>
                {kpi.type === 'positive' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </div>
              <div className={styles.kpiSparkline}>
                <Sparkline data={kpi.sparkline} color={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Rows */}
      <div className={styles.rowTwo}>
        {/* Active Campaigns */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Active Campaigns</h2>
              <p className={styles.cardSubtitle}>Performance tracking across all platforms</p>
            </div>
            <Link href="/portal/campaigns" className={styles.viewAll}>View all</Link>
          </div>
          <div className={styles.campaignList}>
            {displayCampaigns.map((camp: any, idx: number) => (
              <div key={idx} className={styles.campaignRow}>
                <div className={styles.campaignInfo}>
                  <div className={styles.campaignMain}>
                    <div 
                      className={styles.platformIcon} 
                      style={{ 
                        background: ['Meta', 'Facebook', 'Instagram', 'facebook', 'instagram'].includes(camp.platform) ? '#1877F215' : '#4285F415', 
                        color: ['Meta', 'Facebook', 'Instagram', 'facebook', 'instagram'].includes(camp.platform) ? '#1877F2' : '#4285F4' 
                      }}
                    >
                      {(camp.platform || 'G')[0]}
                    </div>
                    <div>
                      <div className={styles.campaignName}>{camp.name}</div>
                      <div className={styles.campaignType}>{camp.platform || 'Google'} Ads</div>
                    </div>
                  </div>
                  <span className={`${styles.statusPill} ${['Live', 'live', 'Active', 'active'].includes(camp.status) ? styles.statusActive : styles.statusPaused}`}>
                    {camp.status}
                  </span>
                </div>
                <div className={styles.progressArea}>
                  <div className={styles.progressLabelRow}>
                    <span>Spend: <strong>£{((camp.spent || camp.spendPence || 0) / 100).toLocaleString()}</strong></span>
                    <span>Budget: £{((camp.budget || camp.budgetPence || 1) / 100).toLocaleString()}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ 
                        width: `${Math.min(100, ((camp.spent || camp.spendPence || 0) / (camp.budget || camp.budgetPence || 1)) * 100)}%`,
                        background: ['Live', 'live', 'Active', 'active', ''].includes(camp.status) || !camp.status ? '#06B6D4' : '#EAB308'
                      }} 
                    />
                  </div>
                </div>
                <div className={styles.rowStats}>
                   <span className={styles.statLabel}>ROAS Performance</span>
                   <span className={styles.statValue}>{camp.roas || '0.0'}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Performance (Donut Chart) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Channel Mix</h2>
          </div>
          <div className={styles.donutArea}>
            <DonutChart data={channelMix} />
            <div className={styles.donutLegend}>
              {channelMix.map((ch, idx) => (
                <div key={idx} className={styles.donutItem}>
                  <div className={styles.donutLabel}>
                    <div className={styles.legendDot} style={{ background: ch.color }} />
                    {ch.label}
                  </div>
                  <div className={styles.donutValue}>{ch.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rowThree}>
        {/* Recent Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Operations Feed</h2>
          </div>
          <div className={styles.activityFeed}>
            {activities.map((act, idx) => (
              <div key={idx} className={styles.activityItem}>
                <div className={styles.activityIconDot} style={{ background: `${act.color}15`, color: act.color }}>
                  <act.icon size={14} />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityText}>{act.title}</div>
                  <div className={styles.activitySub}>{act.sub}</div>
                  <div className={styles.activityTime}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Services */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Active Services</h2>
          </div>
          <div className={styles.servicesStatusGrid}>
             {[
               { name: 'SEO', status: 'Active', color: '#22C55E' },
               { name: 'Social Media', status: 'Active', color: '#06B6D4' },
               { name: 'Email Marketing', status: 'Active', color: '#F97316' },
               { name: 'Content Strategy', status: 'Active', color: '#8B5CF6' },
             ].map((svc, idx) => (
               <div key={idx} className={styles.serviceStatusRow}>
                  <div className={styles.serviceStatusInfo}>
                    <div className={styles.serviceStatusDot} style={{ background: svc.color }} />
                    <span className={styles.serviceStatusName}>{svc.name}</span>
                  </div>
                  <span className={styles.serviceStatusLabel}>{svc.status}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Action Items */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Action Items</h2>
          </div>
          <div className={styles.taskList}>
            {tasks.map((task, idx) => (
              <div key={idx} className={styles.taskItem}>
                <div className={styles.taskCheck} />
                <div className={styles.taskMain}>
                  <div className={styles.taskName}>{task.name}</div>
                  <div className={styles.taskMeta}>
                    <span className={styles.taskDue}>Due {task.due}</span>
                    <span className={`${styles.taskBadge} ${styles[`priority${task.priority}`]}`}>{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/portal/support" style={{ textDecoration: 'none' }}>
            <button className={styles.supportBtn}>
              <Mail size={16} />
              <span>Contact Support Team</span>
            </button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Shortcuts</h2>
          </div>
          <div className={styles.shortcutsGrid}>
             <Link href="/portal/campaigns" className={styles.shortcutItem}>
                <div className={styles.shortcutIcon} style={{ background: '#06B6D415', color: '#06B6D4' }}><Megaphone size={18} /></div>
                <span>Campaigns</span>
             </Link>
             <Link href="/portal/analytics" className={styles.shortcutItem}>
                <div className={styles.shortcutIcon} style={{ background: '#F9731615', color: '#F97316' }}><TrendingUp size={18} /></div>
                <span>Analytics</span>
             </Link>
             <Link href="/portal/invoices" className={styles.shortcutItem}>
                <div className={styles.shortcutIcon} style={{ background: '#8B5CF615', color: '#8B5CF6' }}><PoundSterling size={18} /></div>
                <span>Invoices</span>
             </Link>
             <Link href="/portal/reports" className={styles.shortcutItem}>
                <div className={styles.shortcutIcon} style={{ background: '#22C55E15', color: '#22C55E' }}><FileText size={18} /></div>
                <span>Reports</span>
             </Link>
          </div>
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
                  <h3 className={styles.modalTitle}>Preview: April 2026 Performance Report</h3>
                  <p className={styles.modalSub}>Format: {showPreview === 'PDF' ? 'Premium PDF Document' : 'Excel CSV Spreadsheet'}</p>
                </div>
              </div>
              <button className={styles.closeModal} onClick={() => setShowPreview(null)}><X size={20} /></button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.reportPaper}>
                {/* PDF Header Mock */}
                <div className={styles.reportHeader}>
                   <div className={styles.reportLogo}><Zap size={18} /> DigitalPulse</div>
                   <div className={styles.reportMeta}>
                      <div><strong>Client:</strong> {user?.name || 'Sarah Miller'}</div>
                      <div><strong>Agency ID:</strong> DP-2026-084</div>
                      <div><strong>Period:</strong> 01 Apr - 30 Apr 2026</div>
                   </div>
                </div>

                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>1. Executive Summary</h4>
                  <div className={styles.previewGrid}>
                    {kpis.map(k => (
                      <div key={k.id} className={styles.previewKpi}>
                        <div className={styles.pKpiLabel}>{k.label}</div>
                        <div className={styles.pKpiVal}>{k.value}</div>
                        <div className={styles.pKpiChange}>{k.change}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>2. Campaign Deep-Dive</h4>
                  <table className={styles.previewTable}>
                    <thead>
                      <tr>
                        <th>Campaign Name</th>
                        <th>Platform</th>
                        <th>Spend</th>
                        <th>ROAS</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayCampaigns.map((c: any, i: number) => (
                        <tr key={i}>
                          <td>{c.name}</td>
                          <td>{c.platform}</td>
                          <td>£{((c.spendPence || 0) / 100).toLocaleString()}</td>
                          <td>{c.roas}x</td>
                          <td>{c.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>3. Channel Distribution</h4>
                  <div className={styles.previewChannels}>
                    {channelMix.map((ch, i) => (
                      <div key={i} className={styles.pChannelRow}>
                        <span className={styles.pChannelName}>{ch.label}</span>
                        <div className={styles.pChannelBar}><div style={{ width: `${ch.value}%`, background: ch.color }} /></div>
                        <span className={styles.pChannelVal}>{ch.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.reportFooter}>
                   <p>Generated via DigitalPulse Intelligence Core. All rights reserved © 2026.</p>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalHint}>
                <Info size={14} /> This is a 1:1 preview of the {showPreview} data structure.
              </div>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowPreview(null)}>Cancel</button>
                <button className={styles.downloadConfirmBtn} onClick={confirmDownload}>
                  <Download size={16} /> Confirm & Download {showPreview}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
