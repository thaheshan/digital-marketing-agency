'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { ContentScorePanel } from '@/components/admin/ContentScorePanel/ContentScorePanel';
import styles from './page.module.css';

const CATEGORIES = ['SEO', 'PPC', 'Social Media', 'Email Marketing', 'Content', 'Brand Strategy', 'News'];

export default function NewBlogPostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/admin/blog" className={styles.backLink}><ArrowLeft size={16} /> Blog Posts</Link>
        <div className={styles.topActions}>
          <select value={category} onChange={e => setCategory(e.target.value)} className={styles.categorySelect}>
            <option value="">Category</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className={styles.draftBtn} onClick={handleSave}>Save Draft</button>
          <button className={styles.publishBtn} disabled={!title || !content || content.length < 100}>Publish Post</button>
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
