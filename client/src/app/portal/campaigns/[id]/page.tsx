'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useCampaignStore } from '@/store';
import styles from './page.module.css';

type Tab = 'overview' | 'performance' | 'audiences' | 'creative' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'performance', label: 'Performance' },
  { id: 'audiences', label: 'Audiences' },
  { id: 'creative', label: 'Creative' },
  { id: 'settings', label: 'Settings' },
];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 3 }} />
    </div>
  );
}

function LineChart({ data }: { data: { date: string; clicks: number; conversions: number }[] }) {
  const maxClicks = Math.max(...data.map(d => d.clicks));
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 580;
    const y = 100 - (d.clicks / maxClicks) * 90;
    return `${x},${y}`;
  });
  const pts2 = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 580;
    const maxC = Math.max(...data.map(d => d.conversions));
    const y = 100 - (d.conversions / maxC) * 90;
    return `${x},${y}`;
  });
  const showEvery = Math.ceil(data.length / 6);
  return (
    <svg viewBox="0 0 580 110" width="100%" height={140} style={{ display: 'block' }}>
      <polyline fill="none" stroke="#06B6D4" strokeWidth="2" points={pts.join(' ')} />
      <polyline fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="4 3" points={pts2.join(' ')} />
      {data.filter((_, i) => i % showEvery === 0 || i === data.length - 1).map((d, i, arr) => {
        const origIdx = data.indexOf(d);
        const x = (origIdx / (data.length - 1)) * 580;
        return <text key={i} x={x} y={110} textAnchor="middle" fontSize={9} fill="#94a3b8">{d.date}</text>;
      })}
    </svg>
  );
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getCampaign } = useCampaignStore();
  const campaign = getCampaign(id);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!campaign) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <p>Campaign not found.</p>
        <Link href="/portal/campaigns">← Back to campaigns</Link>
      </div>
    );
  }

  const spentPct = Math.round((campaign.spent / campaign.budget) * 100);
  const statusColor = campaign.status === 'Active' ? '#22c55e' : campaign.status === 'Paused' ? '#f59e0b' : '#94a3b8';

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topBar}>
        <Link href="/portal/campaigns" className={styles.backLink}><ArrowLeft size={15} /> Campaigns</Link>
        <div className={styles.topHeader}>
          <div>
            <h1 className={styles.campaignName}>{campaign.name}</h1>
            <div className={styles.campaignMeta}>
              <span className={styles.channelBadge}>{campaign.channel}</span>
              <span className={styles.statusBadge} style={{ background: `${statusColor}15`, color: statusColor }}>
                {campaign.status}
              </span>
              <span className={styles.dateRange}>{campaign.startDate} → {campaign.endDate}</span>
            </div>
          </div>
          <div className={styles.budgetWidget}>
            <div className={styles.budgetRow}>
              <span className={styles.budgetLabel}>Budget used</span>
              <span className={styles.budgetPct}>{spentPct}%</span>
            </div>
            <div className={styles.budgetTrack}>
              <div className={styles.budgetFill}
                style={{ width: `${spentPct}%`, background: spentPct > 90 ? '#ef4444' : spentPct > 70 ? '#f59e0b' : '#22c55e' }} />
            </div>
            <div className={styles.budgetNums}>
              <span>£{campaign.spent.toLocaleString()} spent</span>
              <span>£{campaign.budget.toLocaleString()} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className={styles.section}>
          <div className={styles.kpiGrid}>
            {campaign.kpis.map(kpi => (
              <div key={kpi.label} className={styles.kpiCard}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <strong className={styles.kpiValue}>{kpi.value}</strong>
                <span className={`${styles.kpiChange} ${kpi.positive ? styles.pos : styles.neg}`}>
                  {kpi.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{kpi.change}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.goalSection}>
            <h3 className={styles.subTitle}>Campaign Goals</h3>
            <div className={styles.goalsGrid}>
              {campaign.goals.map(g => {
                const pct = Math.round((g.current / g.target) * 100);
                const gColor = g.status === 'exceeding' ? '#22c55e' : g.status === 'on-track' ? '#06b6d4' : g.status === 'at-risk' ? '#f59e0b' : '#ef4444';
                return (
                  <div key={g.label} className={styles.goalCard}>
                    <div className={styles.goalTop}>
                      <span>{g.label}</span>
                      <span style={{ color: gColor, fontWeight: 700, fontSize: 12 }}>{g.status.replace('-', ' ')}</span>
                    </div>
                    <div className={styles.goalNums}>
                      <strong style={{ color: gColor }}>{g.unit}{typeof g.current === 'number' && g.current > 1000 ? g.current.toLocaleString() : g.current}</strong>
                      <span>/ {g.unit}{g.target.toLocaleString()}</span>
                    </div>
                    <div className={styles.goalTrack}>
                      <div className={styles.goalFill} style={{ width: `${Math.min(pct, 100)}%`, background: gColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className={styles.section}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.subTitle}>30-Day Trend</h3>
              <div className={styles.chartLegend}>
                <span><span className={styles.legendDot} style={{ background: '#06B6D4' }} />Clicks</span>
                <span><span className={styles.legendDot} style={{ background: '#F97316', border: '1px dashed #F97316' }} />Conversions</span>
              </div>
            </div>
            <LineChart data={campaign.chartData} />
          </div>

          <div className={styles.threeGrid}>
            <div className={styles.miniCard}>
              <h4>Platform Breakdown</h4>
              {campaign.platformBreakdown.map(p => (
                <div key={p.label} className={styles.barRow}>
                  <span className={styles.barLabel}>{p.label}</span>
                  <MiniBar value={p.pct} max={100} color={p.color} />
                  <span className={styles.barPct}>{p.pct}%</span>
                </div>
              ))}
            </div>

            <div className={styles.miniCard}>
              <h4>Device Split</h4>
              {campaign.deviceBreakdown.map(d => (
                <div key={d.label} className={styles.barRow}>
                  <span className={styles.barLabel}>{d.label}</span>
                  <MiniBar value={d.pct} max={100} color="#0f172a" />
                  <span className={styles.barPct}>{d.pct}%</span>
                </div>
              ))}
            </div>

            <div className={styles.miniCard}>
              <h4>Funnel Overview</h4>
              {campaign.funnel.slice(0, 4).map((f, i) => (
                <div key={f.label} className={styles.funnelRow}>
                  <span className={styles.funnelLabel}>{f.label}</span>
                  <strong className={styles.funnelVal}>{f.value.toLocaleString()}</strong>
                  {f.dropPct && <span className={styles.funnelDrop}>-{f.dropPct}%</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audiences' && (
        <div className={styles.section}>
          <div className={styles.twoGrid}>
            <div className={styles.card}>
              <h3 className={styles.subTitle}>Age Distribution</h3>
              <div className={styles.ageList}>
                {campaign.audienceAge.map(a => (
                  <div key={a.range} className={styles.barRow}>
                    <span className={styles.barLabel}>{a.range}</span>
                    <MiniBar value={a.pct} max={50} color="#06B6D4" />
                    <span className={styles.barPct}>{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <h3 className={styles.subTitle}>Gender Breakdown</h3>
              <div className={styles.genderBars}>
                <div className={styles.genderBar}>
                  <span>Female</span>
                  <MiniBar value={58} max={100} color="#E879F9" />
                  <span>58%</span>
                </div>
                <div className={styles.genderBar}>
                  <span>Male</span>
                  <MiniBar value={38} max={100} color="#60A5FA" />
                  <span>38%</span>
                </div>
                <div className={styles.genderBar}>
                  <span>Other</span>
                  <MiniBar value={4} max={100} color="#A78BFA" />
                  <span>4%</span>
                </div>
              </div>
              <h3 className={styles.subTitle} style={{ marginTop: 24 }}>Top Interests</h3>
              <div className={styles.interestTags}>
                {['Fashion', 'Beauty', 'Fitness', 'Travel', 'Food & Dining', 'Technology', 'Home Decor'].map(t => (
                  <span key={t} className={styles.interestTag}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'creative' && (
        <div className={styles.section}>
          {campaign.topCreatives.length === 0 ? (
            <div className={styles.emptyState}>No creative assets available for this campaign type.</div>
          ) : (
            <>
              <h3 className={styles.subTitle}>Top Performing Creatives</h3>
              <div className={styles.creativesGrid}>
                {campaign.topCreatives.map(c => (
                  <div key={c.id} className={styles.creativeCard}>
                    <div className={styles.creativeThumb}><span>{c.name[0]}</span></div>
                    <div className={styles.creativeInfo}>
                      <strong>{c.name}</strong>
                      <div className={styles.creativeMetrics}>
                        <span>CTR <strong>{c.ctr}</strong></span>
                        <span>Conv. <strong>{c.conv}</strong></span>
                        <span>Spend <strong>{c.spend}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.abTestPanel}>
                <h3 className={styles.subTitle}>A/B Test Results</h3>
                <div className={styles.abGrid}>
                  <div className={styles.abCard}>
                    <div className={styles.abHeader}><span className={styles.abWinner}>Winner ✓</span>Variant A — Video Ad</div>
                    <div className={styles.abMetrics}>
                      <span>CTR <strong>3.2%</strong></span>
                      <span>Conv Rate <strong>4.8%</strong></span>
                    </div>
                  </div>
                  <div className={styles.abCard}>
                    <div className={styles.abHeader}><span className={styles.abLoser}>Challenger</span>Variant B — Static Image</div>
                    <div className={styles.abMetrics}>
                      <span>CTR <strong>2.1%</strong></span>
                      <span>Conv Rate <strong>3.1%</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className={styles.section}>
          <div className={styles.settingsGrid}>
            <div className={styles.settingBlock}>
              <h3>Campaign Details</h3>
              <div className={styles.settingRows}>
                <div className={styles.settingRow}><span>Name</span><strong>{campaign.name}</strong></div>
                <div className={styles.settingRow}><span>Channel</span><strong>{campaign.channel}</strong></div>
                <div className={styles.settingRow}><span>Status</span><strong>{campaign.status}</strong></div>
                <div className={styles.settingRow}><span>Start Date</span><strong>{campaign.startDate}</strong></div>
                <div className={styles.settingRow}><span>End Date</span><strong>{campaign.endDate}</strong></div>
              </div>
            </div>
            <div className={styles.settingBlock}>
              <h3>Budget & Billing</h3>
              <div className={styles.settingRows}>
                <div className={styles.settingRow}><span>Total Budget</span><strong>£{campaign.budget.toLocaleString()}</strong></div>
                <div className={styles.settingRow}><span>Spent</span><strong>£{campaign.spent.toLocaleString()}</strong></div>
                <div className={styles.settingRow}><span>Remaining</span><strong>£{(campaign.budget - campaign.spent).toLocaleString()}</strong></div>
                <div className={styles.settingRow}><span>Daily Budget</span><strong>£{Math.round(campaign.budget / 30).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
          <div className={styles.readOnlyNote}>
            ⓘ Settings are read-only. Contact your account manager to make changes.
          </div>
        </div>
      )}
    </div>
  );
}
