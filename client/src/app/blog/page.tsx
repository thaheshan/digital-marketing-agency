'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

const posts = [
  {
    slug: 'seo-trends-2026',
    title: 'The 7 SEO Trends That Will Define 2026',
    excerpt: 'AI-generated content, voice search, and Core Web Vitals are reshaping search rankings. Here\'s what you need to know to stay ahead.',
    category: 'SEO',
    readTime: '7 min',
    date: 'Mar 28, 2026',
    image: 'https://picsum.photos/seed/seo/800/600',
    featured: true,
  },
  {
    slug: 'social-media-roi',
    title: 'How to Measure Social Media ROI: A Complete Guide',
    excerpt: 'Stop guessing and start proving the value of your social efforts. Our framework for attributing real revenue to social campaigns.',
    category: 'Social Media',
    readTime: '9 min',
    date: 'Mar 25, 2026',
    image: 'https://picsum.photos/seed/social/800/600',
    featured: false,
  },
  {
    slug: 'ppc-bidding-strategies',
    title: 'Smart Bidding vs Manual: When to Use Each',
    excerpt: 'Google\'s Smart Bidding has matured significantly. We break down the 6 bidding strategies and the exact scenarios where each wins.',
    category: 'PPC',
    readTime: '6 min',
    date: 'Mar 22, 2026',
    image: 'https://picsum.photos/seed/ppc/800/600',
    featured: false,
  },
  {
    slug: 'content-marketing-funnel',
    title: 'Building a Content Marketing Funnel That Actually Converts',
    excerpt: 'Most content marketing fails at the bottom of the funnel. Here\'s how to create content that turns readers into paying customers.',
    category: 'Content',
    readTime: '11 min',
    date: 'Mar 19, 2026',
    image: 'https://picsum.photos/seed/content/800/600',
    featured: false,
  },
  {
    slug: 'email-automation-sequences',
    title: '5 Email Automation Sequences Every E-Commerce Brand Needs',
    excerpt: 'Welcome series, abandoned cart, win-back flows — these automated sequences generated over $2M for our clients last year.',
    category: 'Email',
    readTime: '8 min',
    date: 'Mar 15, 2026',
    image: 'https://picsum.photos/seed/email/800/600',
    featured: false,
  },
  {
    slug: 'brand-positioning-strategy',
    title: 'Brand Positioning: How to Stand Out in a Crowded Market',
    excerpt: 'A distinctive market position is your most durable competitive advantage. Here\'s our proven 4-step positioning framework.',
    category: 'Branding',
    readTime: '10 min',
    date: 'Mar 12, 2026',
    image: 'https://picsum.photos/seed/brand/800/600',
    featured: false,
  },
];

const categories = ['All', 'SEO', 'Social Media', 'PPC', 'Content', 'Email', 'Branding'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

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
