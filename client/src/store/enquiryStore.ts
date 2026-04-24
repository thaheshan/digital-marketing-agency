import { create } from 'zustand';
import { api } from '@/lib/api';

export type LeadStatus = 'hot' | 'warm' | 'cold' | 'converted' | 'archived';
export type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed_lost';

export interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
  time: string;
}

export interface PageVisit {
  page: string;
  duration: string;
  timestamp: string;
}

export interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phone?: string;
  serviceInterest?: string[];
  budgetRange?: string;
  message?: string;
  leadScore?: number;
  leadTemperature?: 'hot' | 'warm' | 'cold';
  status: EnquiryStatus;
  createdAt: string;
  source?: string;
  chatLog: ChatMessage[];
  pageVisits: PageVisit[];
  scoreBreakdown: {
    behaviour: number;
    form: number;
    chatbot: number;
    recency: number;
  };
}

interface EnquiryState {
  enquiries: Enquiry[];
  isLoading: boolean;
  error: string | null;
  fetchEnquiries: (status?: string, temp?: string) => Promise<void>;
  fetchEnquiryDetail: (id: string) => Promise<Enquiry | null>;
  addEnquiry: (data: Omit<Enquiry, 'id' | 'status' | 'score' | 'timestamp' | 'scoreBreakdown'>) => void;
  updateStatus: (id: string, status: LeadStatus) => Promise<void>;
  convertToClient: (id: string) => Promise<void>;
}

export const useEnquiryStore = create<EnquiryState>((set, get) => ({
  enquiries: [],
  isLoading: false,
  error: null,

  fetchEnquiries: async (status, temp) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{ success: boolean; enquiries: any[] }>(`/admin/enquiries?${status ? `status=${status}` : ''}${temp ? `&temp=${temp}` : ''}`);
      if (data.success) {
        set({ enquiries: data.enquiries, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchEnquiryDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{ success: boolean; enquiry: any }>(`/admin/enquiries/${id}`);
      if (data.success && data.enquiry) {
        set({ isLoading: false });
        // Update list
        set(s => ({ enquiries: s.enquiries.map(e => e.id === id ? data.enquiry : e) }));
        return data.enquiry;
      }
      return null;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  addEnquiry: (data) => {
    // This is normally handled by the public contact form / chatbot hitting the backend
    // But keeping it for local updates if needed
    const score = Math.min(100, data.chatLog.length * 5 + 40);
    const status: LeadStatus = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold';
    const newEnquiry: Enquiry = {
      ...data,
      id: `e${Date.now()}`,
      score,
      status,
      timestamp: new Date().toISOString(),
      scoreBreakdown: { behaviour: 15, form: 15, chatbot: data.chatLog.length * 3, recency: 10 },
    };
    set(s => ({ enquiries: [newEnquiry, ...s.enquiries] }));
  },

  updateStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      const data = await api.put<{ success: boolean }>(`/admin/enquiries/${id}/status`, { status });
      if (data.success) {
        set(s => ({ 
          enquiries: s.enquiries.map(e => e.id === id ? { ...e, status } : e),
          isLoading: false 
        }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  convertToClient: async (id) => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ success: boolean }>(`/admin/enquiries/${id}/convert`, {});
      if (data.success) {
        set(s => ({ 
          enquiries: s.enquiries.map(e => e.id === id ? { ...e, status: 'converted' } : e),
          isLoading: false 
        }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
