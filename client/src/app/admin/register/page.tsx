'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToStaffWizard() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/register/staff');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', height: '100vh', color: '#64748b' }}>
      Redirecting to staff registration...
    </div>
  );
}
