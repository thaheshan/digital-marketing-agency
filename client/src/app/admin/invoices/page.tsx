'use client';

import { useState } from 'react';
import styles from './page.module.css';

const allInvoices = [
  { id: 'INV-2026-003', client: 'RetailCo', amount: 8500, status: 'Unpaid', date: 'Mar 31, 2026', due: 'Apr 7, 2026' },
  { id: 'INV-2026-002', client: 'TechFlow', amount: 4200, status: 'Paid', date: 'Mar 10, 2026', due: 'Mar 17, 2026' },
  { id: 'INV-2026-001', client: 'FashionFirst', amount: 12000, status: 'Paid', date: 'Feb 20, 2026', due: 'Feb 27, 2026' },
  { id: 'INV-2025-015', client: 'HealthPlus', amount: 1200, status: 'Paid', date: 'Mar 28, 2026', due: 'Apr 4, 2026' },
  { id: 'INV-2025-014', client: 'GrowthMet', amount: 3600, status: 'Overdue', date: 'Jan 5, 2026', due: 'Jan 12, 2026' },
  { id: 'INV-2025-013', client: 'Propel Finance', amount: 5800, status: 'Paid', date: 'Nov 12, 2025', due: 'Nov 19, 2025' },
];

const statusClass: Record<string, string> = {
  Paid: 'sPaid', Unpaid: 'sUnpaid', Overdue: 'sOverdue',
};

export default function AdminInvoicesPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = allInvoices.filter(inv => {
    const matchStatus = filter === 'All' || inv.status === filter;
    const s = search.toLowerCase();
    const matchSearch = inv.id.toLowerCase().includes(s) || inv.client.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Management</h1>
          <p className={styles.sub}>Track all client billing, payments, and overdue accounts.</p>
        </div>
        <div className={styles.headerActions}>
           <button className={styles.generateBtn}>+ Generate New Invoice</button>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        {[
          { label: 'Total Outstanding', value: '$12,100', count: '2 Invoices', icon: '💰', color: '#DC2626' },
          { label: 'Total Paid (Mar)', value: '$23,200', count: '14 Invoices', icon: '✅', color: '#15803D' },
          { label: 'Average Ticket', value: '$5,920', count: 'Across all clients', icon: '📊', color: '#F97316' },
          { label: 'Draft Invoices', value: '4', count: 'Awaiting approval', icon: '📝', color: '#7C3AED' },
        ].map((s) => (
          <div key={s.label} className={styles.summaryCard}>
            <div className={styles.summaryTop}>
               <span className={styles.summaryIcon}>{s.icon}</span>
               <span className={styles.summaryCount}>{s.count}</span>
            </div>
            <div className={styles.summaryValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {['All', 'Paid', 'Unpaid', 'Overdue'].map(f => (
            <button 
              key={f} 
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <span>🔍</span>
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice ID or client..." 
            className={styles.searchInput} 
          />
        </div>
      </div>

      <div className={styles.tableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Billing Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className={styles.tr}>
                <td className={styles.bold}>{inv.id}</td>
                <td className={styles.clientName}>{inv.client}</td>
                <td>{inv.date}</td>
                <td>{inv.due}</td>
                <td className={styles.mono}>${inv.amount.toLocaleString()}.00</td>
                <td>
                   <span className={`${styles.statusBadge} ${styles[statusClass[inv.status] || '']}`}>
                    {inv.status}
                   </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn}>👁</button>
                    <button className={styles.iconBtn}>📧</button>
                    <button className={styles.iconBtn}>⚙️</button>
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
