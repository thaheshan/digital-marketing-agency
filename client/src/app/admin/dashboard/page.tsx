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
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore, useEnquiryStore, useCampaignStore } from '@/store';
import styles from './page.module.css';

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

const MultiAreaChart = () => {
    return (
        <svg  width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Grid Lines */}
            {[0, 1, 2, 3].map(i => (
                <line key={i} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#F1F5F9" strokeWidth="1" />
            ))}
            {/* Target Area */}
            <path d="M0,200 L100,180 L200,190 L300,150 L400,160 L500,130 L600,140 L700,110 L800,120 L800,300 L0,300 Z" fill="url(#gradTarget)" />
            <path d="M0,200 L100,180 L200,190 L300,150 L400,160 L500,130 L600,140 L700,110 L800,120" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Actual Area */}
            <path d="M0,220 L100,210 L200,160 L300,140 L400,100 L500,80 L600,95 L700,50 L800,40 L800,300 L0,300 Z" fill="url(#gradActual)" />
            <path d="M0,220 L100,210 L200,160 L300,140 L400,100 L500,80 L600,95 L700,50 L800,40" fill="none" stroke="#F97316" strokeWidth="3" />
            
            {/* Data Points */}
            <circle cx="700" cy="50" r="4" fill="#FFFFFF" stroke="#F97316" strokeWidth="2" />
            <circle cx="800" cy="40" r="5" fill="#F97316" />
        </svg>
    );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [firstName, setFirstName] = useState('Priya');

  useEffect(() => {
    if (user?.name) setFirstName(user.name.split(' ')[0]);
  }, [user]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="animate">
          <h1 className={styles.welcomeTitle}>Welcome back, {firstName} 👋</h1>
          <p className={styles.welcomeSub}>Agency Overview: All systems are operational.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.headerBtn}>
            <Download size={16} />
            <span>Export Financials</span>
          </div>
          <button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>
            <Plus size={16} />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {adminKpis.map((kpi) => (
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
            <h2 className={styles.cardTitle}>Agency Revenue Pipeline</h2>
            <div className={styles.headerActions}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} /> Actual
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#94A3B8' }} /> Projected
                    </div>
                </div>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <MultiAreaChart />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Urgent Hot Leads</h2>
            <Link href="/admin/enquiries" className={styles.welcomeSub}>View All</Link>
          </div>
          <div className={styles.leadList}>
            {urgentLeads.map((lead) => (
              <Link href={`/admin/enquiries/${lead.id}`} key={lead.id} className={styles.leadItem}>
                <div className={styles.leadAvatar}>{lead.name[0]}</div>
                <div className={styles.leadInfo}>
                  <span className={styles.leadName}>{lead.name}</span>
                  <span className={styles.leadMeta}>{lead.company} · {lead.service}</span>
                </div>
                <div className={styles.leadScoreBadge}>
                  {lead.score}
                </div>
              </Link>
            ))}
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
            {teamWorkload.map((staff, i) => (
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
            {auditLogs.map((log, i) => {
               const Icon = log.icon;
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
             <div className={styles.headerBtn} style={{ justifyContent: 'center', width: '100%', borderStyle: 'dashed' }}>
                 <Clock size={16} />
                 <span>Schedule Strategy Review</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
