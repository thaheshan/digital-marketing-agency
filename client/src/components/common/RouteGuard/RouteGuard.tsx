'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'staff' | 'client')[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const normalizedPath = pathname.replace(/\/$/, '') || '/';
      // Path verification: checking if current path is public
      const isPublic = 
        ['', '/', '/admin/login', '/portal/login', '/register'].includes(normalizedPath) || 
        normalizedPath.startsWith('/register');

      // 1. Immediate authorization for public paths
      if (isPublic) {
        if (isAuthenticated) {
          // If already logged in, redirect away from login/register to dashboard
          const dest = (user?.role === 'admin' || user?.role === 'staff') ? '/admin/dashboard' : '/portal/dashboard';
          if (['/admin/login', '/portal/login', '/register'].includes(normalizedPath)) {
            router.push(dest);
          } else {
            setAuthorized(true);
          }
          return;
        }
        setAuthorized(true);
        return;
      }

      // 2. Strict check for protected routes
      if (!isAuthenticated) {
        setAuthorized(false);
        const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/portal/login';
        router.push(loginPath);
        return;
      }

      // 3. Role-based access control
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        setAuthorized(false);
        const dashPath = (user.role === 'admin' || user.role === 'staff') ? '/admin/dashboard' : '/portal/dashboard';
        router.push(dashPath);
        return;
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [isAuthenticated, user, allowedRoles, router, pathname]);

  // Show nothing or a loading spinner while checking
  if (!authorized) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#0F172A',
        color: '#fff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(6, 182, 212, 0.2)', 
          borderTopColor: '#06B6D4', 
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Verifying Authentication...</span>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return <>{children}</>;
}
