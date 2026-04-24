'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Award, TrendingUp, DollarSign, Target, Lightbulb } from 'lucide-react';
import styles from './page.module.css';

export default function PortalPerformancePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get<any>('/portal/dashboard');
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to fetch performance data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className={styles.page}>Loading performance summary...</div>;
  if (!data) return <div className={styles.page}>No performance data available.</div>;

  const kpis = [
    { label: 'Overall ROI', value: data.kpis.roi, trend: '+2.4%', icon: TrendingUp },
    { label: 'Revenue Attributed', value: data.kpis.revenueAttributed, trend: '+12.1%', icon: DollarSign },
    { label: 'Marketing Efficiency', value: '4.8x', trend: '+0.3x', icon: Award },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Executive Summary</h1>
        <p className={styles.sub}>High-level marketing performance and strategic ROI overview.</p>
      </header>

      <div className={styles.summaryGrid}>
        {kpis.map((kpi, i) => (
          <div key={i} className={styles.summaryCard}>
            <div className={styles.cardLabel}>{kpi.label}</div>
            <div className={styles.cardValue}>{kpi.value}</div>
            <div className={styles.cardTrend}>
                <span className={styles.positive}>{kpi.trend}</span>
                <span style={{opacity: 0.6}}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Core Strategic Goals</h2>
        <div className={styles.goalGrid}>
          {[
            { name: 'Lead Generation Volume', target: '1,500', current: data.kpis.leadsGenerated.replace(/,/g, ''), unit: 'Leads' },
            { name: 'Customer Acquisition Cost', target: '£15.00', current: '18.50', unit: '£/Lead', inverse: true },
            { name: 'Organic Brand Visibility', target: '50,000', current: data.kpis.organicTraffic.replace(/,/g, ''), unit: 'Sessions' },
          ].map((goal, i) => {
            const current = parseFloat(goal.current);
            const target = parseFloat(goal.target.replace(/[^0-9.]/g, ''));
            let pct = (current / target) * 100;
            if (goal.inverse) pct = (target / current) * 100;
            pct = Math.min(Math.round(pct), 100);

            return (
              <div key={i} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <span className={styles.goalName}>{goal.name}</span>
                  <span className={`${styles.goalStatus} ${styles.statusOnTrack}`}>On Track</span>
                </div>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className={styles.progressMeta}>
                    <span>Current: {goal.unit === '£/Lead' ? `£${goal.current}` : parseFloat(goal.current).toLocaleString()}</span>
                    <span>Target: {goal.target}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.insightCard}>
        <div className={styles.insightTitle}>
          <Lightbulb size={20} />
          Strategic Insight
        </div>
        <p className={styles.insightText}>
          Your "Paid Search" campaigns are currently delivering the highest ROI at 5.2x, 
          driven by strong performance in the Brand Awareness category. We recommend 
          increasing budget by 15% next month to capture remaining market share.
        </p>
      </div>
    </div>
  );
}
