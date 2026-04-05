'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Star,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { 
  useAuthStore, 
  useEnquiryStore, 
  useCampaignStore, 
  usePortfolioStore 
} from '@/store';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { enquiries } = useEnquiryStore();
  const { campaigns } = useCampaignStore();
  const { items: portfolioItems } = usePortfolioStore();
  
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17) setGreeting('Good evening');
  }, []);

  // Stats calculation
  const totalLeads = enquiries.length;
  const hotLeads = enquiries.filter(e => {
    const total = Object.values(e.scoreBreakdown).reduce((a, b) => a + b, 0);
    return total >= 70 && e.status === 'new';
  }).length;
  
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const publishedPortfolio = portfolioItems.filter(i => i.status === 'published').length;

  const stats = [
    { 
      label: 'Hot Leads', 
      value: hotLeads, 
      sub: `${totalLeads} total enquiries`, 
      icon: Star, 
      color: '#F97316',
      link: '/admin/enquiries'
    },
    { 
      label: 'Active Campaigns', 
      value: activeCampaigns, 
      sub: 'Across 12 clients', 
      icon: Target, 
      color: '#06B6D4',
      link: '/portal/campaigns' 
    },
    { 
      label: 'Portfolio Items', 
      value: publishedPortfolio, 
      sub: `${portfolioItems.length} total entries`, 
      icon: FileText, 
      color: '#6366F1',
      link: '/admin/portfolio'
    },
    { 
      label: 'Team Members', 
      value: 5, 
      sub: '4 online now', 
      icon: Users, 
      color: '#22C55E',
      link: '/admin/team'
    },
  ];

  const recentHotLeads = enquiries
    .filter(e => {
      const total = Object.values(e.scoreBreakdown).reduce((a, b) => a + b, 0);
      return total >= 70;
    })
    .slice(0, 4);

  return (
    <div className={styles.page}>
      {/* Welcome Header */}
      <div className={styles.welcomeRow}>
        <div className={styles.welcomeText}>
          <span className={styles.greeting}>{greeting}, {user?.name || 'Admin'}</span>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSub}>Here's what's happening with your agency today.</p>
        </div>
        <div className={styles.dateBox}>
          <Clock size={16} />
          <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <Link href={s.link} key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
            <ArrowRight size={16} className={styles.statArrow} />
          </Link>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Hot Leads & Recent Activity */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleLine}>
                <Star size={18} color="#F97316" fill="#F97316" />
                <h3>Urgent Hot Leads</h3>
              </div>
              <Link href="/admin/enquiries" className={styles.viewLink}>View all</Link>
            </div>
            <div className={styles.leadList}>
              {recentHotLeads.length > 0 ? (
                recentHotLeads.map(lead => (
                  <Link href={`/admin/enquiries/${lead.id}`} key={lead.id} className={styles.leadItem}>
                    <div className={styles.leadAvatar}>{lead.name[0]}</div>
                    <div className={styles.leadInfo}>
                      <strong>{lead.name}</strong>
                      <span>{lead.company} · {lead.service}</span>
                    </div>
                    <div className={styles.leadScore}>
                      <span className={styles.scoreLabel}>Score</span>
                      <span className={styles.scoreValue}>{Object.values(lead.scoreBreakdown).reduce((a, b) => a + b, 0)}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.emptyState}>No hot leads at the moment.</div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleLine}>
                <LayoutDashboard size={18} color="#06B6D4" />
                <h3>Active Campaigns Performance</h3>
              </div>
            </div>
            <div className={styles.campaignMiniList}>
              {campaigns.slice(0, 3).map(c => (
                <div key={c.id} className={styles.campItem}>
                  <div className={styles.campTop}>
                    <strong>{c.name}</strong>
                    <span className={styles.campStatus}>Active</span>
                  </div>
                  <div className={styles.campMetrics}>
                    <div className={styles.miniMetric}>
                      <span>CTR</span>
                      <strong>{c.kpis.find(k => k.label === 'CTR')?.value || '2.4%'}</strong>
                    </div>
                    <div className={styles.miniMetric}>
                      <span>Conv.</span>
                      <strong>{c.kpis.find(k => k.label === 'Conversions')?.value || '142'}</strong>
                    </div>
                    <div className={styles.minibarOuter}>
                      <div className={styles.minibarInner} style={{ width: '70%', background: '#06B6D4' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tasks & Alerts */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleLine}>
                <CheckCircle2 size={18} color="#22C55E" />
                <h3>Agency Tasks</h3>
              </div>
            </div>
            <div className={styles.todoList}>
              {[
                { text: 'Review new portfolio submissions', priority: 'High', done: false },
                { text: 'Update monthly client reports', priority: 'Medium', done: true },
                { text: 'Respond to Chatbot leads (3)', priority: 'High', done: false },
                { text: 'Check campaign budget alerts', priority: 'Medium', done: false },
              ].map((t, i) => (
                <div key={i} className={`${styles.todoItem} ${t.done ? styles.todoDone : ''}`}>
                  <div className={styles.todoCheck} />
                  <span className={styles.todoText}>{t.text}</span>
                  {!t.done && <span className={`${styles.prioTag} ${styles[t.priority.toLowerCase()]}`}>{t.priority}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.alertCard}>
            <AlertCircle size={20} />
            <div className={styles.alertContent}>
              <strong>System Update</strong>
              <p>AI content generation tool is now available for all portfolio items.</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Quick Actions</h3>
            </div>
            <div className={styles.quickActions}>
              <Link href="/admin/portfolio/new" className={styles.actionBtn}>New Portfolio Item</Link>
              <Link href="/admin/blog/new" className={styles.actionBtn}>Write Blog Post</Link>
              <Link href="/audit" className={styles.actionBtnSecondary}>Run Website Audit</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
