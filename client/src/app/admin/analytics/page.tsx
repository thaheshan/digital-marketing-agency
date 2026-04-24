'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Zap, ArrowUpRight, PoundSterling, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('90d');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [customDays, setCustomDays] = useState('90');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await api.get(`/admin/analytics?range=${range}`);
        setData(result);
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  const handleCustomRange = (days: string) => {
    setCustomDays(days);
    setRange(`${days}d`);
  };

  if (loading && !data) return <div className={styles.loading}>Analyzing agency data...</div>;

  const points = data?.revenueHistory || [];
  const maxVal = Math.max(...points.map((p: any) => p.value), 1000);
  const chartHeight = 200;
  const chartWidth = 800;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agency Analytics</h1>
          <p className={styles.sub}>Deep-dive into cross-channel performance and revenue intelligence.</p>
        </div>
        <div className={styles.timeRange}>
          {['7d', '30d', '60d', '90d', '12m', 'all'].map(r => (
            <button 
              key={r}
              className={`${styles.rangeBtn} ${range === r ? styles.active : ''}`}
              onClick={() => setRange(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.iconBox} style={{ background: '#06b6d4' }}><PoundSterling size={20} /></div>
            <span className={styles.trend}>+12.5%</span>
          </div>
          <span className={styles.metricValue}>£{(data.pipelineValue || 0).toLocaleString()}</span>
          <span className={styles.metricLabel}>Total Pipeline Value</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.iconBox} style={{ background: '#f59e0b' }}><Target size={20} /></div>
            <span className={styles.trend}>+4.2%</span>
          </div>
          <span className={styles.metricValue}>{data.avgRoi}x</span>
          <span className={styles.metricLabel}>Avg. Account ROI</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={styles.iconBox} style={{ background: '#10b981' }}><Users size={20} /></div>
            <span className={styles.trend}>+18.1%</span>
          </div>
          <span className={styles.metricValue}>{(data.totalImpressions / 1000).toFixed(0)}k</span>
          <span className={styles.metricLabel}>Total Impressions</span>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
             <h2 className={styles.chartTitle}>Revenue Growth vs Target</h2>
             <span className={styles.chartMeta}>Live Data Pipeline: {range.toUpperCase()} Window</span>
          </div>
          <div className={styles.chartContainer} onMouseLeave={() => setHoverIndex(null)}>
             <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Grid Lines */}
                {[0, 1, 2, 3].map(i => (
                  <line 
                    key={i} 
                    x1="0" y1={i * 50} x2={chartWidth} y2={i * 50} 
                    stroke="#f1f5f9" strokeWidth="1" 
                  />
                ))}
                
                {/* The Line */}
                <path 
                  d={points.map((p: any, i: number) => {
                    const x = (i / (points.length - 1)) * chartWidth;
                    const y = chartHeight - (p.value / maxVal) * chartHeight;
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  }).join(' ')} 
                  fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                />

                {/* Interaction Points */}
                {points.map((p: any, i: number) => {
                   const x = (i / (points.length - 1)) * chartWidth;
                   return (
                     <rect 
                       key={i} 
                       x={x - 10} y="0" width="20" height={chartHeight} 
                       fill="transparent" 
                       onMouseEnter={() => setHoverIndex(i)}
                     />
                   );
                })}

                {/* Hover Indicator */}
                {hoverIndex !== null && points[hoverIndex] && (
                  <>
                    <line 
                      x1={(hoverIndex / (points.length - 1)) * chartWidth} 
                      y1="0" 
                      x2={(hoverIndex / (points.length - 1)) * chartWidth} 
                      y2={chartHeight} 
                      stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" 
                    />
                    <circle 
                      cx={(hoverIndex / (points.length - 1)) * chartWidth} 
                      cy={chartHeight - (points[hoverIndex].value / maxVal) * chartHeight} 
                      r="6" fill="#F97316" stroke="#fff" strokeWidth="2" 
                    />
                  </>
                )}
             </svg>

             {/* Custom Tooltip */}
             {hoverIndex !== null && points[hoverIndex] && (
               <div 
                 className={styles.tooltip}
                 style={{ 
                   left: `${(hoverIndex / (points.length - 1)) * 100}%`,
                   transform: `translateX(${hoverIndex > points.length / 2 ? '-100%' : '0'})`
                 }}
               >
                 <div className={styles.tooltipDate}>{points[hoverIndex].date}</div>
                 <div className={styles.tooltipValue}>£{points[hoverIndex].value.toLocaleString()}</div>
               </div>
             )}
          </div>
          <div className={styles.chartXLabels}>
            {points.filter((_: any, i: number) => i % Math.ceil(points.length / 6) === 0).map((p: any, i: number) => (
              <span key={i}>{p.date}</span>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
             <h2 className={styles.chartTitle}>Channel Efficiency</h2>
             <span className={styles.chartMeta}>ROI per Marketing Channel</span>
          </div>
          <div className={styles.barList}>
             {data.channelEfficiency.map((item: any) => (
               <div key={item.name} className={styles.barItem}>
                 <div className={styles.barInfo}>
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                 </div>
                 <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${item.value}%`, background: '#F97316' }} />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
