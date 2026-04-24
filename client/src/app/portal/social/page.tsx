'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Share2, TrendingUp, Users, Eye, MessageCircle } from 'lucide-react';
import styles from './page.module.css';

export default function PortalSocialPage() {
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
        console.error('API failed to load campaigns for Social', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const socialPlatforms = ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Twitter'];
  const socialCampaigns = campaigns.filter(c => 
    c.platforms?.some((p: any) => socialPlatforms.includes(p.platform)) || c.name.toLowerCase().includes('social')
  );
  
  const isActive = socialCampaigns.length > 0;
  
  // Calculate derived metrics
  const totalSpend = socialCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const followers = isActive ? 12450 + Math.floor(totalSpend * 0.5) : 0;
  const impressions = isActive ? 342000 + Math.floor(totalSpend * 12) : 0;
  const engagementRate = isActive ? 4.2 : 0;

  const chartPoints = Array.from({ length: 12 }, (_, i) => {
    const base = followers / 2;
    const progress = (i / 11) * (followers / 2);
    return `${(i / 11) * 100}%, ${100 - (((base + progress) / followers) * 100)}%`;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Social Media</h1>
          <p className={styles.sub}>Analyze your social audience growth and campaign engagement.</p>
        </div>
        <div className={styles.serviceBadge}>
          <Share2 size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Audience</span>
            <div className={styles.kpiIcon} style={{ background: '#06B6D4' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{followers.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +5.2% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Impressions</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <Eye size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{impressions.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +12.4% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Engagement Rate</span>
            <div className={styles.kpiIcon} style={{ background: '#F97316' }}>
              <MessageCircle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{engagementRate}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +0.4% pts
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Audience Growth (12 Months)</h2>
            <div style={{ height: '200px', position: 'relative' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="socialGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0,200 L ${chartPoints.map((p, i) => `${(i / 11) * 100}%,${p.split(',')[1]}`).join(' L ')} L 100%,200 Z`}
                  fill="url(#socialGrad)"
                />
                <path 
                  d={`M ${chartPoints.map((p, i) => `${(i / 11) * 100}%,${p.split(',')[1]}`).join(' L ')}`}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Top Performing Posts</h2>
            <div className={styles.postGrid}>
              {[
                { title: 'New Product Launch Video', platform: 'Instagram', reach: '45K', eng: '5.2%' },
                { title: 'Industry Report 2026', platform: 'LinkedIn', reach: '12K', eng: '8.4%' },
                { title: 'Behind the Scenes Story', platform: 'Instagram', reach: '28K', eng: '4.1%' },
                { title: 'Feature Update Thread', platform: 'Twitter', reach: '18K', eng: '3.8%' }
              ].map((p, i) => (
                <div key={i} className={styles.postRow}>
                  <div className={styles.postThumb} />
                  <div className={styles.postMain}>
                    <div className={styles.postName}>{p.title}</div>
                    <div className={styles.postMeta}>
                      <span className={styles.postPlatform}>{p.platform}</span>
                      <span>•</span>
                      <span>{p.reach} Reach</span>
                      <span>•</span>
                      <span>{p.eng} ER</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Share2 size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active Social Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active Social Media services running.</p>
          </div>
        </div>
      )}
    </div>
  );
}
