'use client';

import { useState } from 'react';
import styles from './page.module.css';

const performanceData = [
  { label: 'SEO Traffic', value: '12.4K', change: '+14%', color: 'var(--color-secondary)' },
  { label: 'PPC Leads', value: '482', change: '+8%', color: 'var(--color-accent)' },
  { label: 'Social Reach', value: '142K', change: '+22%', color: '#8B5CF6' },
  { label: 'Email CTR', value: '3.2%', change: '-2%', color: '#F97316' },
];

const chartBars = [
  { label: 'W1', value: 65 },
  { label: 'W2', value: 45 },
  { label: 'W3', value: 85 },
  { label: 'W4', value: 70 },
  { label: 'W5', value: 95 },
  { label: 'W6', value: 60 },
  { label: 'W7', value: 75 },
  { label: 'W8', value: 90 },
];

const trafficSources = [
  { source: 'Direct', percentage: 35, color: 'var(--color-secondary)' },
  { source: 'Search', percentage: 40, color: 'var(--color-accent)' },
  { source: 'Social', percentage: 15, color: '#8B5CF6' },
  { source: 'Referral', percentage: 10, color: '#F97316' },
];

export default function PortalAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Detailed Analytics</h1>
          <p className={styles.sub}>Deep dive into your campaign performance and traffic metrics.</p>
        </div>
        <div className={styles.headerActions}>
          <select 
            className={styles.timeSelect}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>
          <button className={styles.exportBtn}>📥 Export Data</button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className={styles.performanceGrid}>
        {performanceData.map((item) => (
          <div key={item.label} className={styles.perfCard}>
            <div className={styles.perfLabel}>{item.label}</div>
            <div className={styles.perfValue} style={{ color: item.color }}>{item.value}</div>
            <div className={`${styles.perfChange} ${item.change.startsWith('+') ? styles.plus : styles.minus}`}>
              {item.change} vs last period
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Trend Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Traffic Trends</h3>
            <div className={styles.legend}>
              <span className={styles.dot} style={{ background: 'var(--color-secondary)' }}></span>
              Total Sessions
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.yAxis}>
              <span>100K</span>
              <span>75K</span>
              <span>50K</span>
              <span>25K</span>
              <span>0</span>
            </div>
            <div className={styles.bars}>
              {chartBars.map((bar) => (
                <div key={bar.label} className={styles.barItem}>
                  <div className={styles.barWrapper}>
                    <div 
                      className={styles.barFill} 
                      style={{ height: `${bar.value}%` }}
                    >
                      <span className={styles.tooltip}>{bar.value}K</span>
                    </div>
                  </div>
                  <span className={styles.barLabel}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Traffic Sources</h3>
          </div>
          <div className={styles.sourcesList}>
            {trafficSources.map((src) => (
              <div key={src.source} className={styles.sourceItem}>
                <div className={styles.sourceInfo}>
                  <span className={styles.sourceName}>{src.source}</span>
                  <span className={styles.sourcePct}>{src.percentage}%</span>
                </div>
                <div className={styles.progressBg}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${src.percentage}%`, background: src.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.donutPlaceholder}>
             {/* Simple CSS-based visualization of 4 components */}
             <div className={styles.donut}>
                <div className={styles.segment} style={{ '--deg': '0deg', '--pct': '35%', '--color': trafficSources[0].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '126deg', '--pct': '40%', '--color': trafficSources[1].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '270deg', '--pct': '15%', '--color': trafficSources[2].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '324deg', '--pct': '10%', '--color': trafficSources[3].color } as any}></div>
                <div className={styles.donutCenter}>
                    <strong>12.4K</strong>
                    <span>Sessions</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Top Performing Channels */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Channel Performance Breakdown</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Sessions</th>
                <th>Bounce Rate</th>
                <th>Avg. Session Duration</th>
                <th>Goal Completions</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.bold}>Organic Search</td>
                <td>5,842</td>
                <td>42.5%</td>
                <td>3m 42s</td>
                <td>248</td>
                <td className={styles.positive}>4.2%</td>
              </tr>
              <tr>
                <td className={styles.bold}>Paid Search</td>
                <td>3,120</td>
                <td>54.2%</td>
                <td>1m 12s</td>
                <td>112</td>
                <td className={styles.mid}>3.5%</td>
              </tr>
              <tr>
                <td className={styles.bold}>Social Media</td>
                <td>1,850</td>
                <td>68.4%</td>
                <td>0m 48s</td>
                <td>42</td>
                <td className={styles.low}>2.2%</td>
              </tr>
              <tr>
                <td className={styles.bold}>Email Marketing</td>
                <td>940</td>
                <td>28.1%</td>
                <td>2m 15s</td>
                <td>65</td>
                <td className={styles.positive}>6.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
