import { type NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { buildCatalogOrderUpdates } from '@/lib/catalog-order';

export async function PUT(req: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updates = buildCatalogOrderUpdates(body?.ids);
    const supabase = createAdminClient();

    const results = await Promise.all(
      updates.map((update) =>
        supabase
          .from('talents')
          .update({ catalog_order: update.catalog_order })
          .eq('id', update.id)
      )
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      throw failed.error;
    }

    return NextResponse.json({ success: true, count: updates.length });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('ids must')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error updating catalog order:', error);
    return NextResponse.json({ error: 'Failed to update catalog order' }, { status: 500 });
  }
}
