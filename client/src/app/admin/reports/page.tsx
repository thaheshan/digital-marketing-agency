'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, Plus, Search, Eye, FileText, Mail, 
  Filter, FileDown, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
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
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);
  const [newReport, setNewReport] = useState({ title: '', clientId: '', type: 'monthly' });
  const [clients, setClients] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [reportsData, clientsData] = await Promise.all([
        api.get('/admin/reports'),
        api.get('/admin/clients')
      ]);
      setReports(reportsData);
      setClients(clientsData);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      if (clients.length > 0) {
        // MUST use the userId from the ClientProfile
        await api.post('/admin/reports/generate', { 
          clientId: clients[0].userId, 
          type: 'Monthly'
        });
        fetchData();
      }
    } catch (err) {
      console.error('Auto-generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/reports/generate', {
        clientId: newReport.clientId || clients[0].userId,
        type: newReport.type,
        title: newReport.title
      });
      setShowModal(false);
      setNewReport({ title: '', clientId: '', type: 'monthly' });
      fetchData();
    } catch (err) {
      console.error('Failed to create custom report');
    }
  };

  const handleView = (report: any) => {
    setViewingReport(report);
  };

  const handleDownload = (report: any) => {
    const content = report.fileUrl && report.fileUrl.startsWith('data:') 
      ? decodeURIComponent(report.fileUrl.split(',')[1])
      : `DigitalPulse Strategic Report\nTitle: ${report.title}\nClient: ${report.client?.clientProfile?.companyName}\nType: ${report.reportType}\nGenerated: ${new Date(report.createdAt).toLocaleDateString()}\n\n[Performance Summary]\nROI remains strong across search and social channels. AI-driven optimizations have reduced CPA by 14% this month.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (report: any) => {
    // Create a high-fidelity print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 60px; color: #0f172a; line-height: 1.6; }
          .header { border-bottom: 3px solid #F97316; padding-bottom: 20px; margin-bottom: 40px; }
          .title { font-size: 32px; font-weight: 800; margin: 0; }
          .client { color: #F97316; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; }
          .meta { display: flex; justify-content: space-between; margin-top: 10px; color: #64748b; font-size: 14px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: 800; margin-bottom: 15px; border-left: 4px solid #F97316; padding-left: 15px; }
          .content { background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 15px; }
          .footer { margin-top: 60px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="client">${report.client?.clientProfile?.companyName || 'DigitalPulse Client'}</div>
          <h1 class="title">${report.title}</h1>
          <div class="meta">
            <span>Type: ${report.reportType.toUpperCase()}</span>
            <span>Date: ${new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Strategic Insights & Performance Data</div>
          <div class="content">${report.fileUrl && report.fileUrl.startsWith('data:') 
            ? decodeURIComponent(report.fileUrl.split(',')[1]) 
            : 'AI synthesis complete. Campaigns are performing above benchmark with a 3.24x Avg. ROI. Optimization focus remains on high-converting search terms and audience refinement.'}</div>
        </div>

        <div class="section">
          <div class="section-title">Forward Roadmap</div>
          <p>Based on current performance trends, we recommend re-allocating 15% of the remaining budget to high-performing Meta Ad sets while scaling the organic SEO authority build.</p>
        </div>

        <div class="footer">
          DigitalPulse Command Center — Professional Performance Report — Confidential
        </div>

        <script>
          window.onload = () => {
            window.print();
            // window.close(); // Optional: close the tab after print
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSend = async (report: any) => {
    try {
      await api.patch(`/admin/reports/${report.id}/visibility`, { isVisible: true });
      fetchData();
      
      const email = report.client?.email || 'client@example.com';
      const subject = encodeURIComponent(`DigitalPulse: ${report.title}`);
      const body = encodeURIComponent(`Hello,\n\nYour strategic report "${report.title}" is now available in your DigitalPulse portal.\n\nBest regards,\nDigitalPulse Strategy Team`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } catch (err) {
      console.error('Failed to send report');
    }
  };

  const filtered = reports.filter(r => {
    const matchType = activeType === 'All' || r.reportType?.toLowerCase() === activeType.toLowerCase();
    const s = search.toLowerCase();
    const matchSearch = r.title.toLowerCase().includes(s) || 
                        r.client?.clientProfile?.companyName?.toLowerCase().includes(s);
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
           <button 
             className={styles.generateBtn} 
             onClick={handleGenerate}
             disabled={generating}
           >
             <Zap size={16} fill={generating ? '#94a3b8' : '#F97316'} />
             <span>{generating ? 'Generating...' : 'Auto-Generate Monthly Reports'}</span>
           </button>
           <button className={styles.createBtn} onClick={() => setShowModal(true)}>
             <Plus size={16} />
             <span>Create Custom Report</span>
           </button>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Create Custom Report</h2>
            <form onSubmit={handleCreateCustom} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Report Title</label>
                <input 
                  required
                  placeholder="e.g. Q1 Content Strategy Audit"
                  value={newReport.title}
                  onChange={e => setNewReport({...newReport, title: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Select Client</label>
                <select 
                  value={newReport.clientId}
                  onChange={e => setNewReport({...newReport, clientId: e.target.value})}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.userId}>{c.companyName}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Report Type</label>
                <select 
                  value={newReport.type}
                  onChange={e => setNewReport({...newReport, type: e.target.value})}
                >
                  <option value="monthly">Monthly</option>
                  <option value="audit">Audit</option>
                  <option value="strategy">Strategy</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Generate Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewingReport && (
        <div className={styles.modalOverlay} onClick={() => setViewingReport(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{viewingReport.title}</h2>
              <p className={styles.modalSub}>{viewingReport.client?.clientProfile?.companyName}</p>
            </div>
            <div className={styles.reportViewContent}>
              {viewingReport.fileUrl && viewingReport.fileUrl.startsWith('data:') ? (
                <pre className={styles.reportPre}>{decodeURIComponent(viewingReport.fileUrl.split(',')[1])}</pre>
              ) : (
                <div className={styles.placeholderDoc}>
                   <FileText size={48} color="#94a3b8" />
                   <p>Synthesizing performance data...</p>
                   <p className={styles.docSub}>Full AI audit analysis and strategic roadmap for {viewingReport.client?.clientProfile?.companyName}.</p>
                </div>
              )}
            </div>
            <div className={styles.modalActions} style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleDownloadPDF(viewingReport)} className={styles.submitBtn} style={{ background: '#0f172a' }}>Download as PDF</button>
              <button onClick={(e) => { e.stopPropagation(); setViewingReport(null); }} className={styles.cancelBtn} style={{ flex: 1 }}>Close Viewer</button>
            </div>
          </div>
        </div>
      )}

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
          <Search size={18} />
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
                    <span className={styles.client}>{r.client?.clientProfile?.companyName || 'Private Client'}</span>
                    <span className={styles.reportTitle}>{r.title}</span>
                  </div>
                </td>
                <td><span className={styles.typeSmall}>{r.reportType}</span></td>
                <td>
                  <span className={`${styles.statusBadge} ${r.isVisibleToClient ? styles.sDelivered : styles.sDraft}`}>
                    {r.isVisibleToClient ? 'Delivered' : 'Draft'}
                  </span>
                </td>
                <td className={styles.date}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>{r.generator?.firstName || 'System AI'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => handleView(r)} title="View Online"><Eye size={16} /></button>
                    <button className={styles.iconBtn} onClick={() => handleDownloadPDF(r)} title="Download PDF"><FileDown size={16} /></button>
                    <button className={styles.iconBtn} onClick={() => handleSend(r)} title="Send to Client"><Mail size={16} /></button>
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
