'use client';

import styles from './page.module.css';
import Link from 'next/link';

const kpiCards = [
  { icon: '📈', label: 'Total Sessions', value: '48,320', change: '+12.5%', positive: true },
  { icon: '🎯', label: 'Conversions', value: '1,847', change: '+8.2%', positive: true },
  { icon: '💰', label: 'Revenue Generated', value: '$142,500', change: '+22.1%', positive: true },
  { icon: '📉', label: 'Avg. CPA', value: '$18.40', change: '-5.3%', positive: true },
];

const campaigns = [
  { name: 'Spring Social Blitz', channel: '📱 Social Media', status: 'Active', budget: '$4,500', spent: '$3,120', roi: '+187%', progress: 69 },
  { name: 'SEO Authority Build', channel: '🔍 SEO', status: 'Active', budget: '$2,200', spent: '$1,980', roi: '+142%', progress: 90 },
  { name: 'Q1 Google Ads', channel: '🎯 PPC', status: 'Paused', budget: '$6,000', spent: '$2,400', roi: '+95%', progress: 40 },
  { name: 'Email Nurture Flow', channel: '📧 Email', status: 'Active', budget: '$800', spent: '$640', roi: '+210%', progress: 80 },
  { name: 'Brand Awareness Push', channel: '🏆 Display', status: 'Completed', budget: '$3,200', spent: '$3,200', roi: '+67%', progress: 100 },
];

const chartData = [
  { month: 'Oct', sessions: 35, conversions: 28 },
  { month: 'Nov', sessions: 52, conversions: 41 },
  { month: 'Dec', sessions: 48, conversions: 38 },
  { month: 'Jan', sessions: 62, conversions: 54 },
  { month: 'Feb', sessions: 71, conversions: 65 },
  { month: 'Mar', sessions: 90, conversions: 82 },
];

const activities = [
  { icon: '📊', msg: 'Monthly report is ready to download', time: '2h ago', type: 'report' },
  { icon: '📣', msg: 'Spring Social Blitz reached 50K impressions', time: '5h ago', type: 'campaign' },
  { icon: '💬', msg: 'New message from your account manager', time: '1d ago', type: 'message' },
  { icon: '🔔', msg: 'SEO campaign ranking improved for 12 keywords', time: '2d ago', type: 'seo' },
];

export default function PortalDashboardPage() {
  const maxVal = Math.max(...chartData.map(d => d.sessions));

  return (
    <div className={styles.page}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome back, John 👋</h1>
          <p className={styles.welcomeSub}>Here&apos;s what&apos;s happening with your campaigns today — <strong>March 30, 2026</strong></p>
        </div>
        <Link href="/portal/reports" className={styles.reportBtn}>📄 Download Report</Link>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpiCards.map(card => (
          <div key={card.label} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiIcon}>{card.icon}</span>
              <span className={`${styles.kpiChange} ${card.positive ? styles.positive : styles.negative}`}>
                {card.change}
              </span>
            </div>
            <div className={styles.kpiValue}>{card.value}</div>
            <div className={styles.kpiLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart + Activity */}
      <div className={styles.middleGrid}>
        {/* Performance Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Performance Overview</h3>
            <div className={styles.chartLegend}>
              <span className={styles.legendDot} style={{ background: 'var(--color-secondary)' }}></span>
              <span>Sessions</span>
              <span className={styles.legendDot} style={{ background: 'var(--color-accent)' }}></span>
              <span>Conversions</span>
            </div>
          </div>
          <div className={styles.chartArea}>
            {chartData.map(d => (
              <div key={d.month} className={styles.chartCol}>
                <div className={styles.barGroup}>
                  <div
                    className={`${styles.bar} ${styles.barSessions}`}
                    style={{ height: `${(d.sessions / maxVal) * 100}%` }}
                  >
                    <span className={styles.barTooltip}>{d.sessions}K</span>
                  </div>
                  <div
                    className={`${styles.bar} ${styles.barConversions}`}
                    style={{ height: `${(d.conversions / maxVal) * 100}%` }}
                  >
                    <span className={styles.barTooltip}>{d.conversions}K</span>
                  </div>
                </div>
                <div className={styles.chartLabel}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className={styles.activityCard}>
          <div className={styles.cardHeader}><h3>Recent Activity</h3></div>
          <div className={styles.activityList}>
            {activities.map((act, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIcon}>{act.icon}</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityMsg}>{act.msg}</p>
                  <span className={styles.activityTime}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/portal/messages" className={styles.viewAllLink}>View All Activity →</Link>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Active Campaigns</h3>
          <Link href="/portal/campaigns" className={styles.viewAllLink}>View All →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>ROI</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.name} className={styles.tableRow}>
                  <td className={styles.campaignName}>{c.name}</td>
                  <td>{c.channel}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status${c.status}`]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className={styles.mono}>{c.budget}</td>
                  <td className={styles.mono}>{c.spent}</td>
                  <td className={`${styles.mono} ${styles.roiValue}`}>{c.roi}</td>
                  <td>
                    <div className={styles.progressBarWrap}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${c.progress}%` }}></div>
                      </div>
                      <span className={styles.progressLabel}>{c.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
