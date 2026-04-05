'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { usePortfolioStore } from '@/store';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Social Media Marketing', 'SEO Optimization', 'PPC Advertising', 'Content Marketing', 'Email Marketing'];

export default function AdminPortfolioPage() {
  const { items, deleteItem, publishItem } = usePortfolioStore();
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = items.filter(item => {
    const matchCat = filter === 'All' || item.serviceCategory === filter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.clientName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Portfolio</h1>
          <p className={styles.pageSub}>{items.filter(i => i.status === 'published').length} published · {items.filter(i => i.status === 'draft').length} drafts</p>
        </div>
        <Link href="/admin/portfolio/new" className={styles.addBtn}>
          <Plus size={16} /> Add Portfolio Item
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.catTabs}>
          {CATEGORIES.map(c => (
            <button key={c} className={`${styles.catTab} ${filter === c ? styles.catActive : ''}`}
              onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className={styles.rightFilters}>
          <div className={styles.statusTabs}>
            {(['all', 'published', 'draft'] as const).map(s => (
              <button key={s} className={`${styles.statusTab} ${statusFilter === s ? styles.statusActive : ''}`}
                onClick={() => setStatusFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.searchBar}>
            <Search size={14} />
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>
                <span>{item.clientIndustry.split('/')[0].trim()}</span>
              </div>
              <span className={`${styles.statusBadge} ${item.status === 'published' ? styles.published : styles.draft}`}>
                {item.status}
              </span>
              <div className={styles.scoreChip} title="Content Score">
                {item.contentScore}<span>/100</span>
              </div>
              <div className={styles.menuBtn} onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}>
                <MoreHorizontal size={16} />
                {openMenu === item.id && (
                  <div className={styles.dropdown}>
                    <Link href={`/admin/portfolio/${item.id}`} className={styles.ddItem}>
                      <Edit size={14} /> Edit
                    </Link>
                    <Link href={`/portfolio/${item.slug}`} className={styles.ddItem} target="_blank">
                      <Eye size={14} /> Preview
                    </Link>
                    {item.status === 'draft' && (
                      <button className={styles.ddItem} onClick={() => publishItem(item.id)}>
                        ✓ Publish
                      </button>
                    )}
                    <button className={`${styles.ddItem} ${styles.ddDelete}`} onClick={() => deleteItem(item.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.catChip}>{item.serviceCategory}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.clientName}>{item.clientName} · {item.clientIndustry}</p>
              <div className={styles.metrics}>
                <span>ROI {item.metrics.roi}</span>
                <span>{item.metrics.impressions} impressions</span>
                <span>{item.metrics.conversions} conv.</span>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.dateStr}>{item.dateRange}</span>
                <Link href={`/admin/portfolio/${item.id}`} className={styles.editLink}>Edit →</Link>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No portfolio items match your filters.</div>
        )}
      </div>
    </div>
  );
}
