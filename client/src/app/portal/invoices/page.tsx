'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Search,
  ChevronRight,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react';
import styles from './page.module.css';

const MOCK_INVOICES = [
  { id: 'INV-2026-003', date: 'Mar 31, 2026', amount: 8500, status: 'Unpaid', dueDate: 'Apr 7, 2026', method: 'Visa •••• 4242' },
  { id: 'INV-2026-002', date: 'Feb 28, 2026', amount: 8500, status: 'Paid', dueDate: 'Mar 7, 2026', method: 'Visa •••• 4242' },
  { id: 'INV-2026-001', date: 'Jan 31, 2026', amount: 8500, status: 'Paid', dueDate: 'Feb 7, 2026', method: 'Visa •••• 4242' },
  { id: 'INV-2025-012', date: 'Dec 31, 2025', amount: 8500, status: 'Paid', dueDate: 'Jan 7, 2026', method: 'Visa •••• 4242' },
  { id: 'INV-2025-011', date: 'Nov 30, 2025', amount: 8500, status: 'Paid', dueDate: 'Dec 7, 2025', method: 'Visa •••• 4242' },
];

export default function PortalInvoicesPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? MOCK_INVOICES : MOCK_INVOICES.filter(inv => inv.status === filter);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Billing & Invoices</h1>
          <p className={styles.sub}>Manage your subscription, view history, and download tax invoices.</p>
        </div>
        <button className={styles.payBtn}>
          <CreditCard size={16} /> Pay Outstanding Balance
        </button>
      </div>

      <div className={styles.topGrid}>
        <div className={styles.planCard}>
          <div className={styles.cardTop}>
            <div className={styles.planIcon}><ShieldCheck size={24} color="#06B6D4" /></div>
            <div>
              <h3 className={styles.planName}>Enterprise Plan</h3>
              <span className={styles.planStatus}>Active</span>
            </div>
          </div>
          <div className={styles.planDetails}>
            <div className={styles.planPrice}>
              <span className={styles.currency}>£</span>
              <span className={styles.amount}>8,500</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.nextBilling}>
              <Calendar size={14} /> Next billing: Apr 30, 2026
            </div>
          </div>
          <div className={styles.planActions}>
            <button className={styles.secondaryBtn}>Change Plan</button>
            <button className={styles.primaryBtn}>Manage Billing <ArrowUpRight size={14} /></button>
          </div>
        </div>

        <div className={styles.paymentCard}>
          <h3 className={styles.sectionTitle}>Payment Method</h3>
          <div className={styles.cardBox}>
            <div className={styles.cardType}>VISA</div>
            <div className={styles.cardInfo}>
              <strong>Visa ending in 4242</strong>
              <span>Expiry 12/28</span>
            </div>
            <button className={styles.editBtn}>Edit</button>
          </div>
          <div className={styles.billingAddress}>
             <h4 className={styles.subTitle}>Billing Address</h4>
             <p>123 Digital Way, London, EC1A 1BB, UK</p>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
           <h3 className={styles.sectionTitle}>Invoice History</h3>
           <div className={styles.tabs}>
              {['All', 'Paid', 'Unpaid'].map(t => (
                <button 
                  key={t}
                  className={`${styles.tab} ${filter === t ? styles.tabActive : ''}`}
                  onClick={() => setFilter(t)}
                >{t}</button>
              ))}
           </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Billing Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td className={styles.invId}>{inv.id}</td>
                  <td className={styles.invDate}>{inv.date}</td>
                  <td className={styles.invAmount}>£{inv.amount.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[inv.status.toLowerCase()]}`}>
                      {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className={styles.invMethod}>{inv.method}</td>
                  <td className={styles.invAction}>
                    <button className={styles.downloadLink}>
                      <Download size={14} /> PDF
                    </button>
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
