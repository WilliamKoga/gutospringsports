import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>🏀 SpringSports</span>
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>
        <p className={styles.copyright}>
          © {year} SpringSports. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
