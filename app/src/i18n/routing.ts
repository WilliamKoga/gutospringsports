import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/catalog': '/catalog',
    '/catalog/[slug]': '/catalog/[slug]',
    '/inquiry': '/inquiry',
  },
});

export type Locale = (typeof routing.locales)[number];
