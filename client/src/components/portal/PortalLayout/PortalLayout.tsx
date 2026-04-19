'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, TrendingUp, FileText,
  MessageSquare, CreditCard, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Zap, Search,
  Calendar, Mail, X
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RouteGuard } from '@/components/common/RouteGuard/RouteGuard';
import styles from './PortalLayout.module.css';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/portal/dashboard' },
      { icon: TrendingUp, label: 'Analytics', href: '/portal/analytics' },
      { icon: FileText, label: 'Performance', href: '/portal/performance' }
    ]
  },
  {
    label: 'Campaigns',
    items: [
      { icon: Megaphone, label: 'Active Campaigns', href: '/portal/campaigns', badge: '5' },
      { icon: CreditCard, label: 'Ad Spend', href: '/portal/ad-spend' },
      { icon: TrendingUp, label: 'Goals & KPIs', href: '/portal/goals' }
    ]
  },
  {
    label: 'Services',
    items: [
      { icon: LayoutDashboard, label: 'SEO', href: '/portal/seo' },
      { icon: MessageSquare, label: 'Social Media', href: '/portal/social' },
      { icon: Mail, label: 'Email Marketing', href: '/portal/email' },
      { icon: FileText, label: 'Content', href: '/portal/content' }
    ]
  },
  {
    label: 'Reports',
    items: [
      { icon: FileText, label: 'Monthly Reports', href: '/portal/reports', badge: '2' },
      { icon: TrendingUp, label: 'Export Data', href: '/portal/export' }
    ]
  },
  {
    label: 'Account',
    items: [
      { icon: Settings, label: 'Settings', href: '/portal/settings' },
      { icon: Bell, label: 'Support', href: '/portal/support' }
    ]
  }
];

const TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const WARN_MS = 60; // seconds to count down

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [countdown, setCountdown] = useState(WARN_MS);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Close profile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
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

  const handleStayLoggedIn = () => { setShowTimeout(false); resetTimer(); };
  const handleLogout = () => { logout(); router.push('/portal/login'); };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'SM';

  const isLoginPage = pathname === '/portal/login';

  if (isLoginPage) {
    return <RouteGuard>{children}</RouteGuard>;
  }

  return (
    <RouteGuard allowedRoles={['client', 'admin']}>
      <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
        <aside className={styles.sidebar}>
          <div className={styles.logoSection}>
            <div className={styles.logoMark}>
              <Zap size={20} color="#FFFFFF" />
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
                  return (
                    <Link key={item.href} href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                      <Icon size={18} className={styles.navIcon} />
                      {!collapsed && (
                        <>
                          <span className={styles.navItemLabel}>{item.label}</span>
                          {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
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
                  <div className={styles.userName}>{user?.name || 'Sarah Miller'}</div>
                  <div className={styles.userPlan}>{user?.company || 'Miller Digital'}</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.headerBar}>
            <div className={styles.headerLeft}>
              <div className={styles.breadcrumb}>
                <span className={styles.breadMain}>DigitalPulse</span>
                <ChevronRight size={14} className={styles.breadSeparator} />
                <span className={styles.breadCurrent}>Dashboard</span>
              </div>

              <div className={styles.periodBadge}>
                <Calendar size={14} />
                <span>Apr 1 – Apr 30, 2026</span>
              </div>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.globalSearch}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Search reports, campaigns..." className={styles.searchInput} />
                <div className={styles.searchShortcut}>⌘K</div>
              </div>

              <div className={styles.iconActions}>
                <button className={styles.headerIconButton}>
                  <Bell size={20} />
                  <div className={styles.notifBadge} />
                </button>
                
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
                      <button className={styles.dropdownItem}>
                        <Settings size={16} />
                        <span>Account Settings</span>
                      </button>
                      <button className={styles.dropdownItem} onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
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
  );
}
