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
    const publicPaths = ['/admin/login', '/portal/login'];
    const isPublicPath = publicPaths.includes(pathname);

    const checkAuth = () => {
      // 1. If hitting a public path (like login)
      if (isPublicPath) {
        if (isAuthenticated) {
          // If already logged in, redirect to dashboard
          if (user?.role === 'admin' || user?.role === 'staff') {
            router.push('/admin/dashboard');
          } else {
            router.push('/portal/dashboard');
          }
          return;
        }
        // If not logged in, they are authorized to see the public page
        setAuthorized(true);
        return;
      }

      // 2. Initial check for protected routes
      if (!isAuthenticated) {
        setAuthorized(false);
        if (pathname.startsWith('/admin')) {
          router.push('/admin/login');
        } else {
          router.push('/portal/login');
        }
        return;
      }

      // 3. Role check if allowedRoles provided
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        setAuthorized(false);
        if (user.role === 'admin' || user.role === 'staff') {
          router.push('/admin/dashboard');
        } else {
          router.push('/portal/dashboard');
        }
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
