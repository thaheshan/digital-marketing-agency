'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await api.get<any>(`/blog/public/${slug}`);
        if (res.item) {
          setPost(res.item);
        }
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) return (
    <div className={styles.loading}>
      <Loader2 className={styles.spinner} />
      <span>Fetching article...</span>
    </div>
  );

  if (!post) return (
    <div className={styles.notFound}>
      <h2>Article Not Found</h2>
      <p>The post you are looking for does not exist or has been removed.</p>
      <Link href="/blog">Back to Blog</Link>
    </div>
  );

  return (
    <div className={styles.page}>
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/blog">Blog</Link>
            <ChevronRight size={14} />
            <span>{post.category || 'Insights'}</span>
          </nav>
          <h1 className={styles.heroTitle}>{post.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>
              <Calendar size={16} /> 
              {new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className={styles.metaItem}><Clock size={16} /> 5 min read</span>
          </div>
        </div>
      </section>

      <section className={styles.coverSection}>
        <div className={styles.coverImageWrapper}>
          <img 
            src={post.featuredImageUrl || `https://picsum.photos/seed/${post.slug}/1200/800`} 
            alt={post.title} 
            className={styles.coverImage} 
            referrerPolicy="no-referrer" 
          />
        </div>
      </section>

      <section className={styles.contentSection}>
        <article 
          className={styles.articleBody} 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        <div className={styles.articleFooter}>
          <h3 className={styles.footerTitle}>Ready to elevate your strategy?</h3>
          <p className={styles.footerText}>Let our experts analyze your current positioning and discover new growth avenues.</p>
          <Link href="/contact">
            <Button variant="primary" size="large">Get a Free Consultation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
