import { type NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCatalogOrderMode } from '@/lib/catalog-order';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    
    const role = searchParams.get('role');
    const position = searchParams.get('position');
    const search = searchParams.get('search');
    
    let query = supabase.from('talents').select('*');
    
    if (role) {
      query = query.eq('role', role);
    }
    if (position) {
      query = query.eq('position', position);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,full_name_jp.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    if (getCatalogOrderMode(searchParams) === 'manual') {
      query = query
        .order('catalog_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching talents:', error);
    return NextResponse.json({ error: 'Failed to fetch talents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('talents')
      .insert([body])
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating talent:', error);
    return NextResponse.json({ error: 'Failed to create talent' }, { status: 500 });
  }
}
