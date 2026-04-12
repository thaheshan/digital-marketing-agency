'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, LayoutGrid, List, X, Check } from 'lucide-react';
import styles from './page.module.css';

type Category = 'All' | 'Social Media' | 'SEO' | 'Branding' | 'PPC' | 'Content Marketing' | 'Email Marketing';
type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
type ViewMode = 'grid' | 'list';

const ALL_ITEMS = [
  { id: 1,  title: 'Social Media Dashboard',      category: 'Social Media',      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2024 },
  { id: 2,  title: 'Content Strategy Layout',      category: 'Content Marketing', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2024 },
  { id: 3,  title: 'SEO Growth Analytics',          category: 'SEO',               image: 'https://images.unsplash.com/photo-1543286386-7f8a3ae1f94e?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 4,  title: 'Brand Identity Design',         category: 'Branding',          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 5,  title: 'Email Campaign Builder',        category: 'Email Marketing',   image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2024 },
  { id: 6,  title: 'PPC Performance Dashboard',     category: 'PPC',               image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 7,  title: 'Analytics Reporting Suite',     category: 'SEO',               image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2022 },
  { id: 8,  title: 'Social Ads Creative',           category: 'Social Media',      image: 'https://images.unsplash.com/photo-1607703703674-df96af81dffa?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2024 },
  { id: 9,  title: 'Video Production Campaign',     category: 'Content Marketing', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 10, title: 'CRM & Lead Management',         category: 'PPC',               image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2022 },
  { id: 11, title: 'Brand Guidelines Book',         category: 'Branding',          image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 12, title: 'Newsletter Design System',      category: 'Email Marketing',   image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2024 },
  { id: 13, title: 'Influencer Campaign Tracker',   category: 'Social Media',      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2024 },
  { id: 14, title: 'Keyword Research Dashboard',    category: 'SEO',               image: 'https://images.unsplash.com/photo-1432821579788-7b9c43bd0aba?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2022 },
  { id: 15, title: 'Logo & Visual Identity',        category: 'Branding',          image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2023 },
  { id: 16, title: 'Google Ads Conversion Funnel',  category: 'PPC',               image: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2024 },
  { id: 17, title: 'Blog Content Calendar',         category: 'Content Marketing', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2022 },
  { id: 18, title: 'Drip Email Sequence',           category: 'Email Marketing',   image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 19, title: 'Retargeting Ad Creative',       category: 'PPC',               image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2024 },
  { id: 20, title: 'Social Listening Report',       category: 'Social Media',      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2023 },
  { id: 21, title: 'Technical SEO Audit',           category: 'SEO',               image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2022 },
  { id: 22, title: 'Brand Refresh Campaign',        category: 'Branding',          image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2024 },
  { id: 23, title: 'Webinar Content Series',        category: 'Content Marketing', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', height: 'tall',   year: 2023 },
  { id: 24, title: 'Welcome Email Onboarding',      category: 'Email Marketing',   image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', height: 'medium', year: 2024 },
];

const CATEGORIES: Category[] = ['All', 'Social Media', 'SEO', 'Branding', 'PPC', 'Content Marketing', 'Email Marketing'];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'A – Z', value: 'a-z' },
  { label: 'Z – A', value: 'z-a' },
];
const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [pendingSort, setPendingSort] = useState<SortOption>('newest');
  const [pendingCats, setPendingCats] = useState<Set<Category>>(new Set(['All']));

  /* Apply filters */
  const applyFilters = () => {
    setSortBy(pendingSort);
    if (pendingCats.has('All')) setActiveCategory('All');
    else setActiveCategory(Array.from(pendingCats)[0] as Category);
    setVisibleCount(INITIAL_VISIBLE);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setPendingSort('newest');
    setPendingCats(new Set(['All']));
  };

  const togglePendingCat = (cat: Category) => {
    if (cat === 'All') { setPendingCats(new Set(['All'])); return; }
    const next = new Set(pendingCats);
    next.delete('All');
    if (next.has(cat)) next.delete(cat); else next.add(cat);
    if (next.size === 0) next.add('All');
    setPendingCats(next);
  };

  const filtered = useMemo(() => {
    let items = ALL_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    switch (sortBy) {
      case 'newest': items = [...items].sort((a, b) => b.year - a.year); break;
      case 'oldest': items = [...items].sort((a, b) => a.year - b.year); break;
      case 'a-z':    items = [...items].sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'z-a':    items = [...items].sort((a, b) => b.title.localeCompare(a.title)); break;
    }
    return items;
  }, [activeCategory, searchQuery, sortBy]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className={styles.page}>
      {/* ── Hero Banner ── */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>Portfolio</span>
          </nav>
          <h1 className={styles.heroTitle}>Our Portfolio</h1>
          <p className={styles.heroSubtitle}>
            Comprehensive digital marketing solutions tailored to accelerate your business growth
          </p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarInner}>
          <div className={styles.filterPills}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
                onClick={() => { setActiveCategory(cat); setVisibleCount(INITIAL_VISIBLE); }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.filterRight}>
            <div className={styles.searchWrap}>
              <Search size={15} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search projects..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(INITIAL_VISIBLE); }}
              />
            </div>

            {/* Filter Button */}
            <button
              className={`${styles.iconBtn} ${filterOpen ? styles.iconBtnActive : ''}`}
              onClick={() => { setPendingSort(sortBy); setFilterOpen(true); }}
              title="Filter & Sort"
            >
              <SlidersHorizontal size={16} />
            </button>

            {/* View Toggle */}
            <button
              className={`${styles.iconBtn} ${viewMode === 'list' ? styles.iconBtnActive : ''}`}
              onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
            >
              {viewMode === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Modal ── */}
      {filterOpen && (
        <div className={styles.filterOverlay} onClick={() => setFilterOpen(false)}>
          <div className={styles.filterModal} onClick={e => e.stopPropagation()}>
            <div className={styles.filterModalHead}>
              <h3 className={styles.filterModalTitle}>Filter & Sort</h3>
              <button className={styles.filterModalClose} onClick={() => setFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Sort */}
            <div className={styles.filterSection}>
              <p className={styles.filterSectionLabel}>Sort By</p>
              <div className={styles.sortOptions}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.sortBtn} ${pendingSort === opt.value ? styles.sortBtnActive : ''}`}
                    onClick={() => setPendingSort(opt.value)}
                  >
                    {pendingSort === opt.value && <Check size={13} />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className={styles.filterSection}>
              <p className={styles.filterSectionLabel}>Category</p>
              <div className={styles.filterCatList}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.filterCatBtn} ${pendingCats.has(cat) ? styles.filterCatActive : ''}`}
                    onClick={() => togglePendingCat(cat)}
                  >
                    {pendingCats.has(cat) && <Check size={12} />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.filterReset} onClick={resetFilters}>Reset</button>
              <button className={styles.filterApply} onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Portfolio Grid / List ── */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          {visibleItems.length > 0 ? (
            <>
              <div className={viewMode === 'grid' ? styles.portfolioGrid : styles.portfolioList}>
                {visibleItems.map((item) => (
                  viewMode === 'grid' ? (
                    <Link key={item.id} href={`/portfolio/${item.id}`} className={`${styles.gridItem} ${styles[item.height]}`}>
                      <img src={item.image} alt={item.title} className={styles.gridImage} />
                      <div className={styles.gridOverlay}>
                        <span className={styles.gridCategory}>{item.category}</span>
                        <h4 className={styles.gridTitle}>{item.title}</h4>
                      </div>
                    </Link>
                  ) : (
                    <Link key={item.id} href={`/portfolio/${item.id}`} className={styles.listItem}>
                      <img src={item.image} alt={item.title} className={styles.listImage} />
                      <div className={styles.listContent}>
                        <span className={styles.listCategory}>{item.category}</span>
                        <h4 className={styles.listTitle}>{item.title}</h4>
                        <span className={styles.listYear}>{item.year}</span>
                      </div>
                    </Link>
                  )
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className={styles.loadMoreWrap}>
                  <button
                    className={styles.loadMoreBtn}
                    onClick={() => setVisibleCount(v => v + LOAD_MORE_COUNT)}
                  >
                    Load More Projects
                  </button>
                  <p className={styles.loadMoreCount}>
                    Showing {visibleCount} of {filtered.length} projects
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>No projects found matching your filters.</p>
              <button
                className={styles.clearBtn}
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); setSortBy('newest'); setVisibleCount(INITIAL_VISIBLE); }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
