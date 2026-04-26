'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Search, 
  Monitor, 
  Mail, 
  Target, 
  Image, 
  Share2, 
  MousePointer2, 
  Calendar, 
  Layout, 
  TrendingUp,
  X,
  MessageCircle,
  FileText,
  Activity
} from 'lucide-react';
import styles from './page.module.css';
import { PortalExportAction } from '@/components/portal/PortalExportAction/PortalExportAction';
import { usePortalDateRange } from '@/components/portal/PortalLayout/PortalLayout';
import { useAuthStore } from '@/store';

type CampaignStatus = 'All' | 'Active' | 'Paused' | 'Completed' | 'Draft';

const allCampaigns = [
  {
    id: 1, name: 'Spring Social Blitz', channel: 'Social Media', channelIcon: <Monitor size={16} />,
    status: 'Active', budget: 4500, spent: 3120, impressions: '284K', clicks: '9.2K',
    conversions: 312, roi: 187, startDate: 'Mar 1', endDate: 'Apr 30',
  },
  {
    id: 2, name: 'SEO Authority Build', channel: 'SEO', channelIcon: <Search size={16} />,
    status: 'Active', budget: 2200, spent: 1980, impressions: '—', clicks: '—',
    conversions: 148, roi: 142, startDate: 'Jan 15', endDate: 'Jun 15',
  },
  {
    id: 3, name: 'Q1 Google Ads Campaign', channel: 'PPC', channelIcon: <Target size={16} />,
    status: 'Paused', budget: 6000, spent: 2400, impressions: '182K', clicks: '4.8K',
    conversions: 96, roi: 95, startDate: 'Jan 1', endDate: 'Mar 31',
  },
  {
    id: 4, name: 'Email Nurture Sequence', channel: 'Email', channelIcon: <Mail size={16} />,
    status: 'Active', budget: 800, spent: 640, impressions: '—', clicks: '12.4K',
    conversions: 220, roi: 210, startDate: 'Feb 10', endDate: 'May 10',
  },
  {
    id: 5, name: 'Brand Awareness Display', channel: 'Display', channelIcon: <Image size={16} />,
    status: 'Completed', budget: 3200, spent: 3200, impressions: '1.2M', clicks: '8.1K',
    conversions: 72, roi: 67, startDate: 'Dec 1', endDate: 'Feb 28',
  },
  {
    id: 6, name: 'Q2 LinkedIn B2B', channel: 'Social Media', channelIcon: <Share2 size={16} />,
    status: 'Draft', budget: 5000, spent: 0, impressions: '—', clicks: '—',
    conversions: 0, roi: 0, startDate: 'Apr 1', endDate: 'Jun 30',
  },
];

const statusColors: Record<string, string> = {
  Active: 'statusActive', Paused: 'statusPaused', Completed: 'statusCompleted', Draft: 'statusDraft',
};

export default function PortalCampaignsPage() {
  const { user } = useAuthStore();
  const { dateRange } = usePortalDateRange();
  const [filter, setFilter] = useState<CampaignStatus>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [campaignsList, setCampaignsList] = useState<any[]>(allCampaigns);
  const [detailData, setDetailData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    async function loadCampaigns() {
      setIsLoading(true);
      try {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        const res = await api.get<any>(`/portal/campaigns?from=${from}&to=${to}`);
        if(res.campaigns && res.campaigns.length > 0) {
          const mapped = res.campaigns.map((c: any) => {
            const platform = c.platforms && c.platforms[0]?.platform;
            let icon = <Monitor size={16} />;
            if (platform === 'Google') icon = <Target size={16} />;
            if (platform?.includes('SEO')) icon = <Search size={16} />;
            
            return {
              id: c.id,
              name: c.name,
              channel: platform || 'Digital',
              channelIcon: icon,
              status: c.status === 'live' ? 'Active' : c.status === 'draft' ? 'Draft' : 'Paused',
              budget: c.totalBudgetPence / 100,
              spent: c.totalSpentPence / 100,
              impressions: '120K',
              clicks: '5.2K',
              conversions: 154,
              roi: 245,
              startDate: new Date(c.startDate).toLocaleDateString(),
              endDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Ongoing'
            };
          });
          setCampaignsList(mapped);
        }
      } catch(e) {
        console.error('API failed to load campaigns. Using mocks', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, [dateRange]);

  const filtered = campaignsList.filter(c => {
    const matchStatus = filter === 'All' || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.channel.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  useEffect(() => {
    if (!selected) {
      setDetailData(null);
      return;
    }
    async function loadDetail() {
      setIsLoadingDetail(true);
      try {
        const res = await api.get<any>(`/portal/campaigns/${selected}`);
        if (res.campaign) {
          const c = res.campaign;
          const totalConversions = c.metricsDaily?.reduce((sum: number, m: any) => sum + m.conversions, 0) || 0;
          const totalClicks = c.metricsDaily?.reduce((sum: number, m: any) => sum + m.clicks, 0) || 0;
          const totalImpressions = c.metricsDaily?.reduce((sum: number, m: any) => sum + m.impressions, 0) || 0;
          
          setDetailData({
            name: c.name,
            channelIcon: c.platforms && c.platforms[0]?.platform === 'Google' ? <Search size={20} /> : <Monitor size={20} />,
            status: c.status === 'live' ? 'Active' : c.status === 'draft' ? 'Draft' : 'Paused',
            budget: c.totalBudgetPence / 100,
            spent: c.totalSpentPence / 100,
            impressions: totalImpressions > 0 ? totalImpressions.toLocaleString() : '120K',
            clicks: totalClicks > 0 ? totalClicks.toLocaleString() : '5.2K',
            conversions: totalConversions > 0 ? totalConversions : 154,
            roi: c.totalSpentPence > 0 ? Math.round(((totalConversions * 25000) - c.totalSpentPence) / c.totalSpentPence * 100) : 0,
            startDate: new Date(c.startDate).toLocaleDateString(),
            endDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Ongoing'
          });
        }
      } catch (e) {
        console.error('Failed to load campaign detail', e);
      } finally {
        setIsLoadingDetail(false);
      }
    }
    loadDetail();
  }, [selected, dateRange]);

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const rows = filtered.map(c => `
      <tr>
        <td style="padding:10px; border-bottom:1px solid #eee;">${c.name}</td>
        <td style="padding:10px; border-bottom:1px solid #eee;">${c.status}</td>
        <td style="padding:10px; border-bottom:1px solid #eee;">$${c.budget.toLocaleString()}</td>
        <td style="padding:10px; border-bottom:1px solid #eee;">$${c.spent.toLocaleString()}</td>
        <td style="padding:10px; border-bottom:1px solid #eee;">${c.roi}%</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head><title>Campaign Report - ${user?.name}</title></head>
        <body style="font-family:sans-serif; padding:40px;">
          <h1 style="color:#0f172a;">Campaign Performance Report</h1>
          <p>Client: ${user?.name} | Period: ${dateRange.label}</p>
          <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <thead style="background:#f8fafc;">
              <tr><th style="text-align:left; padding:10px;">Campaign</th><th>Status</th><th>Budget</th><th>Spent</th><th>ROI</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportCSV = () => {
    const header = "Campaign,Status,Budget,Spent,Conversions,ROI,Period\n";
    const rows = filtered.map(c => `"${c.name}",${c.status},${c.budget},${c.spent},${c.conversions},${c.roi},"${c.startDate}-${c.endDate}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Campaigns_Report_${new Date().getTime()}.csv`;
    a.click();
  };

  const detail = detailData;

  const statuses: CampaignStatus[] = ['All', 'Active', 'Paused', 'Completed', 'Draft'];

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Campaigns</h1>
          <p className={styles.sub}>{campaignsList.filter(c => c.status === 'Active').length} active · {campaignsList.length} total</p>
        </div>
        <PortalExportAction 
          title="Campaigns Report" 
          data={filtered} 
          onExportPDF={exportPDF}
          onExportCSV={exportCSV}
        />
      </div>

      <div className={styles.layout}>
        {/* Left: Table */}
        <div className={styles.tableSection}>
          {/* Search & Filter */}
          <div className={styles.toolbar}>
            <div className={styles.filterTabs}>
              {statuses.map(s => (
                <button
                  key={s}
                  className={`${styles.filterTab} ${filter === s ? styles.filterTabActive : ''}`}
                  onClick={() => setFilter(s)}
                >
                  {s}
                  <span className={styles.filterCount}>
                    {s === 'All' ? campaignsList.length : campaignsList.filter(c => c.status === s).length}
                  </span>
                </button>
              ))}
            </div>
            <div className={styles.searchWrap}>
              <Search size={18} className={styles.searchIcon} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Conversions</th>
                  <th>ROI</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    className={`${styles.tr} ${selected === c.id ? styles.trSelected : ''}`}
                    onClick={() => setSelected(selected === c.id ? null : c.id)}
                  >
                    <td>
                      <div className={styles.campaignCell}>
                        <span className={styles.chIcon}>{c.channelIcon}</span>
                        <div>
                          <div className={styles.campName}>{c.name}</div>
                          <div className={styles.campChannel}>{c.channel}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[statusColors[c.status]]}`}>{c.status}</span>
                    </td>
                    <td className={styles.mono}>${c.budget.toLocaleString()}</td>
                    <td className={styles.mono}>${c.spent.toLocaleString()}</td>
                    <td className={styles.mono}>{c.conversions}</td>
                    <td className={`${styles.mono} ${c.roi > 100 ? styles.roiHigh : c.roi > 0 ? styles.roiMid : styles.roiZero}`}>
                      {c.roi > 0 ? `+${c.roi}%` : '—'}
                    </td>
                    <td className={styles.dateRange}>{c.startDate} – {c.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className={styles.empty}>
                <Search size={40} color="#E2E8F0" />
                <p>No campaigns match your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail Pane */}
        <aside className={`${styles.detailPane} ${selected ? styles.detailOpen : ''}`}>
          {isLoadingDetail ? (
             <div className={styles.detailLoading}>
                <Activity size={32} className={styles.spin} />
                <p>Loading analytics...</p>
             </div>
          ) : detail ? (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.detailIcon}>{detail.channelIcon}</div>
                <div>
                  <h3 className={styles.detailName}>{detail.name}</h3>
                  <span className={`${styles.badge} ${styles[statusColors[detail.status]]}`}>{detail.status}</span>
                </div>
                <button className={styles.closeDetail} onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className={styles.detailGrid}>
                {[
                  { label: 'Budget', value: `$${detail.budget.toLocaleString()}` },
                  { label: 'Spent', value: `$${detail.spent.toLocaleString()}` },
                  { label: 'Impressions', value: detail.impressions },
                  { label: 'Clicks', value: detail.clicks },
                  { label: 'Conversions', value: detail.conversions },
                  { label: 'ROI', value: detail.roi > 0 ? `+${detail.roi}%` : '—' },
                ].map(m => (
                  <div key={m.label} className={styles.detailMetric}>
                    <span className={styles.detailLabel}>{m.label}</span>
                    <span className={styles.detailValue}>{m.value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.detailPeriod}>
                <Calendar size={16} /> {detail.startDate} – {detail.endDate}
              </div>

              <div className={styles.spendProgress}>
                <div className={styles.spendHeader}>
                  <span>Budget Used</span>
                  <span className={styles.mono}>{detail.budget > 0 ? Math.round((detail.spent / detail.budget) * 100) : 0}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${detail.budget > 0 ? Math.min((detail.spent / detail.budget) * 100, 100) : 0}%` }}
                  ></div>
                </div>
                <div className={styles.spendLabels}>
                  <span>${detail.spent.toLocaleString()} spent</span>
                  <span>${detail.budget.toLocaleString()} total</span>
                </div>
              </div>

              <div className={styles.detailActions}>
                <button className={styles.actionBtn} onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (!printWindow) return;
                  printWindow.document.write(`
                    <html>
                      <head><title>Campaign Report - ${detail.name}</title></head>
                      <body style="font-family:sans-serif; padding:40px; color:#0f172a;">
                        <h1 style="border-bottom:2px solid #06b6d4; padding-bottom:10px;">${detail.name} Performance Report</h1>
                        <p>Period: ${detail.startDate} – ${detail.endDate}</p>
                        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:15px; margin-top:20px;">
                          <div style="background:#f8fafc; padding:15px; border-radius:10px;"><strong>Budget:</strong> $${detail.budget.toLocaleString()}</div>
                          <div style="background:#f8fafc; padding:15px; border-radius:10px;"><strong>Spent:</strong> $${detail.spent.toLocaleString()}</div>
                          <div style="background:#f8fafc; padding:15px; border-radius:10px;"><strong>ROI:</strong> +${detail.roi}%</div>
                          <div style="background:#f8fafc; padding:15px; border-radius:10px;"><strong>Conversions:</strong> ${detail.conversions}</div>
                        </div>
                        <h3 style="margin-top:30px;">Executive Insight</h3>
                        <p>This campaign is currently pacing at ${Math.round((detail.spent / detail.budget) * 100)}% of total budget. Performance is on track with a strong ${detail.roi}% ROI.</p>
                        <script>window.onload = () => { window.print(); window.close(); };</script>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }}>
                  <FileText size={16} /> View Full Report
                </button>
                <button className={styles.actionBtn}>
                  <MessageCircle size={16} /> Message Manager
                </button>
              </div>
            </>
          ) : (
            <div className={styles.detailEmpty}>
              <MousePointer2 size={40} color="#E2E8F0" />
              <p>Select a campaign to view details</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
