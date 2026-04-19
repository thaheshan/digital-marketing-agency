import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalShell } from "@/components/layout/ConditionalShell/ConditionalShell";
import ChatbotWidget from "@/components/common/ChatbotWidget/ChatbotWidget";
import { AuthProvider } from "@/components/common/AuthProvider/AuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Digital Marketing Agency",
  description: "Interactive Digital Marketing Portfolio and Analytics Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <ConditionalShell>{children}</ConditionalShell>
          <ChatbotWidget />
        </AuthProvider>
      </body>
    </html>
  );
}

