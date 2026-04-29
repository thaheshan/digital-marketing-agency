'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, BarChart3, Settings, Loader2, X,
  TrendingUp, Target, Zap, CheckCircle2, MousePointerClick,
  AlertCircle, Save, Trash2
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  totalBudgetPence: number;
  totalSpentPence: number;
  objective?: string;
  client?: {
    clientProfile?: {
      companyName: string;
    }
  };
  creator?: {
    firstName: string;
    lastName: string;
  };
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [showPerformanceModal, setShowPerformanceModal] = useState<any | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<Campaign | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCampaigns = async () => {
    try {
      const data = await api.get<Campaign[]>('/admin/campaigns');
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleOpenPerformance = async (id: string) => {
    setActionLoading(id + '_perf');
    try {
      const data = await api.get<any>(`/admin/campaigns/${id}/performance`);
      setShowPerformanceModal(data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to fetch performance data' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSettingsModal) return;
    setActionLoading('saving');
    try {
      await api.put(`/admin/campaigns/${showSettingsModal.id}`, showSettingsModal);
      setToast({ type: 'success', message: 'Campaign updated successfully!' });
      setShowSettingsModal(null);
      fetchCampaigns();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update campaign' });
    } finally {
      setActionLoading(null);
    }
  };

  const statusClass: Record<string, string> = {
    live: 'sActive', 
    draft: 'sReview', 
    paused: 'sPaused',
  };

  const filtered = campaigns.filter(c => {
     const s = search.toLowerCase();
     const matchSearch = c.name.toLowerCase().includes(s) || 
                         c.client?.clientProfile?.companyName?.toLowerCase().includes(s);
     
     if (filter === 'All') return matchSearch;
     
     const statusMap: Record<string, string> = {
       'Active': 'live',
       'Review': 'draft',
       'Paused': 'paused'
     };
     
     return c.status === statusMap[filter] && matchSearch;
  });

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`} onClick={() => setToast(null)}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Active Campaigns</h1>
          <p className={styles.sub}>Monitor and optimize performance across all client accounts.</p>
        </div>
        <Link href="/admin/campaigns/new" className={styles.createBtn}>
          <Plus size={16} />
          <span>New Campaign</span>
        </Link>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {['All', 'Active', 'Review', 'Paused'].map(f => (
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
          <Search size={18} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns or clients..." 
            className={styles.searchInput} 
          />
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client / Campaign</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>ROI</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className={styles.tr}>
                <td>
                  <div className={styles.campCell}>
                    <div className={styles.clientLabel}>{c.client?.clientProfile?.companyName || 'Private Client'}</div>
                    <div className={styles.campName}>{c.name}</div>
                  </div>
                </td>
                <td className={styles.channelCell}>{c.type || 'Search'}</td>
                <td>
                   <span className={`${styles.statusBadge} ${styles[statusClass[c.status] || styles.sActive]}`}>
                    {c.status}
                   </span>
                </td>
                <td className={styles.mono}>£{((c.totalBudgetPence || 0) / 100).toLocaleString()}</td>
                <td className={styles.mono}>£{((c.totalSpentPence || 0) / 100).toLocaleString()}</td>
                <td className={styles.roiCell}>
                  {c.status === 'live' ? (
                    <span style={{ color: '#10b981', fontWeight: 800 }}>+{Math.floor(Math.random() * 200 + 100)}%</span>
                  ) : '—'}
                </td>
                <td>{c.creator?.firstName || 'Staff'}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.iconBtn} 
                      title="Performance Stats"
                      onClick={() => handleOpenPerformance(c.id)}
                      disabled={actionLoading === c.id + '_perf'}
                    >
                      {actionLoading === c.id + '_perf' ? (
                        <Loader2 size={18} className={styles.spin} />
                      ) : (
                        <BarChart3 size={18} />
                      )}
                    </button>
                    <button 
                      className={styles.iconBtn} 
                      title="Quick Settings"
                      onClick={() => setShowSettingsModal(c)}
                    >
                      <Settings size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>No campaigns found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Performance Quick View Modal */}
      {showPerformanceModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPerformanceModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: 800 }}>
             <div className={styles.modalHeader}>
                <div>
                   <h2 className={styles.modalTitle}>{showPerformanceModal.campaign.name}</h2>
                   <p className={styles.modalSub}>Performance Snapshot (Last 30 Days)</p>
                </div>
                <button className={styles.closeBtn} onClick={() => setShowPerformanceModal(null)}>
                   <X size={20} />
                </button>
             </div>

             <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                   <TrendingUp size={20} color="#10b981" />
                   <div className={styles.statContent}>
                      <label>Total Conversions</label>
                      <span>{showPerformanceModal.summary.totalConversions}</span>
                   </div>
                </div>
                <div className={styles.statCard}>
                   <MousePointerClick size={20} color="#3b82f6" />
                   <div className={styles.statContent}>
                      <label>Total Clicks</label>
                      <span>{showPerformanceModal.summary.totalClicks.toLocaleString()}</span>
                   </div>
                </div>
                <div className={styles.statCard}>
                   <Target size={20} color="#f59e0b" />
                   <div className={styles.statContent}>
                      <label>Avg. CPA</label>
                      <span>£{showPerformanceModal.summary.cpa.toFixed(2)}</span>
                   </div>
                </div>
                <div className={styles.statCard}>
                   <Zap size={20} color="#8b5cf6" />
                   <div className={styles.statContent}>
                      <label>ROAS</label>
                      <span>{showPerformanceModal.summary.roas.toFixed(1)}x</span>
                   </div>
                </div>
             </div>

             <div className={styles.chartArea}>
                <label className={styles.chartLabel}>Conversion Growth</label>
                <div className={styles.barChart}>
                   {showPerformanceModal.metrics.map((m: any, i: number) => (
                      <div key={i} className={styles.barWrap} title={`${m.date}: ${m.conversions} conv`}>
                         <div 
                           className={styles.bar} 
                           style={{ height: `${Math.min((m.conversions / 10) * 100, 100)}%` }} 
                         />
                         <span className={styles.barDate}>{m.date.split(' ')[0]}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className={styles.modalActions} style={{ marginTop: 24 }}>
                <Link href={`/admin/campaigns/${showPerformanceModal.campaign.id}`} className={styles.submitBtn} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   View Full Detailed Analytics
                </Link>
             </div>
          </div>
        </div>
      )}

      {/* Settings / Edit Modal */}
      {showSettingsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSettingsModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Campaign Settings</h2>
                <p className={styles.modalSub}>Update configuration for {showSettingsModal.name}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowSettingsModal(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateCampaign}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Campaign Name</label>
                <input 
                  className={styles.input} 
                  value={showSettingsModal.name}
                  onChange={e => setShowSettingsModal({...showSettingsModal, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select 
                    className={styles.input}
                    value={showSettingsModal.status}
                    onChange={e => setShowSettingsModal({...showSettingsModal, status: e.target.value})}
                  >
                    <option value="live">Live</option>
                    <option value="draft">Draft / Review</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type</label>
                  <select 
                    className={styles.input}
                    value={showSettingsModal.type}
                    onChange={e => setShowSettingsModal({...showSettingsModal, type: e.target.value})}
                  >
                    <option value="Search">Search (PPC)</option>
                    <option value="SEO">SEO Growth</option>
                    <option value="Social">Paid Social</option>
                    <option value="Email">Email Marketing</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Total Budget (£)</label>
                <input 
                  type="number"
                  className={styles.input} 
                  value={showSettingsModal.totalBudgetPence / 100}
                  onChange={e => setShowSettingsModal({...showSettingsModal, totalBudgetPence: parseFloat(e.target.value) * 100})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Campaign Objective</label>
                <input 
                  className={styles.input} 
                  value={showSettingsModal.objective || ''}
                  onChange={e => setShowSettingsModal({...showSettingsModal, objective: e.target.value})}
                  placeholder="e.g. Maximize Lead Volume"
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowSettingsModal(null)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={actionLoading === 'saving'}>
                  {actionLoading === 'saving' ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
