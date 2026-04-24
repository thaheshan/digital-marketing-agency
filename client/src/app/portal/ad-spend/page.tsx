'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PoundSterling, TrendingUp, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';

export default function PortalAdSpendPage() {
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
        console.error('API failed to load campaigns for ad spend', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'live');
  
  const totalBudgetPence = activeCampaigns.reduce((sum, c) => sum + (c.totalBudgetPence || 0), 0);
  const totalSpentPence = activeCampaigns.reduce((sum, c) => sum + (c.totalSpentPence || 0), 0);
  
  const budget = totalBudgetPence / 100;
  const spent = totalSpentPence / 100;
  const remaining = Math.max(budget - spent, 0);
  const progressPercent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Ad Spend</h1>
          <p className={styles.sub}>Track your budget pacing across all active campaigns.</p>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryTitle}>Total Spent</span>
            <div className={styles.summaryIcon} style={{ background: '#3B82F6' }}>
              <PoundSterling size={20} />
            </div>
          </div>
          <div className={styles.summaryValue}>£{spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`${styles.summaryTrend} ${styles.trendPositive}`}>
            <TrendingUp size={14} /> +12% vs last month
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryTitle}>Remaining Budget</span>
            <div className={styles.summaryIcon} style={{ background: '#10B981' }}>
              <PoundSterling size={20} />
            </div>
          </div>
          <div className={styles.summaryValue}>£{remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`${styles.summaryTrend} ${styles.trendNeutral}`}>
            Out of £{budget.toLocaleString()} total
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryTitle}>Run Rate</span>
            <div className={styles.summaryIcon} style={{ background: '#F59E0B' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className={styles.summaryValue}>{progressPercent.toFixed(1)}%</div>
          <div className={`${styles.summaryTrend} ${styles.trendNeutral}`}>
            Of monthly allocated budget used
          </div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Overall Budget Pacing</h2>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%`, background: progressPercent > 90 ? '#EF4444' : progressPercent > 75 ? '#F59E0B' : '#3B82F6' }} />
        </div>
        <div className={styles.progressLabels}>
          <span>£{spent.toLocaleString()} spent</span>
          <span>£{budget.toLocaleString()} total limit</span>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.chartTitle}>Campaign Spend Breakdown</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Spent</th>
              <th>Budget Limit</th>
              <th>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5}>Loading...</td></tr>
            ) : activeCampaigns.length === 0 ? (
              <tr><td colSpan={5}>No active campaigns found.</td></tr>
            ) : activeCampaigns.map(c => {
              const cBudget = (c.totalBudgetPence || 0) / 100;
              const cSpent = (c.totalSpentPence || 0) / 100;
              const cProg = cBudget > 0 ? (cSpent / cBudget) * 100 : 0;
              return (
                <tr key={c.id} className={styles.tr}>
                  <td>{c.name}</td>
                  <td><span className={styles.statusActive}>Active</span></td>
                  <td className={styles.mono}>£{cSpent.toLocaleString()}</td>
                  <td className={styles.mono}>£{cBudget.toLocaleString()}</td>
                  <td className={styles.mono}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(cProg, 100)}%`, background: cProg > 90 ? '#EF4444' : '#10B981' }} />
                      </div>
                      {cProg.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
