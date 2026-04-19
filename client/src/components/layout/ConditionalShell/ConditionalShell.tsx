'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import ChatbotWidget from '@/components/common/ChatbotWidget/ChatbotWidget';

const SHELL_HIDDEN_PREFIXES = ['/portal', '/admin', '/register'];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = SHELL_HIDDEN_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const hideFooter = SHELL_HIDDEN_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>{children}</main>
      {!hideFooter && <Footer />}
      <ChatbotWidget />
    </>
  );
}
