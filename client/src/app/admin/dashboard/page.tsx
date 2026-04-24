'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Target, 
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
  Zap,
  Activity,
  UserCheck,
  Star,
  Clock,
  Briefcase,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore, useEnquiryStore, useCampaignStore } from '@/store';
import styles from './page.module.css';
import { api } from '@/lib/api';

// --- MOCK DATA ---

const adminKpis = [
  {
    id: 'agency_revenue',
    label: 'Agency Revenue',
    value: '£284,500',
    change: '+14.2%',
    type: 'positive',
    icon: PoundSterling,
    color: '#06B6D4',
    sparkline: [40, 50, 45, 60, 75, 70, 85]
  },
  {
    id: 'hot_leads',
    label: 'Urgent Hot Leads',
    value: '12',
    change: '+3 new',
    type: 'positive',
    icon: Star,
    color: '#F97316',
    sparkline: [20, 30, 25, 45, 40, 55, 60]
  },
  {
    id: 'campaign_health',
    label: 'Campaign Health',
    value: '94%',
    change: '+2.1%',
    type: 'positive',
    icon: Target,
    color: '#22C55E',
    sparkline: [85, 88, 86, 92, 90, 93, 94]
  },
  {
    id: 'team_utilization',
    label: 'Team Utilization',
    value: '82%',
    change: 'Stable',
    type: 'positive',
    icon: UserCheck,
    color: '#8B5CF6',
    sparkline: [75, 80, 78, 82, 85, 81, 82]
  }
];

const urgentLeads = [
  { id: '1', name: 'James Okoro', company: 'TechFlow SaaS', score: 92, service: 'SEO + PPC', time: '10m ago' },
  { id: '2', name: 'Sarah Thompson', company: 'Glow Skincare', score: 88, service: 'Social Media', time: '1h ago' },
  { id: '3', name: 'Robert Chen', company: 'Zenith Logistics', score: 75, service: 'Full Strategy', time: '3h ago' },
  { id: '4', name: 'Emma Wilson', company: 'Nova Fashion', score: 82, service: 'Content Mktg', time: '5h ago' },
];

const teamWorkload = [
  { name: 'Nivethika N.', role: 'Account Manager', load: 85, clients: 12, color: '#F97316' },
  { name: 'Tom Bradley', role: 'Content Head', load: 60, clients: 8, color: '#06B6D4' },
  { name: 'Sarah Miller', role: 'PPC Lead', load: 92, clients: 15, color: '#3B82F6' },
];

const auditLogs = [
  { icon: Target, iconBg: '#F97316', title: 'New campaign launched', desc: 'Google Ads for Miller Digital', time: '2m ago' },
  { icon: FileText, iconBg: '#06B6D4', title: 'Monthly report generated', desc: 'Performance Review — Apr 2026', time: '45m ago' },
  { icon: Settings, iconBg: '#64748B', title: 'System settings updated', desc: 'Lead scoring weights adjusted', time: '3h ago' },
];

// --- COMPONENTS ---

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
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

const InteractiveRevenueChart = ({ history, onHover, onLeave }: any) => {
    if (!history || history.length === 0) return null;

    const padding = 40;
    const width = 800;
    const height = 300;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxVal = Math.max(...history.map((d: any) => Math.max(d.actual, d.projected))) * 1.1;
    
    const getX = (i: number) => padding + (i / (history.length - 1)) * chartWidth;
    const getY = (val: number) => height - padding - (val / maxVal) * chartHeight;

    const actualPath = history.map((d: any, i: number) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.actual)}`).join(' ');
    const projectedPath = history.map((d: any, i: number) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.projected)}`).join(' ');
    
    const actualArea = `${actualPath} L${getX(history.length - 1)},${height - padding} L${padding},${height - padding} Z`;
    const projectedArea = `${projectedPath} L${getX(history.length - 1)},${height - padding} L${padding},${height - padding} Z`;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const relativeX = (x / rect.width) * width;
        
        // Find closest point
        const i = Math.round(((relativeX - padding) / chartWidth) * (history.length - 1));
        if (i >= 0 && i < history.length) {
            onHover(history[i], x, (getY(history[i].actual) / height) * rect.height);
        }
    };

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" onMouseMove={handleMouseMove} onMouseLeave={onLeave}>
            <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(p => (
                <line key={p} x1={padding} y1={padding + p * chartHeight} x2={width - padding} y2={padding + p * chartHeight} stroke="#F1F5F9" strokeWidth="1" />
            ))}
            {/* Paths */}
            <path d={projectedArea} fill="#F1F5F9" opacity="0.5" />
            <path d={projectedPath} fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
            
            <path d={actualArea} fill="url(#actualGrad)" />
            <path d={actualPath} fill="none" stroke="#F97316" strokeWidth="3" />

            {/* Labels */}
            {history.map((d: any, i: number) => (
                i % Math.ceil(history.length / 6) === 0 && (
                    <text key={i} x={getX(i)} y={height - 15} textAnchor="middle" fontSize="11" fill="#94A3B8">{d.date}</text>
                )
            ))}
        </svg>
    );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [firstName, setFirstName] = useState('Priya');
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('90d');
  const [hoverData, setHoverData] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ clientId: '', title: '', date: '', notes: '' });
  const [stats, setStats] = useState<any>({ clients: 0, leads: 0, activeCampaigns: 0, revenue: 0, revenueHistory: [] });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [statsData, leadsData, clientsData] = await Promise.all([
        api.get(`/admin/stats?range=${range}`),
        api.get('/admin/enquiries?limit=4&sort=desc'),
        api.get('/admin/clients')
      ]);
      setStats(statsData);
      setRecentLeads(leadsData.enquiries || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error('Failed to sync dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  useEffect(() => {
    if (user?.firstName) setFirstName(user.firstName);
    else if (user?.name) setFirstName(user.name.split(' ')[0]);
  }, [user]);

  // Update KPI objects with live data
  const liveKpis = adminKpis.map(k => {
    if (k.id === 'agency_revenue') return { ...k, value: `£${stats.revenue.toLocaleString()}` };
    if (k.id === 'hot_leads') return { ...k, value: stats.leads.toString() };
    if (k.id === 'campaign_health') return { ...k, value: stats.activeCampaigns.toString(), label: 'Active Campaigns' };
    return k;
  });

  const handleExport = (format: 'pdf' | 'csv') => {
    setExportOpen(false);

    if (format === 'csv') {
      let csv = "DIGITAL PULSE AGENCY - EXECUTIVE DATA EXPORT\n";
      csv += `Export Date: ${new Date().toLocaleString()}\n\n`;
      csv += "01. KEY PERFORMANCE INDICATORS\nMetric,Value,Status,Trend\n";
      adminKpis.forEach(k => { csv += `${k.label},"${k.value}",Stable,${k.change}\n`; });
      csv += "\n02. SERVICE LINE REVENUE\nService,Revenue,Growth,Margin\nSEO Optimization,£94000,+8%,62%\nPaid Media (PPC),£120500,+18%,45%\nContent Strategy,£70000,+12%,74%\n\n";
      csv += "03. URGENT LEAD PIPELINE\nLead Name,Company,Service,Lead Score,Last Contact\n";
      urgentLeads.forEach(l => { csv += `${l.name},${l.company},${l.service},${l.score},${l.time}\n`; });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DigitalPulse_Advanced_Report.csv`;
      link.click();
    } else {
      // Direct Print on same page
      window.print();
    }
  };

  const handleScheduleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/strategy-reviews', {
        clientId: newReview.clientId || clients[0]?.userId,
        title: newReview.title,
        reviewDate: newReview.date,
        notes: newReview.notes
      });
      alert('Strategy Review Scheduled Successfully!');
      setShowReviewModal(false);
      setNewReview({ clientId: '', title: '', date: '', notes: '' });
    } catch (err) {
      console.error('Failed to schedule review');
      alert('Failed to schedule session. Please try again.');
    }
  };

  useEffect(() => {
    if (user?.name) setFirstName(user.name.split(' ')[0]);
  }, [user]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="animate">
          <h1 className={styles.welcomeTitle}>Welcome back, {firstName} <Sparkles size={24} color="#F97316" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} /></h1>
          <p className={styles.welcomeSub}>Agency Overview: All systems are operational.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.exportWrapper}>
            <button className={styles.headerBtn} onClick={() => setExportOpen(!exportOpen)}>
              <Download size={16} />
              <span>Export Financials</span>
            </button>
            {exportOpen && (
              <div className={styles.exportDropdown}>
                <button onClick={() => handleExport('pdf')} className={styles.dropdownItem}>
                  <FileText size={14} color="#EF4444" />
                  <span>Download PDF Report</span>
                </button>
                <button onClick={() => handleExport('csv')} className={styles.dropdownItem}>
                  <TrendingUp size={14} color="#10B981" />
                  <span>Download CSV Data</span>
                </button>
              </div>
            )}
          </div>
          <Link href="/admin/campaigns/new" className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>
            <Plus size={16} />
            <span>New Campaign</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {liveKpis.map((kpi) => (
          <div key={kpi.id} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <div className={styles.kpiIconBox} style={{ background: kpi.color }}>
                <kpi.icon size={22} />
              </div>
              <div className={`${styles.kpiChange} ${kpi.type === 'positive' ? styles.changePos : styles.changeNeg}`}>
                {kpi.change}
              </div>
            </div>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiValue}>{kpi.value}</span>
              <span className={styles.kpiLabel}>{kpi.label}</span>
            </div>
            <div className={styles.sparklineContainer}>
              <Sparkline data={kpi.sparkline} color={kpi.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Revenue & Leads */}
      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>Agency Revenue Pipeline</h2>
              <span className={styles.cardSub}>Period: {range.toUpperCase()} Performance</span>
            </div>
            <div className={styles.headerActions}>
                <div className={styles.rangeSelector}>
                    {['7d', '30d', '90d', '12m', 'all'].map(r => (
                        <button 
                            key={r} 
                            className={`${styles.rangeBtn} ${range === r ? styles.rangeBtnActive : ''}`}
                            onClick={() => setRange(r)}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className={styles.rangeStats}>
                    <div className={styles.rangeStatItem}>
                        <div className={styles.rangeStatDotActual} />
                        <div className={styles.rangeStatInfo}>
                            <span>Actual</span>
                            <strong>£{stats.revenue.toLocaleString()}</strong>
                        </div>
                    </div>
                    <div className={styles.rangeStatItem}>
                        <div className={styles.rangeStatDotProjected} />
                        <div className={styles.rangeStatInfo}>
                            <span>Projected</span>
                            <strong>£{(stats.projectedRevenue || 0).toLocaleString()}</strong>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div className={styles.chartContainer} style={{ position: 'relative' }}>
            <InteractiveRevenueChart 
                history={stats.revenueHistory} 
                onHover={(d: any, x: number, y: number) => {
                    setHoverData(d);
                    setMousePos({ x, y });
                }}
                onLeave={() => setHoverData(null)}
            />
            {hoverData && (
                <div className={styles.chartTooltip} style={{ left: mousePos.x, top: mousePos.y }}>
                    <div className={styles.tooltipDate}>{hoverData.date}</div>
                    <div className={styles.tooltipVal}>
                        <span className={styles.tooltipDotActual} /> Actual: £{hoverData.actual.toLocaleString()}
                    </div>
                    <div className={styles.tooltipVal}>
                        <span className={styles.tooltipDotProjected} /> Proj: £{hoverData.projected.toLocaleString()}
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Urgent Hot Leads</h2>
            <Link href="/admin/enquiries" className={styles.welcomeSub}>View All</Link>
          </div>
          <div className={styles.leadList}>
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <Link href={`/admin/enquiries/${lead.id}`} key={lead.id} className={styles.leadItem}>
                <div className={styles.leadAvatar}>{lead.firstName[0]}</div>
                <div className={styles.leadInfo}>
                  <span className={styles.leadName}>{lead.firstName} {lead.lastName}</span>
                  <span className={styles.leadMeta}>{lead.companyName || 'Private Individual'} · {lead.serviceInterest?.[0] || 'Digital Strategy'}</span>
                </div>
                <div className={styles.leadScoreBadge}>
                  {lead.leadScore || 0}
                </div>
              </Link>
            )) : (
              <div className={styles.emptyState}>No urgent leads found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Operations Grid: Team, Activity, Quick Actions */}
      <div className={styles.opsGrid}>
        {/* Team Workload */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Team Utilization</h2>
          </div>
          <div className={styles.teamList}>
            {(stats.teamWorkload || teamWorkload).map((staff: any, i: number) => (
              <div key={i} className={styles.teamItem}>
                <div className={styles.teamTop}>
                  <span className={styles.teamName}>{staff.name}</span>
                  <span className={styles.teamUsage}>{staff.load}% Capacity</span>
                </div>
                <div className={styles.usageBar}>
                  <div 
                    className={styles.usageFill} 
                    style={{ width: `${staff.load}%`, background: staff.color }} 
                  />
                </div>
                <span className={styles.welcomeSub} style={{ fontSize: 11 }}>{staff.clients} Active Clients</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Activity Feed */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Live Operations Feed</h2>
          </div>
          <div className={styles.activityList}>
            {(stats.activityLogs || auditLogs).map((log: any, i: number) => {
               // Map icon string to component
               const iconMap: any = { Target, FileText, Settings };
               const Icon = iconMap[log.icon] || Activity;
               return (
                <div key={i} className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{ background: `${log.iconBg}15`, color: log.iconBg }}>
                        <Icon size={18} />
                    </div>
                    <div className={styles.activityText}>
                        <strong>{log.title}</strong>
                        <p>{log.desc}</p>
                        <span className={styles.activityTime}>{log.time}</span>
                    </div>
                </div>
               );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Operations</h2>
          </div>
          <div className={styles.quickActions}>
            <Link href="/admin/portfolio/new" className={styles.actionBtn}>
                <Plus size={20} color="#F97316" />
                <strong>Add Work</strong>
            </Link>
            <Link href="/admin/enquiries" className={styles.actionBtn}>
                <Mail size={20} color="#06B6D4" />
                <strong>New Lead</strong>
            </Link>
            <Link href="/admin/team" className={styles.actionBtn}>
                <Users size={20} color="#8B5CF6" />
                <strong>Add Staff</strong>
            </Link>
            <Link href="/admin/analytics" className={styles.actionBtn}>
                <TrendingUp size={20} color="#22C55E" />
                <strong>Audit</strong>
            </Link>
          </div>
          <div className={styles.activityList} style={{ paddingTop: 0 }}>
             <div className={styles.headerBtn} style={{ justifyContent: 'center', width: '100%', borderStyle: 'dashed', cursor: 'pointer' }} onClick={() => setShowReviewModal(true)}>
                 <Clock size={16} />
                 <span>Schedule Strategy Review</span>
             </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Schedule Strategy Review</h2>
            <form onSubmit={handleScheduleReview} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Review Title</label>
                <input 
                  required
                  placeholder="e.g. Q2 Performance Deep-Dive"
                  value={newReview.title}
                  onChange={e => setNewReview({...newReview, title: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Select Client</label>
                <select 
                  required
                  value={newReview.clientId}
                  onChange={e => setNewReview({...newReview, clientId: e.target.value})}
                >
                  <option value="">Choose a client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.userId}>{c.clientProfile?.companyName || c.email}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Date & Time</label>
                <input 
                  required
                  type="datetime-local"
                  value={newReview.date}
                  onChange={e => setNewReview({...newReview, date: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Internal Notes</label>
                <textarea 
                  placeholder="Key items to discuss..."
                  value={newReview.notes}
                  onChange={e => setNewReview({...newReview, notes: e.target.value})}
                  style={{ minHeight: 80, padding: 12, borderRadius: 8, border: '1.5px solid #e2e8f0' }}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowReviewModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- HIDDEN PRINT-ONLY REPORT --- */}
      <div className={styles.printOnlyReport}>
        <div className={styles.reportPage}>
           <div className={styles.reportCover}>
              <p className={styles.reportSubtitle}>Executive Financial Review</p>
              <h1 className={styles.reportTitle}>Agency Performance & Financial Summary</h1>
              <div className={styles.reportDivider} />
              <div className={styles.reportMeta}>
                <div><strong>Date Prepared:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Prepared By:</strong> Priya Nanthakumar</div>
              </div>
           </div>
        </div>

        <div className={styles.reportPage}>
           <h2 className={styles.sectionTitle}>01. Executive Summary</h2>
           <div className={styles.reportStats}>
              {adminKpis.map(kpi => (
                <div key={kpi.id} className={styles.reportStatBox}>
                   <span className={styles.statLabel}>{kpi.label}</span>
                   <span className={styles.statValue}>{kpi.value}</span>
                   <span className={styles.statTrend}>{kpi.change}</span>
                </div>
              ))}
           </div>
           
           <h3 className={styles.subTitle}>Service Line Breakdown</h3>
           <table className={styles.reportTable}>
              <thead>
                <tr><th>SERVICE</th><th>REVENUE</th><th>GROWTH</th><th>MARGIN</th></tr>
              </thead>
              <tbody>
                <tr><td>SEO Optimization</td><td>£94,000</td><td>+8%</td><td>62%</td></tr>
                <tr><td>Paid Media (PPC)</td><td>£120,500</td><td>+18%</td><td>45%</td></tr>
                <tr><td>Content Strategy</td><td>£70,000</td><td>+12%</td><td>74%</td></tr>
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
