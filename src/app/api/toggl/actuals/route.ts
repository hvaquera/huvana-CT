/**
 * GET /api/toggl/actuals?year=2026&month=5
 *
 * Returns time actuals from Toggl normalized to ActualsResponse shape.
 * Projects show as "Client Name — Project Name" for readability.
 */

import { NextResponse } from 'next/server';
import {
  fetchTogglTimeEntries,
  fetchTogglProjects,
  fetchTogglUsers,
  withCache,
  round,
} from '@/lib/api';
import type { ActualsResponse } from '@/types';

const CACHE_TTL = 10 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const year = parseInt(searchParams.get('year') ?? String(now.getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1));

  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  try {
    const cacheKey = `toggl-actuals-${year}-${month}`;
    const result = await withCache(cacheKey, CACHE_TTL, async () => {
      const [entries, projectMap, userMap] = await Promise.all([
        fetchTogglTimeEntries(from, to),
        fetchTogglProjects(),
        fetchTogglUsers(),
      ]);

      const valid = entries.filter((e) => e.duration > 0);
      const totalHours = round(valid.reduce((sum, e) => sum + e.duration, 0) / 3600);

      // Helper: get readable project name
      const getProjectName = (projectId: number | null): string => {
        if (!projectId) return 'Internal / No Project';
        const proj = projectMap.get(projectId);
        if (!proj) return `Project ${projectId}`;
        // Show "Client — Project" if client exists, else just project name
        if (proj.client_name) return `${proj.client_name} — ${proj.name}`;
        return proj.name;
      };

      const getProjectKey = (projectId: number | null): string => {
        if (!projectId) return 'internal';
        const proj = projectMap.get(projectId);
        return proj?.name ?? String(projectId);
      };

      // ── By Person ─────────────────────────────────────────────────────────
      const personMap = new Map<number, {
        name: string;
        projects: Map<number, { name: string; key: string; hours: number; billable: boolean }>;
        totalHours: number;
      }>();

      for (const entry of valid) {
        const uid = entry.user_id;
        if (!personMap.has(uid)) {
          personMap.set(uid, { name: userMap.get(uid) ?? `User ${uid}`, projects: new Map(), totalHours: 0 });
        }
        const person = personMap.get(uid)!;
        person.totalHours = round(person.totalHours + entry.duration / 3600);

        const pid = entry.project_id ?? 0;
        if (!person.projects.has(pid)) {
          person.projects.set(pid, {
            name: getProjectName(entry.project_id),
            key: getProjectKey(entry.project_id),
            hours: 0,
            billable: entry.billable,
          });
        }
        const proj = person.projects.get(pid)!;
        proj.hours = round(proj.hours + entry.duration / 3600);
      }

      const people = Array.from(personMap.entries()).map(([, person]) => ({
        id: person.name,
        name: person.name,
        totalHours: person.totalHours,
        projects: Array.from(person.projects.values()).map(proj => ({
          projectKey: proj.key,
          projectName: proj.name,
          hours: proj.hours,
          percent: totalHours > 0 ? Math.round((proj.hours / totalHours) * 100) : 0,
          tasks: [],
        })),
      })).sort((a, b) => b.totalHours - a.totalHours);

      // ── By Project ────────────────────────────────────────────────────────
      const projectTotals = new Map<number, { name: string; key: string; hours: number; people: Set<number> }>();

      for (const entry of valid) {
        const pid = entry.project_id ?? 0;
        if (!projectTotals.has(pid)) {
          projectTotals.set(pid, {
            name: getProjectName(entry.project_id),
            key: getProjectKey(entry.project_id),
            hours: 0,
            people: new Set(),
          });
        }
        const pt = projectTotals.get(pid)!;
        pt.hours = round(pt.hours + entry.duration / 3600);
        pt.people.add(entry.user_id);
      }

      const projects = Array.from(projectTotals.values()).map(pt => ({
        projectKey: pt.key,
        projectName: pt.name,
        hours: pt.hours,
        people: pt.people.size,
        percent: totalHours > 0 ? Math.round((pt.hours / totalHours) * 100) : 0,
      })).sort((a, b) => b.hours - a.hours);

      return {
        period: { year, month, from, to },
        totalHours,
        totalWorklogs: valid.length,
        totalPeople: personMap.size,
        totalProjects: projectTotals.size,
        people,
        projects,
      } satisfies ActualsResponse;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Toggl] Actuals error:', error);
    return NextResponse.json({ error: 'Failed to fetch Toggl actuals' }, { status: 500 });
  }
}