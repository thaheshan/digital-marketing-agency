'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Star, Shield, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

const clientData = [
  { id: 1, name: 'Miller Digital Strategy', industry: 'Professional Services', retainer: '£4,500/mo', health: 98, status: 'Active', manager: 'Sarah M.', logo: 'M' },
  { id: 2, name: 'TechFlow SaaS', industry: 'Technology', retainer: '£6,200/mo', health: 85, status: 'Active', manager: 'Tom B.', logo: 'T' },
  { id: 3, name: 'Glow Skincare', industry: 'E-commerce', retainer: '£3,800/mo', health: 92, status: 'Active', manager: 'James O.', logo: 'G' },
  { id: 4, name: 'Zenith Logistics', industry: 'Logistics', retainer: '£5,000/mo', health: 74, status: 'Warning', manager: 'Sarah M.', logo: 'Z' },
];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.get('/admin/clients');
        setClients(data);
      } catch (error) {
        console.error('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Client Portfolio</h1>
          <p className={styles.sub}>Manage active accounts, monitor health scores, and track retainers.</p>
        </div>
        <button className={styles.addBtn}>
          <Plus size={18} />
          <span>Onboard Client</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Clients</span>
          <span className={styles.statValue}>24</span>
          <span className={styles.statChange}>+2 this month</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg. Health Score</span>
          <span className={styles.statValue}>91%</span>
          <span className={styles.statChange} style={{ color: '#10b981' }}>Optimal</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total MRR</span>
          <span className={styles.statValue}>£142,500</span>
          <span className={styles.statChange}>+8.4% Growth</span>
        </div>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input 
            placeholder="Search by client or industry..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <button className={styles.filterBtn}><Filter size={18} /> Filter</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Industry</th>
              <th>Retainer</th>
              <th>Health Score</th>
              <th>Manager</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id} className={styles.row}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.avatar}>{client.companyName[0]}</div>
                    <div>
                      <div className={styles.clientName}>{client.companyName}</div>
                      <div className={styles.clientMeta}>ID: {client.id.slice(0,8)}</div>
                    </div>
                  </div>
                </td>
                <td>{client.industry || 'General'}</td>
                <td className={styles.retainer}>£{(client.monthlyBudgetPence / 100).toLocaleString()}/mo</td>
                <td>
                  <div className={styles.healthWrap}>
                    <div className={styles.healthBar}>
                      <div 
                        className={styles.healthFill} 
                        style={{ width: `90%`, background: '#10b981' }} 
                      />
                    </div>
                    <span>90%</span>
                  </div>
                </td>
                <td>{client.user?.firstName || 'Assigned'}</td>
                <td>
                  <span className={`${styles.badge} ${styles.active}`}>
                    Active
                  </span>
                </td>
                <td><button className={styles.moreBtn}><MoreVertical size={16} /></button></td>
              </tr>
            ))}
            {filteredClients.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No clients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
