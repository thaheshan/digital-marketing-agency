'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await api.get<any[]>('/admin/blog');
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Blog Articles</h1>
          <p className={styles.sub}>Manage your agency's thought leadership and content marketing.</p>
        </div>
        <Link href="/admin/blog/new" className={styles.addBtn}>
          <Plus size={18} />
          <span>New Article</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div className={styles.loading}>Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>No articles found. Create your first one!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postStatus}>
                 <span className={`${styles.statusBadge} ${styles[post.status.toLowerCase()]}`}>{post.status}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <div className={styles.postMeta}>
                 <div className={styles.metaItem}><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</div>
                 <div className={styles.metaItem}><Tag size={14} /> {post.category || 'General'}</div>
                 <div className={styles.metaItem}><Eye size={14} /> {post.viewsCount || 0} views</div>
              </div>
              <div className={styles.postFooter}>
                 <div className={styles.author}>
                    <div className={styles.avatarMini}>{post.author?.firstName?.[0] || 'A'}</div>
                    <span>{post.author?.firstName} {post.author?.lastName}</span>
                 </div>
                 <div className={styles.actions}>
                    <button className={styles.actionBtn}><Edit2 size={16} /></button>
                    <button className={styles.actionBtn}><Trash2 size={16} /></button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
