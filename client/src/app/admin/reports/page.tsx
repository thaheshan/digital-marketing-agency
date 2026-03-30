'use client';

import { useState } from 'react';
import styles from './page.module.css';

const reportHistory = [
  { id: 1, client: 'RetailCo', title: 'March 2026 SEO performance', type: 'Monthly', status: 'Delivered', date: 'Mar 31, 2026', manager: 'Sarah K.' },
  { id: 2, client: 'TechFlow', title: 'Q1 PPC Strategy Review', type: 'Quarterly', status: 'Delivered', date: 'Mar 30, 2026', manager: 'Marcus C.' },
  { id: 3, client: 'FashionFirst', title: 'Social Media Growth Audit', type: 'Audit', status: 'Delivered', date: 'Mar 28, 2026', manager: 'Sarah K.' },
  { id: 4, client: 'HealthPlus', title: 'April Campaign Road Map', type: 'Strategy', status: 'Draft', date: 'Apr 2, 2026', manager: 'Priya N.' },
  { id: 5, client: 'GrowthMet', title: 'Paid Search ROI Recalculation', type: 'Custom', status: 'Needs Review', date: 'Mar 25, 2026', manager: 'James O.' },
  { id: 6, client: 'Propel Finance', title: 'Competitor Analysis - Q1', type: 'Audit', status: 'Delivered', date: 'Jan 15, 2026', manager: 'Marcus C.' },
];

const statusStyle: Record<string, string> = {
  Delivered: 'sDelivered', Draft: 'sDraft', 'Needs Review': 'sReview',
};

export default function AdminReportsPage() {
  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = reportHistory.filter(r => {
    const matchType = activeType === 'All' || r.type === activeType;
    const s = search.toLowerCase();
    const matchSearch = r.title.toLowerCase().includes(s) || r.client.toLowerCase().includes(s);
    return matchType && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Client Reporting</h1>
          <p className={styles.sub}>Generate automated insights and manage strategic deliverables.</p>
        </div>
        <div className={styles.headerActions}>
           <button className={styles.generateBtn}>⚡ Auto-Generate Monthly Reports</button>
           <button className={styles.createBtn}>+ Create Custom Report</button>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.statBox}>
          <span className={styles.statVal}>84</span>
          <span className={styles.statLabel}>Total Reports (Mar)</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>12</span>
          <span className={styles.statLabel}>Pending Deliverables</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>98%</span>
          <span className={styles.statLabel}>Deliverance Rate</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>4.8</span>
          <span className={styles.statLabel}>Avg. Satisfaction</span>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
           {['All', 'Monthly', 'Quarterly', 'Audit', 'Strategy'].map(t => (
             <button 
               key={t} 
               className={`${styles.tab} ${activeType === t ? styles.tabActive : ''}`}
               onClick={() => setActiveType(t)}
             >
               {t}
             </button>
           ))}
        </div>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report title or client..." 
            className={styles.input} 
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client / Report Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Delivery Date</th>
              <th>Managed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className={styles.tr}>
                <td>
                  <div className={styles.titleCell}>
                    <span className={styles.client}>{r.client}</span>
                    <span className={styles.reportTitle}>{r.title}</span>
                  </div>
                </td>
                <td><span className={styles.typeSmall}>{r.type}</span></td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[statusStyle[r.status] || '']}`}>
                    {r.status}
                  </span>
                </td>
                <td className={styles.date}>{r.date}</td>
                <td>{r.manager}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn}>👁</button>
                    <button className={styles.iconBtn}>📄</button>
                    <button className={styles.iconBtn}>📧</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
