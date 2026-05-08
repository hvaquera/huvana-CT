/**
 * GET /api/harvest/actuals?year=2026&month=5
 *
 * Returns time actuals from Harvest normalized to the same ActualsResponse
 * shape as /api/tempo/actuals and /api/toggl/actuals — UI works unchanged.
 *
 * Harvest advantage: user, client, project, task all embedded in each entry.
 * Zero extra API calls needed beyond the single time_entries fetch.
 */

import { NextResponse } from 'next/server';

const HARVEST_BASE = 'https://api.harvestapp.com/api/v2';
const HARVEST_TOKEN = process.env.HARVEST_ACCESS_TOKEN ?? '';
const HARVEST_ACCOUNT = process.env.HARVEST_ACCOUNT_ID ?? '';

// ─── Harvest types ────────────────────────────────────────────────────────────

interface HarvestTimeEntry {
  id: number;
  spent_date: string;        // "2026-05-01"
  hours: number;             // 2.5
  billable: boolean;
  billable_rate: number | null;
  notes: string | null;
  is_running: boolean;
  user: { id: number; name: string };
  client: { id: number; name: string; currency: string };
  project: { id: number; name: string; code: string | null };
  task: { id: number; name: string };
}

interface HarvestResponse {
  time_entries: HarvestTimeEntry[];
  total_pages: number;
  total_entries: number;
  next_page: number | null;
  page: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const round = (n: number) => Math.round(n * 10) / 10;

function harvestHeaders() {
  return {
    Authorization: `Bearer ${HARVEST_TOKEN}`,
    'Harvest-Account-Id': HARVEST_ACCOUNT,
    Accept: 'application/json',
  };
}

async function fetchAllTimeEntries(from: string, to: string): Promise<HarvestTimeEntry[]> {
  const all: HarvestTimeEntry[] = [];
  let page = 1;

  while (true) {
    const url = `${HARVEST_BASE}/time_entries?from=${from}&to=${to}&page=${page}&per_page=2000`;
    const res = await fetch(url, { headers: harvestHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`Harvest API error: ${res.status}`);
    const data: HarvestResponse = await res.json();

    all.push(...data.time_entries);

    if (!data.next_page) break;
    page = data.next_page;
  }

  return all;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  if (!HARVEST_TOKEN || !HARVEST_ACCOUNT) {
    return NextResponse.json(
      { error: 'HARVEST_ACCESS_TOKEN and HARVEST_ACCOUNT_ID are required' },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const year = parseInt(searchParams.get('year') ?? String(now.getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1));

  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  try {
    const entries = await fetchAllTimeEntries(from, to);

    // Skip running timers (duration not finalized)
    const valid = entries.filter((e) => !e.is_running && e.hours > 0);

    const totalHours = round(valid.reduce((sum, e) => sum + e.hours, 0));

    // ── By Person ─────────────────────────────────────────────────────────────
    const personMap = new Map<
      number,
      {
        name: string;
        projects: Map<number, { name: string; clientName: string; hours: number; billable: boolean }>;
        totalHours: number;
      }
    >();

    for (const entry of valid) {
      const uid = entry.user.id;
      if (!personMap.has(uid)) {
        personMap.set(uid, { name: entry.user.name, projects: new Map(), totalHours: 0 });
      }
      const person = personMap.get(uid)!;
      person.totalHours = round(person.totalHours + entry.hours);

      const pid = entry.project.id;
      if (!person.projects.has(pid)) {
        person.projects.set(pid, {
          name: entry.project.name,
          clientName: entry.client.name,
          hours: 0,
          billable: entry.billable,
        });
      }
      const proj = person.projects.get(pid)!;
      proj.hours = round(proj.hours + entry.hours);
    }

    const people = Array.from(personMap.entries())
      .map(([uid, person]) => ({
        id: String(uid),
        name: person.name,
        totalHours: person.totalHours,
        projects: Array.from(person.projects.entries()).map(([pid, proj]) => ({
          projectKey: String(pid),
          projectName: proj.name,
          clientName: proj.clientName,
          hours: proj.hours,
          billable: proj.billable,
          percent: totalHours > 0 ? Math.round((proj.hours / totalHours) * 100) : 0,
          tasks: [],
        })),
      }))
      .sort((a, b) => b.totalHours - a.totalHours);

    // ── By Project ────────────────────────────────────────────────────────────
    const projectMap = new Map<
      number,
      { name: string; clientName: string; hours: number; billableHours: number; people: Set<number> }
    >();

    for (const entry of valid) {
      const pid = entry.project.id;
      if (!projectMap.has(pid)) {
        projectMap.set(pid, {
          name: entry.project.name,
          clientName: entry.client.name,
          hours: 0,
          billableHours: 0,
          people: new Set(),
        });
      }
      const proj = projectMap.get(pid)!;
      proj.hours = round(proj.hours + entry.hours);
      if (entry.billable) proj.billableHours = round(proj.billableHours + entry.hours);
      proj.people.add(entry.user.id);
    }

    const projects = Array.from(projectMap.entries())
      .map(([pid, proj]) => ({
        projectKey: String(pid),
        projectName: proj.name,
        clientName: proj.clientName,
        hours: proj.hours,
        billableHours: proj.billableHours,
        nonBillableHours: round(proj.hours - proj.billableHours),
        people: proj.people.size,
        percent: totalHours > 0 ? Math.round((proj.hours / totalHours) * 100) : 0,
      }))
      .sort((a, b) => b.hours - a.hours);

    return NextResponse.json({
      source: 'harvest',
      period: { year, month, from, to },
      totalHours,
      totalWorklogs: valid.length,
      totalPeople: personMap.size,
      totalProjects: projectMap.size,
      people,
      projects,
    });
  } catch (error) {
    console.error('[Harvest] Actuals error:', error);
    return NextResponse.json({ error: 'Failed to fetch Harvest actuals' }, { status: 500 });
  }
}
