'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Download, Plus, Search, FileText, CheckCircle2, Clock, 
  AlertCircle, MoreVertical, Send, XCircle, Loader2, CheckCheck
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

function Toast({ msg, type, onClose }: { msg: string; type: 'success'|'error'|'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const configs = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', Icon: CheckCircle2 },
    error:   { bg: '#fff1f2', border: '#fecdd3', color: '#9f1239', Icon: AlertCircle },
    info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', Icon: CheckCheck },
  };
  const { bg, border, color, Icon } = configs[type];
  return (
    <div style={{ position:'fixed', top:24, right:24, zIndex:9999, display:'flex', alignItems:'center', gap:10, padding:'14px 20px', borderRadius:14, fontWeight:600, fontSize:14, background:bg, border:`1px solid ${border}`, color, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
      <Icon size={18} /><span>{msg}</span>
    </div>
  );
}

function ConfirmModal({ inv, onConfirm, onClose, loading }: { inv: any; onConfirm: () => void; onClose: () => void; loading: boolean }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:8888, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'white', borderRadius:20, padding:32, maxWidth:420, width:'90%', boxShadow:'0 24px 80px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'#fff1f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <XCircle size={22} color="#ef4444" />
          </div>
          <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>Cancel Invoice</h3>
        </div>
        <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, marginBottom:24 }}>
          Are you sure you want to cancel <strong>{inv.invoiceNumber}</strong> for <strong>{inv.client?.clientProfile?.companyName || 'this client'}</strong>?
          <br />This action cannot be undone.
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px 20px', borderRadius:12, border:'1px solid #e2e8f0', background:'white', fontWeight:600, fontSize:14, cursor:'pointer', color:'#475569' }}>
            Keep Invoice
          </button>
          <button onClick={onConfirm} disabled={loading} style={{ flex:1, padding:'12px 20px', borderRadius:12, border:'none', background:'#ef4444', color:'white', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} className="spin" /> : <XCircle size={16} />}
            Cancel Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [actionLoading, setActionLoading]   = useState<string | null>(null);
  const [toast, setToast]                   = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null);
  const [cancelTarget, setCancelTarget]     = useState<any>(null);
  const [cancelLoading, setCancelLoading]   = useState(false);

  const [showModal, setShowModal]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', amount: '', description: '', dueDate: '' });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const showToast = useCallback((msg: string, type: 'success'|'error'|'info' = 'success') => setToast({ msg, type }), []);

  const fetchData = useCallback(async () => {
    try {
      const [invData, clientData] = await Promise.all([api.get<any>('/admin/invoices'), api.get<any>('/admin/clients')]);
      setInvoices(invData);
      setClients(clientData);
      if (clientData.length > 0) setFormData(p => p.clientId ? p : { ...p, clientId: clientData[0].userId });
    } catch { showToast('Failed to load invoice data.', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpenId(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const handleDownloadPDF = async (inv: any) => {
    setDropdownOpenId(null);
    setActionLoading(inv.id + '_pdf');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      // API_BASE_URL already ends in /api, so strip the /api prefix to get the server origin
      const serverBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
        .replace(/\/api$/, '');
      const url = `${serverBase}/api/admin/invoices/${inv.id}/pdf`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${inv.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      showToast(`${inv.invoiceNumber} downloaded.`, 'success');
    } catch (err: any) {
      showToast(`Download failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSend = async (inv: any) => {
    setDropdownOpenId(null);
    setActionLoading(inv.id + '_send');
    try {
      const res = await api.post<any>(`/admin/invoices/${inv.id}/send`, {});
      showToast(res.message || 'Invoice sent to client!', 'success');
      fetchData();
    } catch (err: any) { showToast(err?.message || 'Failed to send invoice.', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleMarkPaid = async (inv: any) => {
    setDropdownOpenId(null);
    setActionLoading(inv.id + '_paid');
    try {
      await api.put(`/admin/invoices/${inv.id}/status`, { status: 'paid' });
      showToast(`${inv.invoiceNumber} marked as paid ✓`, 'success');
      fetchData();
    } catch { showToast('Failed to update status.', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      await api.delete(`/admin/invoices/${cancelTarget.id}`);
      showToast(`${cancelTarget.invoiceNumber} cancelled.`, 'info');
      setCancelTarget(null);
      fetchData();
    } catch (err: any) { showToast(err?.message || 'Failed to cancel invoice.', 'error'); }
    finally { setCancelLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/invoices', {
        clientId:    formData.clientId || clients[0]?.userId,
        amount:      parseFloat(formData.amount),
        description: formData.description,
        dueDate:     formData.dueDate
      });
      setShowModal(false);
      setFormData(p => ({ ...p, amount: '', description: '', dueDate: '' }));
      showToast('Invoice created!', 'success');
      fetchData();
    } catch { showToast('Failed to create invoice.', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const isActing = (id: string, s: string) => actionLoading === `${id}_${s}`;

  const filtered = invoices.filter(inv => {
    const s = search.toLowerCase();
    return (inv.invoiceNumber?.toLowerCase().includes(s) || inv.client?.clientProfile?.companyName?.toLowerCase().includes(s))
      && (filter === 'all' || inv.status === filter);
  });

  const totalCollected   = invoices.filter(i => i.status === 'paid').reduce((a, c) => a + c.totalPence, 0) / 100;
  const totalOutstanding = invoices.filter(i => !['paid','cancelled'].includes(i.status)).reduce((a, c) => a + c.totalPence, 0) / 100;
  const totalOverdue     = invoices.filter(i => i.status === 'overdue').reduce((a, c) => a + c.totalPence, 0) / 100;

  return (
    <div className={styles.page}>
      <style>{`.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {cancelTarget && <ConfirmModal inv={cancelTarget} onConfirm={handleCancelConfirm} onClose={() => setCancelTarget(null)} loading={cancelLoading} />}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoicing &amp; Billing</h1>
          <p className={styles.sub}>Manage client retainers, issue invoices, and track revenue collection.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={18} /><span>Issue Invoice</span>
        </button>
      </div>

      {/* Stats */}
      <div className={styles.financeStats}>
        {[
          { label:'Total Collected',  value: totalCollected,   bg:'#dcfce7', color:'#15803d', Icon: CheckCircle2 },
          { label:'Outstanding Total',value: totalOutstanding, bg:'#fef3c7', color:'#b45309', Icon: Clock       },
          { label:'Overdue',          value: totalOverdue,     bg:'#fee2e2', color:'#b91c1c', Icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className={styles.fStat}>
            <div className={styles.fIcon} style={{ background: s.bg, color: s.color }}><s.Icon size={24} /></div>
            <div className={styles.fInfo}>
              <span className={styles.fLabel}>{s.label}</span>
              <span className={styles.fValue}>£{s.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.tableControls}>
        <div className={styles.tabs}>
          {['all','draft','sent','paid','overdue','cancelled'].map(t => (
            <button key={t} className={`${styles.tab} ${filter===t ? styles.tabActive:''}`} onClick={() => setFilter(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input placeholder="Search by invoice # or client..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice Number</th><th>Client</th><th>Issue Date</th>
              <th>Due Date</th><th>Amount</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className={styles.row}>
                <td className={styles.idCell}>
                  <FileText size={16} color="#94a3b8" style={{ marginRight:8, verticalAlign:'middle' }} />
                  <Link href={`/admin/invoices/${inv.id}`} style={{ color:'#06b6d4', textDecoration:'none', fontWeight:700 }}>
                    {inv.invoiceNumber}
                  </Link>
                </td>
                <td className={styles.clientName}>{inv.client?.clientProfile?.companyName || `${inv.client?.firstName} ${inv.client?.lastName}`}</td>
                <td>{new Date(inv.issueDate).toLocaleDateString('en-GB')}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString('en-GB')}</td>
                <td className={styles.amount}>£{(inv.totalPence/100).toLocaleString(undefined,{minimumFractionDigits:2})}</td>
                <td><span className={`${styles.status} ${styles[inv.status?.toLowerCase()]}`}>{inv.status}</span></td>
                <td style={{ position:'relative' }} ref={dropdownOpenId===inv.id ? dropdownRef : null}>
                  <button className={styles.moreBtn} onClick={() => setDropdownOpenId(dropdownOpenId===inv.id ? null : inv.id)}>
                    <MoreVertical size={18} />
                  </button>

                  {dropdownOpenId === inv.id && (
                    <div className={styles.dropdownMenu}>

                      {/* ─ Download PDF ─ */}
                      <button className={styles.dropdownItem} onClick={() => handleDownloadPDF(inv)} disabled={!!actionLoading}>
                        {isActing(inv.id,'pdf') ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
                        Download PDF
                      </button>

                      {/* ─ Send to Client ─ */}
                      <button
                        className={styles.dropdownItem}
                        onClick={() => handleSend(inv)}
                        disabled={!!actionLoading || inv.status === 'paid' || inv.status === 'cancelled'}
                      >
                        {isActing(inv.id,'send') ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
                        Send to Client
                      </button>

                      {/* ─ Mark as Paid ─ */}
                      {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                        <button className={styles.dropdownItem} style={{ color:'#10b981' }} onClick={() => handleMarkPaid(inv)} disabled={!!actionLoading}>
                          {isActing(inv.id,'paid') ? <Loader2 size={15} className="spin" /> : <CheckCircle2 size={15} />}
                          Mark as Paid
                        </button>
                      )}

                      {/* ─ Cancel Invoice ─ */}
                      {inv.status !== 'cancelled' && inv.status !== 'paid' && (
                        <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => { setDropdownOpenId(null); setCancelTarget(inv); }}>
                          <XCircle size={15} />
                          Cancel Invoice
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:48, color:'#94a3b8' }}>No invoices found.</td></tr>
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
                <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                  {clients.map(c => <option key={c.userId||c.id} value={c.userId||c.id}>{c.companyName || `${c.user?.firstName} ${c.user?.lastName}`}</option>)}
                </select>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Amount (£)</label>
                  <input type="number" step="0.01" min="1" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Description / Notes</label>
                <input required placeholder="e.g. Monthly SEO Retainer — April 2026" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? 'Issuing...' : 'Create Invoice'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
