'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Download, Send, CheckCircle2, XCircle,
  Loader2, Printer, Clock, FileText, Building2, Calendar, CreditCard
} from 'lucide-react';
import { api } from '@/lib/api';

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success'|'error'|'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const cfg = {
    success: { bg:'#f0fdf4', border:'#bbf7d0', color:'#166534', Icon: CheckCircle2 },
    error:   { bg:'#fff1f2', border:'#fecdd3', color:'#9f1239', Icon: XCircle },
    info:    { bg:'#eff6ff', border:'#bfdbfe', color:'#1d4ed8', Icon: CheckCircle2 },
  };
  const { bg, border, color, Icon } = cfg[type];
  return (
    <div style={{ position:'fixed', top:24, right:24, zIndex:9999, display:'flex', alignItems:'center', gap:10, padding:'14px 20px', borderRadius:14, fontWeight:600, fontSize:14, background:bg, border:`1px solid ${border}`, color, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', animation:'toastIn .3s ease' }}>
      <Icon size={18}/><span>{msg}</span>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

// ── Status config ──────────────────────────────────────────────────────────
const STATUS = {
  paid:      { bg:'#dcfce7', color:'#15803d', label:'Paid'      },
  sent:      { bg:'#e0f2fe', color:'#0284c7', label:'Sent'      },
  draft:     { bg:'#f1f5f9', color:'#475569', label:'Draft'     },
  overdue:   { bg:'#fee2e2', color:'#b91c1c', label:'Overdue'   },
  cancelled: { bg:'#f3f4f6', color:'#9ca3af', label:'Cancelled' },
} as Record<string, { bg: string; color: string; label: string }>;

export default function InvoiceDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [invoice,  setInvoice]  = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState<string|null>(null);
  const [toast,    setToast]    = useState<{ msg:string; type:'success'|'error'|'info' }|null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'success') => setToast({ msg, type });

  useEffect(() => {
    (async () => {
      try {
        const invList: any[] = await api.get('/admin/invoices');
        const found = invList.find((i: any) => i.id === id);
        setInvoice(found || null);
      } catch { showToast('Failed to load invoice.', 'error'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (!invoice) return;
    setActing('pdf');
    try {
      const token      = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const serverBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const res        = await fetch(`${serverBase}/api/admin/invoices/${invoice.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const blob      = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a         = document.createElement('a');
      a.href = objectUrl; a.download = `${invoice.invoiceNumber}.html`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(objectUrl);
      showToast(`${invoice.invoiceNumber} downloaded.`);
    } catch (err: any) { showToast(`Download failed: ${err.message}`, 'error'); }
    finally { setActing(null); }
  };

  const handleSend = async () => {
    setActing('send');
    try {
      const res: any = await api.post(`/admin/invoices/${invoice.id}/send`, {});
      showToast(res.message || 'Invoice sent to client!');
      setInvoice((p: any) => ({ ...p, status: 'sent' }));
    } catch (err: any) { showToast(err.message || 'Failed to send.', 'error'); }
    finally { setActing(null); }
  };

  const handleMarkPaid = async () => {
    setActing('paid');
    try {
      await api.put(`/admin/invoices/${invoice.id}/status`, { status: 'paid' });
      showToast('Invoice marked as paid ✓');
      setInvoice((p: any) => ({ ...p, status: 'paid', paymentDate: new Date().toISOString() }));
    } catch { showToast('Failed to update.', 'error'); }
    finally { setActing(null); }
  };

  const handlePrint = () => window.print();

  // ── Loading / not found ───────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400, gap:16, color:'#64748b', fontSize:15, flexDirection:'column' }}>
      <Loader2 size={32} style={{ animation:'spin .8s linear infinite' }} />
      <p>Loading invoice...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!invoice) return (
    <div style={{ padding:40, textAlign:'center', color:'#64748b' }}>
      <FileText size={48} style={{ margin:'0 auto 16px', display:'block', opacity:.3 }} />
      <p style={{ fontSize:16, fontWeight:600 }}>Invoice not found.</p>
      <Link href="/admin/invoices" style={{ color:'#06b6d4', textDecoration:'underline', marginTop:8, display:'inline-block' }}>← Back to Invoices</Link>
    </div>
  );

  const st = STATUS[invoice.status] || STATUS.draft;
  const clientName = invoice.client?.clientProfile?.companyName || `${invoice.client?.firstName} ${invoice.client?.lastName}`;
  const amount = (invoice.totalPence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 });
  const issueDate = new Date(invoice.issueDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  const dueDate   = new Date(invoice.dueDate).toLocaleDateString('en-GB',   { day:'numeric', month:'long', year:'numeric' });
  const paidDate  = invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          .invoice-card { box-shadow: none !important; border: none !important; margin: 0 !important; }
        }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="no-print" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <Link href="/admin/invoices" style={{ display:'flex', alignItems:'center', gap:8, color:'#64748b', textDecoration:'none', fontSize:14, fontWeight:600, transition:'color .2s' }}>
          <ChevronLeft size={16} /> Back to All Invoices
        </Link>

        <div style={{ display:'flex', gap:10 }}>
          {/* Print */}
          <button onClick={handlePrint} style={btnStyle('#f8fafc','#0f172a','#e2e8f0')}>
            <Printer size={16} /> Print
          </button>

          {/* Download */}
          <button onClick={handleDownload} disabled={!!acting} style={btnStyle('#f8fafc','#0f172a','#e2e8f0')}>
            {acting==='pdf' ? <Loader2 size={16} style={{ animation:'spin .8s linear infinite' }}/> : <Download size={16} />}
            Download PDF
          </button>

          {/* Send */}
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <button onClick={handleSend} disabled={!!acting} style={btnStyle('#eff6ff','#2563eb','#bfdbfe')}>
              {acting==='send' ? <Loader2 size={16} style={{ animation:'spin .8s linear infinite' }}/> : <Send size={16} />}
              Send to Client
            </button>
          )}

          {/* Mark Paid */}
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <button onClick={handleMarkPaid} disabled={!!acting} style={btnStyle('#0f172a','white','transparent')}>
              {acting==='paid' ? <Loader2 size={16} style={{ animation:'spin .8s linear infinite' }}/> : <CheckCircle2 size={16} />}
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* ── Invoice Card ─────────────────────────────────────────────── */}
      <div
        ref={printRef}
        className="invoice-card"
        style={{ background:'white', borderRadius:24, border:'1px solid #e2e8f0', boxShadow:'0 4px 24px rgba(0,0,0,0.04)', overflow:'hidden', maxWidth:900, margin:'0 auto' }}
      >
        {/* Header Band */}
        <div style={{ background:'#0f172a', padding:'40px 48px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:26, fontWeight:800, color:'white', letterSpacing:'-0.5px' }}>
              Digital<span style={{ color:'#06b6d4' }}>Pulse</span>
            </div>
            <div style={{ fontSize:13, color:'#94a3b8', marginTop:6 }}>hello@digitalpulse.agency</div>
            <div style={{ fontSize:13, color:'#94a3b8' }}>digitalpulse.agency</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:13, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Invoice</div>
            <div style={{ fontSize:28, fontWeight:800, color:'white', letterSpacing:'-1px', marginBottom:12 }}>{invoice.invoiceNumber}</div>
            <div style={{ display:'inline-block', padding:'6px 16px', borderRadius:20, background:st.color+'22', border:`1.5px solid ${st.color}`, color:st.color, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>
              {st.label}
            </div>
          </div>
        </div>

        <div style={{ padding:'40px 48px' }}>
          {/* Meta Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:32, marginBottom:48 }}>
            <MetaBlock icon={<Building2 size={18} color="#06b6d4"/>} label="Billed To">
              <strong style={{ fontSize:16, color:'#0f172a', display:'block', marginBottom:4 }}>{clientName}</strong>
              <span style={{ fontSize:13, color:'#64748b' }}>{invoice.client?.email}</span>
            </MetaBlock>

            <MetaBlock icon={<Calendar size={18} color="#8b5cf6"/>} label="Invoice Dates">
              <div style={{ fontSize:13, color:'#475569', lineHeight:1.8 }}>
                <strong>Issued:</strong> {issueDate}<br/>
                <strong>Due:</strong> {dueDate}<br/>
                {paidDate && <><strong style={{color:'#10b981'}}>Paid:</strong> {paidDate}</>}
              </div>
            </MetaBlock>

            <MetaBlock icon={<CreditCard size={18} color="#f59e0b"/>} label="Amount Due">
              <div style={{ fontSize:32, fontWeight:900, color:'#0f172a', letterSpacing:'-1px' }}>£{amount}</div>
              {invoice.status === 'paid' && <div style={{ fontSize:13, color:'#10b981', fontWeight:600, marginTop:4 }}>✓ Payment received</div>}
            </MetaBlock>
          </div>

          {/* Line Items Table */}
          <div style={{ border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', marginBottom:40 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#f8fafc' }}>
                  <th style={thStyle}>Description</th>
                  <th style={{ ...thStyle, width:120, textAlign:'right' }}>Qty</th>
                  <th style={{ ...thStyle, width:160, textAlign:'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>{invoice.notes || 'Digital Marketing Services — Monthly Retainer'}</td>
                  <td style={{ ...tdStyle, textAlign:'right', color:'#64748b' }}>1</td>
                  <td style={{ ...tdStyle, textAlign:'right', fontWeight:700, color:'#0f172a' }}>£{amount}</td>
                </tr>
              </tbody>
            </table>

            {/* Total Row */}
            <div style={{ background:'#0f172a', padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'#94a3b8', fontWeight:700, fontSize:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>Total Due</span>
              <span style={{ color:'white', fontWeight:900, fontSize:22, letterSpacing:'-0.5px' }}>£{amount}</span>
            </div>
          </div>

          {/* Notes / Payment Terms */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <div style={{ padding:24, background:'#f8fafc', borderRadius:16, border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Payment Terms</div>
              <p style={{ fontSize:14, color:'#334155', lineHeight:1.7 }}>Payment is due within 30 days of the invoice date. Please reference invoice number {invoice.invoiceNumber} when making payment.</p>
            </div>
            <div style={{ padding:24, background:'#f8fafc', borderRadius:16, border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Bank Details</div>
              <p style={{ fontSize:14, color:'#334155', lineHeight:1.7 }}>Account: DigitalPulse Marketing Ltd<br/>Sort Code: 20-00-00 &nbsp;·&nbsp; Acc: 12345678<br/>Ref: {invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop:40, paddingTop:24, borderTop:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:12, color:'#94a3b8' }}>DigitalPulse Marketing Agency · hello@digitalpulse.agency</div>
            <div style={{ fontSize:12, color:'#94a3b8' }}>VAT Reg: GB 123 456 789</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function MetaBlock({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        {icon}
        <span style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ── Inline style helpers ──────────────────────────────────────────────────
function btnStyle(bg: string, color: string, border: string): React.CSSProperties {
  return {
    display:'flex', alignItems:'center', gap:8,
    padding:'10px 18px', borderRadius:12,
    background:bg, color, border:`1px solid ${border}`,
    fontWeight:600, fontSize:14, cursor:'pointer',
    transition:'all .2s',
  };
}

const thStyle: React.CSSProperties = {
  padding:'14px 20px', textAlign:'left',
  fontSize:12, fontWeight:700, color:'#64748b',
  textTransform:'uppercase', letterSpacing:'0.5px',
  borderBottom:'1px solid #e2e8f0',
};
const tdStyle: React.CSSProperties = {
  padding:'18px 20px', fontSize:14, color:'#475569',
  borderBottom:'1px solid #f1f5f9',
};
