'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

const categories = ['All', 'SEO', 'Social Media', 'PPC', 'Content', 'Email', 'Branding'];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await api.get<any>('/blog/public');
        console.log('[BlogPage] API Response:', res);
        if (res.items) {
          const mapped = res.items.map((p: any) => ({
             slug: p.slug,
             title: p.title,
             excerpt: p.excerpt,
             category: p.category || 'Marketing',
             readTime: '5 min',
             date: new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
             image: p.featuredImageUrl || `https://picsum.photos/seed/${p.slug}/800/600`,
             featured: p.isFeatured || false
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const featured = filteredPosts.find(p => p.featured);
  const regular = filteredPosts.filter(p => !p.featured);
  return (
    <div className={styles.page}>
      {/* ── Hero Banner ── */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>Blog</span>
          </nav>
          <h1 className={styles.heroTitle}>Marketing Insights</h1>
          <p className={styles.heroSubtitle}>
            Expert strategies, trends, and tutorials to grow your business online
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className={styles.categoryBar}>
        <div className={styles.container}>
          <div className={styles.categoryTabs}>
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`${styles.catTab} ${activeCategory === cat ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Featured Post */}
        {featured && (
          <section className={styles.featuredSection}>
            <Link href={`/blog/${featured.slug}`} className={styles.featuredCard}>
              <div className={styles.featuredIllustration}>
                <img src={featured.image} alt={featured.title} className={styles.coverImage} referrerPolicy="no-referrer" />
                <span className={styles.featuredBadge}>Featured Article</span>
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.categoryTag}>
                  {featured.category}
                </span>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.postMeta}>
                  <span className={styles.metaItem}><Calendar size={14} /> {featured.date}</span>
                  <span className={styles.metaItem}><Clock size={14} /> {featured.readTime} read</span>
                </div>
                <span className={styles.readMore}>Read Article <ArrowRight size={15} /></span>
              </div>
            </Link>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section className={styles.postsSection}>
          {regular.length > 0 && <h3 className={styles.gridTitle}>{activeCategory === 'All' ? 'Latest Articles' : `${activeCategory} Articles`}</h3>}
          
          {regular.length > 0 ? (
            <div className={styles.postsGrid}>
              {regular.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                  <div className={styles.postIllustration}>
                    <img src={post.image} alt={post.title} className={styles.coverImage} referrerPolicy="no-referrer" />
                  </div>
                  <div className={styles.postContent}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <h4 className={styles.postTitle}>{post.title}</h4>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.postMeta}>
                      <span className={styles.metaItem}><Calendar size={14} /> {post.date}</span>
                      <span className={styles.metaItem}><Clock size={14} /> {post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No articles found for the {activeCategory} category.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
