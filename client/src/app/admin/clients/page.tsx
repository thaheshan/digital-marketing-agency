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

  // Modals state
  const [showOnboard, setShowOnboard] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Onboard Form state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', companyName: '', industry: '', monthlyBudget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeFilters, setActiveFilters] = useState({ industry: '', status: '' });

  const fetchClients = async () => {
    try {
      const data = await api.get<any>('/admin/clients');
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post<any>('/portal/clients', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName,
        industry: formData.industry,
        monthlyBudgetPence: parseInt(formData.monthlyBudget) * 100 || 0,
      });
      setShowOnboard(false);
      setFormData({ firstName: '', lastName: '', email: '', companyName: '', industry: '', monthlyBudget: '' });
      fetchClients();
    } catch (err) {
      alert('Failed to onboard client. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyFilters = () => {
    setActiveFilters({ industry: filterIndustry, status: filterStatus });
    setShowFilter(false);
  };

  const clearFilters = () => {
    setFilterIndustry('');
    setFilterStatus('');
    setActiveFilters({ industry: '', status: '' });
    setShowFilter(false);
  };

  const toggleDropdown = (id: string) => {
    if (dropdownOpenId === id) setDropdownOpenId(null);
    else setDropdownOpenId(id);
  };

  const hasFilters = activeFilters.industry || activeFilters.status;

  const filteredClients = clients.filter(c => {
    const matchSearch = c.companyName.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase());
    const matchInd = !activeFilters.industry || c.industry?.toLowerCase() === activeFilters.industry.toLowerCase();
    const matchStatus = !activeFilters.status || (activeFilters.status === 'active' && c.portalAccess) || (activeFilters.status === 'inactive' && !c.portalAccess);
    return matchSearch && matchInd && matchStatus;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Client Portfolio</h1>
          <p className={styles.sub}>Manage active accounts, monitor health scores, and track retainers.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowOnboard(true)}>
          <Plus size={18} />
          <span>Onboard Client</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Clients</span>
          <span className={styles.statValue}>{clients.length}</span>
          <span className={styles.statChange}>+2 this month</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg. Health Score</span>
          <span className={styles.statValue}>91%</span>
          <span className={styles.statChange} style={{ color: '#10b981' }}>Optimal</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total MRR</span>
          <span className={styles.statValue}>£{(clients.reduce((acc, curr) => acc + (curr.monthlyBudgetPence || 0), 0) / 100).toLocaleString()}</span>
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
        <button 
          className={`${styles.filterBtn} ${hasFilters ? styles.activeFilter : ''}`} 
          onClick={() => setShowFilter(true)}
        >
          <Filter size={18} /> 
          {hasFilters ? 'Filters Active' : 'Filter'}
        </button>
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
                <td className={styles.retainer}>£{((client.monthlyBudgetPence || 0) / 100).toLocaleString()}/mo</td>
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
                <td>{client.accountManager?.firstName || client.user?.firstName || 'Assigned'}</td>
                <td>
                  <span className={`${styles.badge} ${client.portalAccess ? styles.active : styles.inactive}`}>
                    {client.portalAccess ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ position: 'relative' }}>
                  <button className={styles.moreBtn} onClick={() => toggleDropdown(client.id)}>
                    <MoreVertical size={16} />
                  </button>
                  {dropdownOpenId === client.id && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={() => { setDropdownOpenId(null); alert('Profile view coming soon'); }}>View Profile</button>
                      <button onClick={() => { setDropdownOpenId(null); alert('Retainer edit coming soon'); }}>Edit Retainer</button>
                      <button onClick={() => { setDropdownOpenId(null); alert('Messaging coming soon'); }}>Send Message</button>
                      <button 
                        onClick={async () => {
                          setDropdownOpenId(null);
                          try {
                            await api.put(`/admin/clients/${client.id}/status`, {});
                            fetchClients();
                          } catch (err) {
                            alert('Failed to update status');
                          }
                        }} 
                        className={client.portalAccess ? styles.danger : ''}
                      >
                        {client.portalAccess ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No clients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Onboard Modal */}
      {showOnboard && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Onboard New Client</h2>
            <form onSubmit={handleOnboard}>
               <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                     <label>First Name</label>
                     <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                     <label>Last Name</label>
                     <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
               </div>
               <div className={styles.formGroup}>
                 <label>Email Address</label>
                 <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className={styles.formGroup}>
                 <label>Company Name</label>
                 <input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
               </div>
               <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                     <label>Industry</label>
                     <input value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                     <label>Monthly Retainer (£)</label>
                     <input type="number" required value={formData.monthlyBudget} onChange={e => setFormData({...formData, monthlyBudget: e.target.value})} />
                  </div>
               </div>
               <div className={styles.modalActions}>
                 <button type="button" className={styles.cancelBtn} onClick={() => setShowOnboard(false)}>Cancel</button>
                 <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                   {isSubmitting ? 'Creating...' : 'Create Client'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div className={styles.modalOverlay} onClick={() => setShowFilter(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Filter Clients</h2>
            <div className={styles.formGroup}>
               <label>Industry</label>
               <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}>
                 <option value="">All Industries</option>
                 <option value="fashion">Fashion</option>
                 <option value="technology">Technology</option>
                 <option value="finance">Finance</option>
                 <option value="healthcare">Healthcare</option>
                 <option value="e-commerce">E-commerce</option>
               </select>
            </div>
            <div className={styles.formGroup}>
               <label>Status</label>
               <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                 <option value="">All Statuses</option>
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
               </select>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowFilter(false)}>Cancel</button>
              {hasFilters ? (
                <button className={styles.dangerBtn} onClick={clearFilters}>Clear Filters</button>
              ) : (
                <button className={styles.submitBtn} onClick={applyFilters}>Apply Filters</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
