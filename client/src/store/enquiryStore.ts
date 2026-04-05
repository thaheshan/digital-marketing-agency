import { create } from 'zustand';

export type LeadStatus = 'hot' | 'warm' | 'cold' | 'converted' | 'archived';

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
  name: string;
  email: string;
  company: string;
  phone?: string;
  service: string;
  budget: string;
  message: string;
  score: number;
  status: LeadStatus;
  timestamp: string;
  source: string;
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
  addEnquiry: (data: Omit<Enquiry, 'id' | 'status' | 'score' | 'timestamp' | 'scoreBreakdown'>) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  convertToClient: (id: string) => void;
}

const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: 'e1', name: 'Sarah Thompson', email: 'sarah@skincare.com', company: 'Glow Skincare',
    phone: '+44 7700 900123', service: 'Social Media Marketing', budget: '£2,000 – £4,000/mo',
    message: 'Looking for help with Instagram ads and conversions for my skincare brand.',
    score: 87, status: 'hot', timestamp: '2026-03-30T09:12:00Z', source: 'ROI Calculator',
    chatLog: [
      { from: 'bot', text: 'Hi! What service are you looking for?', time: '09:10' },
      { from: 'user', text: 'Social media ads for e-commerce', time: '09:11' },
      { from: 'bot', text: 'Great! What is your monthly budget?', time: '09:11' },
      { from: 'user', text: 'Around £3,000 per month', time: '09:12' },
      { from: 'bot', text: 'And what is your timeline to get started?', time: '09:12' },
      { from: 'user', text: 'Within the next month', time: '09:13' },
    ],
    pageVisits: [
      { page: 'Homepage', duration: '1m 20s', timestamp: '09:05' },
      { page: 'Portfolio (E-commerce filter)', duration: '3m 45s', timestamp: '09:06' },
      { page: 'ROI Calculator', duration: '2m 10s', timestamp: '09:09' },
      { page: 'Contact Form', duration: '1m 55s', timestamp: '09:12' },
    ],
    scoreBreakdown: { behaviour: 32, form: 25, chatbot: 20, recency: 10 },
  },
  {
    id: 'e2', name: 'Marcus Reid', email: 'marcus@techflow.io', company: 'TechFlow Inc.',
    phone: '+44 7700 900456', service: 'SEO Optimization', budget: '£1,000 – £2,000/mo',
    message: 'Need help with organic search rankings for our SaaS product.',
    score: 72, status: 'warm', timestamp: '2026-03-29T14:30:00Z', source: 'LinkedIn',
    chatLog: [
      { from: 'bot', text: 'Hi! What service are you looking for?', time: '14:28' },
      { from: 'user', text: 'SEO for B2B SaaS', time: '14:29' },
      { from: 'bot', text: 'What is your monthly budget range?', time: '14:29' },
      { from: 'user', text: 'About £1,500/month', time: '14:30' },
    ],
    pageVisits: [
      { page: 'Services — SEO', duration: '4m 12s', timestamp: '14:20' },
      { page: 'Case Studies', duration: '5m 33s', timestamp: '14:24' },
      { page: 'Contact', duration: '2m 01s', timestamp: '14:29' },
    ],
    scoreBreakdown: { behaviour: 28, form: 20, chatbot: 14, recency: 10 },
  },
  {
    id: 'e3', name: 'Aisha Khan', email: 'aisha@brandco.com', company: 'BrandCo',
    phone: '', service: 'Brand Strategy', budget: 'Not specified',
    message: 'Just browsing, curious about your services.',
    score: 28, status: 'cold', timestamp: '2026-03-28T10:00:00Z', source: 'Google Search',
    chatLog: [],
    pageVisits: [{ page: 'Homepage', duration: '0m 38s', timestamp: '10:00' }],
    scoreBreakdown: { behaviour: 5, form: 8, chatbot: 0, recency: 15 },
  },
  {
    id: 'e4', name: 'James Carter', email: 'james@buildwell.com', company: 'BuildWell Ltd',
    phone: '+44 7700 900789', service: 'PPC Advertising', budget: '£4,000 – £8,000/mo',
    message: 'Want to run Google Ads for our construction company.',
    score: 81, status: 'hot', timestamp: '2026-03-30T11:45:00Z', source: 'Direct',
    chatLog: [
      { from: 'bot', text: 'Hi! What service are you looking for?', time: '11:43' },
      { from: 'user', text: 'Google Ads and PPC', time: '11:44' },
      { from: 'bot', text: 'What budget range are you working with?', time: '11:44' },
      { from: 'user', text: 'About £5,000 a month', time: '11:45' },
    ],
    pageVisits: [
      { page: 'Services — PPC', duration: '3m 22s', timestamp: '11:38' },
      { page: 'Portfolio', duration: '2m 44s', timestamp: '11:41' },
      { page: 'Contact', duration: '1m 30s', timestamp: '11:43' },
    ],
    scoreBreakdown: { behaviour: 30, form: 22, chatbot: 18, recency: 11 },
  },
];

export const useEnquiryStore = create<EnquiryState>((set) => ({
  enquiries: MOCK_ENQUIRIES,

  addEnquiry: (data) => {
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

  updateStatus: (id, status) =>
    set(s => ({ enquiries: s.enquiries.map(e => e.id === id ? { ...e, status } : e) })),

  convertToClient: (id) =>
    set(s => ({ enquiries: s.enquiries.map(e => e.id === id ? { ...e, status: 'converted' } : e) })),
}));
