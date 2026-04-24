'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, TrendingUp, FileText,
  MessageSquare, CreditCard, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Zap, Search,
  Calendar, Users, ClipboardList, BookOpen, ShieldCheck,
  Image as ImageIcon, UserCheck, Activity, Globe
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RouteGuard } from '@/components/common/RouteGuard/RouteGuard';
import { api } from '@/lib/api';
import styles from './AdminLayout.module.css';

const navGroups = [
  {
    label: 'Management',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
      { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
      { icon: FileText, label: 'Reports', href: '/admin/reports', badge: '3' }
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Users, label: 'Clients', href: '/admin/clients' },
      { icon: ClipboardList, label: 'Leads & Enquiries', href: '/admin/enquiries', badge: '12' },
      { icon: Megaphone, label: 'Active Campaigns', href: '/admin/campaigns' }
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

const TIMEOUT_MS = 60 * 60 * 1000; // 60 min for Admins
const WARN_MS = 60; // seconds to count down

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ clients: any[], leads: any[] }>({ clients: [], leads: [] });
  const [counts, setCounts] = useState({ reports: 0, leads: 0 });
  const [countdown, setCountdown] = useState(WARN_MS);
  const [agencyStatus, setAgencyStatus] = useState('Operational');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/admin/status');
      setAgencyStatus(res.status);
    } catch (err) {
      console.error('Failed to fetch status');
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications');
      setNotifications(res || []);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleStatusToggle = async () => {
    const statuses = ['Operational', 'Maintenance', 'Issue'];
    const currentIndex = statuses.indexOf(agencyStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    try {
      setAgencyStatus(nextStatus);
      await api.post('/admin/status', { status: nextStatus });
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const handleClearNotifications = async () => {
    try {
      await api.delete('/admin/notifications');
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications');
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (showTimeout) return;
    timerRef.current = setTimeout(() => {
      setShowTimeout(true);
      setCountdown(WARN_MS);
    }, TIMEOUT_MS);
  };

  useEffect(() => {
    resetTimer();
    fetchStatus();
    fetchNotifications();
    
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
      resetTimer();
    };

    window.addEventListener('keydown', handleKeyDown);
    events.forEach(e => e !== 'keydown' && window.addEventListener(e, resetTimer));
    
    // Polling for live status
    const interval = setInterval(() => {
        fetchStatus();
        fetchNotifications();
    }, 30000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      events.forEach(e => e !== 'keydown' && window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const stats = await api.get('/admin/stats');
        setCounts({ reports: 0, leads: stats.leads });
      } catch (err) {
        console.error('Failed to fetch sidebar counts');
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    if (showTimeout) {
      countRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(countRef.current!);
            logout();
            router.push('/portal/login');
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      if (countRef.current) clearInterval(countRef.current);
    }
    return () => { if (countRef.current) clearInterval(countRef.current); };
  }, [showTimeout]);

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const results = await api.get(`/admin/search?q=${searchQuery}`);
          setSearchResults(results);
        } catch (err) {
          console.error('Search failed');
        }
      } else {
        setSearchResults({ clients: [], leads: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleStayLoggedIn = () => { setShowTimeout(false); resetTimer(); };
  const handleLogout = () => { logout(); router.push('/portal/login'); };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'PN';

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <RouteGuard>{children}</RouteGuard>;
  }

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
        <aside className={styles.sidebar}>
          <div className={styles.logoSection}>
            <div className={styles.logoMark}>
              <Zap size={20} color="#FFFFFF" strokeWidth={3} />
            </div>
            {!collapsed && (
              <div className={styles.logoText}>
                <span className={styles.logoName}>DigitalPulse</span>
                <span className={styles.logoTagline}>Command Center</span>
              </div>
            )}
            <button className={styles.collapseToggle} onClick={() => setCollapsed(!collapsed)}>
              <ChevronLeft size={14} className={collapsed ? styles.rotate180 : ''} />
            </button>
          </div>

          <div className={styles.navSection}>
            {navGroups.map((group, idx) => (
              <div key={idx} className={styles.navGroup}>
                {!collapsed && <div className={styles.groupLabel}>{group.label}</div>}
                {group.items.map(item => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  
                  // Dynamic badge override
                  let badge = item.badge;
                  if (item.label === 'Leads & Enquiries') badge = counts.leads > 0 ? counts.leads.toString() : undefined;
                  if (item.label === 'Reports') badge = counts.reports > 0 ? counts.reports.toString() : undefined;

                  return (
                    <Link key={item.href} href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                      <Icon size={18} className={styles.navIcon} />
                      {!collapsed && (
                        <>
                          <span className={styles.navItemLabel}>{item.label}</span>
                          {badge && <span className={styles.navBadge}>{badge}</span>}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.userProfileCard}>
              <div className={styles.userAvatar}>
                {initials}
                <div className={styles.onlineDot} />
              </div>
              {!collapsed && (
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user?.name || 'Priya Nanthakumar'}</div>
                  <div className={styles.userPlan}>Founder & CEO</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.headerBar}>
            <div className={styles.headerLeft}>
              <div className={styles.breadcrumb}>
                <ShieldCheck size={16} color="#F97316" />
                <span className={styles.breadMain}>Agency Admin</span>
                <ChevronRight size={14} className={styles.breadSeparator} />
                <span className={styles.breadCurrent}>
                  {pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
                </span>
              </div>

              <div 
                className={`${styles.periodBadge} ${
                  agencyStatus === 'Operational' ? styles.periodBadgeActive : 
                  agencyStatus === 'Maintenance' ? styles.periodBadgeMaintenance : 
                  styles.periodBadgeIssue
                }`}
                onClick={handleStatusToggle}
                title="Click to toggle agency status"
              >
                <Activity size={14} color={
                  agencyStatus === 'Operational' ? "#059669" : 
                  agencyStatus === 'Maintenance' ? "#D97706" : 
                  "#DC2626"
                } />
                <span>Live Status: {agencyStatus}</span>
              </div>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.globalSearch} onClick={() => setIsSearchOpen(true)}>
                <Search size={16} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search leads, clients, invoices..." 
                  className={styles.searchInput} 
                  readOnly
                />
                <div className={styles.searchShortcut}>⌘K</div>
              </div>

              <div className={styles.iconActions}>
                <div className={styles.profileContainer} ref={notifMenuRef}>
                  <button 
                    className={styles.headerIconButton} 
                    onClick={() => setShowNotifPopup(!showNotifPopup)}
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && <div className={styles.notifBadge} />}
                  </button>

                  {showNotifPopup && (
                    <div className={styles.notifPopup}>
                      <div className={styles.notifHeader}>
                        <h3 className={styles.notifTitle}>Notifications</h3>
                        {notifications.length > 0 && (
                          <button className={styles.clearAllBtn} onClick={handleClearNotifications}>
                            Clear All
                          </button>
                        )}
                      </div>
                      <div className={styles.notifList}>
                        {notifications.length > 0 ? (
                          notifications.map((n: any) => {
                            const iconMap: any = {
                              'Lead': Users,
                              'Campaign': Megaphone,
                              'Invoice': CreditCard,
                              'System': ShieldCheck
                            };
                            const colorMap: any = {
                              'Lead': '#F97316',
                              'Campaign': '#06B6D4',
                              'Invoice': '#8B5CF6',
                              'System': '#64748B'
                            };
                            const Icon = iconMap[n.type] || Bell;
                            const color = colorMap[n.type] || '#F97316';

                            return (
                              <div key={n.id} className={`${styles.notifItem} ${!n.isRead ? styles.notifItemUnread : ''}`}>
                                <div className={styles.notifIconBox} style={{ backgroundColor: `${color}15`, color: color }}>
                                  <Icon size={18} />
                                </div>
                                <div className={styles.notifContent}>
                                  <span className={styles.notifItemTitle}>{n.title}</span>
                                  <span className={styles.notifItemBody}>{n.body}</span>
                                  <span className={styles.notifItemTime}>
                                    {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} · {new Date(n.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className={styles.notifEmpty}>
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.profileContainer} ref={profileMenuRef}>
                  <div 
                    className={styles.accountAvatar} 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    {initials}
                  </div>
                  
                  {showProfileMenu && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownUserName}>{user?.name}</div>
                        <div className={styles.dropdownUserEmail}>{user?.email}</div>
                      </div>
                      <div className={styles.dropdownDivider} />
                      <Link href="/admin/settings" className={styles.dropdownItem}>
                        <Settings size={16} />
                        <span>Agency Settings</span>
                      </Link>
                      <button className={styles.dropdownItem} onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Switch Account / Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>{children}</div>
        </div>

        {showTimeout && (
          <div className={styles.timeoutOverlay}>
            <div className={styles.timeoutModal}>
              <div className={styles.timeoutIcon}>🔐</div>
              <h3>Security Session Timeout</h3>
              <p>For your security, administrative sessions expire after 60 minutes. Logout in <strong>{countdown}</strong> seconds.</p>
              <div className={styles.timeoutActions}>
                <button className={styles.stayBtn} onClick={handleStayLoggedIn}>Stay Online</button>
                <button className={styles.logoutNowBtn} onClick={handleLogout}>Logout Now</button>
              </div>
            </div>
          </div>
        )}

        {/* --- COMMAND PALETTE (⌘K) --- */}
        {isSearchOpen && (
          <div className={styles.commandOverlay} onClick={() => setIsSearchOpen(false)}>
            <div className={styles.commandPalette} onClick={e => e.stopPropagation()}>
              <div className={styles.commandHeader}>
                <Search size={20} className={styles.commandIcon} />
                <input 
                  autoFocus 
                  placeholder="Type to search clients, leads, or pages..." 
                  className={styles.commandInput}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button className={styles.escBtn} onClick={() => setIsSearchOpen(false)}>ESC</button>
              </div>
              <div className={styles.commandBody}>
                 <div className={styles.commandGroup}>
                    <div className={styles.groupHeader}>Clients</div>
                    {searchResults.clients.length > 0 ? searchResults.clients.map(c => (
                       <Link key={c.id} href={`/admin/clients`} className={styles.commandItem} onClick={() => setIsSearchOpen(false)}>
                         <Users size={16} /> <span>{c.companyName}</span>
                       </Link>
                    )) : searchQuery.length > 1 && <div className={styles.noResults}>No clients found.</div>}
                    {!searchQuery && (
                      <div className={styles.commandItem}><Users size={16} /> <span>Miller Digital Strategy (Example)</span></div>
                    )}
                 </div>
                 <div className={styles.commandGroup}>
                    <div className={styles.groupHeader}>Leads</div>
                    {searchResults.leads.length > 0 ? searchResults.leads.map(l => (
                       <Link key={l.id} href={`/admin/enquiries`} className={styles.commandItem} onClick={() => setIsSearchOpen(false)}>
                         <ClipboardList size={16} /> <span>{l.firstName} {l.lastName} ({l.companyName || 'Lead'})</span>
                       </Link>
                    )) : searchQuery.length > 1 && <div className={styles.noResults}>No leads found.</div>}
                 </div>
              </div>
              <div className={styles.commandFooter}>
                 <span><kbd>↑↓</kbd> Navigate</span>
                 <span><kbd>↵</kbd> Select</span>
                 <span><kbd>esc</kbd> Close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
