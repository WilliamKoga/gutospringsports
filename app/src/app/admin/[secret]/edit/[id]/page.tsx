import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { TalentForm } from '@/components/admin/TalentForm';

interface EditTalentPageProps {
  params: Promise<{ secret: string; id: string }>;
}

export default async function EditTalentPage({ params }: EditTalentPageProps) {
  const { secret, id } = await params;

  if (secret !== process.env.ADMIN_SECRET) {
    notFound();
  }

  const supabase = createAdminClient();
  const { data: talent, error } = await supabase
    .from('talents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !talent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/admin/${secret}`}
            className="text-muted-foreground hover:text-foreground transition text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Talent</h1>
          <p className="text-muted-foreground mt-1">
            Editing profile for{' '}
            <span className="font-semibold text-foreground">{talent.full_name}</span>
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <TalentForm initialData={talent} secret={secret} />
        </div>
      </div>
    </div>
  );
}
