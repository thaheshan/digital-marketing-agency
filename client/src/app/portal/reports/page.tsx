'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Search, 
  Filter, 
  BarChart3, 
  Calendar, 
  Database,
  ArrowUpRight
} from 'lucide-react';
import styles from './page.module.css';

const MOCK_REPORTS = [
  { id: 'rep1', title: 'March 2026 Performance Report', period: 'Mar 1 – Mar 31, 2026', type: 'Monthly', status: 'Ready', size: '2.4 MB', generated: 'Mar 31, 2026' },
  { id: 'rep2', title: 'Q1 2026 Campaign Summary', period: 'Jan 1 – Mar 31, 2026', type: 'Quarterly', status: 'Ready', size: '5.1 MB', generated: 'Mar 31, 2026' },
  { id: 'rep3', title: 'February 2026 Performance Report', period: 'Feb 1 – Feb 28, 2026', type: 'Monthly', status: 'Ready', size: '2.1 MB', generated: 'Feb 28, 2026' },
  { id: 'rep4', title: 'Social Media Strategy Deep Dive', period: 'Q1 2026', type: 'Custom', status: 'Ready', size: '3.8 MB', generated: 'Mar 15, 2026' },
  { id: 'rep5', title: 'January 2026 Performance Report', period: 'Jan 1 – Jan 31, 2026', type: 'Monthly', status: 'Ready', size: '2.2 MB', generated: 'Jan 31, 2026' },
  { id: 'rep6', title: 'April 2026 Performance Report', period: 'Apr 1 – Apr 30, 2026', type: 'Monthly', status: 'Generating', size: '—', generated: 'Due Apr 30' },
];

const STATS = [
  { icon: FileText, label: 'Total Reports', value: '24', color: '#06B6D4' },
  { icon: BarChart3, label: 'Analytics Docs', value: '12', color: '#F97316' },
  { icon: Database, label: 'Total Data', value: '47.3MB', color: '#6366F1' },
  { icon: Calendar, label: 'Next Report', value: 'Apr 30', color: '#22C55E' },
];

export default function PortalReportsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_REPORTS.filter(r => {
    const matchType = filter === 'All' || r.type === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Performance Reports</h1>
          <p className={styles.sub}>Access your historical campaign data and strategic summaries.</p>
        </div>
        <button className={styles.requestBtn}>
          Request Custom Insights <ArrowUpRight size={16} />
        </button>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={20} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {['All', 'Monthly', 'Quarterly', 'Custom'].map(t => (
            <button 
              key={t} 
              className={`${styles.tab} ${filter === t ? styles.tabActive : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input 
            placeholder="Search reports..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.reportList}>
        {filtered.map(report => (
          <div key={report.id} className={`${styles.reportRow} ${report.status === 'Generating' ? styles.generating : ''}`}>
            <div className={styles.reportMain}>
              <div className={styles.typeIcon}>
                <FileText size={20} />
              </div>
              <div className={styles.reportInfo}>
                <h3>{report.title}</h3>
                <div className={styles.reportMeta}>
                  <span className={styles.metaItem}><Calendar size={12} /> {report.period}</span>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaItem}>Generated {report.generated}</span>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaItem}>{report.size}</span>
                </div>
              </div>
            </div>

            <div className={styles.reportActions}>
              {report.status === 'Ready' ? (
                <>
                  <button className={styles.previewBtn}><Eye size={16} /> Preview</button>
                  <button className={styles.downloadBtn}><Download size={16} /> Download PDF</button>
                </>
              ) : (
                <div className={styles.statusBox}>
                  <Clock size={14} /> Generating...
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.emptyState}>No reports found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}
