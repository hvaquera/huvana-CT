import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WORKSPACE_EMAIL = process.env.CT_WORKSPACE_EMAIL ?? '';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { error } = await supabase
      .from('ct_workspaces')
      .upsert({
        owner_email: WORKSPACE_EMAIL,
        ...body,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'owner_email' });

    if (error) {
      console.error('[Admin config] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate config cache
    const { invalidateConfig } = await import('@/lib/config');
    invalidateConfig();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Admin config] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('ct_workspaces')
    .select('*')
    .eq('owner_email', WORKSPACE_EMAIL)
    .single();

  if (error || !data) return NextResponse.json(null);
  return NextResponse.json(data);
}