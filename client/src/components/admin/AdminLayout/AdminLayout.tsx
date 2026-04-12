'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, Megaphone, TrendingUp, FileText, MessageSquare,
  CreditCard, Settings, LogOut, ChevronLeft, ChevronRight,
  Search, Bell, Shield, Image, ClipboardList, BookOpen, UserCheck
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RouteGuard } from '@/components/common/RouteGuard/RouteGuard';
import styles from './AdminLayout.module.css';

const navItems = [
  { icon: Home, label: 'Overview', href: '/admin/dashboard' },
  { icon: Users, label: 'Clients', href: '/admin/clients' },
  { icon: Megaphone, label: 'Campaigns', href: '/admin/campaigns' },
  { icon: ClipboardList, label: 'Enquiries', href: '/admin/enquiries' },
  { icon: Image, label: 'Portfolio', href: '/admin/portfolio' },
  { icon: BookOpen, label: 'Blog', href: '/admin/blog' },
  { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
  { icon: CreditCard, label: 'Invoices', href: '/admin/invoices' },
  { icon: FileText, label: 'Reports', href: '/admin/reports' },
  { icon: MessageSquare, label: 'Messages', href: '/admin/messages', badge: 7 },
  { icon: UserCheck, label: 'Team', href: '/admin/team' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <RouteGuard>{children}</RouteGuard>;
  }

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <div className={`${styles.layout} ${!sidebarOpen ? styles.collapsed : ''}`}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.brand}>
              <div className={styles.brandIcon}><Shield size={18} /></div>
              {sidebarOpen && <span className={styles.brandText}>Admin<span className={styles.brandAccent}>Panel</span></span>}
            </div>
            <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <nav className={styles.nav}>
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                  <Icon size={19} className={styles.navIcon} strokeWidth={isActive ? 2.5 : 2} />
                  {sidebarOpen && (
                    <>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            {sidebarOpen && (
              <div className={styles.adminCard}>
                <div className={styles.adminAvatar}>{initials}</div>
                <div className={styles.adminInfo}>
                  <strong>{user?.name || 'Admin User'}</strong>
                  <span>{user?.role === 'admin' ? 'Administrator' : 'Staff Member'}</span>
                </div>
              </div>
            )}
            <button className={styles.exitBtn} onClick={handleLogout}>
              <LogOut size={18} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <div className={styles.breadcrumb}>
                <span className={styles.breadHome}>Admin</span>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadCurrent}>
                  {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label ?? 'Dashboard'}
                </span>
              </div>
            </div>
            <div className={styles.topbarActions}>
              <div className={styles.search}>
                <Search size={16} color="#94a3b8" />
                <input placeholder="Search..." className={styles.searchInput} />
              </div>
              <div className={styles.notifBtn}>
                <Bell size={19} />
                <span className={styles.dot} />
              </div>
              <div className={styles.adminAvatar2}>{initials}</div>
            </div>
          </header>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </RouteGuard>
  );
}
