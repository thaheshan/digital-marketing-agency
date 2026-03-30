'use client';

import { useState } from 'react';
import styles from './page.module.css';

const agencyStats = [
  { label: 'Total Managed Spend', value: '$1.4M', change: '+12%', color: '#F97316' },
  { label: 'Total Client ROI', value: '184%', change: '+5%', color: 'var(--color-success)' },
  { label: 'Active Campaigns', value: '47', change: '+3', color: 'var(--color-secondary)' },
  { label: 'Client Retention', value: '98%', change: '+0.5%', color: 'var(--color-accent)' },
];

const conversionChart = [
  { month: 'Jan', value: 420 },
  { month: 'Feb', value: 380 },
  { month: 'Mar', value: 510 },
  { month: 'Apr', value: 460 },
  { month: 'May', value: 650 },
  { month: 'Jun', value: 820 },
];

const revenueDistribution = [
  { channel: 'SEO Services', value: 42, color: 'var(--color-secondary)' },
  { channel: 'Social Media', value: 28, color: 'var(--color-accent)' },
  { channel: 'PPC Management', value: 20, color: '#F97316' },
  { channel: 'Content / Creative', value: 10, color: '#8B5CF6' },
];

export default function AdminAnalyticsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Agency Performance</h1>
          <p className={styles.sub}>Combined analytics across all clients and service lines.</p>
        </div>
        <div className={styles.headerActions}>
           <button className={styles.exportBtn}>📊 Download Agency Report</button>
        </div>
      </div>

      {/* KPI Overviews */}
      <div className={styles.statsGrid}>
        {agencyStats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statChange}>
               <span className={styles.plus}>{s.change}</span> vs last month
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Conversion Trends */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Global Conversion Growth</h3>
          </div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartArea}>
              {conversionChart.map(point => (
                <div key={point.month} className={styles.chartCol}>
                  <div 
                    className={styles.chartBar} 
                    style={{ height: `${(point.value / 900) * 100}%` }}
                  >
                    <span className={styles.barValue}>{point.value}</span>
                  </div>
                  <span className={styles.chartLabel}>{point.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Share */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Service Line Revenue Share</h3>
          </div>
          <div className={styles.shareList}>
            {revenueDistribution.map(item => (
              <div key={item.channel} className={styles.shareItem}>
                <div className={styles.shareInfo}>
                   <span className={styles.shareName}>{item.channel}</span>
                   <span className={styles.shareValue}>{item.value}%</span>
                </div>
                <div className={styles.barContainer}>
                   <div 
                      className={styles.barFill} 
                      style={{ width: `${item.value}%`, background: item.color }}
                   ></div>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.shareFooter}>Based on $218.4K monthly recurring revenue.</p>
        </div>
      </div>

      {/* Top Clients by Performance */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Top 5 Clients by ROI</h3>
        </div>
        <div className={styles.tableWrap}>
           <table className={styles.table}>
             <thead>
               <tr>
                 <th>Client Account</th>
                 <th>Managed Spend</th>
                 <th>Conversions</th>
                 <th>Goal Value</th>
                 <th>ROI</th>
                 <th>Manager</th>
               </tr>
             </thead>
             <tbody>
               {[
                 { name: 'FashionFirst', spend: '$42K', conv: 842, value: '$172.5K', roi: '+310%', manager: 'Sarah K.' },
                 { name: 'RetailCo', spend: '$12.5K', conv: 412, value: '$35.8K', roi: '+187%', manager: 'Sarah K.' },
                 { name: 'TechFlow', spend: '$8.2K', conv: 382, value: '$19.8K', roi: '+142%', manager: 'Marcus C.' },
                 { name: 'PowerLabs', spend: '$14.2K', conv: 520, value: '$32.4K', roi: '+128%', manager: 'James O.' },
                 { name: 'GrowthMet', spend: '$6.2K', conv: 142, value: '$12.1K', roi: '+95%', manager: 'James O.' },
               ].map(client => (
                 <tr key={client.name}>
                   <td className={styles.bold}>{client.name}</td>
                   <td className={styles.mono}>{client.spend}</td>
                   <td className={styles.mono}>{client.conv}</td>
                   <td className={styles.mono}>{client.value}</td>
                   <td className={styles.positive}>{client.roi}</td>
                   <td>{client.manager}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
