import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UiState {
  sidebarCollapsed: boolean;
  chatbotOpen: boolean;
  chatbotMinimised: boolean;
  sessionTimeoutWarning: boolean;
  notifications: Notification[];

  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setChatbotOpen: (v: boolean) => void;
  toggleChatbot: () => void;
  minimiseChatbot: () => void;
  setSessionTimeoutWarning: (v: boolean) => void;
  addNotification: (n: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarCollapsed: false,
  chatbotOpen: false,
  chatbotMinimised: false,
  sessionTimeoutWarning: false,
  notifications: [],

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setChatbotOpen: (v) => set({ chatbotOpen: v, chatbotMinimised: false }),
  toggleChatbot: () => set(s => ({ chatbotOpen: !s.chatbotOpen, chatbotMinimised: false })),
  minimiseChatbot: () => set({ chatbotMinimised: true }),
  setSessionTimeoutWarning: (v) => set({ sessionTimeoutWarning: v }),
  addNotification: (n) => {
    const id = Date.now().toString();
    set(s => ({ notifications: [...s.notifications, { ...n, id }] }));
    setTimeout(() => get().removeNotification(id), 4000);
  },
  removeNotification: (id) => set(s => ({ notifications: s.notifications.filter(x => x.id !== id) })),
}));
