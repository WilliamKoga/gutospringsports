import { useTranslations } from 'next-intl';
import { TalentGrid } from '@/components/catalog/TalentGrid';

export default function CatalogPage() {
  const t = useTranslations('catalog');

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
        
        <TalentGrid />
      </div>
    </div>
  );
}
