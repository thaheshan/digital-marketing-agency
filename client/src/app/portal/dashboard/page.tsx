'use client';

import React from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { api } from '@/lib/api';
import styles from './page.module.css';

// --- MOCK DATA ---

const kpis = [
  {
    id: 'organic_traffic',
    label: 'Organic Traffic',
    period: 'This month',
    value: '48,320',
    change: '+23.4%',
    type: 'positive',
    icon: Users,
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    sparkline: [30, 45, 35, 55, 65, 58, 75]
  },
  {
    id: 'leads_generated',
    label: 'Leads Generated',
    period: 'This month',
    value: '312',
    change: '+18.7%',
    type: 'positive',
    icon: UserPlus,
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    sparkline: [20, 25, 45, 40, 60, 75, 80]
  },
  {
    id: 'ad_spend_roi',
    label: 'Ad Spend ROI',
    period: 'This month',
    value: '285%',
    change: '+12.1%',
    type: 'positive',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #F97316, #EA580C)',
    sparkline: [60, 55, 70, 65, 85, 80, 95]
  },
  {
    id: 'revenue_attributed',
    label: 'Revenue Attributed',
    period: 'This month',
    value: '£84,200',
    change: '-3.2%',
    type: 'negative',
    icon: PoundSterling,
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    sparkline: [80, 90, 85, 75, 85, 70, 65]
  }
];

const campaigns = [
  { name: 'Google Search — Brand', platform: 'Google', iconBg: '#4285F4', status: 'Active', spend: '£2,840', budget: '£4,000', roas: '4.2x', progress: 71, color: '#22C55E' },
  { name: 'Meta — Retargeting', platform: 'Meta', iconBg: '#1877F2', status: 'Active', spend: '£1,200', budget: '£2,000', roas: '3.8x', progress: 60, color: '#06B6D4' },
  { name: 'Google Display', platform: 'Google', iconBg: '#34A853', status: 'Paused', spend: '£680', budget: '£1,500', roas: '2.1x', progress: 45, color: '#EAB308' },
];

const activities = [
  { icon: TrendingUp, iconBg: '#22C55E', title: 'SEO ranking improved', sub: '15 keywords moved to page 1', time: '2m ago' },
  { icon: UserPlus, iconBg: '#06B6D4', title: '12 new leads captured', sub: 'Via Google Ads landing page', time: '1h ago' },
  { icon: AlertTriangle, iconBg: '#EAB308', title: 'Campaign budget alert', sub: 'LinkedIn B2B at 89% of budget', time: '3h ago' },
];

const tasks = [
  { name: 'Review April SEO content calendar', due: 'Today', priority: 'High' },
  { name: 'Approve new ad creatives for Meta', due: 'Tomorrow', priority: 'High' },
  { name: 'Strategy call — Q2 planning', due: 'Apr 8', priority: 'Med' },
];

// --- COMPONENTS ---

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const width = 80;
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Client';

  const [dashboardData, setDashboardData] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get<any>('/portal/dashboard');
        if (res.kpis) {
          setDashboardData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard data from API; using fallbacks', err);
      }
    }
    fetchDashboard();
  }, []);

  const displayKpis = dashboardData?.kpis ? [
    { ...kpis[0], value: dashboardData.kpis.organicTraffic },
    { ...kpis[1], value: dashboardData.kpis.leadsGenerated },
    { ...kpis[2], value: dashboardData.kpis.roi },
    { ...kpis[3], value: dashboardData.kpis.revenueAttributed }
  ] : kpis;

  const displayCampaigns = dashboardData?.activeCampaigns && dashboardData.activeCampaigns.length > 0 
    ? dashboardData.activeCampaigns.map((c: any) => ({
        name: c.name, 
        platform: c.platform, 
        iconBg: c.platform === 'Meta' || c.platform === 'Facebook' ? '#1877F2' : '#4285F4', 
        status: 'Active', 
        spend: `£${c.spent / 100}`, 
        budget: `£${c.budget / 100}`, 
        roas: 'N/A', 
        progress: c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0, 
        color: c.budget > 0 && (c.spent / c.budget) > 0.8 ? '#EAB308' : '#22C55E'
      }))
    : campaigns;

  const displayChartData = dashboardData?.chartData || [];
  const chartMax = Math.max(...displayChartData.map((d: any) => d.traffic), 1);
  const chartPointsArea = displayChartData.length > 0 
    ? displayChartData.map((d: any, i: number) => {
        const x = (i / (displayChartData.length - 1)) * 600;
        const y = 180 - ((d.traffic / chartMax) * 120); 
        return `${x},${y}`;
      }).join(' ')
    : '0,180 100,120 200,150 400,100 600,60';

  const displayChannelBreakdown = dashboardData?.channelBreakdown || { organic: 38, paidSearch: 27, socialMedia: 19 };
  const getStrokeDash = (percent: number) => {
    const circumference = 2 * Math.PI * 40;
    const value = (percent / 100) * circumference;
    return `${value} ${circumference}`;
  };
  const getStrokeOffset = (percentBefore: number) => {
    const circumference = 2 * Math.PI * 40;
    const offset = 25 - ((percentBefore / 100) * circumference);
    return offset;
  };
  
  const displayActivities = dashboardData?.recentActivity || activities;
  const displayTasks = dashboardData?.upcomingTasks || tasks;
  const displayServices = dashboardData?.activeServices || [
    { name: 'SEO', status: 'Healthy' },
    { name: 'Social', status: 'Healthy' },
    { name: 'PPC', status: 'Healthy' },
    { name: 'Content', status: 'Healthy' },
    { name: 'Email', status: 'Healthy' },
    { name: 'Brand', status: 'Healthy' },
  ];

  const mapActivityIcon = (type: string) => {
    if (type === 'warning') return AlertTriangle;
    if (type === 'positive') return TrendingUp;
    return UserPlus;
  };

  const mapServiceIcon = (name: string) => {
    if (name === 'SEO') return Search;
    if (name === 'Social') return Share2;
    if (name === 'PPC') return TrendingUp;
    if (name === 'Content') return FileText;
    if (name === 'Email') return Mail;
    if (name === 'Brand') return Award;
    return Search;
  };


  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="animate">
          <h1 className={styles.welcomeTitle}>Good morning, {firstName} 👋</h1>
          <p className={styles.welcomeSub}>Here&apos;s how your marketing is performing this month.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.headerBtn}>
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </div>
          <button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {displayKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.id} className={`${styles.kpiCard} animate`} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className={styles.kpiTop}>
                <div className={styles.kpiLabelGroup}>
                  <span className={styles.kpiLabel}>{kpi.label}</span>
                  <span className={styles.kpiPeriod}>{kpi.period}</span>
                </div>
                <div className={styles.kpiIconBadge} style={{ background: kpi.gradient }}>
                  <Icon size={20} />
                </div>
              </div>
              <div className={styles.kpiValue}>{kpi.value}</div>
              <div className={styles.kpiBottom}>
                <div className={`${styles.kpiChangeBadge} ${kpi.type === 'positive' ? styles.positive : styles.negative}`}>
                  {kpi.type === 'positive' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{kpi.change}</span>
                </div>
                <Sparkline data={kpi.sparkline} color={kpi.type === 'positive' ? '#22C55E' : '#DC2626'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Row Two: 65/35 */}
      <div className={styles.rowTwo}>
        {/* Chart Card */}
        <div className={`${styles.card} animate`} style={{ animationDelay: '0.4s' }}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Performance Over Time</h2>
              <p className={styles.cardSubtitle}>Traffic vs Leads vs Revenue</p>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.headerBtn}>12 Months</div>
            </div>
          </div>
          
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#22C55E' }} />
              Organic Traffic <span className={styles.legendValue}>48.3K</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#06B6D4' }} />
              Leads <span className={styles.legendValue}>312</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#8B5CF6' }} />
              Revenue <span className={styles.legendValue}>£84.2K</span>
            </div>
          </div>

          <div className={styles.chartContainer}>
            {/* Simple Mock Area Chart SVG */}
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path 
                d={`M0,180 L${chartPointsArea.split(' ').map(p => {
                  const [x,y] = p.split(',');
                  return `${x},${y}`;
                }).join(' L')} L600,200 L0,200 Z`}
                fill="url(#grad1)" 
              />
              <path 
                d={`M${chartPointsArea.split(' ').map(p => {
                  const [x,y] = p.split(',');
                  return `${x},${y}`;
                }).join(' L')}`}
                fill="none" 
                stroke="#06B6D4" 
                strokeWidth="3" 
              />
              {/* x-axis grid lines dummy */}
              <line x1="0" y1="180" x2="600" y2="180" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#F1F5F9" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Campaign Health Card */}
        <div className={`${styles.card} animate`} style={{ animationDelay: '0.5s' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Campaign Health</h2>
            <Link href="/portal/campaigns" className={styles.cardSubtitle}>View All →</Link>
          </div>
          <div className={styles.campaignList}>
            {displayCampaigns.map((c, i) => (
              <div key={i} className={styles.campaignRow}>
                <div className={styles.campaignInfo}>
                  <div className={styles.campaignMain}>
                    <div className={styles.platformIcon} style={{ background: c.iconBg }}>
                      {c.platform[0]}
                    </div>
                    <div>
                      <div className={styles.campaignName}>{c.name}</div>
                      <div className={styles.campaignType}>{c.platform} Ads</div>
                    </div>
                  </div>
                  <span className={`${styles.statusPill} ${c.status === 'Active' ? styles.statusActive : styles.statusPaused}`}>
                    {c.status}
                  </span>
                </div>
                <div className={styles.progressArea}>
                  <div className={styles.progressLabelRow}>
                    <span>Spend: {c.spend}</span>
                    <span>Budget: {c.budget}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${c.progress}%`, background: c.color }} />
                  </div>
                </div>
                <div className={styles.rowStats}>
                  <div className={styles.statLabel}>Monthly ROAS</div>
                  <div className={styles.statValue} style={{ color: c.color }}>{c.roas}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row Three: 3 Columns */}
      <div className={styles.rowThree}>
        {/* Channel Breakdown */}
        <div className={`${styles.card} animate`} style={{ animationDelay: '0.6s' }}>
          <h2 className={styles.cardTitle} style={{ marginBottom: '24px' }}>Channel Breakdown</h2>
          <div className={styles.donutArea}>
            <svg className={styles.donutSvg} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="15" />
              {displayChannelBreakdown.organic > 0 && (
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22C55E" strokeWidth="15" strokeDasharray={getStrokeDash(displayChannelBreakdown.organic)} strokeDashoffset={getStrokeOffset(0)} />
              )}
              {displayChannelBreakdown.paidSearch > 0 && (
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06B6D4" strokeWidth="15" strokeDasharray={getStrokeDash(displayChannelBreakdown.paidSearch)} strokeDashoffset={getStrokeOffset(displayChannelBreakdown.organic)} />
              )}
              {displayChannelBreakdown.socialMedia > 0 && (
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F97316" strokeWidth="15" strokeDasharray={getStrokeDash(displayChannelBreakdown.socialMedia)} strokeDashoffset={getStrokeOffset(displayChannelBreakdown.organic + displayChannelBreakdown.paidSearch)} />
              )}
            </svg>
            <div className={styles.donutLegend}>
              <div className={styles.donutItem}>
                <div className={styles.donutLabel}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} /> Organic Search</div>
                <span className={styles.donutValue}>{displayChannelBreakdown.organic}%</span>
              </div>
              <div className={styles.donutItem}>
                <div className={styles.donutLabel}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4' }} /> Paid Search</div>
                <span className={styles.donutValue}>{displayChannelBreakdown.paidSearch}%</span>
              </div>
              <div className={styles.donutItem}>
                <div className={styles.donutLabel}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} /> Social Media</div>
                <span className={styles.donutValue}>{displayChannelBreakdown.socialMedia}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${styles.card} animate`} style={{ animationDelay: '0.7s' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
          </div>
          <div className={styles.activityFeed}>
            {displayActivities.map((a: any, i: number) => {
              const Icon = a.icon || mapActivityIcon(a.type);
              const iconBg = a.iconBg || (a.type === 'positive' ? '#22C55E' : a.type === 'warning' ? '#EAB308' : '#06B6D4');
              return (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityIconDot} style={{ background: iconBg }}>
                    <Icon size={14} color="#FFF" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>{a.title}</div>
                    <div className={styles.activitySub}>{a.sub}</div>
                    <div className={styles.activityTime}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className={`${styles.card} animate`} style={{ animationDelay: '0.8s' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming Tasks</h2>
            <button className={styles.headerIconButton}><Plus size={16} /></button>
          </div>
          <div className={styles.taskList}>
            {displayTasks.map((t: any, i: number) => (
              <div key={i} className={styles.taskItem}>
                <div className={styles.taskCheck} />
                <div className={styles.taskMain}>
                  <div className={styles.taskName}>{t.name}</div>
                  <div className={styles.taskMeta}>
                    <div className={styles.activitySub}>Due {t.due}</div>
                    <span className={`${styles.taskBadge} ${t.priority === 'High' ? styles.priorityHigh : styles.priorityMed}`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Strip */}
      <div className={`${styles.servicesStrip} animate`} style={{ animationDelay: '0.9s' }}>
        <div className={styles.stripHeader}>
          <h2 className={styles.cardTitle}>Active Services Status</h2>
          <div className={styles.headerBtn}>Manage All</div>
        </div>
        <div className={styles.servicesGrid}>
          {displayServices.map((s: any, i: number) => {
            const Icon = mapServiceIcon(s.name);
            const isHealthy = s.status === 'Healthy';
            const bg = s.bg || (s.name === 'SEO' ? '#22C55E' : s.name === 'Social' ? '#06B6D4' : s.name === 'PPC' ? '#F97316' : s.name === 'Content' ? '#8B5CF6' : s.name === 'Email' ? '#EC4899' : '#EAB308');
            return (
              <div key={i} className={styles.serviceStatusCard} style={{ opacity: isHealthy ? 1 : 0.6 }}>
                <div className={styles.serviceIconWrap} style={{ background: isHealthy ? bg : '#94A3B8' }}>
                  <Icon size={18} />
                </div>
                <div className={styles.serviceTitle}>{s.name}</div>
                <div className={styles.serviceUpdate} style={{ color: isHealthy ? '#22C55E' : '#94A3B8' }}>{s.status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
