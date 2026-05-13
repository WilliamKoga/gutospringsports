import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SpringSports — Brazilian Basketball Talent',
    template: '%s | SpringSports',
  },
  description:
    'Connecting elite Brazilian basketball players, coaches, and staff with Japanese clubs.',
};

/**
 * Root layout — must render html/body because Next.js requires it at the
 * root level. The [locale] layout will override html lang and body styles.
 * Using suppressHydrationWarning to prevent hydration mismatches from
 * browser extensions or the locale layout rerendering the html element.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
