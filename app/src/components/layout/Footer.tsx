import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/springsports-logo-footer.png"
            alt="SpringSports"
            width={1508}
            height={319}
            className={styles.logoImage}
          />
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>
        <p className={styles.copyright}>
          © {year} SpringSports. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
