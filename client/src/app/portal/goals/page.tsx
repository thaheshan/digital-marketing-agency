'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Target } from 'lucide-react';
import styles from './page.module.css';

export default function PortalGoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        const res = await api.get<any>('/portal/goals');
        if (res.goals) {
          setGoals(res.goals);
        }
      } catch (e) {
        console.error('API failed to load goals', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadGoals();
  }, []);

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'on_track': return styles.statusOnTrack;
      case 'needs_attention': return styles.statusNeedsAttention;
      case 'missed': return styles.statusMissed;
      case 'exceeding': return styles.statusExceeding;
      default: return styles.statusNotStarted;
    }
  };

  const getProgressColor = (status: string) => {
    switch(status) {
      case 'on_track': return '#22C55E';
      case 'needs_attention': return '#F59E0B';
      case 'missed': return '#EF4444';
      case 'exceeding': return '#3B82F6';
      default: return '#94A3B8';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Goals & KPIs</h1>
          <p className={styles.sub}>Track performance targets across all active campaigns.</p>
        </div>
      </div>

      <div className={styles.goalsGrid}>
        {isLoading ? (
          <div>Loading goals...</div>
        ) : goals.length === 0 ? (
          <div>No goals found for your active campaigns.</div>
        ) : goals.map(g => {
          const current = Number(g.currentValue);
          const target = Number(g.targetValue);
          const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
          
          return (
            <div key={g.id} className={styles.goalCard}>
              <div className={styles.goalTop}>
                <div>
                  <div className={styles.goalTitle}>{g.metricName}</div>
                  <div className={styles.goalCampaign}>{g.campaign?.name}</div>
                </div>
                <span className={`${styles.statusPill} ${getStatusClass(g.status)}`}>
                  {formatStatus(g.status)}
                </span>
              </div>
              
              <div className={styles.goalMetrics}>
                <div className={styles.goalCurrent}>
                  {g.unit === '£' ? `£${current.toLocaleString()}` : g.unit === '%' ? `${current}%` : current.toLocaleString()}
                </div>
                <div className={styles.goalTarget}>
                  Target: {g.unit === '£' ? `£${target.toLocaleString()}` : g.unit === '%' ? `${target}%` : target.toLocaleString()}
                </div>
              </div>

              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${percent}%`, background: getProgressColor(g.status) }} 
                />
              </div>

              <div className={styles.goalPeriod}>
                <Target size={14} /> {g.period}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
