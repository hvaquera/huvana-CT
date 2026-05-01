/**
 * /api/projects/status — Weekly PM status updates.
 *
 * DISABLED: Status updates live in the PSA (vbt-psa), not here.
 *
 * To re-enable: see /api/projects/route.ts for instructions.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Status updates live in the PSA' }, { status: 501 });
}

/*
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { project_id, status, update_note, next_milestone, blockers, updated_by } = body;
  // ... rest of implementation
}
*/
