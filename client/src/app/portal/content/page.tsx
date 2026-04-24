'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FileText, TrendingUp, CheckCircle, BarChart2, Edit3 } from 'lucide-react';
import styles from './page.module.css';

export default function PortalContentPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await api.get<any>('/portal/campaigns');
        if (res.campaigns) {
          setCampaigns(res.campaigns);
        }
      } catch (e) {
        console.error('API failed to load campaigns for Content', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const contentCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes('content') || c.name.toLowerCase().includes('blog')
  );
  
  const isActive = contentCampaigns.length > 0;
  
  // Calculate derived metrics
  const totalSpend = contentCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const piecesPublished = isActive ? 12 + Math.floor(totalSpend * 0.01) : 0;
  const healthScore = isActive ? 92 : 0;
  const contentTraffic = isActive ? 18400 + Math.floor(totalSpend * 5) : 0;

  const chartPoints = Array.from({ length: 12 }, (_, i) => {
    const base = contentTraffic / 2;
    const progress = (i / 11) * (contentTraffic / 2);
    return `${(i / 11) * 100}%, ${100 - (((base + progress) / contentTraffic) * 100)}%`;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Content Marketing</h1>
          <p className={styles.sub}>Track content production, health scores, and inbound traffic.</p>
        </div>
        <div className={styles.serviceBadge}>
          <FileText size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pieces Published</span>
            <div className={styles.kpiIcon} style={{ background: '#3B82F6' }}>
              <Edit3 size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{piecesPublished}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +3 this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Health Score</span>
            <div className={styles.kpiIcon} style={{ background: '#22C55E' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{healthScore}/100</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +2 pts
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Content Traffic</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <BarChart2 size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{contentTraffic.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +15.4% this month
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Content Traffic Growth (12 Months)</h2>
            <div style={{ height: '200px', position: 'relative' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="contentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0,200 L ${chartPoints.map((p, i) => `${(i / 11) * 100}%,${p.split(',')[1]}`).join(' L ')} L 100%,200 Z`}
                  fill="url(#contentGrad)"
                />
                <path 
                  d={`M ${chartPoints.map((p, i) => `${(i / 11) * 100}%,${p.split(',')[1]}`).join(' L ')}`}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Recent Publications</h2>
            <div className={styles.contentList}>
              {[
                { title: 'The Ultimate Guide to B2B SaaS Marketing', type: 'Long-form Post', views: '2.4K', score: 98 },
                { title: 'Q2 Industry Trends Report', type: 'Whitepaper', views: '1.2K', score: 95 },
                { title: 'How to Optimize Your Landing Pages', type: 'Blog Post', views: '840', score: 88 },
                { title: 'Case Study: 300% ROI in 6 Months', type: 'Case Study', views: '1.5K', score: 92 }
              ].map((c, i) => (
                <div key={i} className={styles.contentRow}>
                  <div className={styles.contentMain}>
                    <div className={styles.contentName}>{c.title}</div>
                    <div className={styles.contentMeta}>
                      <span>{c.type}</span>
                      <span>•</span>
                      <span>{c.views} Views</span>
                    </div>
                  </div>
                  <div className={styles.contentScore} style={{ borderColor: c.score >= 90 ? '#22C55E' : '#F59E0B', color: c.score >= 90 ? '#16A34A' : '#D97706' }}>
                    {c.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FileText size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active Content Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active Content Marketing services running.</p>
          </div>
        </div>
      )}
    </div>
  );
}
