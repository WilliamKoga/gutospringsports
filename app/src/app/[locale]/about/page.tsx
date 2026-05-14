import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/60">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">
            {t('eyebrow')}
          </p>
          <h1 className="max-w-4xl text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
              {t('mission_label')}
            </p>
            <h2 className="text-2xl font-bold">{t('mission_title')}</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>{t('mission_1')}</p>
            <p>{t('mission_2')}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {['clubs', 'talent', 'context'].map((key) => (
            <article key={key} className="rounded-lg border border-border bg-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
                {t(`${key}_label`)}
              </p>
              <h3 className="text-lg font-bold">{t(`${key}_title`)}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t(`${key}_text`)}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t('how_label')}
            </p>
            <h2 className="text-2xl font-bold">{t('how_title')}</h2>
            <p className="mt-4 text-muted-foreground">{t('how_text')}</p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {t('catalog_cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
