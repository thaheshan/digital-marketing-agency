'use client';

import { useState } from 'react';
import styles from './page.module.css';

const invoices = [
  { id: 'INV-2026-003', date: 'Mar 31, 2026', amount: 8500, status: 'Unpaid', dueDate: 'Apr 7, 2026' },
  { id: 'INV-2026-002', date: 'Feb 28, 2026', amount: 8500, status: 'Paid', dueDate: 'Mar 7, 2026' },
  { id: 'INV-2026-001', date: 'Jan 31, 2026', amount: 8500, status: 'Paid', dueDate: 'Feb 7, 2026' },
  { id: 'INV-2025-012', date: 'Dec 31, 2025', amount: 8500, status: 'Paid', dueDate: 'Jan 7, 2026' },
  { id: 'INV-2025-011', date: 'Nov 30, 2025', amount: 8500, status: 'Paid', dueDate: 'Dec 7, 2025' },
];

export default function PortalInvoicesPage() {
  const [filter, setFilter] = useState('All');

  const filteredInvoices = filter === 'All' ? invoices : invoices.filter(inv => inv.status === filter);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Billing & Invoices</h1>
          <p className={styles.sub}>Manage your subscription, view history, and download tax invoices.</p>
        </div>
        <button className={styles.payBtn}>💳 Pay Outstanding Balance</button>
      </div>

      {/* Subscription Summary */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <h3>Current Plan: Enterprise</h3>
          <span className={styles.planStatus}>Active</span>
        </div>
        <div className={styles.summaryContent}>
          <div className={styles.summaryItem}>
            <span>Monthly Fee</span>
            <strong>$8,500.00</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Next Billing Date</span>
            <strong>Apr 30, 2026</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Payment Method</span>
            <strong>•••• •••• •••• 4242</strong>
          </div>
        </div>
        <div className={styles.cardActions}>
          <button className={styles.actionBtn}>Change Plan</button>
          <button className={styles.actionBtn}>Update Payment Method</button>
        </div>
      </div>

      {/* Invoices List */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Invoice History</h3>
          <div className={styles.filterGroup}>
             <button 
                className={`${styles.filterBtn} ${filter === 'All' ? styles.active : ''}`}
                onClick={() => setFilter('All')}
             >All</button>
             <button 
                className={`${styles.filterBtn} ${filter === 'Paid' ? styles.active : ''}`}
                onClick={() => setFilter('Paid')}
             >Paid</button>
             <button 
                className={`${styles.filterBtn} ${filter === 'Unpaid' ? styles.active : ''}`}
                onClick={() => setFilter('Unpaid')}
             >Unpaid</button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Billing Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className={styles.bold}>{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td className={styles.mono}>${inv.amount.toLocaleString()}.00</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[inv.status.toLowerCase()]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.downloadBtn}>Download PDF</button>
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
