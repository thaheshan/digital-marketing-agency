'use client';

import { useState } from 'react';
import styles from './page.module.css';

const clients = [
  { id: 1, name: 'RetailCo', contact: 'Sarah Mitchell', email: 'sarah@retailco.com', plan: 'Enterprise', status: 'Active', spend: 8500, manager: 'Sarah K.', joined: 'Jan 15, 2025', campaigns: 5 },
  { id: 2, name: 'TechFlow Solutions', contact: 'Marcus Chen', email: 'marcus@techflow.io', plan: 'Professional', status: 'Active', spend: 4200, manager: 'Marcus C.', joined: 'Mar 10, 2025', campaigns: 3 },
  { id: 3, name: 'HealthPlus', contact: 'Dr. Priya Nair', email: 'priya@healthplus.com', plan: 'Starter', status: 'Trial', spend: 1200, manager: 'Priya N.', joined: 'Mar 28, 2026', campaigns: 1 },
  { id: 4, name: 'FashionFirst', contact: 'Emily Nakamura', email: 'emily@fashionfirst.com', plan: 'Enterprise', status: 'Active', spend: 12000, manager: 'Sarah K.', joined: 'Feb 20, 2024', campaigns: 7 },
  { id: 5, name: 'GrowthMetrics', contact: 'David Okonkwo', email: 'david@growthmet.com', plan: 'Professional', status: 'Paused', spend: 3600, manager: 'James O.', joined: 'Jan 5, 2025', campaigns: 2 },
  { id: 6, name: 'Propel Finance', contact: 'James Parker', email: 'james@propelfinance.com', plan: 'Professional', status: 'Active', spend: 5800, manager: 'Marcus C.', joined: 'Nov 12, 2024', campaigns: 4 },
];

const plans = ['All', 'Enterprise', 'Professional', 'Starter'];

const statusClass: Record<string, string> = {
  Active: 'sActive', Trial: 'sTrial', Paused: 'sPaused',
};

export default function AdminClientsPage() {
  const [planFilter, setPlanFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = clients.filter(c => {
    const matchPlan = planFilter === 'All' || c.plan === planFilter;
    const s = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(s) || c.contact.toLowerCase().includes(s) || c.email.toLowerCase().includes(s);
    return matchPlan && matchSearch;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Client Management</h1>
          <p className={styles.sub}>{clients.filter(c => c.status === 'Active').length} active · {clients.length} total clients</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add New Client</button>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {[
          { label: 'Total Revenue/Mo', value: `$${clients.reduce((a, c) => a + c.spend, 0).toLocaleString()}`, icon: '💰' },
          { label: 'Active Clients', value: clients.filter(c => c.status === 'Active').length, icon: '✅' },
          { label: 'On Trial', value: clients.filter(c => c.status === 'Trial').length, icon: '🧪' },
          { label: 'Paused', value: clients.filter(c => c.status === 'Paused').length, icon: '⏸️' },
        ].map(s => (
          <div key={s.label} className={styles.summaryCard}>
            <span className={styles.summaryIcon}>{s.icon}</span>
            <div className={styles.summaryValue}>{s.value}</div>
            <div className={styles.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <div className={styles.planTabs}>
          {plans.map(p => (
            <button key={p} className={`${styles.planTab} ${planFilter === p ? styles.planTabActive : ''}`} onClick={() => setPlanFilter(p)}>{p}</button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className={styles.searchInput} />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Monthly Spend</th>
              <th>Campaigns</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className={styles.tr}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.clientAvatar}>{c.name[0]}</div>
                    <div>
                      <div className={styles.clientName}>{c.name}</div>
                      <div className={styles.clientJoined}>Since {c.joined}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contactCell}>
                    <div className={styles.contactName}>{c.contact}</div>
                    <div className={styles.contactEmail}>{c.email}</div>
                  </div>
                </td>
                <td><span className={`${styles.planBadge} ${styles[`plan${c.plan}`]}`}>{c.plan}</span></td>
                <td><span className={`${styles.statusBadge} ${styles[statusClass[c.status]]}`}>{c.status}</span></td>
                <td className={styles.mono}>${c.spend.toLocaleString()}/mo</td>
                <td className={styles.centerCell}>{c.campaigns}</td>
                <td>{c.manager}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn}>View</button>
                    <button className={styles.actionBtn}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {showAdd && (
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add New Client</h3>
              <button className={styles.modalClose} onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <form className={styles.modalForm} onSubmit={e => { e.preventDefault(); setShowAdd(false); }}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Company Name *</label>
                  <input placeholder="RetailCo Ltd." className={styles.formInput} required />
                </div>
                <div className={styles.formField}>
                  <label>Contact Name *</label>
                  <input placeholder="John doe" className={styles.formInput} required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Email *</label>
                  <input type="email" placeholder="contact@company.com" className={styles.formInput} required />
                </div>
                <div className={styles.formField}>
                  <label>Plan</label>
                  <select className={styles.formInput}>
                    <option>Starter</option>
                    <option>Professional</option>
                    <option>Enterprise</option>
                  </select>
                </div>
              </div>
              <div className={styles.formField}>
                <label>Assign Account Manager</label>
                <select className={styles.formInput}>
                  <option>Sarah K.</option>
                  <option>Marcus C.</option>
                  <option>Priya N.</option>
                  <option>James O.</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Create Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
