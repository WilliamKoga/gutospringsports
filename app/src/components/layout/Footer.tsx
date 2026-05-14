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
            src="/logo-horizontal-white-gutospringsports.png"
            alt="GutoSpringSports"
            width={1123}
            height={215}
            className={styles.logoImage}
          />
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>
        <p className={styles.copyright}>
          © {year} GutoSpringSports. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
