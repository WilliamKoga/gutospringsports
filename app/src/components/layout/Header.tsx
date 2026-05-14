'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTransition } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function toggleLocale() {
    const nextLocale = locale === 'en' ? 'ja' : 'en';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const queryString = searchParams.toString();
    const nextPath = `${segments.join('/')}${queryString ? `?${queryString}` : ''}`;

    startTransition(() => {
      router.replace(nextPath);
    });
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          🏀 <span>SpringSports</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/" className={styles.navLink}>
            {t('home')}
          </Link>
          <Link href="/catalog" className={styles.navLink}>
            {t('catalog')}
          </Link>
          <Link href="/about" className={styles.navLink}>
            {t('about')}
          </Link>
        </nav>

        <button
          className={styles.langToggle}
          onClick={toggleLocale}
          disabled={isPending}
          aria-label={`Switch to ${locale === 'en' ? 'Japanese' : 'English'}`}
          title={`Switch to ${locale === 'en' ? '日本語' : 'English'}`}
        >
          <span className={locale === 'en' ? styles.active : styles.inactive}>EN</span>
          <span className={styles.divider}>/</span>
          <span className={locale === 'ja' ? styles.active : styles.inactive}>JP</span>
        </button>
      </div>
    </header>
  );
}
