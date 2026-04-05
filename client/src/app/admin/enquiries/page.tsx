'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Flame, TrendingUp, Minus } from 'lucide-react';
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
  const { enquiries } = useEnquiryStore();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const filtered = enquiries.filter(e => {
    const matchTab = filter === 'all' || e.status === filter || (filter === 'hot' && e.score >= 70) || (filter === 'warm' && e.score >= 40 && e.score < 70) || (filter === 'cold' && e.score < 40);
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.company.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const hotLeads = enquiries.filter(e => e.score >= 70).sort((a, b) => b.score - a.score);

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
                  <div className={styles.hotAvatar}>{e.name.split(' ').map(n => n[0]).join('')}</div>
                  <ScoreBadge score={e.score} />
                </div>
                <strong className={styles.hotName}>{e.name}</strong>
                <span className={styles.hotCompany}>{e.company}</span>
                <span className={styles.hotService}>{e.service}</span>
                <div className={styles.hotBudget}>{e.budget}</div>
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
                    : t === 'hot' ? enquiries.filter(e => e.score >= 70).length
                    : t === 'warm' ? enquiries.filter(e => e.score >= 40 && e.score < 70).length
                    : enquiries.filter(e => e.score < 40).length}
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
                      <div className={styles.avatar}>{e.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <strong>{e.name}</strong>
                        <span>{e.company}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.serviceCell}>{e.service}</td>
                  <td className={styles.budgetCell}>{e.budget}</td>
                  <td><ScoreBadge score={e.score} /></td>
                  <td><StatusDot status={e.status} /></td>
                  <td className={styles.sourceCell}>{e.source}</td>
                  <td className={styles.dateCell}>{new Date(e.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
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
