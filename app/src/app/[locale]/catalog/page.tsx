import { useTranslations } from 'next-intl';
import { TalentGrid } from '@/components/catalog/TalentGrid';

export default function CatalogPage() {
  const t = useTranslations('catalog');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-5 py-12 sm:px-6 md:py-16">
        <div className="mb-10 border-b border-border pb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            GutoSpringSports
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{t('title')}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {t('subtitle')}
          </p>
        </div>
        
        <TalentGrid />
      </div>
    </div>
  );
}
