'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, TrendingUp, FileText,
  MessageSquare, CreditCard, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RouteGuard } from '@/components/common/RouteGuard/RouteGuard';
import styles from './PortalLayout.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/portal/dashboard' },
  { icon: Megaphone, label: 'Campaigns', href: '/portal/campaigns' },
  { icon: TrendingUp, label: 'Analytics', href: '/portal/analytics' },
  { icon: FileText, label: 'Reports', href: '/portal/reports' },
  { icon: MessageSquare, label: 'Messages', href: '/portal/messages', badge: 3 },
  { icon: CreditCard, label: 'Invoices', href: '/portal/invoices' },
  { icon: Settings, label: 'Settings', href: '/portal/settings' },
];

const TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const WARN_MS = 60; // seconds to count down

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [countdown, setCountdown] = useState(WARN_MS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'JD';

  return (
    <RouteGuard allowedRoles={['client', 'admin']}>
      <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <TrendingUp size={18} color="#06B6D4" strokeWidth={3} />
              </div>
              {!collapsed && <span className={styles.logoText}>Digital<span className={styles.logoAccent}>Pulse</span></span>}
            </div>
            <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          </div>

          <nav className={styles.nav}>
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                  <Icon size={19} className={styles.navIcon} strokeWidth={isActive ? 2.5 : 2} />
                  {!collapsed && (
                    <>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarBottom}>
            {!collapsed && (
              <div className={styles.userCard}>
                <div className={styles.userAvatar}>{initials}</div>
                <div className={styles.userInfo}>
                  <strong>{user?.name || 'Client'}</strong>
                  <span>{user?.company || 'Portal Account'}</span>
                </div>
              </div>
            )}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} className={styles.navIcon} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <div className={styles.breadcrumbs}>
                <span>Portal</span>
                <span className={styles.breadDivider}>/</span>
                <span className={styles.breadCurrent}>
                  {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label ?? 'Dashboard'}
                </span>
              </div>
            </div>
            <div className={styles.topbarRight}>
              <div className={styles.notifBtn}>
                <Bell size={19} />
                <span className={styles.notifDot} />
              </div>
              <div className={styles.topbarAvatar}>{initials}</div>
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
