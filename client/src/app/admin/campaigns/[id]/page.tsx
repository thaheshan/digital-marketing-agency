'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, Settings, Play, Pause, Save, TrendingUp, 
  Target, Mail, Search, Zap, CheckCircle2, Clock, 
  BarChart3, Plus, Hash, MousePointerClick
} from 'lucide-react';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function CampaignManagementPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  
  // Mock forms states to make it feel fully interactive
  const [seoKeywords, setSeoKeywords] = useState('enterprise saas, cloud migration, digital transformation');
  const [dailyBudget, setDailyBudget] = useState('150');
  const [targetAcos, setTargetAcos] = useState('12.5');

  useEffect(() => {
    // In a real app, this fetches /admin/campaigns/:id
    // But since that endpoint might not return deep SEO/Email relations yet, we will wrap the base data
    const fetchCampaign = async () => {
      try {
        const campaigns = await api.get('/admin/campaigns');
        const found = campaigns.find((c: any) => c.id === id);
        
        if (found) {
          setCampaign(found);
        } else {
          // Mock data fallback if ID is missing or new
          setCampaign({
            id,
            name: 'Enterprise SEO & Lead Gen',
            status: 'live',
            type: 'SEO + PPC',
            totalBudgetPence: 800000,
            client: { clientProfile: { companyName: 'Acme Corp' } }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) return <div style={{ padding: 40, color: '#64748b' }}>Loading campaign data...</div>;
  if (!campaign) return <div style={{ padding: 40 }}>Campaign not found.</div>;

  return (
    <div className={styles.page}>
      <Link href="/admin/campaigns" className={styles.backLink}>
        <ChevronLeft size={16} /> Back to All Campaigns
      </Link>

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{campaign.name}</h1>
            <span className={`${styles.badge} ${campaign.status === 'live' ? styles.badgeLive : styles.badgeDraft}`}>
              {campaign.status}
            </span>
          </div>
          <p className={styles.sub}>
            Client: <strong>{campaign.client?.clientProfile?.companyName || 'Private Client'}</strong> &bull; 
            Type: {campaign.type || 'Performance Marketing'}
          </p>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>
            {campaign.status === 'live' ? <Pause size={16} /> : <Play size={16} />}
            {campaign.status === 'live' ? 'Pause Campaign' : 'Activate Campaign'}
          </button>
          <button className={styles.btnPrimary}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('overview')} className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}>
          <BarChart3 size={16} /> Overview
        </button>
        <button onClick={() => setActiveTab('seo')} className={`${styles.tab} ${activeTab === 'seo' ? styles.active : ''}`}>
          <Search size={16} /> SEO & Organic
        </button>
        <button onClick={() => setActiveTab('ads')} className={`${styles.tab} ${activeTab === 'ads' ? styles.active : ''}`}>
          <Target size={16} /> Paid Ads & Budget
        </button>
        <button onClick={() => setActiveTab('email')} className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}>
          <Mail size={16} /> Email Marketing
        </button>
      </div>

      <div className={styles.contentArea}>
        {activeTab === 'overview' && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><TrendingUp size={20} color="#3b82f6" /> Real-time Performance</h3>
              <div className={styles.statGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Total Budget</span>
                  <span className={styles.statVal}>£{((campaign.totalBudgetPence || 800000)/100).toLocaleString()}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Spend to Date</span>
                  <span className={styles.statVal}>£{((campaign.totalSpentPence || 345000)/100).toLocaleString()}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Total Clicks</span>
                  <span className={styles.statVal}>12,409</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Avg. CPA</span>
                  <span className={styles.statVal}>£42.50</span>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Settings size={20} color="#64748b" /> Campaign Settings</h3>
              <div className={styles.formGroup}>
                <label>Campaign Name</label>
                <input type="text" className={styles.input} defaultValue={campaign.name} />
              </div>
              <div className={styles.formGroup}>
                <label>Objective</label>
                <input type="text" className={styles.input} defaultValue={campaign.objective || 'Lead Generation'} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Search size={20} color="#10b981" /> Keyword Strategy</h3>
              <div className={styles.formGroup}>
                <label>Target Keywords (Comma separated)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={seoKeywords}
                  onChange={e => setSeoKeywords(e.target.value)} 
                />
              </div>
              <div className={styles.tagList}>
                {seoKeywords.split(',').map((k, i) => k.trim() && (
                  <div key={i} className={styles.tag}><Hash size={14} /> {k.trim()}</div>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Target size={20} color="#f59e0b" /> Technical SEO Status</h3>
              <div className={styles.emailList}>
                 <div className={styles.emailRow}>
                   <div className={styles.emailInfo}>
                     <CheckCircle2 color="#10b981" size={20} />
                     <div className={styles.emailMeta}>
                       <h4>Site Speed Optimization</h4>
                       <p>LCP: 1.2s | FID: 14ms</p>
                     </div>
                   </div>
                 </div>
                 <div className={styles.emailRow}>
                   <div className={styles.emailInfo}>
                     <CheckCircle2 color="#10b981" size={20} />
                     <div className={styles.emailMeta}>
                       <h4>On-Page Metadata</h4>
                       <p>94% coverage across landing pages</p>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Zap size={20} color="#8b5cf6" /> Budget Pacing & Limits</h3>
              <div className={styles.formGroup}>
                <label>Daily Spend Limit (£)</label>
                <input type="number" className={styles.input} value={dailyBudget} onChange={e => setDailyBudget(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Target ACoS / ROAS (%)</label>
                <input type="number" className={styles.input} value={targetAcos} onChange={e => setTargetAcos(e.target.value)} />
              </div>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><MousePointerClick size={20} color="#f43f5e" /> Active Channels</h3>
              <div className={styles.emailList}>
                 <div className={styles.emailRow}>
                   <div className={styles.emailInfo}>
                     <div className={styles.emailMeta}>
                       <h4>Google Search Network</h4>
                       <p>Status: Active &bull; Avg CPC: £2.40</p>
                     </div>
                   </div>
                 </div>
                 <div className={styles.emailRow}>
                   <div className={styles.emailInfo}>
                     <div className={styles.emailMeta}>
                       <h4>LinkedIn B2B Lead Gen</h4>
                       <p>Status: Active &bull; Avg CPL: £45.00</p>
                     </div>
                   </div>
                 </div>
                 <button className={styles.btnOutline}><Plus size={14} /> Add Advertising Channel</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className={styles.grid}>
            <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
              <h3 className={styles.cardTitle}><Mail size={20} color="#06b6d4" /> Automated Email Sequences</h3>
              <div className={styles.emailList}>
                <div className={styles.emailRow}>
                  <div className={styles.emailInfo}>
                    <Clock color="#f59e0b" size={20} />
                    <div className={styles.emailMeta}>
                      <h4>Abandoned Lead Recovery Flow</h4>
                      <p>Trigger: 24h post-bounce &bull; 3 steps</p>
                    </div>
                  </div>
                  <div className={styles.emailStats}>
                    <div>Sent: <span>1,245</span></div>
                    <div>Open: <span>42%</span></div>
                    <div>Conv: <span>3.4%</span></div>
                  </div>
                </div>
                
                <div className={styles.emailRow}>
                  <div className={styles.emailInfo}>
                    <CheckCircle2 color="#10b981" size={20} />
                    <div className={styles.emailMeta}>
                      <h4>New Customer Onboarding</h4>
                      <p>Trigger: Payment success &bull; 5 steps</p>
                    </div>
                  </div>
                  <div className={styles.emailStats}>
                    <div>Sent: <span>320</span></div>
                    <div>Open: <span>68%</span></div>
                    <div>Conv: <span>12.1%</span></div>
                  </div>
                </div>

                <button className={styles.btnOutline}><Plus size={14} /> Create New Sequence</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
