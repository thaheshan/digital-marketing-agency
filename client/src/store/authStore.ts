import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export type UserRole = 'admin' | 'content_manager' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: string;
  // Derived helpers for UI convenience
  name: string;        // `${firstName} ${lastName}`
  company?: string;    // from clientProfile
  jobTitle?: string;   // from staffProfile
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login:      (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:     () => void;
  loadFromToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.post<{
            accessToken: string;
            user: { id: string; email: string; firstName: string; lastName: string; role: UserRole; status: string };
          }>('/auth/login', { email, password });

          const user: User = {
            ...data.user,
            name: `${data.user.firstName} ${data.user.lastName}`,
          };

          // Persist token for API calls
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.accessToken);
          }

          set({ user, token: data.accessToken, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err: any) {
          const msg = err?.message || 'Invalid email or password';
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        // Fire-and-forget logout to invalidate server session
        api.post('/auth/logout', {}).catch(() => {});
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      loadFromToken: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        try {
          const data = await api.get<{ user: { id: string; email: string; firstName: string; lastName: string; role: UserRole; status: string } }>('/auth/me');
          const user: User = { ...data.user, name: `${data.user.firstName} ${data.user.lastName}` };
          set({ user, token, isAuthenticated: true });
        } catch {
          // Token invalid — clear state
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name:    'dp-auth',
      // Only persist token — re-validate on load
      partialize: (state) => ({ token: state.token }),
    }
  )
);
