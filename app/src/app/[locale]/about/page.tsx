import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="container mx-auto px-5 py-16 sm:px-6 md:py-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {t('eyebrow')}
          </p>
          <h1 className="max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 py-16 sm:px-6">
        <div className="grid gap-8 border-b border-border pb-14 md:grid-cols-[260px_minmax(0,1fr)]">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {t('mission_label')}
            </p>
            <h2 className="text-3xl font-black">{t('mission_title')}</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>{t('mission_1')}</p>
            <p>{t('mission_2')}</p>
          </div>
        </div>

        <div className="mt-12 grid border border-border md:grid-cols-3">
          {['clubs', 'talent', 'context'].map((key) => (
            <article key={key} className="border-b border-border bg-card p-6 md:border-b-0 md:border-r md:p-8 last:border-b-0 md:last:border-r-0">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {t(`${key}_label`)}
              </p>
              <h3 className="text-xl font-black">{t(`${key}_title`)}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t(`${key}_text`)}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border border-border bg-card p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {t('how_label')}
            </p>
            <h2 className="text-2xl font-black">{t('how_title')}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{t('how_text')}</p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex min-h-11 items-center justify-center rounded bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground transition hover:bg-primary/85"
          >
            {t('catalog_cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
