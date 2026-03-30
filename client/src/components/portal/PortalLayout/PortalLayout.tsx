'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Megaphone, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';
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

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <TrendingUp size={20} color="#06B6D4" strokeWidth={3} />
            </div>
            {!collapsed && <span className={styles.logoText}>Digital<span className={styles.logoAccent}>Pulse</span></span>}
          </div>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                <Icon size={20} className={styles.navIcon} strokeWidth={isActive ? 2.5 : 2} />
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
              <div className={styles.userAvatar}>JD</div>
              <div className={styles.userInfo}>
                <strong>John Doe</strong>
                <span>john@company.com</span>
              </div>
            </div>
          )}
          <Link href="/" className={styles.logoutBtn}>
            <LogOut size={20} className={styles.navIcon} />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top Bar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
             <div className={styles.breadcrumbs}>
                <span>Portal</span>
                <span className={styles.breadDivider}>/</span>
                <span className={styles.breadCurrent}>
                   {navItems.find(n => n.href === pathname)?.label ?? 'Dashboard'}
                </span>
             </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input placeholder="Search analytics..." className={styles.searchInput} />
            </div>
            <div className={styles.notifBtn}>
              <Bell size={20} />
              <span className={styles.notifDot}></span>
            </div>
            <div className={styles.topbarAvatar}>JD</div>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
