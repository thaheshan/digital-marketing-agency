'use client';

import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

const invoices = [
  { id: 'INV-2026-001', client: 'Miller Digital', date: 'Apr 12, 2026', amount: '£4,500.00', status: 'Paid', method: 'Stripe' },
  { id: 'INV-2026-002', client: 'TechFlow SaaS', date: 'Apr 10, 2026', amount: '£6,200.00', status: 'Pending', method: 'Bank Transfer' },
  { id: 'INV-2026-003', client: 'Glow Skincare', date: 'Apr 05, 2026', amount: '£3,800.00', status: 'Overdue', method: 'Stripe' },
  { id: 'INV-2026-004', client: 'Zenith Logistics', date: 'Mar 28, 2026', amount: '£5,000.00', status: 'Paid', method: 'Stripe' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await api.get('/admin/invoices');
        setInvoices(data);
      } catch (error) {
        console.error('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const totalCollected = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + ((i.totalPence || 0) / 100), 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoices & Billing</h1>
          <p className={styles.sub}>Track agency revenue, manage subscriptions, and issue client invoices.</p>
        </div>
        <button className={styles.addBtn}>
          <Plus size={18} />
          <span>Create Invoice</span>
        </button>
      </div>

      <div className={styles.financeStats}>
        <div className={styles.fStat}>
          <div className={styles.fIcon} style={{ background: '#dcfce7', color: '#15803d' }}><CheckCircle2 size={24} /></div>
          <div>
            <span className={styles.fLabel}>Total Collected</span>
            <span className={styles.fValue}>£{totalCollected.toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.fStat}>
          <div className={styles.fIcon} style={{ background: '#fef3c7', color: '#b45309' }}><Clock size={24} /></div>
          <div>
            <span className={styles.fLabel}>Pending Approval</span>
            <span className={styles.fValue}>£18,200</span>
          </div>
        </div>
        <div className={styles.fStat}>
          <div className={styles.fIcon} style={{ background: '#fee2e2', color: '#b91c1c' }}><AlertCircle size={24} /></div>
          <div>
            <span className={styles.fLabel}>Overdue</span>
            <span className={styles.fValue}>£3,800</span>
          </div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Transactions</h2>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input placeholder="Search invoice ID or client..." />
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className={styles.row}>
                <td className={styles.idCell}>INV-{inv.id.slice(0,6).toUpperCase()}</td>
                <td className={styles.clientName}>{inv.client?.clientProfile?.companyName || 'Private Client'}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className={styles.amount}>£{((inv.totalPence || 0) / 100).toLocaleString()}</td>
                <td>
                  <span className={`${styles.status} ${styles[inv.status.toLowerCase()]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className={styles.method}>Stripe</td>
                <td>
                  <button className={styles.dlBtn} title="Download PDF"><Download size={16} /></button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No invoice data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
