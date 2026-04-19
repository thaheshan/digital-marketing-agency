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
                <span className={styles.breadCurrent}>Dashboard</span>
              </div>

              <div className={styles.periodBadge}>
                <Activity size={14} color="#F97316" />
                <span>Live Status: Operational</span>
              </div>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.globalSearch}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Search leads, clients, invoices..." className={styles.searchInput} />
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
      </div>
    </RouteGuard>
  );
}
