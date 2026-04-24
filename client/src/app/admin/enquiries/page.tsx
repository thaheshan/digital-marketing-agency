'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Flame, TrendingUp, Minus, Loader2 } from 'lucide-react';
import { useEnquiryStore } from '@/store';
import type { LeadStatus } from '@/store';
import styles from './page.module.css';

type FilterTab = 'all' | 'hot' | 'warm' | 'cold';

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 70 ? styles.hot : score >= 40 ? styles.warm : styles.cold;
  const Icon = score >= 70 ? Flame : score >= 40 ? TrendingUp : Minus;
  return (
    <span className={`${styles.scoreBadge} ${cls}`}>
      <Icon size={11} /> {score}
    </span>
  );
}

function StatusDot({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    hot: styles.dotHot, warm: styles.dotWarm, cold: styles.dotCold,
    converted: styles.dotConverted, archived: styles.dotArchived,
  };
  const label: Record<LeadStatus, string> = {
    hot: 'Hot', warm: 'Warm', cold: 'Cold', converted: 'Converted', archived: 'Archived',
  };
  return (
    <span className={styles.statusCell}>
      <span className={`${styles.dot} ${map[status]}`} />
      {label[status]}
    </span>
  );
}

export default function EnquiriesPage() {
  const { enquiries, fetchEnquiries, isLoading, error } = useEnquiryStore();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  if (isLoading && enquiries.length === 0) return (
    <div className={styles.loading}>
      <Loader2 className={styles.spinner} />
      <span>Fetching strategic leads...</span>
    </div>
  );

  const filtered = enquiries.filter(e => {
    const score = e.leadScore || 0;
    const temp = e.leadTemperature || (score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold');
    
    const matchTab = filter === 'all' || temp === filter;
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch = !search || fullName.includes(search.toLowerCase()) || (e.companyName && e.companyName.toLowerCase().includes(search.toLowerCase())) || e.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const hotLeads = enquiries.filter(e => {
    const score = e.leadScore || 0;
    return e.leadTemperature === 'hot' || score >= 70;
  }).sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Enquiries</h1>
          <p className={styles.pageSub}>{enquiries.length} total leads · {hotLeads.length} hot</p>
        </div>
      </div>

      {/* Hot leads summary */}
      {hotLeads.length > 0 && (
        <div className={styles.hotSection}>
          <h3 className={styles.hotTitle}><Flame size={15} color="#ef4444" /> Priority Leads</h3>
          <div className={styles.hotGrid}>
            {hotLeads.slice(0, 3).map(e => (
              <Link key={e.id} href={`/admin/enquiries/${e.id}`} className={styles.hotCard}>
                <div className={styles.hotCardTop}>
                  <div className={styles.hotAvatar}>{e.firstName[0]}{e.lastName[0]}</div>
                  <ScoreBadge score={e.leadScore || 0} />
                </div>
                <strong className={styles.hotName}>{e.firstName} {e.lastName}</strong>
                <span className={styles.hotCompany}>{e.companyName || 'Private Individual'}</span>
                <span className={styles.hotService}>{e.serviceInterest?.[0] || 'Digital Strategy'}</span>
                <div className={styles.hotBudget}>{e.budgetRange || '£—'}</div>
                <span className={styles.hotArrow}><ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Table section */}
      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <div className={styles.tabs}>
            {(['all', 'hot', 'warm', 'cold'] as FilterTab[]).map(t => (
              <button key={t} className={`${styles.tab} ${filter === t ? styles.tabActive : ''}`}
                onClick={() => setFilter(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className={styles.tabCount}>
                  {t === 'all' ? enquiries.length
                    : enquiries.filter(e => {
                        const score = e.leadScore || 0;
                        const temp = e.leadTemperature || (score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold');
                        return temp === t;
                      }).length}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input placeholder="Search leads..." className={styles.searchInput}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name / Company</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Score</th>
                <th>Status</th>
                <th>Source</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className={styles.tr}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.avatar}>{e.firstName[0]}{e.lastName[0]}</div>
                      <div>
                        <strong>{e.firstName} {e.lastName}</strong>
                        <span>{e.companyName || 'Private Individual'}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.serviceCell}>{e.serviceInterest?.[0] || 'Strategic Review'}</td>
                  <td className={styles.budgetCell}>{e.budgetRange || '£—'}</td>
                  <td><ScoreBadge score={e.leadScore || 0} /></td>
                  <td><StatusDot status={(e.leadScore || 0) >= 70 ? 'hot' : (e.leadScore || 0) >= 40 ? 'warm' : 'cold'} /></td>
                  <td className={styles.sourceCell}>{e.source || 'Organic'}</td>
                  <td className={styles.dateCell}>{new Date(e.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                  <td>
                    <Link href={`/admin/enquiries/${e.id}`} className={styles.viewBtn}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className={styles.empty}>No leads match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
