'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useState, useTransition } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const activePath = pathname.replace(/^\/(en|ja)/, '') || '/';

  function toggleLocale() {
    const nextLocale = locale === 'en' ? 'ja' : 'en';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const queryString = searchParams.toString();
    const nextPath = `${segments.join('/')}${queryString ? `?${queryString}` : ''}`;

    startTransition(() => {
      router.replace(nextPath);
      setMenuOpen(false);
    });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo-icon-gutospringsports.png"
            alt=""
            width={64}
            height={64}
            priority
            className={styles.logoMark}
          />
          <span className={styles.logoText}>SpringSports</span>
        </Link>

        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
          aria-label="Main navigation"
          id="site-menu"
        >
          <Link
            href="/"
            className={`${styles.navLink} ${activePath === '/' ? styles.current : ''}`}
            onClick={closeMenu}
          >
            {t('home')}
          </Link>
          <Link
            href="/catalog"
            className={`${styles.navLink} ${activePath.startsWith('/catalog') ? styles.current : ''}`}
            onClick={closeMenu}
          >
            {t('catalog')}
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${activePath.startsWith('/about') ? styles.current : ''}`}
            onClick={closeMenu}
          >
            {t('about')}
          </Link>
        </nav>

        <div className={styles.actions}>
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

          <button
            className={styles.menuToggle}
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="site-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
