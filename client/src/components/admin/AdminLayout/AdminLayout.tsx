'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, TrendingUp, FileText,
  MessageSquare, CreditCard, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Zap, Search,
  Calendar, Users, ClipboardList, BookOpen, ShieldCheck,
  Image as ImageIcon, UserCheck, Activity, Globe,
  Check, CheckCheck, AlertTriangle, Info, Sparkles, Clock, Filter
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RouteGuard } from '@/components/common/RouteGuard/RouteGuard';
import { api } from '@/lib/api';
import styles from './AdminLayout.module.css';

// --- Admin Context for Shared State (e.g., Date Range) ---
export interface AdminDateRange { from: Date; to: Date; label: string; }

interface AdminContextType {
  dateRange: AdminDateRange;
  setDateRange: (r: AdminDateRange) => void;
  agencyStatus: string;
}

export const AdminContext = createContext<AdminContextType>({
  dateRange: { from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date(), label: 'This Month' },
  setDateRange: () => {},
  agencyStatus: 'Operational',
});

export const useAdminContext = () => useContext(AdminContext);

// --- Navigation Configuration ---
const getNavGroups = (counts: { reports: number; campaigns: number; leads: number }) => [
  {
    label: 'Management',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
      { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
      { icon: FileText, label: 'Reports', href: '/admin/reports', badge: counts.reports > 0 ? counts.reports.toString() : undefined }
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Users, label: 'Clients', href: '/admin/clients' },
      { icon: ClipboardList, label: 'Leads & Enquiries', href: '/admin/enquiries', badge: 'LIVE_LEADS' },
      { icon: Megaphone, label: 'Active Campaigns', href: '/admin/campaigns', badge: counts.campaigns > 0 ? counts.campaigns.toString() : undefined }
    ]
  },
  {
    label: 'Content',
    items: [
      { icon: ImageIcon, label: 'Portfolio', href: '/admin/portfolio' },
      { icon: BookOpen, label: 'Blog Articles', href: '/admin/blog' },
      { icon: Globe, label: 'Agency Services', href: '/admin/services' }
    ]
  },
  {
    label: 'System',
    items: [
      { icon: UserCheck, label: 'Team Members', href: '/admin/team', badge: 'Online' },
      { icon: CreditCard, label: 'Invoices & Billing', href: '/admin/invoices' },
      { icon: Settings, label: 'Agency Settings', href: '/admin/settings' }
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

const TIMEOUT_MS = 60 * 60 * 1000; // 1 hour for admins
const WARN_MS = 60;

interface AdminNotification {
  id: string; type: string; title: string; message: string;
  time: string; read: boolean; href: string; icon: string;
}

interface AdminSearchResult {
  type: 'client' | 'lead' | 'campaign' | 'tool'; id: string; title: string; subtitle: string; href: string;
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [countdown, setCountdown] = useState(WARN_MS);
  const [agencyStatus, setAgencyStatus] = useState('Operational');

  // Date Range
  const [dateRange, setDateRange] = useState<AdminDateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
    label: 'This Month'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AdminSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);

  // Live badge counts
  const [liveLeadCount, setLiveLeadCount] = useState<number | null>(null);
  const [liveCounts, setLiveCounts] = useState({ reports: 0, campaigns: 0 });

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- External Data Handlers ---
  const fetchAgencyStatus = useCallback(async () => {
    try {
      const data = await api.get('/admin/status');
      setAgencyStatus(data.status || 'Operational');
    } catch { setAgencyStatus('Warning'); }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (notifLoading) return;
    setNotifLoading(true);
    try {
      const data = await api.get('/admin/notifications');
      setNotifications(data.notifications || []);
    } catch { } finally { setNotifLoading(false); }
  }, []);

  useEffect(() => {
    fetchAgencyStatus();
    const statusInterval = setInterval(fetchAgencyStatus, 5 * 60000); // Check status every 5 mins
    return () => clearInterval(statusInterval);
  }, [fetchAgencyStatus]);

  // Fetch live lead count, report count, and campaign count for sidebar badges
  useEffect(() => {
    const fetchSidebarStats = async () => {
      try {
        const [enqData, reportData, campData] = await Promise.all([
          api.get('/admin/enquiries'),
          api.get('/admin/reports'),
          api.get('/admin/campaigns')
        ]);
        
        const enquiries = enqData.enquiries || [];
        const activeLeadCount = enquiries.filter((e: any) =>
          ['new', 'contacted', 'qualified'].includes(e.status)
        ).length;
        
        setLiveLeadCount(activeLeadCount);
        setLiveCounts({
          reports: reportData.length || 0,
          campaigns: campData.length || 0
        });
      } catch (err) {
        console.warn('Failed to fetch sidebar stats');
      }
    };
    fetchSidebarStats();
  }, []);

  // --- Search Logic ---
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    searchDebounce.current = setTimeout(async () => {
      try {
        const data = await api.get(`/admin/search?q=${encodeURIComponent(q)}`);
        setSearchResults(data.results || []);
      } catch { setSearchResults([]); } finally { setSearchLoading(false); }
    }, 350);
  }, []);

  // --- Click Outside & Keyboard Shortcuts ---
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

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearchPopup(true); }
      if (e.key === 'Escape') { setShowSearchPopup(false); setShowDatePicker(false); setShowNotifications(false); }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, []);

  // --- Session Timer ---
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
      countRef.current = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(countRef.current!); logout(); router.push('/admin/login'); return 0; } return c - 1; }), 1000);
    } else { if (countRef.current) clearInterval(countRef.current); }
    return () => { if (countRef.current) clearInterval(countRef.current); };
  }, [showTimeout]);

  const handleStayLoggedIn = () => { setShowTimeout(false); resetTimer(); };
  const handleLogout = () => { logout(); router.push('/admin/login'); };

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';
  const currentNavGroups = getNavGroups({ ...liveCounts, leads: liveLeadCount || 0 });
  const pageName = currentNavGroups.flatMap(g => g.items).find(i => pathname.startsWith(i.href))?.label || 'Overview';
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) return <RouteGuard>{children}</RouteGuard>;

  return (
    <AdminContext.Provider value={{ dateRange, setDateRange, agencyStatus }}>
      <RouteGuard allowedRoles={['admin', 'staff']}>
        <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
              <div className={styles.logoMark}><Zap size={20} color="#FFFFFF" /></div>
              {!collapsed && (
                <div className={styles.logoText}>
                  <span className={styles.logoName}>DigitalPulse</span>
                  <span className={styles.logoTagline}>Admin Panel</span>
                </div>
              )}
              <button className={styles.collapseToggle} onClick={() => setCollapsed(!collapsed)}>
                <ChevronLeft size={14} className={collapsed ? styles.rotate180 : ''} />
              </button>
            </div>

            <div className={styles.navSection}>
              {currentNavGroups.map((group, idx) => {
                // RBAC: Hide System group for staff
                if (user?.role === 'staff' && group.label === 'System') return null;

                // RBAC: Filter specific items for staff
                const filteredItems = group.items.filter(item => {
                  if (user?.role === 'staff' && (item.label === 'Invoices & Billing' || item.label === 'Agency Settings' || item.label === 'Team Members')) return false;
                  return true;
                });

                if (filteredItems.length === 0) return null;

                return (
                  <div key={idx} className={styles.navGroup}>
                    {!collapsed && <div className={styles.groupLabel}>{group.label}</div>}
                    {filteredItems.map(item => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                          <Icon size={18} className={styles.navIcon} />
                          {!collapsed && (
                            <>
                              <span className={styles.navItemLabel}>{item.label}</span>
                              {item.badge && (
                                <span className={styles.navBadge}>
                                  {item.badge === 'LIVE_LEADS'
                                    ? (liveLeadCount !== null ? liveLeadCount : '…')
                                    : item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className={styles.sidebarFooter}>
              <div className={styles.statusIndicator}>
                <div className={`${styles.statusDot} ${styles[`status_${agencyStatus.toLowerCase()}`]}`} />
                {!collapsed && <span>Agency {agencyStatus}</span>}
              </div>
              <div className={styles.userProfileCard}>
                <div className={styles.userAvatar}>{initials}<div className={styles.onlineDot} /></div>
                {!collapsed && (
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user?.name || 'Administrator'}</div>
                    <div className={styles.userRole}>Agency Owner</div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Container */}
          <div className={styles.main}>
            <header className={styles.headerBar}>
              <div className={styles.headerLeft}>
                <div className={styles.breadcrumb}>
                  <span className={styles.breadMain}>Admin</span>
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
                      <div className={styles.dpHeader}><Calendar size={16} color="#F97316" /><span>Agency Data Range</span></div>
                      <div className={styles.dpPresets}>
                        {PRESET_RANGES.map(p => (
                          <button key={p.label} className={`${styles.dpPreset} ${dateRange.label === p.label ? styles.dpPresetActive : ''}`} onClick={() => { const { from, to } = p.getDates(); setDateRange({ from, to, label: p.label }); setShowDatePicker(false); }}>{p.label}</button>
                        ))}
                      </div>
                      <div className={styles.dpDivider} />
                      <div className={styles.dpCustom}>
                        <div className={styles.dpCustomLabel}>Custom Range</div>
                        <div className={styles.dpCustomRow}>
                          <div className={styles.dpInput}><label>From</label><input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} /></div>
                          <div className={styles.dpInput}><label>To</label><input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} /></div>
                        </div>
                        <button className={styles.dpApplyBtn} onClick={() => { if (customFrom && customTo) { const from = new Date(customFrom); const to = new Date(customTo); setDateRange({ from, to, label: `${formatShort(from)} – ${formatShort(to)}` }); setShowDatePicker(false); } }} disabled={!customFrom || !customTo}>Apply Range</button>
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
                    placeholder="Search clients, leads, tools..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => setShowSearchPopup(true)}
                  />
                  <div className={styles.searchShortcut}>⌘K</div>

                  {showSearchPopup && (
                    <div className={styles.searchPopup}>
                      <div className={styles.searchPopupHeader}><Search size={14} color="#94a3b8" /><span>{searchQuery.length < 2 ? 'Search agency records...' : `Results for "${searchQuery}"`}</span></div>
                      {searchLoading && <div className={styles.searchLoading}><div className={styles.spinner} /> Searching...</div>}
                      {!searchLoading && searchResults.length > 0 && (
                        <div className={styles.searchResults}>
                          {searchResults.map(r => (
                            <Link key={r.id} href={r.href} className={styles.searchResult} onClick={() => { setShowSearchPopup(false); setSearchQuery(''); }}>
                              <div className={`${styles.searchResultIcon} ${styles[r.type]}`}>
                                {r.type === 'client' ? <Users size={14} /> : r.type === 'lead' ? <ClipboardList size={14} /> : <Megaphone size={14} />}
                              </div>
                              <div><div className={styles.searchResultTitle}>{r.title}</div><div className={styles.searchResultSub}>{r.subtitle}</div></div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchQuery.length < 2 && (
                        <div className={styles.searchSuggestions}>
                          <div className={styles.searchSugLabel}>Operations Quick Links</div>
                          {[{ label: 'New Client Onboarding', href: '/admin/clients', icon: Users }, { label: 'Revenue Analytics', href: '/admin/analytics', icon: TrendingUp }, { label: 'Issuing Invoices', href: '/admin/invoices', icon: CreditCard }].map(s => (
                            <Link key={s.href} href={s.href} className={styles.searchSugItem} onClick={() => setShowSearchPopup(false)}><s.icon size={14} /> {s.label}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.iconActions}>
                  {/* Notifications */}
                  <div className={styles.notifContainer} ref={notifRef}>
                    <button className={styles.headerIconButton} onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) fetchNotifications(); }}>
                      <Bell size={20} />
                      {unreadCount > 0 && <div className={styles.notifBadge}>{unreadCount}</div>}
                    </button>

                    {showNotifications && (
                      <div className={styles.notifPanel}>
                        <div className={styles.notifPanelHeader}>
                          <div className={styles.notifPanelTitle}><Bell size={16} /><span>Agency Alerts</span></div>
                          {unreadCount > 0 && <button className={styles.markAllBtn} onClick={() => setReadIds(new Set(notifications.map(n => n.id)))}><CheckCheck size={14} /> Clear all</button>}
                        </div>
                        <div className={styles.notifList}>
                          {notifLoading && <div className={styles.notifLoading}><div className={styles.spinner} /> Loading...</div>}
                          {!notifLoading && notifications.length === 0 && <div className={styles.notifEmpty}><Sparkles size={32} color="#e2e8f0" /><span>All systems green!</span></div>}
                          {!notifLoading && notifications.map(n => (
                            <Link key={n.id} href={n.href} className={`${styles.notifItem} ${readIds.has(n.id) ? styles.notifRead : ''}`} onClick={() => { setReadIds(prev => new Set([...prev, n.id])); setShowNotifications(false); }}>
                              <div className={`${styles.notifIcon} ${styles[`notif_${n.type}`]}`}>{n.type === 'warning' ? <AlertTriangle size={14} /> : <Check size={14} />}</div>
                              <div className={styles.notifBody}><div className={styles.notifTitle}>{n.title}</div><div className={styles.notifMsg}>{n.message}</div><div className={styles.notifTime}><Clock size={11} /> {n.time}</div></div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className={styles.profileContainer} ref={profileMenuRef}>
                    <div className={styles.accountAvatar} onClick={() => setShowProfileMenu(!showProfileMenu)}>{initials}</div>
                    {showProfileMenu && (
                      <div className={styles.dropdownMenu}>
                        <div className={styles.dropdownHeader}><div className={styles.dropdownUserName}>{user?.name}</div><div className={styles.dropdownUserEmail}>{user?.email}</div></div>
                        <div className={styles.dropdownDivider} />
                        <Link href="/admin/settings" className={styles.dropdownItem} onClick={() => setShowProfileMenu(false)}><Settings size={16} /><span>Agency Settings</span></Link>
                        <button className={styles.dropdownItem} onClick={handleLogout}><LogOut size={16} /><span>Logout</span></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <div className={styles.content}>{children}</div>
          </div>

          {/* Session Timeout */}
          {showTimeout && (
            <div className={styles.timeoutOverlay}>
              <div className={styles.timeoutModal}>
                <div className={styles.timeoutIcon}>⏱</div>
                <h3>Admin Session Expiring</h3>
                <p>Security protocol: You will be logged out in <strong>{countdown}</strong> seconds due to inactivity.</p>
                <div className={styles.timeoutActions}><button className={styles.stayBtn} onClick={handleStayLoggedIn}>Extend Session</button><button className={styles.logoutNowBtn} onClick={handleLogout}>Logout Now</button></div>
              </div>
            </div>
          )}
        </div>
      </RouteGuard>
    </AdminContext.Provider>
  );
}
