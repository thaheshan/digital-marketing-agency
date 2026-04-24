import { create } from 'zustand';

export interface CampaignKpi {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface ChartDataPoint {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface FunnelStep {
  label: string;
  value: number;
  dropPct?: number;
}

export interface GoalCard {
  label: string;
  current: number;
  target: number;
  unit: string;
  status: 'on-track' | 'exceeding' | 'at-risk' | 'behind';
}

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  channel: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  kpis: CampaignKpi[];
  chartData: ChartDataPoint[];
  funnel: FunnelStep[];
  goals: GoalCard[];
  platformBreakdown: { label: string; pct: number; color: string }[];
  deviceBreakdown: { label: string; pct: number }[];
  audienceAge: { range: string; pct: number }[];
  topCreatives: { id: string; name: string; ctr: string; conv: number; spend: string; img: string }[];
}

interface CampaignState {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  fetchCampaignDetail: (id: string) => Promise<Campaign | null>;
  getCampaign: (id: string) => Campaign | undefined;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{ success: boolean; campaigns: any[] }>('/portal/campaigns');
      if (data.success) {
        const mapped: Campaign[] = data.campaigns.map(c => ({
          id: c.id,
          name: c.name,
          clientId: c.clientId,
          channel: 'Digital Marketing',
          status: c.status === 'live' ? 'Active' : c.status === 'paused' ? 'Paused' : c.status === 'completed' ? 'Completed' : 'Draft',
          budget: (c.totalBudgetPence || 0) / 100,
          spent: (c.totalSpentPence || 0) / 100,
          startDate: new Date(c.startDate).toISOString().split('T')[0],
          endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : 'Ongoing',
          kpis: [],
          chartData: [],
          funnel: [],
          goals: [],
          platformBreakdown: [],
          deviceBreakdown: [],
          audienceAge: [],
          topCreatives: []
        }));
        set({ campaigns: mapped, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCampaignDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{ success: boolean; campaign: any }>(`/portal/campaigns/${id}`);
      if (data.success && data.campaign) {
        const c = data.campaign;
        // Basic mapping for now, can be expanded to fill KPIs/Charts from metricsDaily
        const mapped: Campaign = {
          id: c.id,
          name: c.name,
          clientId: c.clientId,
          channel: 'Digital Marketing',
          status: c.status === 'live' ? 'Active' : c.status === 'paused' ? 'Paused' : c.status === 'completed' ? 'Completed' : 'Draft',
          budget: (c.totalBudgetPence || 0) / 100,
          spent: (c.totalSpentPence || 0) / 100,
          startDate: new Date(c.startDate).toISOString().split('T')[0],
          endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : 'Ongoing',
          kpis: [],
          chartData: c.metricsDaily?.map((m: any) => ({
            date: new Date(m.metricDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            impressions: m.impressions,
            clicks: m.clicks,
            conversions: m.conversions,
            spend: m.spendPence / 100
          })) || [],
          funnel: [],
          goals: c.goals?.map((g: any) => ({
             label: g.metricName,
             current: Number(g.currentValue),
             target: Number(g.targetValue),
             unit: g.unit,
             status: g.status === 'on_track' ? 'on-track' : g.status === 'exceeding' ? 'exceeding' : g.status === 'needs_attention' ? 'at-risk' : 'behind'
          })) || [],
          platformBreakdown: [],
          deviceBreakdown: [],
          audienceAge: [],
          topCreatives: []
        };
        set({ isLoading: false });
        // Update campaigns list with this detailed version
        set(s => ({ campaigns: s.campaigns.map(item => item.id === id ? mapped : item) }));
        return mapped;
      }
      return null;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  getCampaign: (id) => get().campaigns.find(c => c.id === id),
}));
