'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { ContentScorePanel } from '@/components/admin/ContentScorePanel/ContentScorePanel';
import styles from './page.module.css';

const CATEGORIES = [
  'SEO Optimization', 'PPC Advertising', 'Social Media Marketing', 
  'Content Marketing', 'Email Marketing', 'Brand Strategy', 
  'Web Development', 'Mobile App Development', 'Conversion Rate Optimization', 
  'AI & Automation', 'Influencer Marketing', 'Video Production', 
  'Digital PR', 'Amazon Marketing', 'Data & Analytics', 'Agency News'
];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.get<any[]>('/admin/services');
        if (data.length > 0) {
          setCategories(data.map(s => s.name));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handlePublish = async (status: 'published' | 'draft') => {
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/blog/create', {
        title,
        excerpt: content.substring(0, 160) + '...',
        content,
        status,
        category
      });
      if (res.success) {
        router.push('/admin/blog');
      }
    } catch (err) {
      console.error('Failed to publish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/admin/blog" className={styles.backLink}><ArrowLeft size={16} /> Blog Posts</Link>
        <div className={styles.topActions}>
          <select value={category} onChange={e => setCategory(e.target.value)} className={styles.categorySelect}>
            <option value="">Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className={styles.draftBtn} onClick={() => handlePublish('draft')} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            className={styles.publishBtn} 
            onClick={() => handlePublish('published')}
            disabled={isSubmitting || !title || !content || content.length < 10}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        <div className={styles.editorMain}>
          <input
            className={styles.titleInput}
            placeholder="Post title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className={styles.toolbar}>
            {['B', 'I', 'H2', 'H3', '"', '—', 'Link'].map(btn => (
              <button key={btn} className={styles.toolbarBtn}>{btn}</button>
            ))}
          </div>
          <textarea
            className={styles.editor}
            placeholder="Start writing your blog post here...&#10;&#10;Use clear paragraphs, include specific data points, and naturally incorporate relevant keywords to improve your content score."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className={styles.editorFooter}>
            <span className={styles.wordCount}>{content.split(/\s+/).filter(Boolean).length} words</span>
            {content.length > 0 && content.length < 400 && (
              <span className={styles.wordHint}>Aim for 500+ words for best results</span>
            )}
          </div>
        </div>

        <div className={styles.scorePanel}>
          <ContentScorePanel text={`${title}. ${content}`} serviceCategory={category} />
        </div>
      </div>
    </div>
  );
}
