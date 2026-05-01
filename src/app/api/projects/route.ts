/**
 * /api/projects — Supabase-backed project status.
 *
 * DISABLED: Control Tower reads everything from Jira + Tempo APIs directly.
 * Project status tracking lives in the PSA (vbt-psa), not here.
 *
 * To re-enable:
 * 1. Set up Supabase and add env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
 * 2. Run supabase/migrations/001_project_status.sql
 * 3. Uncomment the code below
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ projects: [] });
}

export async function POST() {
  return NextResponse.json({ error: 'Project management lives in the PSA' }, { status: 501 });
}

/*
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: projects } = await supabase.from('projects').select('*, clients(name)').order('name');
  const { data: currentStatuses } = await supabase.from('project_current_status').select('*');
  const { data: history } = await supabase.from('project_status_history').select('*');
  // ... rest of implementation
}
*/
