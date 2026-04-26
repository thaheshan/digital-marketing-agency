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
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    description: '',
    dueDate: ''
  });

  const fetchData = async () => {
    try {
      const [invData, clientData] = await Promise.all([
        api.get('/admin/invoices'),
        api.get('/admin/clients')
      ]);
      setInvoices(invData);
      setClients(clientData);
      if (clientData.length > 0 && !formData.clientId) {
        setFormData(prev => ({ ...prev, clientId: clientData[0].userId }));
      }
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/invoices', {
        clientId: formData.clientId || clients[0]?.userId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        dueDate: formData.dueDate
      });
      setShowModal(false);
      setFormData(prev => ({ ...prev, amount: '', description: '', dueDate: '' }));
      fetchData();
    } catch (err) {
      alert('Failed to issue invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/invoices/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const toggleDropdown = (id: string) => {
    if (dropdownOpenId === id) setDropdownOpenId(null);
    else setDropdownOpenId(id);
  };

  const filteredInvoices = invoices.filter(inv => {
    const searchMatch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
                        inv.client?.clientProfile?.companyName?.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === 'all' || inv.status === filter;
    return searchMatch && filterMatch;
  });

  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.totalPence, 0) / 100;
  const totalOutstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((acc, curr) => acc + curr.totalPence, 0) / 100;
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((acc, curr) => acc + curr.totalPence, 0) / 100;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoicing & Billing</h1>
          <p className={styles.sub}>Manage client retainers, issue new invoices, and track revenue collection.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Issue Invoice</span>
        </button>
      </div>

      <div className={styles.financeStats}>
        <div className={styles.fStat}>
          <div className={styles.fIcon} style={{ background: '#dcfce7', color: '#15803d' }}><CheckCircle2 size={24} /></div>
          <div className={styles.fInfo}>
            <span className={styles.fLabel}>Total Collected</span>
            <span className={styles.fValue}>£ {totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className={styles.fStat}>
          <div className={styles.fIcon} style={{ background: '#fef3c7', color: '#b45309' }}><Clock size={24} /></div>
          <div className={styles.fInfo}>
            <span className={styles.fLabel}>Outstanding Total</span>
            <span className={styles.fValue}>£ {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className={styles.fStat}>
          <div className={styles.fIcon} style={{ background: '#fee2e2', color: '#b91c1c' }}><AlertCircle size={24} /></div>
          <div className={styles.fInfo}>
            <span className={styles.fLabel}>Overdue</span>
            <span className={styles.fValue}>£ {totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.tabs}>
           {['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'].map(t => (
             <button 
               key={t} 
               className={`${styles.tab} ${filter === t ? styles.tabActive : ''}`}
               onClick={() => setFilter(t)}
             >
               {t.charAt(0).toUpperCase() + t.slice(1)}
             </button>
           ))}
        </div>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input 
            placeholder="Search by invoice # or client..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Client</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => (
              <tr key={inv.id} className={styles.row}>
                <td className={styles.idCell}>
                   <FileText size={16} color="#94a3b8" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                   {inv.invoiceNumber}
                </td>
                <td className={styles.clientName}>{inv.client?.clientProfile?.companyName || 'Private Client'}</td>
                <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className={styles.amount}>£{(inv.totalPence / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`${styles.status} ${styles[inv.status.toLowerCase()]}`}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ position: 'relative' }}>
                  <button className={styles.moreBtn} onClick={() => toggleDropdown(inv.id)}>
                    <Download size={16} style={{ display: 'none' }}/> {/* Keeping standard import usage */}
                    <span style={{ fontSize: '20px', lineHeight: '10px' }}>⋮</span>
                  </button>
                  {dropdownOpenId === inv.id && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={() => { setDropdownOpenId(null); alert('PDF Generation coming soon'); }}>Download PDF</button>
                      <button onClick={() => { setDropdownOpenId(null); alert('Sending email to client...'); updateStatus(inv.id, 'sent'); }}>Send to Client</button>
                      <button onClick={() => { setDropdownOpenId(null); updateStatus(inv.id, 'paid'); }} style={{ color: '#10b981' }}>Mark as Paid</button>
                      <button onClick={() => { setDropdownOpenId(null); updateStatus(inv.id, 'cancelled'); }} className={styles.danger}>Cancel Invoice</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Issue Invoice Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Issue New Invoice</h2>
            <form onSubmit={handleCreate}>
               <div className={styles.formGroup}>
                  <label>Select Client</label>
                  <select 
                    required 
                    value={formData.clientId} 
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                  >
                    {clients.map(c => (
                      <option key={c.userId || c.id} value={c.userId || c.id}>{c.companyName || c.user?.firstName}</option>
                    ))}
                  </select>
               </div>
               <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                     <label>Amount (£)</label>
                     <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                     <label>Due Date (Optional)</label>
                     <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                  </div>
               </div>
               <div className={styles.formGroup}>
                 <label>Description / Notes</label>
                 <input required placeholder="e.g. Monthly SEO Retainer - April 2026" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <div className={styles.modalActions}>
                 <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                 <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                   {isSubmitting ? 'Issuing...' : 'Create Invoice'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
