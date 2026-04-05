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

const generateChartData = (days: number): ChartDataPoint[] =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date('2026-03-01');
    d.setDate(d.getDate() + i);
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      impressions: Math.floor(60000 + Math.random() * 30000),
      clicks: Math.floor(1200 + Math.random() * 800),
      conversions: Math.floor(40 + Math.random() * 50),
      spend: Math.floor(800 + Math.random() * 400),
    };
  });

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1', name: 'Spring Social Blitz', clientId: 'u3', channel: 'Social Media',
    status: 'Active', budget: 4500, spent: 3120, startDate: '2026-03-01', endDate: '2026-03-31',
    kpis: [
      { label: 'Impressions', value: '2.4M', change: '+18%', positive: true },
      { label: 'Clicks', value: '48,200', change: '+12%', positive: true },
      { label: 'CTR', value: '2.01%', change: '+0.3%', positive: true },
      { label: 'Conversions', value: '1,847', change: '+8%', positive: true },
      { label: 'CPA', value: '£13.21', change: '-5%', positive: true },
      { label: 'ROAS', value: '4.2x', change: '+0.8x', positive: true },
    ],
    chartData: generateChartData(30),
    funnel: [
      { label: 'Impressions', value: 2400000 },
      { label: 'Clicks', value: 48200, dropPct: 98 },
      { label: 'Landing Page', value: 41700, dropPct: 13.5 },
      { label: 'Add to Cart', value: 8340, dropPct: 80 },
      { label: 'Checkout', value: 2918, dropPct: 65 },
      { label: 'Converted', value: 1847, dropPct: 36.7 },
    ],
    goals: [
      { label: 'Total Conversions', current: 1847, target: 2200, unit: '', status: 'on-track' },
      { label: 'Ad Spend', current: 3120, target: 4500, unit: '£', status: 'on-track' },
      { label: 'ROAS Target', current: 4.2, target: 3.5, unit: 'x', status: 'exceeding' },
      { label: 'CPA Target', current: 13.21, target: 15, unit: '£', status: 'exceeding' },
    ],
    platformBreakdown: [
      { label: 'Instagram', pct: 45, color: '#E1306C' },
      { label: 'Facebook', pct: 32, color: '#1877F2' },
      { label: 'TikTok', pct: 23, color: '#010101' },
    ],
    deviceBreakdown: [{ label: 'Mobile', pct: 62 }, { label: 'Desktop', pct: 31 }, { label: 'Tablet', pct: 7 }],
    audienceAge: [
      { range: '18–24', pct: 22 }, { range: '25–34', pct: 38 },
      { range: '35–44', pct: 24 }, { range: '45–54', pct: 12 }, { range: '55+', pct: 4 },
    ],
    topCreatives: [
      { id: 'cr1', name: 'Spring Collection Video', ctr: '3.2%', conv: 412, spend: '£820', img: '' },
      { id: 'cr2', name: 'Product Showcase Carousel', ctr: '2.8%', conv: 334, spend: '£690', img: '' },
      { id: 'cr3', name: 'UGC Story Ad', ctr: '2.1%', conv: 218, spend: '£540', img: '' },
    ],
  },
  {
    id: 'c2', name: 'SEO Authority Build', clientId: 'u3', channel: 'SEO',
    status: 'Active', budget: 2200, spent: 1980, startDate: '2026-01-01', endDate: '2026-06-30',
    kpis: [
      { label: 'Organic Sessions', value: '22,400', change: '+34%', positive: true },
      { label: 'Keywords Ranked', value: '127', change: '+22', positive: true },
      { label: 'Avg Position', value: '4.2', change: '-1.8', positive: true },
      { label: 'Backlinks', value: '1,240', change: '+180', positive: true },
      { label: 'Bounce Rate', value: '38%', change: '-6%', positive: true },
      { label: 'Page Speed', value: '92/100', change: '+8', positive: true },
    ],
    chartData: generateChartData(30),
    funnel: [
      { label: 'Impressions', value: 980000 },
      { label: 'Clicks', value: 22400, dropPct: 97.7 },
      { label: 'Pages Viewed', value: 18900, dropPct: 15.6 },
      { label: 'Engaged', value: 11200, dropPct: 40.7 },
      { label: 'Converted', value: 890, dropPct: 92.1 },
    ],
    goals: [
      { label: 'Organic Sessions', current: 22400, target: 25000, unit: '', status: 'on-track' },
      { label: 'Rankings (Top 10)', current: 78, target: 100, unit: '', status: 'on-track' },
      { label: 'Domain Authority', current: 42, target: 50, unit: '', status: 'at-risk' },
    ],
    platformBreakdown: [
      { label: 'Google', pct: 88, color: '#4285F4' },
      { label: 'Bing', pct: 9, color: '#008373' },
      { label: 'Other', pct: 3, color: '#94A3B8' },
    ],
    deviceBreakdown: [{ label: 'Mobile', pct: 55 }, { label: 'Desktop', pct: 40 }, { label: 'Tablet', pct: 5 }],
    audienceAge: [
      { range: '18–24', pct: 15 }, { range: '25–34', pct: 35 },
      { range: '35–44', pct: 30 }, { range: '45–54', pct: 15 }, { range: '55+', pct: 5 },
    ],
    topCreatives: [],
  },
];

interface CampaignState {
  campaigns: Campaign[];
  getCampaign: (id: string) => Campaign | undefined;
  getClientCampaigns: (clientId: string) => Campaign[];
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: MOCK_CAMPAIGNS,
  getCampaign: (id) => get().campaigns.find(c => c.id === id),
  getClientCampaigns: (clientId) => get().campaigns.filter(c => c.clientId === clientId),
}));
