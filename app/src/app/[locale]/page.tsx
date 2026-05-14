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
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative flex min-h-[720px] items-center overflow-hidden border-b border-border bg-surface md:min-h-[870px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gutospringsports-hero-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16">
          <div className="max-w-2xl">
            <div className="mb-4 inline-block bg-[#f14054] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
              Elite Division
            </div>
            <p className="sr-only">{t('eyebrow')}</p>
            <h1 className="font-display text-[44px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] text-white md:text-5xl">
              SpringSports
              <br />
              <span className="text-[#f14054]">次世代の才能を</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-[1.6] text-white/75">
              {t('subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link
                href="/catalog"
                className="inline-flex min-h-12 items-center justify-center bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-[#f14054]"
              >
                {t('catalog_cta')}
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center border border-white/70 px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                {t('about_cta')}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 h-1 w-1/3 bg-[#f14054]" />
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mb-16 flex flex-col items-start gap-8 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-[#f14054]">
              Curated Selection
            </span>
            <h2 className="font-display text-3xl font-bold uppercase tracking-[-0.01em]">
              {hasFeaturedTalents ? t('featured_label') : t('principles_label')}
            </h2>
          </div>
          <div className="mb-3 hidden h-px flex-grow bg-border md:block" />
          <Link
            href="/catalog"
            className="text-xs font-semibold uppercase tracking-[0.1em] transition hover:text-[#f14054]"
          >
            View all players →
          </Link>
        </div>

        {hasFeaturedTalents ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredTalents.map((talent) => (
              <Link
                key={talent.slug}
                href={{ pathname: '/catalog/[slug]', params: { slug: talent.slug } }}
                className="group border border-border bg-card transition hover:border-[#f14054]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted grayscale transition duration-500 group-hover:grayscale-0">
                  {talent.photo_url ? (
                    <Image
                      src={talent.photo_url}
                      alt={talent.full_name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      SS
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        {[talent.position, talent.current_team].filter(Boolean).join(' / ') ||
                          talent.role.replaceAll('_', ' ')}
                      </p>
                      <h3 className="truncate font-display text-2xl font-semibold uppercase tracking-[-0.01em]">
                        {talent.full_name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        Profile
                      </p>
                      <p className="font-display text-2xl font-semibold text-[#f14054]">JP</p>
                    </div>
                  </div>
                  <div className="mb-4 h-px bg-border" />
                  <div className="flex flex-wrap gap-2">
                    {talent.full_name_jp && (
                      <span className="bg-[#f4f3f3] px-2 py-1 text-[10px] font-bold uppercase tracking-tight">
                        {talent.full_name_jp}
                      </span>
                    )}
                    <span className="bg-[#f4f3f3] px-2 py-1 text-[10px] font-bold uppercase tracking-tight">
                      {talent.role.replaceAll('_', ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid border border-border md:grid-cols-3">
            {['curation', 'bridge', 'profiles'].map((key) => (
              <article
                key={key}
                className="border-b border-border bg-card p-8 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">
                  {t(`${key}_title`)}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {t(`${key}_text`)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-[340px_minmax(0,1fr)] lg:px-16">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-[-0.01em]">
              Data Integrity
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/60">
              Brazilian basketball profiles are organized for disciplined club review, with
              bilingual context, career data, and media in one shareable place.
            </p>
          </div>
          <div className="grid gap-px bg-white/25 md:grid-cols-2">
            {[
              ['94%', 'Profile Readability'],
              ['1.2K', 'Review-Ready Data Points'],
              ['24/7', 'Shareable Access'],
              ['Elite', 'Club Standard'],
            ].map(([value, label]) => (
              <div key={label} className="bg-black p-8">
                <p className="font-display text-5xl font-bold tracking-[-0.02em]">{value}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
