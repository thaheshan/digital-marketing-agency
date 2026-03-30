'use client';

import styles from './page.module.css';
import Link from 'next/link';

const stats = [
  { icon: '👥', label: 'Total Clients', value: '84', change: '+6 this month', positive: true },
  { icon: '📣', label: 'Active Campaigns', value: '47', change: '+3 this week', positive: true },
  { icon: '💰', label: 'Monthly Revenue', value: '$218,400', change: '+18.3% vs last mo', positive: true },
  { icon: '⚠️', label: 'Pending Reviews', value: '12', change: 'Requires attention', positive: false },
];

const recentClients = [
  { name: 'RetailCo', plan: 'Enterprise', status: 'Active', spend: '$8,500', manager: 'Sarah K.', joined: 'Mar 15' },
  { name: 'TechFlow', plan: 'Professional', status: 'Active', spend: '$4,200', manager: 'Marcus C.', joined: 'Mar 10' },
  { name: 'HealthPlus', plan: 'Starter', status: 'Trial', spend: '$1,200', manager: 'Priya N.', joined: 'Mar 28' },
  { name: 'FashionFirst', plan: 'Enterprise', status: 'Active', spend: '$12,000', manager: 'Sarah K.', joined: 'Feb 20' },
  { name: 'GrowthMet', plan: 'Professional', status: 'Paused', spend: '$3,600', manager: 'James O.', joined: 'Jan 5' },
];

const pendingTasks = [
  { task: 'Review March report for RetailCo', priority: 'High', due: 'Today' },
  { task: 'Onboard HealthPlus — campaign setup', priority: 'High', due: 'Tomorrow' },
  { task: 'Update TechFlow SEO strategy doc', priority: 'Medium', due: 'Apr 2' },
  { task: 'Send Q1 invoices batch (12 clients)', priority: 'Medium', due: 'Apr 3' },
  { task: 'Review GrowthMet pause request', priority: 'Low', due: 'Apr 5' },
];

const channelData = [
  { channel: 'Social Media', clients: 38, revenue: '$82K', pct: 37 },
  { channel: 'SEO', clients: 24, revenue: '$54K', pct: 25 },
  { channel: 'PPC', clients: 19, revenue: '$48K', pct: 22 },
  { channel: 'Content', clients: 12, revenue: '$20K', pct: 9 },
  { channel: 'Email', clients: 8, revenue: '$14K', pct: 7 },
];

export default function AdminDashboardPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Agency Overview</h1>
          <p className={styles.pageSub}>Monday, March 30, 2026 — Week 13</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/clients" className={styles.btnSecondary}>+ Add Client</Link>
          <Link href="/admin/reports" className={styles.btnPrimary}>📊 Generate Report</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>{s.icon}</span>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={`${styles.statChange} ${s.positive ? styles.pos : styles.neg}`}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div className={styles.twoCol}>
        {/* Client Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recent Clients</h3>
            <Link href="/admin/clients" className={styles.viewAll}>View All →</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Monthly Spend</th>
                <th>Manager</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map(c => (
                <tr key={c.name} className={styles.tr}>
                  <td className={styles.clientName}>{c.name}</td>
                  <td><span className={styles.planTag}>{c.plan}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`s${c.status}`]}`}>{c.status}</span>
                  </td>
                  <td className={styles.mono}>{c.spend}</td>
                  <td>{c.manager}</td>
                  <td className={styles.dateCell}>{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Tasks */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Pending Tasks</h3>
              <span className={styles.taskCount}>{pendingTasks.length}</span>
            </div>
            <div className={styles.taskList}>
              {pendingTasks.map((t, i) => (
                <div key={i} className={styles.taskItem}>
                  <div className={styles.taskCheck}></div>
                  <div className={styles.taskContent}>
                    <p className={styles.taskText}>{t.task}</p>
                    <div className={styles.taskMeta}>
                      <span className={`${styles.priority} ${styles[`p${t.priority}`]}`}>{t.priority}</span>
                      <span className={styles.dueDate}>Due: {t.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Breakdown */}
          <div className={styles.card}>
            <div className={styles.cardHeader}><h3>Revenue by Channel</h3></div>
            <div className={styles.channelList}>
              {channelData.map(ch => (
                <div key={ch.channel} className={styles.channelItem}>
                  <div className={styles.channelTop}>
                    <span className={styles.channelName}>{ch.channel}</span>
                    <span className={styles.channelRevenue}>{ch.revenue}</span>
                  </div>
                  <div className={styles.channelBar}>
                    <div className={styles.channelFill} style={{ width: `${ch.pct}%` }}></div>
                  </div>
                  <div className={styles.channelMeta}>
                    <span>{ch.clients} clients</span>
                    <span>{ch.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
