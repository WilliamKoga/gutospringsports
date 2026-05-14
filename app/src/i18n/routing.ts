import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/catalog': '/catalog',
    '/catalog/[slug]': '/catalog/[slug]',
    '/about': '/about',
  },
});

export type Locale = (typeof routing.locales)[number];
