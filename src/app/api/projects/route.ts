import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface ProjectWithStatus {
  id: string;
  name: string;
  owner: string;
  phase: string;
  jira_key: string | null;
  client_name: string | null;
  type: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  rate: number | null;
  current_status: 'green' | 'yellow' | 'red' | null;
  update_note: string | null;
  next_milestone: string | null;
  blockers: string | null;
  last_updated: string | null;
  updated_by: string | null;
  status_history: { week_of: string; status: 'green' | 'yellow' | 'red' }[];
}

/**
 * GET /api/projects
 * Returns all projects from Supabase with current status and 12-week history.
 * Projects are managed in Supabase (seeded from PSA / Notion), NOT auto-synced from Jira.
 */
export async function GET() {
  try {
    // Get all projects with client name
    const { data: projects, error: projErr } = await supabase
      .from('projects')
      .select('*, clients(name)')
      .order('name');

    if (projErr) throw projErr;
    if (!projects || projects.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // Get current status per project
    const { data: currentStatuses, error: csErr } = await supabase
      .from('project_current_status')
      .select('*');

    if (csErr) throw csErr;

    // Get status history (last 12 weeks)
    const { data: history, error: histErr } = await supabase
      .from('project_status_history')
      .select('*');

    if (histErr) throw histErr;

    // Build maps
    const currentMap = new Map<string, (typeof currentStatuses)[0]>();
    for (const cs of currentStatuses ?? []) {
      currentMap.set(cs.project_id, cs);
    }

    const historyMap = new Map<string, { week_of: string; status: string }[]>();
    for (const h of history ?? []) {
      if (!historyMap.has(h.project_id)) historyMap.set(h.project_id, []);
      historyMap.get(h.project_id)!.push({ week_of: h.week_of, status: h.status });
    }

    // Merge
    const result: ProjectWithStatus[] = projects.map((p: Record<string, unknown>) => {
      const cs = currentMap.get(p.id as string);
      const clientData = p.clients as { name: string } | null;
      return {
        id: p.id as string,
        name: p.name as string,
        owner: (p.owner as string) ?? 'Unassigned',
        phase: p.status as string,
        jira_key: p.jira_key as string | null,
        client_name: clientData?.name ?? null,
        type: p.type as string,
        start_date: p.start_date as string | null,
        end_date: p.end_date as string | null,
        budget: p.budget as number | null,
        rate: p.rate as number | null,
        current_status: (cs?.status as 'green' | 'yellow' | 'red') ?? null,
        update_note: cs?.update_note ?? null,
        next_milestone: cs?.next_milestone ?? null,
        blockers: cs?.blockers ?? null,
        last_updated: cs?.updated_at ?? null,
        updated_by: cs?.updated_by ?? null,
        status_history: (historyMap.get(p.id as string) ?? []) as ProjectWithStatus['status_history'],
      };
    });

    return NextResponse.json({ projects: result });
  } catch (error) {
    console.error('[Projects] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * Manually create a project (for non-Jira projects).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, owner, type, status, jira_key, client_id } = body;

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        owner: owner || 'Unassigned',
        type: type || 'hourly',
        status: status || 'active',
        jira_key: jira_key || null,
        client_id: client_id || null,
        start_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error('[Projects] POST error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
