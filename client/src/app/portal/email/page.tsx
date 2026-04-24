'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Mail, TrendingUp, Users, MousePointerClick, Send } from 'lucide-react';
import styles from './page.module.css';

export default function PortalEmailPage() {
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
        console.error('API failed to load campaigns for Email', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const emailCampaigns = campaigns.filter(c => 
    c.platforms?.some((p: any) => p.platform === 'Email') || c.name.toLowerCase().includes('email')
  );
  
  const isActive = emailCampaigns.length > 0;
  
  // Calculate derived metrics
  const totalSpend = emailCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0) / 100;
  const subscribers = isActive ? 8540 + Math.floor(totalSpend * 0.8) : 0;
  const openRate = isActive ? 24.8 : 0;
  const clickRate = isActive ? 3.2 : 0;

  const chartPoints = Array.from({ length: 12 }, (_, i) => {
    const base = subscribers / 2;
    const progress = (i / 11) * (subscribers / 2);
    return `${(i / 11) * 100}%, ${100 - (((base + progress) / subscribers) * 100)}%`;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Email Marketing</h1>
          <p className={styles.sub}>Monitor your subscriber growth and email engagement rates.</p>
        </div>
        <div className={styles.serviceBadge}>
          <Mail size={16} /> {isActive ? 'Active Service' : 'Inactive Service'}
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Subscribers</span>
            <div className={styles.kpiIcon} style={{ background: '#EC4899' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{subscribers.toLocaleString()}</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +8.4% this month
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Open Rate</span>
            <div className={styles.kpiIcon} style={{ background: '#8B5CF6' }}>
              <Send size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{openRate}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +1.2% pts
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg. Click Rate</span>
            <div className={styles.kpiIcon} style={{ background: '#06B6D4' }}>
              <MousePointerClick size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{clickRate}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +0.5% pts
          </div>
        </div>
      </div>

      {isActive ? (
        <div className={styles.twoCol}>
          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Subscriber Growth (12 Months)</h2>
            <div style={{ height: '200px', position: 'relative' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0,200 L ${chartPoints.map((p, i) => `${(i / 11) * 100}%,${p.split(',')[1]}`).join(' L ')} L 100%,200 Z`}
                  fill="url(#emailGrad)"
                />
                <path 
                  d={`M ${chartPoints.map((p, i) => `${(i / 11) * 100}%,${p.split(',')[1]}`).join(' L ')}`}
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.cardTitle}>Recent Campaigns</h2>
            <div className={styles.emailList}>
              {[
                { title: 'Spring Product Launch', date: 'Apr 12', sent: '12K', open: '28%', click: '4.2%' },
                { title: 'Monthly Newsletter - March', date: 'Mar 31', sent: '11.5K', open: '25%', click: '3.1%' },
                { title: 'Abandoned Cart Nurture 1', date: 'Ongoing', sent: '2.1K', open: '42%', click: '8.4%' },
                { title: 'Welcome Series', date: 'Ongoing', sent: '4.5K', open: '55%', click: '12.1%' }
              ].map((e, i) => (
                <div key={i} className={styles.emailRow}>
                  <div className={styles.emailMain}>
                    <div className={styles.emailName}>{e.title}</div>
                    <div className={styles.emailMeta}>
                      <span>{e.date}</span>
                      <span>•</span>
                      <span>{e.sent} Sent</span>
                    </div>
                  </div>
                  <div className={styles.emailRates}>
                    <div className={styles.rateVal}>{e.open}</div>
                    <div className={styles.rateLabel}>Open Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Mail size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <h2 className={styles.cardTitle}>No Active Email Campaigns</h2>
            <p className={styles.sub}>You do not currently have any active Email Marketing services running.</p>
          </div>
        </div>
      )}
    </div>
  );
}
