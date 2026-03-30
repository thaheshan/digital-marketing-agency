'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Button } from '@/components/common/Button/Button';

type Category = 'All' | 'Social Media' | 'SEO' | 'Branding' | 'PPC' | 'Content' | 'Email';

const portfolioItems = [
  { id: 1, title: 'E-Commerce Growth Sprint', client: 'RetailCo', category: 'Social Media', color: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)', views: '2.4k', roi: '+182%' },
  { id: 2, title: 'B2B Lead Generation Engine', client: 'TechFlow Solutions', category: 'SEO', color: 'linear-gradient(135deg, #1E293B 0%, #22C55E 100%)', views: '1.8k', roi: '+140%' },
  { id: 3, title: 'Brand Identity Overhaul', client: 'NovaBrand', category: 'Branding', color: 'linear-gradient(135deg, #0F172A 0%, #8B5CF6 100%)', views: '3.1k', roi: '+95%' },
  { id: 4, title: 'Google Ads Performance Max', client: 'GrowthMetrics', category: 'PPC', color: 'linear-gradient(135deg, #1E293B 0%, #DC2626 100%)', views: '1.2k', roi: '+230%' },
  { id: 5, title: 'Content Authority Campaign', client: 'InnovateCorp', category: 'Content', color: 'linear-gradient(135deg, #0F172A 0%, #F97316 100%)', views: '980', roi: '+120%' },
  { id: 6, title: 'Email Drip Automation', client: 'SaaS Ventures', category: 'Email', color: 'linear-gradient(135deg, #1E293B 0%, #EC4899 100%)', views: '1.5k', roi: '+165%' },
  { id: 7, title: 'Social Commerce Launch', client: 'FashionFirst', category: 'Social Media', color: 'linear-gradient(135deg, #06B6D4 0%, #0F172A 100%)', views: '4.2k', roi: '+210%' },
  { id: 8, title: 'Local SEO Domination', client: 'LocalBiz Chain', category: 'SEO', color: 'linear-gradient(135deg, #22C55E 0%, #1E293B 100%)', views: '760', roi: '+88%' },
  { id: 9, title: 'PPC Remarketing Blitz', client: 'ShopBetter', category: 'PPC', color: 'linear-gradient(135deg, #DC2626 0%, #0F172A 100%)', views: '1.1k', roi: '+195%' },
];

const categories: Category[] = ['All', 'Social Media', 'SEO', 'Branding', 'PPC', 'Content', 'Email'];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return portfolioItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Our Work</h1>
        <p className={styles.heroSub}>Results That Speak for Themselves</p>
      </section>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterInner}>
          <div className={styles.filterTabs}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterTab} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.filterControls}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <p>Showing <strong>{filtered.length}</strong> {activeCategory === 'All' ? '' : activeCategory} project{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <section className={styles.gridSection}>
          <div className={styles.portfolioGrid}>
            {filtered.map((item) => (
              <div key={item.id} className={styles.portfolioCard} style={{ background: item.color }}>
                <div className={styles.cardOverlay}>
                  <span className={styles.clientName}>{item.client}</span>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <div className={styles.cardMeta}>
                    <span>👁 {item.views}</span>
                    <span className={styles.roiTag}>{item.roi} ROI</span>
                  </div>
                  <Link href={`/portfolio/${item.id}`} className={styles.viewBtn}>View Project →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>🔍</p>
          <h3>No Projects Found</h3>
          <p>Try adjusting your filters or search term</p>
          <Button variant="primary" size="medium" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
