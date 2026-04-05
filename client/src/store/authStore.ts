import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'staff' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  jobTitle?: string;
  phone?: string;
  avatar?: string;
  staffRole?: 'Content Manager' | 'Account Manager' | 'Analyst';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  twoFARequired: boolean;
  twoFAVerified: boolean;

  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; requiresTwoFA?: boolean }>;
  verifyTwoFA: (code: string) => boolean;
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
}

// Mock user database
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'admin@digitalpulse.com': {
    password: 'admin123',
    user: { id: 'u1', name: 'Priya Nanthakumar', email: 'admin@digitalpulse.com', role: 'admin', jobTitle: 'Founder & CEO' },
  },
  'tom@digitalpulse.com': {
    password: 'staff123',
    user: { id: 'u2', name: 'Tom Bradley', email: 'tom@digitalpulse.com', role: 'staff', jobTitle: 'Content Manager', staffRole: 'Content Manager' },
  },
  'james@company.com': {
    password: 'client123',
    user: { id: 'u3', name: 'James Okoro', email: 'james@company.com', role: 'client', company: 'TechFlow SaaS', jobTitle: 'Marketing Director' },
  },
  'sarah@skincare.com': {
    password: 'client123',
    user: { id: 'u4', name: 'Sarah Thompson', email: 'sarah@skincare.com', role: 'client', company: 'Glow Skincare', jobTitle: 'Founder' },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      twoFARequired: false,
      twoFAVerified: false,

      login: async (email, password, role) => {
        await new Promise(r => setTimeout(r, 900));
        const record = MOCK_USERS[email.toLowerCase()];
        if (!record || record.password !== password) {
          return { success: false };
        }
        if (record.user.role !== role && !(role === 'staff' && record.user.role === 'staff')) {
          if (role === 'admin' && record.user.role !== 'admin') return { success: false };
          if (role === 'client' && record.user.role !== 'client') return { success: false };
        }
        // Admin requires 2FA
        if (record.user.role === 'admin') {
          set({ twoFARequired: true, twoFAVerified: false, user: record.user });
          return { success: true, requiresTwoFA: true };
        }
        set({ user: record.user, isAuthenticated: true, twoFARequired: false });
        return { success: true };
      },

      verifyTwoFA: (code) => {
        // Mock: accept "123456"
        if (code === '123456') {
          set({ twoFAVerified: true, isAuthenticated: true, twoFARequired: false });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, twoFARequired: false, twoFAVerified: false });
      },

      register: async (data) => {
        await new Promise(r => setTimeout(r, 800));
        const newUser: User = {
          id: `u${Date.now()}`,
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'client',
          company: data.company,
          jobTitle: data.jobTitle,
          staffRole: data.staffRole,
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      updateUser: (data) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...data } });
      },
    }),
    { name: 'dp-auth' }
  )
);
