'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
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
  Bell,
  Home,
  Shield
} from 'lucide-react';
import styles from './AdminLayout.module.css';

const navItems = [
  { icon: Home, label: 'Overview', href: '/admin/dashboard' },
  { icon: Users, label: 'Clients', href: '/admin/clients' },
  { icon: Megaphone, label: 'Campaigns', href: '/admin/campaigns' },
  { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
  { icon: CreditCard, label: 'Invoices', href: '/admin/invoices' },
  { icon: FileText, label: 'Reports', href: '/admin/reports' },
  { icon: MessageSquare, label: 'Messages', href: '/admin/messages', badge: 7 },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`${styles.layout} ${!sidebarOpen ? styles.collapsed : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <Shield size={20} />
            </div>
            {sidebarOpen && <span className={styles.brandText}>Admin<span className={styles.brandAccent}>Panel</span></span>}
          </div>
          <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Icon size={20} className={styles.navIcon} strokeWidth={isActive ? 2.5 : 2} />
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
              <div className={styles.adminAvatar}>A</div>
              <div className={styles.adminInfo}>
                <strong>Admin User</strong>
                <span>Super Administrator</span>
              </div>
            </div>
          )}
          <Link href="/portal/login" className={styles.exitBtn}>
            <LogOut size={20} />
            {sidebarOpen && <span>Exit Admin</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.breadcrumb}>
              <span className={styles.breadHome}>Admin</span>
              <span className={styles.breadSep}>/</span>
              <span className={styles.breadCurrent}>
                {navItems.find(n => n.href === pathname)?.label ?? 'Dashboard'}
              </span>
            </div>
          </div>
          <div className={styles.topbarActions}>
            <div className={styles.search}>
              <Search size={18} color="#94a3b8" />
              <input placeholder="Search records..." className={styles.searchInput} />
            </div>
            <div className={styles.notifBtn}>
              <Bell size={20} />
              <span className={styles.dot}></span>
            </div>
            <div className={styles.adminAvatar2}>A</div>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
