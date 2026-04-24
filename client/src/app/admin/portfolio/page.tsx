'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Social Media Marketing', 'SEO Optimization', 'PPC Advertising', 'Content Marketing', 'Email Marketing'];

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await api.get<any[]>('/admin/portfolio');
        setItems(data || []);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const filtered = items.filter(item => {
    const categoryName = item.service?.name || item.serviceCategory || 'Other';
    const matchCat = filter === 'All' || categoryName === filter;
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
        {loading ? (
          <div className={styles.loading}>Loading portfolio...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No portfolio items match your filters.</div>
        ) : (
          filtered.map(item => {
            const featuredImg = item.images?.find((img: any) => img.isFeatured) || item.images?.[0];
            
            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardImage}>
                  {featuredImg ? (
                    <img src={featuredImg.url} alt={item.title} className={styles.actualImage} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>{item.clientIndustry?.[0] || 'P'}</span>
                    </div>
                  )}
                  <span className={`${styles.statusBadge} ${item.status === 'published' ? styles.published : styles.draft}`}>
                    {item.status}
                  </span>
                <div className={styles.scoreChip} title="Content Score">
                  {item.contentScore || 0}<span>/100</span>
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
                      <button className={`${styles.ddItem} ${styles.ddDelete}`}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.catChip}>{item.service?.name || item.serviceCategory || 'Strategy'}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.clientName}>{item.clientName} {item.clientIndustry ? `· ${item.clientIndustry}` : ''}</p>
                <div className={styles.metrics}>
                  <span>ROI {item.metrics?.roi || '—'}</span>
                  <span>{item.metrics?.impressions || '0'} impressions</span>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.dateStr}>{item.dateRange || 'Recent'}</span>
                  <Link href={`/admin/portfolio/${item.id}`} className={styles.editLink}>Edit →</Link>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
}
