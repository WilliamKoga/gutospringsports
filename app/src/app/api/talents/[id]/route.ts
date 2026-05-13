import { type NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('talents')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching talent:', error);
    return NextResponse.json({ error: 'Failed to fetch talent' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminAuthenticated(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('talents')
      .update(body)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating talent:', error);
    return NextResponse.json({ error: 'Failed to update talent' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminAuthenticated(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('talents')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting talent:', error);
    return NextResponse.json({ error: 'Failed to delete talent' }, { status: 500 });
  }
}
