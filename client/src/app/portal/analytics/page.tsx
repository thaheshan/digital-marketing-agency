'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function PortalAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get<any>('/portal/analytics');
        if (res.analytics) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (isLoading) return <div className={styles.page}>Loading analytics...</div>;
  if (!data) return <div className={styles.page}>No analytics data available.</div>;

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
        {data.performanceData.map((item: any) => (
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
              {data.chartBars.map((bar: any) => (
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
            {data.trafficSources.map((src: any) => (
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
             <div className={styles.donut}>
                <div className={styles.segment} style={{ '--deg': '0deg', '--pct': '35%', '--color': data.trafficSources[0].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '126deg', '--pct': '40%', '--color': data.trafficSources[1].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '270deg', '--pct': '15%', '--color': data.trafficSources[2].color } as any}></div>
                <div className={styles.segment} style={{ '--deg': '324deg', '--pct': '10%', '--color': data.trafficSources[3].color } as any}></div>
                <div className={styles.donutCenter}>
                    <strong>{data.performanceData[0].value}</strong>
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
              {data.channelPerformance.map((row: any, i: number) => (
                <tr key={i}>
                  <td className={styles.bold}>{row.channel}</td>
                  <td>{row.sessions}</td>
                  <td>{row.bounce}</td>
                  <td>{row.duration}</td>
                  <td>{row.goals}</td>
                  <td className={styles.positive}>{row.cvr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
