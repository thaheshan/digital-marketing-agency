import styles from './page.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Digital Marketing Agency',
  description: 'Expert insights, strategies, and trends in digital marketing to help your business grow.',
};

const posts = [
  {
    slug: 'seo-trends-2026',
    title: 'The 7 SEO Trends That Will Define 2026',
    excerpt: 'AI-generated content, voice search, and Core Web Vitals are reshaping search rankings. Here\'s what you need to know to stay ahead.',
    category: 'SEO',
    readTime: '7 min',
    date: 'Mar 28, 2026',
    emoji: '🔍',
    color: '#ECFEFF',
    featured: true,
  },
  {
    slug: 'social-media-roi',
    title: 'How to Measure Social Media ROI: A Complete Guide',
    excerpt: 'Stop guessing and start proving the value of your social efforts. Our framework for attributing real revenue to social campaigns.',
    category: 'Social Media',
    readTime: '9 min',
    date: 'Mar 25, 2026',
    emoji: '📱',
    color: '#FFF7ED',
    featured: false,
  },
  {
    slug: 'ppc-bidding-strategies',
    title: 'Smart Bidding vs Manual: When to Use Each',
    excerpt: 'Google\'s Smart Bidding has matured significantly. We break down the 6 bidding strategies and the exact scenarios where each wins.',
    category: 'PPC',
    readTime: '6 min',
    date: 'Mar 22, 2026',
    emoji: '🎯',
    color: '#FEF2F2',
    featured: false,
  },
  {
    slug: 'content-marketing-funnel',
    title: 'Building a Content Marketing Funnel That Actually Converts',
    excerpt: 'Most content marketing fails at the bottom of the funnel. Here\'s how to create content that turns readers into paying customers.',
    category: 'Content',
    readTime: '11 min',
    date: 'Mar 19, 2026',
    emoji: '✍️',
    color: '#F5F3FF',
    featured: false,
  },
  {
    slug: 'email-automation-sequences',
    title: '5 Email Automation Sequences Every E-Commerce Brand Needs',
    excerpt: 'Welcome series, abandoned cart, win-back flows — these automated sequences generated over $2M for our clients last year.',
    category: 'Email',
    readTime: '8 min',
    date: 'Mar 15, 2026',
    emoji: '📧',
    color: '#FDF2F8',
    featured: false,
  },
  {
    slug: 'brand-positioning-strategy',
    title: 'Brand Positioning: How to Stand Out in a Crowded Market',
    excerpt: 'A distinctive market position is your most durable competitive advantage. Here\'s our proven 4-step positioning framework.',
    category: 'Branding',
    readTime: '10 min',
    date: 'Mar 12, 2026',
    emoji: '🏆',
    color: '#F0FDF4',
    featured: false,
  },
];

const categories = ['All', 'SEO', 'Social Media', 'PPC', 'Content', 'Email', 'Branding'];

const featured = posts.find(p => p.featured);
const regular = posts.filter(p => !p.featured);

export default function BlogPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Marketing Insights</h1>
        <p className={styles.heroSub}>Expert strategies, trends, and tutorials to grow your business online</p>
      </section>

      {/* Category Tabs — static for server component */}
      <div className={styles.categoryBar}>
        <div className={styles.container}>
          <div className={styles.categoryTabs}>
            {categories.map((cat, i) => (
              <span key={cat} className={`${styles.catTab} ${i === 0 ? styles.catActive : ''}`}>{cat}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Featured Post */}
        {featured && (
          <section className={styles.featuredSection}>
            <Link href={`/blog/${featured.slug}`} className={styles.featuredCard}>
              <div className={styles.featuredIllustration} style={{ background: featured.color }}>
                <span className={styles.featuredEmoji}>{featured.emoji}</span>
                <span className={styles.featuredBadge}>Featured Article</span>
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.categoryTag} style={{ background: featured.color }}>
                  {featured.category}
                </span>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.postMeta}>
                  <span className={styles.metaItem}>📅 {featured.date}</span>
                  <span className={styles.metaItem}>⏱ {featured.readTime} read</span>
                </div>
                <span className={styles.readMore}>Read Article →</span>
              </div>
            </Link>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section className={styles.postsSection}>
          <h3 className={styles.gridTitle}>Latest Articles</h3>
          <div className={styles.postsGrid}>
            {regular.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                <div className={styles.postIllustration} style={{ background: post.color }}>
                  <span className={styles.postEmoji}>{post.emoji}</span>
                </div>
                <div className={styles.postContent}>
                  <span className={styles.postCategory}>{post.category}</span>
                  <h4 className={styles.postTitle}>{post.title}</h4>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.postMeta}>
                    <span className={styles.metaItem}>📅 {post.date}</span>
                    <span className={styles.metaItem}>⏱ {post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
