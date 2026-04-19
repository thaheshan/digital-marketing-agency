'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

/**
 * AuthProvider – mounted once at the root.
 * On startup it checks if there's a persisted JWT token and
 * validates it against the backend to re-hydrate the user object.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadFromToken = useAuthStore(state => state.loadFromToken);

  useEffect(() => {
    loadFromToken();
  }, []);

  return <>{children}</>;
}
