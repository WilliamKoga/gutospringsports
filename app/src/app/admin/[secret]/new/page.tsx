import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TalentForm } from '@/components/admin/TalentForm';

interface NewTalentPageProps {
  params: Promise<{ secret: string }>;
}

export default async function NewTalentPage({ params }: NewTalentPageProps) {
  const { secret } = await params;

  if (secret !== process.env.ADMIN_SECRET) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/admin/${secret}`}
            className="text-muted-foreground hover:text-foreground transition text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Talent</h1>
          <p className="text-muted-foreground mt-1">
            Create a new profile for a player, coach, or staff member.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <TalentForm secret={secret} />
        </div>
      </div>
    </div>
  );
}
