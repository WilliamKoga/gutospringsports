import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const supabase = await createClient();

  const { data: talents } = await supabase
    .from('talents')
    .select('full_name, full_name_jp, slug, role, position, photo_url, current_team')
    .eq('featured_on_home', true)
    .order('homepage_order', { ascending: true, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .limit(3);
  const featuredTalents = talents ?? [];
  const hasFeaturedTalents = featuredTalents.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div
            className={
              hasFeaturedTalents
                ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center'
                : 'max-w-4xl'
            }
          >
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">
                {t('eyebrow')}
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                {t('title')}
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                {t('subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/catalog"
                  className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  {t('catalog_cta')}
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:border-orange-500/70"
                >
                  {t('about_cta')}
                </Link>
              </div>
              <div className="mt-10 grid gap-3 border-t border-border/70 pt-5 text-sm text-muted-foreground sm:grid-cols-3">
                <span>{t('signal_brazil')}</span>
                <span>{t('signal_japan')}</span>
                <span>{t('signal_profiles')}</span>
              </div>
            </div>

            {hasFeaturedTalents && (
              <aside aria-label={t('featured_label')} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="hidden border-b border-border/70 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:col-span-3 lg:block lg:col-span-1">
                  {t('featured_label')}
                </div>
                {featuredTalents.map((talent) => (
                  <Link
                    key={talent.slug}
                    href={{ pathname: '/catalog/[slug]', params: { slug: talent.slug } }}
                    className="group grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 rounded-lg border border-border bg-card p-3 transition hover:border-orange-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
                  >
                    <div className="relative h-24 w-[72px] overflow-hidden rounded-md bg-muted">
                      {talent.photo_url ? (
                        <Image
                          src={talent.photo_url}
                          alt={talent.full_name}
                          fill
                          sizes="72px"
                          className="object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                          SS
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{talent.full_name}</p>
                      {talent.full_name_jp && (
                        <p className="truncate text-sm text-muted-foreground">
                          {talent.full_name_jp}
                        </p>
                      )}
                      <p className="mt-2 text-xs uppercase tracking-wide text-orange-400">
                        {[talent.position, talent.current_team].filter(Boolean).join(' / ') ||
                          talent.role.replaceAll('_', ' ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </aside>
            )}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t('principles_label')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {['curation', 'bridge', 'profiles'].map((key) => (
            <article key={key} className="rounded-lg border border-border bg-card p-6 transition hover:border-border/80">
              <h2 className="text-xl font-bold">{t(`${key}_title`)}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t(`${key}_text`)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
