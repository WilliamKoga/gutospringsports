import type { Metadata } from 'next';
import { Chivo, Geist_Mono, Inter } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const chivo = Chivo({
  variable: '--font-chivo',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SpringSports | Brazilian Basketball Talent',
    template: '%s | SpringSports',
  },
  description:
    'Connecting elite Brazilian basketball players, coaches, and staff with Japanese clubs.',
  icons: {
    icon: [
      {
        url: '/springsports-icon.png',
        type: 'image/png',
      },
    ],
    shortcut: '/springsports-icon.png',
    apple: '/springsports-icon.png',
  },
};

/**
 * Root layout - must render html/body because Next.js requires it at the
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
        className={`${inter.variable} ${chivo.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wv5kvsfkbd");
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
