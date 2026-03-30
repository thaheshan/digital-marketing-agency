import styles from './page.module.css';
import Link from 'next/link';

export const metadata = { title: 'Reports | Client Portal' };

const reports = [
  { id: 1, title: 'March 2026 Performance Report', period: 'Mar 1–31, 2026', type: 'Monthly', status: 'Ready', size: '2.4 MB', generated: 'Mar 31, 2026' },
  { id: 2, title: 'Q1 2026 Campaign Summary', period: 'Jan 1–Mar 31, 2026', type: 'Quarterly', status: 'Ready', size: '5.1 MB', generated: 'Mar 31, 2026' },
  { id: 3, title: 'February 2026 Performance Report', period: 'Feb 1–28, 2026', type: 'Monthly', status: 'Ready', size: '2.1 MB', generated: 'Feb 28, 2026' },
  { id: 4, title: 'Social Media Deep Dive – Q1', period: 'Jan 1–Mar 31, 2026', type: 'Custom', status: 'Ready', size: '3.8 MB', generated: 'Mar 20, 2026' },
  { id: 5, title: 'January 2026 Performance Report', period: 'Jan 1–31, 2026', type: 'Monthly', status: 'Ready', size: '2.2 MB', generated: 'Jan 31, 2026' },
  { id: 6, title: 'SEO Keyword Ranking Report', period: 'Q4 2025', type: 'Custom', status: 'Ready', size: '1.9 MB', generated: 'Jan 10, 2026' },
  { id: 7, title: 'April 2026 Performance Report', period: 'Apr 1–30, 2026', type: 'Monthly', status: 'Generating', size: '—', generated: 'Due Apr 30' },
];

const highlights = [
  { icon: '📈', label: 'Total Reports', value: '24' },
  { icon: '📊', label: 'Reports This Year', value: '7' },
  { icon: '💾', label: 'Total Data', value: '47.3 MB' },
  { icon: '📅', label: 'Next Report', value: 'Apr 30' },
];

export default function PortalReportsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.sub}>Download and review your monthly and quarterly performance reports</p>
        </div>
        <button className={styles.requestBtn}>+ Request Custom Report</button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {highlights.map(h => (
          <div key={h.label} className={styles.statCard}>
            <span className={styles.statIcon}>{h.icon}</span>
            <div>
              <div className={styles.statValue}>{h.value}</div>
              <div className={styles.statLabel}>{h.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className={styles.reportsList}>
        {reports.map(r => (
          <div key={r.id} className={`${styles.reportCard} ${r.status === 'Generating' ? styles.generating : ''}`}>
            <div className={styles.reportLeft}>
              <div className={styles.fileIcon}>
                {r.status === 'Generating' ? '⏳' : '📄'}
              </div>
              <div className={styles.reportInfo}>
                <h4 className={styles.reportTitle}>{r.title}</h4>
                <div className={styles.reportMeta}>
                  <span>📅 {r.period}</span>
                  <span className={styles.dot}>·</span>
                  <span>Generated: {r.generated}</span>
                  <span className={styles.dot}>·</span>
                  <span>{r.size}</span>
                </div>
              </div>
              <span className={`${styles.typeBadge} ${styles[`type${r.type}`]}`}>{r.type}</span>
            </div>
            <div className={styles.reportRight}>
              {r.status === 'Ready' ? (
                <>
                  <button className={styles.previewBtn}>👁 Preview</button>
                  <button className={styles.downloadBtn}>⬇ Download PDF</button>
                </>
              ) : (
                <span className={styles.generatingLabel}>Generating...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
