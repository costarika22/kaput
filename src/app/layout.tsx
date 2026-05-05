import type { Metadata } from 'next';
import { Bangers, Inter } from 'next/font/google';
import './globals.css';

const bangers = Bangers({
  weight: '400',
  variable: '--font-bangers',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KAPUT — Daily Survival Game',
  description: 'Pick 3 items. Survive a scenario. Get judged by a feral monkey. Play every day.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'KAPUT',
    description: 'Pick 3 items. Survive. Get judged by a monkey.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bangers.variable} ${inter.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
