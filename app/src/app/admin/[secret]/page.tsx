import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminProfileActions from './AdminProfileActions';

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
      'id, full_name, slug, role, position, current_team, photo_url, featured_on_home, homepage_order, created_at'
    )
    .order('featured_on_home', { ascending: false })
    .order('homepage_order', { ascending: true, nullsFirst: false })
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

        <Card>
          <CardContent className="p-0">
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Position</th>
                    <th className="px-6 py-4 font-medium">Current Team</th>
                    <th className="px-6 py-4 font-medium">Home</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {talents && talents.length > 0 ? (
                    talents.map((talent) => (
                      <tr key={talent.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                          {talent.photo_url ? (
                            <Image
                              src={talent.photo_url}
                              alt={talent.full_name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                              {talent.full_name.charAt(0)}
                            </div>
                          )}
                          <span>{talent.full_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            {talent.role.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{talent.position ?? '-'}</td>
                        <td className="px-6 py-4 text-muted-foreground">{talent.current_team ?? '-'}</td>
                        <td className="px-6 py-4">
                          {talent.featured_on_home ? (
                            <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                              Featured #{talent.homepage_order ?? '-'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <AdminProfileActions
                            secret={secret}
                            talentId={talent.id}
                            slug={talent.slug}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        <p>No talent profiles yet.</p>
                        <Link href={`/admin/${secret}/new`} className="mt-4 inline-block">
                          <Button variant="outline">Add your first talent</Button>
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
