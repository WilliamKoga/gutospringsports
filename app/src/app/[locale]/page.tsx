import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from '@/styles/home.module.css';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🏀 B2B Talent Platform</div>
          <h1 className={styles.heroTitle}>{t('hero_title')}</h1>
          <p className={styles.heroSubtitle}>{t('hero_subtitle')}</p>
          <div className={styles.heroCta}>
            <Link href="/catalog" className={styles.btnPrimary}>
              {t('hero_cta')}
            </Link>
            <Link href="/inquiry" className={styles.btnSecondary}>
              {t('hero_contact')}
            </Link>
          </div>
        </div>
        <div className={styles.heroOrb} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />
      </section>

      {/* Value Propositions */}
      <section className={styles.valueProps}>
        <div className={styles.container}>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>✓</span>
              <h3>{t('value_prop_1_title')}</h3>
              <p>{t('value_prop_1_desc')}</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>✉</span>
              <h3>{t('value_prop_2_title')}</h3>
              <p>{t('value_prop_2_desc')}</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🌐</span>
              <h3>{t('value_prop_3_title')}</h3>
              <p>{t('value_prop_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
