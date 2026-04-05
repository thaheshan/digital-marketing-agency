'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import styles from './page.module.css';

const MOCK_POSTS = [
  { id: '1', title: 'How to Maximise ROAS on Meta Ads in 2026', status: 'Published', date: 'Apr 1, 2026', category: 'PPC', views: 1240, score: 84 },
  { id: '2', title: 'The Ultimate Guide to Local SEO for Service Businesses', status: 'Published', date: 'Mar 22, 2026', category: 'SEO', views: 3420, score: 91 },
  { id: '3', title: 'Email Drip Campaigns That Actually Convert', status: 'Draft', date: 'Mar 30, 2026', category: 'Email', views: 0, score: 52 },
  { id: '4', title: '10 Social Media Trends to Watch This Quarter', status: 'Scheduled', date: 'Apr 10, 2026', category: 'Social', views: 0, score: 76 },
];

export default function AdminBlogPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = MOCK_POSTS.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <p className={styles.pageSub}>{MOCK_POSTS.filter(p => p.status === 'Published').length} published · {MOCK_POSTS.filter(p => p.status === 'Draft').length} drafts</p>
        </div>
        <Link href="/admin/blog/new" className={styles.addBtn}>
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {['All', 'Published', 'Draft', 'Scheduled'].map(f => (
            <button key={f} className={`${styles.tab} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className={styles.searchBar}>
          <Search size={14} color="#94a3b8" />
          <input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Score</th>
              <th>Views</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(post => (
              <tr key={post.id} className={styles.tr}>
                <td className={styles.titleCell}>{post.title}</td>
                <td><span className={styles.catChip}>{post.category}</span></td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`s${post.status}`]}`}>{post.status}</span>
                </td>
                <td>
                  <span className={styles.scoreVal} style={{ color: post.score >= 80 ? '#16a34a' : post.score >= 60 ? '#06b6d4' : '#d97706' }}>
                    {post.score}/100
                  </span>
                </td>
                <td className={styles.mono}>{post.views.toLocaleString()}</td>
                <td className={styles.dateCell}>{post.date}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/blog/${post.id}`} className={styles.iconBtn}><Edit2 size={14} /></Link>
                    <button className={styles.iconBtn}><Eye size={14} /></button>
                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className={styles.empty}>No posts found.</div>}
      </div>
    </div>
  );
}
