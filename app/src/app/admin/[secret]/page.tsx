import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';
import { Button } from '@/components/ui/button';
import AdminTalentOrderTable from './AdminTalentOrderTable';

interface AdminDashboardProps {
  params: Promise<{ secret: string }>;
}

export default async function AdminDashboardPage({ params }: AdminDashboardProps) {
  const { secret } = await params;

  // Guard: wrong secret → hard 404
  if (secret !== process.env.ADMIN_SECRET) {
    notFound();
  }

  const supabase = createAdminClient();

  const { data: talents, error } = await supabase
    .from('talents')
    .select(
      'id, full_name, slug, role, position, current_team, photo_url, featured_on_home, homepage_order, catalog_order, created_at'
    )
    .order('catalog_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch talents:', error);
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SpringSports Admin</h1>
            <p className="text-muted-foreground mt-1">
              {talents?.length ?? 0} talent profiles
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={`/admin/${secret}/new`}>
              <Button className="bg-brand hover:bg-brand/90 font-semibold shadow-sm">
                + Add Talent
              </Button>
            </Link>
            <LogoutButton secret={secret} />
          </div>
        </div>

        <AdminTalentOrderTable initialTalents={talents ?? []} secret={secret} />
      </div>
    </div>
  );
}
