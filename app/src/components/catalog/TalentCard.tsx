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
      className="block transition-transform hover:-translate-y-1"
    >
      <Card className="overflow-hidden h-full flex flex-col bg-card hover:border-brand/50 hover:shadow-brand transition-all duration-300">
        <div className="aspect-[3/4] relative bg-muted w-full overflow-hidden">
          {talent.photo_url ? (
            <Image
              src={talent.photo_url}
              alt={talent.full_name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="default" className="bg-brand hover:bg-brand text-white shadow-lg border-none uppercase tracking-wider text-[10px]">
              {roleLabel}
            </Badge>
            {talent.position && (
              <Badge variant="secondary" className="shadow-md bg-black/60 text-white border-white/10 backdrop-blur-md">
                {talent.position}
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg leading-tight truncate text-foreground">{talent.full_name}</h3>
            {talent.full_name_jp && (
              <p className="text-sm text-muted-foreground truncate">{talent.full_name_jp}</p>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
            {talent.height_cm && (
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('height')}</span>
                <span className="font-medium">{talent.height_cm} {t('cm')}</span>
              </div>
            )}
            {talent.weight_kg && (
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('weight')}</span>
                <span className="font-medium">{talent.weight_kg} {t('kg')}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 mt-auto flex flex-col items-start gap-1 border-t border-border/40 pb-4">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('current_team')}</span>
          <span className="text-sm font-medium truncate w-full">{talent.current_team || '-'}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
