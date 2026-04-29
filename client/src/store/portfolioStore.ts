import { create } from 'zustand';
import { api } from '@/lib/api';

export type PortfolioStatus = 'draft' | 'published';

export interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  clientIndustry: string;
  serviceCategory: string;
  channels: string[];
  dateRange: string;
  metrics: {
    impressions: string;
    clicks: string;
    ctr: string;
    conversions: string;
    cpa: string;
    roi: string;
  };
  images: string[];
  featuredImage: string;
  description: string;
  status: PortfolioStatus;
  contentScore: number;
  slug: string;
  createdAt: string;
  tags: string[];
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1', slug: 'fashion-retailer-campaign',
    title: 'Fashion Retailer — Spring Social Blitz',
    clientName: 'StyleCo UK', clientIndustry: 'E-commerce / Fashion',
    serviceCategory: 'Social Media Marketing', channels: ['Instagram', 'Facebook', 'TikTok'],
    dateRange: 'Jan 2026 – Mar 2026',
    metrics: { impressions: '2.4M', clicks: '48,200', ctr: '2.01%', conversions: '1,847', cpa: '£13.21', roi: '312%' },
    images: ['/portfolio-1.jpg'], featuredImage: '/portfolio-1.jpg',
    description: 'Our targeted social media campaign for StyleCo UK achieved a 312% ROI over three months, delivering 1,847 qualified purchases at just £13.21 CPA — 40% below their previous agency benchmark.',
    status: 'published', contentScore: 88, createdAt: '2026-03-01', tags: ['E-commerce', 'Social Media'],
  },
  {
    id: 'p2', slug: 'fitness-app-launch',
    title: 'Fitness App Launch — User Acquisition',
    clientName: 'FitPulse', clientIndustry: 'Health & Fitness',
    serviceCategory: 'PPC Advertising', channels: ['Google Ads', 'Apple Search Ads'],
    dateRange: 'Oct 2025 – Dec 2025',
    metrics: { impressions: '890K', clicks: '22,400', ctr: '2.52%', conversions: '4,200', cpa: '£8.90', roi: '224%' },
    images: ['/portfolio-2.jpg'], featuredImage: '/portfolio-2.jpg',
    description: 'Strategic app install campaigns across Google and Apple platforms drove 4,200 high-quality user acquisitions at £8.90 CPA, achieving 224% ROI against a £37,380 total spend.',
    status: 'published', contentScore: 82, createdAt: '2025-12-15', tags: ['App Marketing', 'PPC'],
  },
  {
    id: 'p3', slug: 'restaurant-rebrand-seo',
    title: 'Restaurant Chain — SEO & Local Authority',
    clientName: 'Ember Kitchens', clientIndustry: 'Food & Beverage',
    serviceCategory: 'SEO Optimization', channels: ['Google Search', 'Google My Business'],
    dateRange: 'Jun 2025 – Sep 2025',
    metrics: { impressions: '1.1M', clicks: '31,000', ctr: '2.82%', conversions: '920', cpa: '£22.10', roi: '185%' },
    images: ['/portfolio-3.jpg'], featuredImage: '/portfolio-3.jpg',
    description: 'A comprehensive local SEO strategy for Ember Kitchens drove 45% revenue growth across 8 locations, with top-3 rankings for 127 high-intent keywords within 4 months.',
    status: 'published', contentScore: 76, createdAt: '2025-09-30', tags: ['Local SEO', 'F&B'],
  },
  {
    id: 'p4', slug: 'saas-lead-generation',
    title: 'SaaS Platform — B2B Lead Generation',
    clientName: 'DataSync Pro', clientIndustry: 'B2B SaaS',
    serviceCategory: 'Content Marketing', channels: ['LinkedIn', 'Email', 'Blog'],
    dateRange: 'Feb 2026 – Mar 2026',
    metrics: { impressions: '340K', clicks: '9,800', ctr: '2.88%', conversions: '312', cpa: '£45.20', roi: '142%' },
    images: ['/portfolio-4.jpg'], featuredImage: '/portfolio-4.jpg',
    description: 'Integrated content marketing and LinkedIn outreach program generated 312 qualified B2B leads for DataSync Pro at £45.20 CPA, with an average deal size of £4,200.',
    status: 'draft', contentScore: 64, createdAt: '2026-03-20', tags: ['B2B', 'SaaS', 'Content'],
  },
];

interface PortfolioState {
  items: PortfolioItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  fetchItemBySlug: (slug: string) => Promise<PortfolioItem | null>;
  addItem: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'contentScore'>) => Promise<void>;
  updateItem: (id: string, data: Partial<PortfolioItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  publishItem: (id: string) => Promise<void>;
  getBySlug: (slug: string) => PortfolioItem | undefined;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{ success: boolean; items: any[] }>('/portfolio/public');
      if (data.success) {
        set({ items: data.items, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchItemBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{ success: boolean; item: any }>(`/portfolio/public/${slug}`);
      if (data.success && data.item) {
        set({ isLoading: false });
        return data.item;
      }
      return null;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  addItem: async (item) => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ success: boolean; item: PortfolioItem }>('/portfolio', item);
      if (data.success) {
        set(s => ({ items: [data.item, ...s.items], isLoading: false }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateItem: async (id, data) => {
    set({ isLoading: true });
    try {
      const resp = await api.put<{ success: boolean; item: PortfolioItem }>(`/portfolio/${id}`, data);
      if (resp.success) {
        set(s => ({ items: s.items.map(i => i.id === id ? resp.item : i), isLoading: false }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      const data = await api.delete<{ success: boolean }>(`/portfolio/${id}`);
      if (data.success) {
        set(s => ({ items: s.items.filter(i => i.id !== id), isLoading: false }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  publishItem: async (id) => {
    set({ isLoading: true });
    try {
      const data = await api.put<{ success: boolean; item: PortfolioItem }>(`/portfolio/${id}`, { status: 'published' });
      if (data.success) {
        set(s => ({ items: s.items.map(i => i.id === id ? data.item : i), isLoading: false }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  getBySlug: (slug) => get().items.find(i => i.slug === slug),
}));
