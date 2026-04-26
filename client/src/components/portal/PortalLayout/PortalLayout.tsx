'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, TrendingUp, FileText,
  MessageSquare, CreditCard, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Zap, Search,
  Calendar, Mail, X, Check, CheckCheck,
  AlertTriangle, Info, Sparkles, Clock, Filter
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RouteGuard } from '@/components/common/RouteGuard/RouteGuard';
import { api } from '@/lib/api';
import styles from './PortalLayout.module.css';

// --- Date Range Context ---
export interface DateRange { from: Date; to: Date; label: string; }

interface PortalContextType {
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
}

export const PortalContext = createContext<PortalContextType>({
  dateRange: { from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date(), label: 'This Month' },
  setDateRange: () => {},
});

export const usePortalDateRange = () => useContext(PortalContext);

// --- Nav Config ---
const navGroups = (stats: { campaigns: number; reports: number }) => [
  {
    label: 'Command Center',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/portal/dashboard' },
      { icon: TrendingUp, label: 'Growth Analytics', href: '/portal/analytics' },
      { icon: FileText, label: 'Performance Review', href: '/portal/performance' }
    ]
  },
  {
    label: 'Campaign Management',
    items: [
      { icon: Megaphone, label: 'Active Campaigns', href: '/portal/campaigns', badge: stats.campaigns > 0 ? stats.campaigns.toString() : undefined },
      { icon: CreditCard, label: 'Ad Spend & ROI', href: '/portal/ad-spend' },
      { icon: TrendingUp, label: 'Goals & KPIs', href: '/portal/goals' }
    ]
  },
  {
    label: 'Premium Services',
    items: [
      { icon: LayoutDashboard, label: 'SEO Visibility', href: '/portal/seo' },
      { icon: MessageSquare, label: 'Social Engagement', href: '/portal/social' },
      { icon: Mail, label: 'Email Marketing', href: '/portal/email' },
      { icon: FileText, label: 'Content Strategy', href: '/portal/content' }
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { icon: FileText, label: 'Monthly Reports', href: '/portal/reports', badge: stats.reports > 0 ? stats.reports.toString() : undefined },
      { icon: TrendingUp, label: 'Data Export', href: '/portal/export' }
    ]
  },
  {
    label: 'Account & Support',
    items: [
      { icon: Settings, label: 'Global Settings', href: '/portal/settings' },
      { icon: Bell, label: 'Support & Tickets', href: '/portal/support' }
    ]
  }
];

const PRESET_RANGES = [
  { label: 'Today', getDates: () => { const t = new Date(); return { from: t, to: t }; } },
  { label: 'Last 7 Days', getDates: () => ({ from: new Date(Date.now() - 6 * 86400000), to: new Date() }) },
  { label: 'This Month', getDates: () => ({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() }) },
  { label: 'Last Month', getDates: () => { const d = new Date(); return { from: new Date(d.getFullYear(), d.getMonth() - 1, 1), to: new Date(d.getFullYear(), d.getMonth(), 0) }; } },
  { label: 'Last 3 Months', getDates: () => ({ from: new Date(Date.now() - 90 * 86400000), to: new Date() }) },
  { label: 'Last 6 Months', getDates: () => ({ from: new Date(Date.now() - 180 * 86400000), to: new Date() }) },
  { label: 'This Year', getDates: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) },
];

const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const formatShort = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const TIMEOUT_MS = 30 * 60 * 1000;
const WARN_MS = 60;

interface Notification {
  id: string; type: string; title: string; message: string;
  time: string; read: boolean; href: string; icon: string;
}

interface SearchResult {
  type: string; id: string; title: string; subtitle: string; href: string;
}

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [countdown, setCountdown] = useState(WARN_MS);
  const [stats, setStats] = useState({ campaigns: 0, reports: 0 });

  // Date Range
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
    label: 'This Month'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Sync Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [campData, reportData] = await Promise.all([
          api.get('/portal/campaigns'),
          api.get('/portal/reports')
        ]);
        setStats({
          campaigns: campData.campaigns?.length || 0,
          reports: reportData.length || 0
        });
      } catch (err) {
        console.warn('Failed to fetch sidebar stats');
      }
    };
    if (user) fetchStats();
  }, [user]);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Click Outside Handler ---
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) setShowProfileMenu(false);
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) setShowDatePicker(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchPopup(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // --- Keyboard shortcut ⌘K ---
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearchPopup(true); }
      if (e.key === 'Escape') { setShowSearchPopup(false); setShowDatePicker(false); setShowNotifications(false); }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, []);

  // --- Session Timeout ---
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setShowTimeout(true); setCountdown(WARN_MS); }, TIMEOUT_MS);
  }, []);

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    return () => { if (timerRef.current) clearTimeout(timerRef.current); events.forEach(e => window.removeEventListener(e, resetTimer)); };
  }, [resetTimer]);

  useEffect(() => {
    if (showTimeout) {
      countRef.current = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(countRef.current!); logout(); router.push('/portal/login'); return 0; } return c - 1; }), 1000);
    } else { if (countRef.current) clearInterval(countRef.current); }
    return () => { if (countRef.current) clearInterval(countRef.current); };
  }, [showTimeout]);

  // --- Search ---
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    searchDebounce.current = setTimeout(async () => {
      try {
        const data = await api.get(`/portal/search?q=${encodeURIComponent(q)}`);
        setSearchResults(data.results || []);
      } catch { setSearchResults([]); } finally { setSearchLoading(false); }
    }, 350);
  }, []);

  // --- Notifications ---
  const fetchNotifications = useCallback(async () => {
    if (notifLoading) return;
    setNotifLoading(true);
    try {
      const data = await api.get('/portal/notifications');
      setNotifications(data.notifications || []);
    } catch { } finally { setNotifLoading(false); }
  }, []);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAllRead = async () => {
    setReadIds(new Set(notifications.map(n => n.id)));
    try { await api.patch('/portal/notifications/read-all', {}); } catch {}
  };

  // --- Date Range ---
  const applyPreset = (preset: typeof PRESET_RANGES[0]) => {
    const { from, to } = preset.getDates();
    setDateRange({ from, to, label: preset.label });
    setShowDatePicker(false);
  };

  const applyCustomRange = () => {
    if (!customFrom || !customTo) return;
    const from = new Date(customFrom);
    const to = new Date(customTo);
    if (from > to) return;
    setDateRange({ from, to, label: `${formatShort(from)} – ${formatShort(to)}` });
    setShowDatePicker(false);
  };

  const handleStayLoggedIn = () => { setShowTimeout(false); resetTimer(); };
  const handleLogout = () => { logout(); router.push('/portal/login'); };
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'SM';
  const currentNavGroups = navGroups(stats);
  const pageName = currentNavGroups.flatMap(g => g.items).find(i => pathname.startsWith(i.href))?.label || 'Dashboard';
  const isLoginPage = pathname === '/portal/login';

  if (isLoginPage) return <RouteGuard>{children}</RouteGuard>;

  return (
    <PortalContext.Provider value={{ dateRange, setDateRange }}>
      <RouteGuard allowedRoles={['client', 'admin']}>
        <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
              <div className={styles.logoMark}><Zap size={20} color="#FFFFFF" /></div>
              {!collapsed && (<div className={styles.logoText}><span className={styles.logoName}>DigitalPulse</span><span className={styles.logoTagline}>Client Portal</span></div>)}
              <button className={styles.collapseToggle} onClick={() => setCollapsed(!collapsed)}>
                <ChevronLeft size={14} className={collapsed ? styles.rotate180 : ''} />
              </button>
            </div>

            <div className={styles.navSection}>
              {currentNavGroups.map((group, idx) => (
                <div key={idx} className={styles.navGroup}>
                  {!collapsed && <div className={styles.groupLabel}>{group.label}</div>}
                  {group.items.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                        <Icon size={18} className={styles.navIcon} />
                        {!collapsed && (<><span className={styles.navItemLabel}>{item.label}</span>{item.badge && <span className={styles.navBadge}>{item.badge}</span>}</>)}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={styles.sidebarFooter}>
              <div className={styles.userProfileCard}>
                <div className={styles.userAvatar}>{initials}<div className={styles.onlineDot} /></div>
                {!collapsed && (<div className={styles.userInfo}><div className={styles.userName}>{user?.name || 'Client'}</div><div className={styles.userPlan}>{user?.company || 'My Account'}</div></div>)}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className={styles.main}>
            <header className={styles.headerBar}>
              <div className={styles.headerLeft}>
                <div className={styles.breadcrumb}>
                  <span className={styles.breadMain}>DigitalPulse</span>
                  <ChevronRight size={14} className={styles.breadSeparator} />
                  <span className={styles.breadCurrent}>{pageName}</span>
                </div>

                {/* Date Range Picker */}
                <div className={styles.datePickerWrap} ref={datePickerRef}>
                  <button className={styles.periodBadge} onClick={() => setShowDatePicker(!showDatePicker)}>
                    <Calendar size={14} />
                    <span>{dateRange.label === 'This Month' ? `${formatShort(dateRange.from)} – ${formatShort(dateRange.to)}` : dateRange.label}</span>
                    <ChevronRight size={12} style={{ transform: showDatePicker ? 'rotate(90deg)' : 'rotate(0)', transition: '0.2s' }} />
                  </button>

                  {showDatePicker && (
                    <div className={styles.datePickerPopup}>
                      <div className={styles.dpHeader}>
                        <Calendar size={16} color="#06B6D4" />
                        <span>Select Date Range</span>
                      </div>
                      <div className={styles.dpPresets}>
                        {PRESET_RANGES.map(p => (
                          <button
                            key={p.label}
                            className={`${styles.dpPreset} ${dateRange.label === p.label ? styles.dpPresetActive : ''}`}
                            onClick={() => applyPreset(p)}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                      <div className={styles.dpDivider} />
                      <div className={styles.dpCustom}>
                        <div className={styles.dpCustomLabel}>Custom Range</div>
                        <div className={styles.dpCustomRow}>
                          <div className={styles.dpInput}>
                            <label>From</label>
                            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
                          </div>
                          <div className={styles.dpInput}>
                            <label>To</label>
                            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} />
                          </div>
                        </div>
                        <button className={styles.dpApplyBtn} onClick={applyCustomRange} disabled={!customFrom || !customTo}>
                          Apply Custom Range
                        </button>
                      </div>
                      <div className={styles.dpFooter}>
                        <span>Showing: <strong>{formatDate(dateRange.from)}</strong> → <strong>{formatDate(dateRange.to)}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.headerRight}>
                {/* Search */}
                <div className={styles.globalSearch} ref={searchRef}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search reports, campaigns..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => setShowSearchPopup(true)}
                  />
                  <div className={styles.searchShortcut}>⌘K</div>

                  {showSearchPopup && (
                    <div className={styles.searchPopup}>
                      <div className={styles.searchPopupHeader}>
                        <Search size={14} color="#94a3b8" />
                        <span>{searchQuery.length < 2 ? 'Type to search campaigns, reports...' : `Results for "${searchQuery}"`}</span>
                      </div>
                      {searchLoading && <div className={styles.searchLoading}><div className={styles.spinner} /> Searching...</div>}
                      {!searchLoading && searchResults.length > 0 && (
                        <div className={styles.searchResults}>
                          {searchResults.map(r => (
                            <Link key={r.id} href={r.href} className={styles.searchResult} onClick={() => { setShowSearchPopup(false); setSearchQuery(''); }}>
                              <div className={`${styles.searchResultIcon} ${styles[r.type]}`}>
                                {r.type === 'campaign' ? <Megaphone size={14} /> : <FileText size={14} />}
                              </div>
                              <div>
                                <div className={styles.searchResultTitle}>{r.title}</div>
                                <div className={styles.searchResultSub}>{r.subtitle}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {!searchLoading && searchQuery.length >= 2 && searchResults.length === 0 && (
                        <div className={styles.searchEmpty}>No results found for "{searchQuery}"</div>
                      )}
                      {searchQuery.length < 2 && (
                        <div className={styles.searchSuggestions}>
                          <div className={styles.searchSugLabel}>Quick Links</div>
                          {[{ label: 'Active Campaigns', href: '/portal/campaigns', icon: Megaphone }, { label: 'Monthly Reports', href: '/portal/reports', icon: FileText }, { label: 'Analytics', href: '/portal/analytics', icon: TrendingUp }].map(s => (
                            <Link key={s.href} href={s.href} className={styles.searchSugItem} onClick={() => setShowSearchPopup(false)}>
                              <s.icon size={14} /> {s.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.iconActions}>
                  {/* Notifications Bell */}
                  <div className={styles.notifContainer} ref={notifRef}>
                    <button
                      className={styles.headerIconButton}
                      onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) fetchNotifications(); }}
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && <div className={styles.notifBadge}>{unreadCount > 9 ? '9+' : unreadCount}</div>}
                    </button>

                    {showNotifications && (
                      <div className={styles.notifPanel}>
                        <div className={styles.notifPanelHeader}>
                          <div className={styles.notifPanelTitle}>
                            <Bell size={16} />
                            <span>Notifications</span>
                            {unreadCount > 0 && <span className={styles.notifCount}>{unreadCount}</span>}
                          </div>
                          {unreadCount > 0 && (
                            <button className={styles.markAllBtn} onClick={markAllRead}>
                              <CheckCheck size={14} /> Mark all read
                            </button>
                          )}
                        </div>
                        <div className={styles.notifList}>
                          {notifLoading && <div className={styles.notifLoading}><div className={styles.spinner} /> Loading...</div>}
                          {!notifLoading && notifications.length === 0 && (
                            <div className={styles.notifEmpty}>
                              <Sparkles size={32} color="#e2e8f0" />
                              <span>You're all caught up!</span>
                            </div>
                          )}
                          {!notifLoading && notifications.map(n => {
                            const isRead = readIds.has(n.id);
                            const timeAgo = (() => {
                              const diff = Date.now() - new Date(n.time).getTime();
                              if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
                              if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
                              return `${Math.round(diff / 86400000)}d ago`;
                            })();
                            return (
                              <Link
                                key={n.id}
                                href={n.href}
                                className={`${styles.notifItem} ${isRead ? styles.notifRead : ''}`}
                                onClick={() => { setReadIds(prev => new Set([...prev, n.id])); setShowNotifications(false); }}
                              >
                                <div className={`${styles.notifIcon} ${styles[`notif_${n.type}`]}`}>
                                  {n.type === 'warning' ? <AlertTriangle size={14} /> : n.type === 'success' ? <Check size={14} /> : <Info size={14} />}
                                </div>
                                <div className={styles.notifBody}>
                                  <div className={styles.notifTitle}>{n.title}</div>
                                  <div className={styles.notifMsg}>{n.message}</div>
                                  <div className={styles.notifTime}><Clock size={11} /> {timeAgo}</div>
                                </div>
                                {!isRead && <div className={styles.unreadDot} />}
                              </Link>
                            );
                          })}
                        </div>
                        <div className={styles.notifFooter}>
                          <Link href="/portal/support" onClick={() => setShowNotifications(false)}>View all activity</Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className={styles.profileContainer} ref={profileMenuRef}>
                    <div className={styles.accountAvatar} onClick={() => setShowProfileMenu(!showProfileMenu)}>{initials}</div>
                    {showProfileMenu && (
                      <div className={styles.dropdownMenu}>
                        <div className={styles.dropdownHeader}>
                          <div className={styles.dropdownUserName}>{user?.name}</div>
                          <div className={styles.dropdownUserEmail}>{user?.email}</div>
                        </div>
                        <div className={styles.dropdownDivider} />
                        <Link href="/portal/settings" className={styles.dropdownItem} onClick={() => setShowProfileMenu(false)}>
                          <Settings size={16} /><span>Account Settings</span>
                        </Link>
                        <button className={styles.dropdownItem} onClick={handleLogout}><LogOut size={16} /><span>Logout</span></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <div className={styles.content}>{children}</div>
          </div>

          {/* Session Timeout Modal */}
          {showTimeout && (
            <div className={styles.timeoutOverlay}>
              <div className={styles.timeoutModal}>
                <div className={styles.timeoutIcon}>⏱</div>
                <h3>Session Expiring</h3>
                <p>You will be automatically logged out in <strong>{countdown}</strong> seconds due to inactivity.</p>
                <div className={styles.timeoutActions}>
                  <button className={styles.stayBtn} onClick={handleStayLoggedIn}>Stay Logged In</button>
                  <button className={styles.logoutNowBtn} onClick={handleLogout}>Logout Now</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </RouteGuard>
    </PortalContext.Provider>
  );
}
