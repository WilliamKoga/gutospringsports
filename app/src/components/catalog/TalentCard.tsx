import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export interface Talent {
  id: string;
  slug: string;
  full_name: string;
  full_name_jp: string | null;
  role: string;
  position: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  current_team: string | null;
  nationality: string;
  photo_url: string | null;
}

interface TalentCardProps {
  talent: Talent;
}

export function TalentCard({ talent }: TalentCardProps) {
  const t = useTranslations('profile');
  
  // Format role label
  const roleLabel = talent.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <Link
      href={{ pathname: '/catalog/[slug]', params: { slug: talent.slug } }}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-colors duration-200 group-hover:border-foreground">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {talent.photo_url ? (
            <Image
              src={talent.photo_url}
              alt={talent.full_name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover grayscale-[15%] transition duration-300 group-hover:scale-[1.02] group-hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            <Badge variant="default" className="border-primary bg-primary text-[10px] text-primary-foreground hover:bg-primary">
              {roleLabel}
            </Badge>
            {talent.position && (
              <Badge variant="secondary" className="border border-border bg-card/90 text-[10px] text-foreground backdrop-blur">
                {talent.position}
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="flex-grow p-5">
          <div className="flex flex-col gap-1">
            <h3 className="truncate font-display text-lg font-black leading-tight text-foreground">{talent.full_name}</h3>
            {talent.full_name_jp && (
              <p className="text-sm text-muted-foreground truncate">{talent.full_name_jp}</p>
            )}
          </div>
          
          <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-border pt-4 text-sm">
            {talent.height_cm && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('height')}</span>
                <span className="font-semibold">{talent.height_cm} {t('cm')}</span>
              </div>
            )}
            {talent.weight_kg && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('weight')}</span>
                <span className="font-semibold">{talent.weight_kg} {t('kg')}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="mt-auto flex flex-col items-start gap-1 border-t border-border p-5 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('current_team')}</span>
          <span className="w-full truncate text-sm font-semibold">{talent.current_team || '-'}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
