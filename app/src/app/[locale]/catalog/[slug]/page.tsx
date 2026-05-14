import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

function getSafeExternalUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const normalizedValue = getSafeExternalUrl(value);
    const url = new URL(normalizedValue);
    const hostname = url.hostname.replace(/^www\./, '');
    let videoId: string | null = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else {
        const [kind, id] = url.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live'].includes(kind)) {
          videoId = id ?? null;
        }
      }
    }

    if (!videoId || !/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  } catch {
    return null;
  }
}

export default async function TalentProfilePage(props: { params: Promise<{ slug: string, locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'profile' });
  const supabase = await createClient();

  const { data: talent, error } = await supabase
    .from('talents')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !talent) {
    notFound();
  }

  // Format role
  const roleLabel = talent.role.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const biography = params.locale === 'ja' ? talent.bio_jp || talent.bio : talent.bio;
  const highlights = talent.highlight_urls ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-5 py-10 sm:px-6 md:py-14">
        
        {/* Back button */}
        <Link href="/catalog" className="mb-8 inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 gap-8 border-y border-border py-8 md:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] md:gap-12">
          
          {/* Left Column: Photo */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-[3/4] overflow-hidden border border-border bg-muted">
              {talent.photo_url ? (
                <Image
                  src={talent.photo_url}
                  alt={talent.full_name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-full w-full object-cover grayscale-[10%]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge className="border-primary bg-primary text-primary-foreground hover:bg-primary">{roleLabel}</Badge>
                {talent.position && (
                  <Badge variant="secondary">{talent.position}</Badge>
                )}
              </div>
              <h1 className="mb-2 text-4xl font-black leading-tight md:text-6xl">{talent.full_name}</h1>
              {talent.full_name_jp && (
                <h2 className="text-xl md:text-2xl text-muted-foreground">{talent.full_name_jp}</h2>
              )}
            </div>

            <Card className="border-border">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {talent.height_cm && (
                    <div className="border-b border-r border-border p-5">
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('height')}</span>
                      <span className="text-lg font-semibold">{talent.height_cm} <span className="text-sm font-normal text-muted-foreground">{t('cm')}</span></span>
                    </div>
                  )}
                  {talent.weight_kg && (
                    <div className="border-b border-r border-border p-5">
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('weight')}</span>
                      <span className="text-lg font-semibold">{talent.weight_kg} <span className="text-sm font-normal text-muted-foreground">{t('kg')}</span></span>
                    </div>
                  )}
                  <div className="border-b border-border p-5 sm:border-r">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('nationality')}</span>
                    <span className="text-lg font-semibold">{talent.nationality || '-'}</span>
                  </div>
                  <div className="border-b border-border p-5 sm:col-span-2">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('current_team')}</span>
                    <span className="text-lg font-semibold">{talent.current_team || '-'}</span>
                  </div>
                  {talent.past_teams && talent.past_teams.length > 0 && (
                    <div className="p-5 sm:col-span-2">
                      <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('past_teams')}</span>
                      <div className="flex flex-wrap gap-2">
                        {talent.past_teams.map((team: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-sm font-normal">{team}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {biography && (
              <div className="flex flex-col gap-3">
                <h3 className="border-b border-border pb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('biography')}</h3>
                <div className="max-w-none text-base leading-8 text-muted-foreground">
                  {biography.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {highlights.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="border-b border-border pb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('highlights')}</h3>
                <div className="grid gap-4">
                  {highlights.map((highlight: string, idx: number) => {
                    const embedUrl = getYouTubeEmbedUrl(highlight);

                    if (!embedUrl) {
                      return (
                        <a
                          key={`${highlight}-${idx}`}
                          href={getSafeExternalUrl(highlight)}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all border border-border bg-card px-4 py-3 text-sm text-muted-foreground transition hover:border-foreground hover:text-foreground"
                        >
                          {highlight}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={`${highlight}-${idx}`}
                        className="overflow-hidden border border-border bg-card"
                      >
                        <div className="aspect-video">
                          <iframe
                            src={embedUrl}
                            title={`${talent.full_name} highlight ${idx + 1}`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                        <a
                          href={getSafeExternalUrl(highlight)}
                          target="_blank"
                          rel="noreferrer"
                          className="block border-t border-border px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition hover:text-foreground"
                        >
                          Watch on YouTube
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
