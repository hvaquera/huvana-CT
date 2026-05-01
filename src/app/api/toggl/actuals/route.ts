/**
 * GET /api/toggl/actuals?year=2026&month=4
 *
 * Returns time actuals from Toggl in the same shape as /api/tempo/actuals
 * so TimeActualsTab works without modification.
 */

import { NextResponse } from 'next/server';
import {
  fetchTogglTimeEntries,
  fetchTogglProjects,
  fetchTogglUsers,
  withCache,
  round,
} from '@/lib/api';
import type { ActualsResponse, ActualsPerson, ActualsProject, ActualsProjectTotal } from '@/types';

const CACHE_TTL = 10 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const year = parseInt(searchParams.get('year') ?? String(now.getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1));

  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  try {
    const cacheKey = `toggl-actuals-${year}-${month}`;
    const result = await withCache(cacheKey, CACHE_TTL, async () => {
      // Fetch all in parallel
      const [entries, projectMap, userMap] = await Promise.all([
        fetchTogglTimeEntries(from, to),
        fetchTogglProjects(),
        fetchTogglUsers(),
      ]);

      // Filter out entries with no duration or negative (running timers)
      const validEntries = entries.filter((e) => e.duration > 0);

      // Group by person
      const personMap = new Map<number, {
        name: string;
        projects: Map<number, { name: string; clientName: string; seconds: number; billable: boolean }>;
        totalSeconds: number;
      }>();

      for (const entry of validEntries) {
        const userId = entry.user_id;
        const userName = userMap.get(userId) ?? `User ${userId}`;
        const project = entry.project_id ? projectMap.get(entry.project_id) : null;
        const projectName = project?.name ?? 'No Project';
        const clientName = project?.client_name ?? 'Internal';
        const projectId = entry.project_id ?? 0;

        if (!personMap.has(userId)) {
          personMap.set(userId, { name: userName, projects: new Map(), totalSeconds: 0 });
        }
        const person = personMap.get(userId)!;
        person.totalSeconds += entry.duration;

        if (!person.projects.has(projectId)) {
          person.projects.set(projectId, { name: projectName, clientName, seconds: 0, billable: entry.billable });
        }
        person.projects.get(projectId)!.seconds += entry.duration;
      }

      // Build people array
      const totalSeconds = validEntries.reduce((sum, e) => sum + e.duration, 0);
      const totalHours = round(totalSeconds / 3600);

      const people: ActualsPerson[] = Array.from(personMap.entries()).map(([userId, person]) => {
        const projects: ActualsProject[] = Array.from(person.projects.entries()).map(([projectId, proj]) => {
          const hours = round(proj.seconds / 3600);
          return {
            projectKey: String(projectId),
            projectName: proj.name,
            hours,
            percent: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0,
            tasks: [], // Toggl entries grouped by description
          };
        });

        return {
          id: String(userId),
          name: person.name,
          totalHours: round(person.totalSeconds / 3600),
          projects,
        };
      }).sort((a, b) => b.totalHours - a.totalHours);

      // Build projects array
      const projectTotals = new Map<number, { name: string; seconds: number; people: Set<number> }>();
      for (const entry of validEntries) {
        const projectId = entry.project_id ?? 0;
        const project = entry.project_id ? projectMap.get(entry.project_id) : null;
        const projectName = project?.name ?? 'No Project';
        if (!projectTotals.has(projectId)) {
          projectTotals.set(projectId, { name: projectName, seconds: 0, people: new Set() });
        }
        const pt = projectTotals.get(projectId)!;
        pt.seconds += entry.duration;
        pt.people.add(entry.user_id);
      }

      const projects: ActualsProjectTotal[] = Array.from(projectTotals.entries()).map(([projectId, pt]) => {
        const hours = round(pt.seconds / 3600);
        return {
          projectKey: String(projectId),
          projectName: pt.name,
          hours,
          people: pt.people.size,
          percent: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0,
        };
      }).sort((a, b) => b.hours - a.hours);

      return {
        period: { year, month, from, to },
        totalHours,
        totalWorklogs: validEntries.length,
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
