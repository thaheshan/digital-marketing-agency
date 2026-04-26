'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, BarChart3, Settings, Filter, 
  TrendingUp, TrendingDown, Target, Zap 
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

const allCampaigns = [
  { id: 1, client: 'RetailCo', name: 'Spring Social Blitz', channel: 'Social Media', status: 'Active', budget: 4500, spent: 3120, roi: '+187%', manager: 'Sarah K.' },
  { id: 2, client: 'TechFlow', name: 'SEO Authority Build', channel: 'SEO', status: 'Active', budget: 2200, spent: 1980, roi: '+142%', manager: 'Marcus C.' },
  { id: 3, client: 'HealthPlus', name: 'New Patient Search', channel: 'PPC', status: 'Review', budget: 3500, spent: 0, roi: '—', manager: 'Priya N.' },
  { id: 4, client: 'FashionFirst', name: 'Influencer Collab', channel: 'Social Media', status: 'Active', budget: 8000, spent: 6200, roi: '+310%', manager: 'Sarah K.' },
  { id: 5, client: 'GrowthMet', name: 'Q1 Performance Ads', channel: 'PPC', status: 'Paused', budget: 5000, spent: 2400, roi: '+95%', manager: 'James O.' },
  { id: 6, client: 'RetailCo', name: 'Email Retention Flow', channel: 'Email', status: 'Active', budget: 1200, spent: 840, roi: '+215%', manager: 'Sarah K.' },
];

const statusClass: Record<string, string> = {
  Active: 'sActive', Review: 'sReview', Paused: 'sPaused',
};

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.get('/admin/campaigns');
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(c => {
     const s = search.toLowerCase();
     const matchSearch = c.name.toLowerCase().includes(s) || 
                         c.client?.clientProfile?.companyName?.toLowerCase().includes(s);
     
     if (filter === 'All') return matchSearch;
     
     // Map UI filters to DB statuses
     const statusMap: Record<string, string[]> = {
       'Active': ['live'],
       'Review': ['draft'],
       'Paused': ['paused']
     };
     
     const matchStatus = statusMap[filter]?.includes(c.status.toLowerCase());
     return matchStatus && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>All Campaigns</h1>
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
                <td className={styles.roiCell}>—</td>
                <td>{c.creator?.firstName || 'Staff'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} title="Performance Stats"><BarChart3 size={18} /></button>
                    <Link href={`/admin/campaigns/${c.id}`} className={styles.iconBtn} title="Campaign Management">
                      <Settings size={18} />
                    </Link>
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
    </div>
  );
}
