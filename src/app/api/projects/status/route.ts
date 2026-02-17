import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/projects/status
 * Submit a weekly status update for a project.
 * Upserts on (project_id, week_of) so PMs can edit their update within the same week.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_id, status, update_note, next_milestone, blockers, updated_by } = body;

    if (!project_id || !status || !updated_by) {
      return NextResponse.json(
        { error: 'project_id, status, and updated_by are required' },
        { status: 400 },
      );
    }

    if (!['green', 'yellow', 'red'].includes(status)) {
      return NextResponse.json({ error: 'status must be green, yellow, or red' }, { status: 400 });
    }

    // Calculate Monday of current week
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const weekOf = monday.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('project_status_updates')
      .upsert(
        {
          project_id,
          week_of: weekOf,
          status,
          update_note: update_note || '',
          next_milestone: next_milestone || null,
          blockers: blockers || null,
          updated_by,
        },
        { onConflict: 'project_id,week_of' },
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ update: data });
  } catch (error) {
    console.error('[ProjectStatus] POST error:', error);
    return NextResponse.json({ error: 'Failed to submit status update' }, { status: 500 });
  }
}
