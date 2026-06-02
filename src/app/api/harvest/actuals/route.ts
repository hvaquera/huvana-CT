import { NextResponse } from 'next/server';
import { withCache, getApiConfig, round } from '@/lib/api';

const CACHE_TTL = 15 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year  = parseInt(searchParams.get('year')  ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1));

  const cfg = await getApiConfig();

  const from = `${year}-${String(month).padStart(2,'0')}-01`;
  const to   = new Date(year, month, 0).toISOString().split('T')[0];

  const emptyResponse = {
    period: { year, month, from, to },
    totalHours: 0, totalWorklogs: 0, totalPeople: 0, totalProjects: 0,
    people: [], projects: [],
  };

  if (!cfg.harvestToken || !cfg.harvestAccountId) {
    return NextResponse.json(emptyResponse);
  }

  const HEADERS = {
    Authorization: `Bearer ${cfg.harvestToken}`,
    'Harvest-Account-Id': cfg.harvestAccountId,
    'User-Agent': 'ControlTower/1.0',
  };

  try {
    const result = await withCache(`harvest-actuals-${year}-${month}`, CACHE_TTL, async () => {
      const res = await fetch(
        `https://api.harvestapp.com/v2/time_entries?from=${from}&to=${to}&per_page=100`,
        { headers: HEADERS, cache: 'no-store' }
      );
      if (!res.ok) return emptyResponse;
      const data = await res.json();
      const entries = data.time_entries ?? [];

      // Build people map
      const peopleMap = new Map<string, { name: string; hours: number; projects: Map<string, number> }>();
      const projectMap = new Map<string, { name: string; hours: number; people: Set<string> }>();

      for (const e of entries) {
        const name = e.user?.name ?? 'Unknown';
        const userId = String(e.user?.id ?? name);
        const projectKey = String(e.project?.id ?? 'unknown');
        const projectName = e.project?.name ?? 'Unknown';
        const hours = round(e.hours ?? 0);

        if (!peopleMap.has(userId)) peopleMap.set(userId, { name, hours: 0, projects: new Map() });
        const person = peopleMap.get(userId)!;
        person.hours = round(person.hours + hours);
        person.projects.set(projectKey, round((person.projects.get(projectKey) ?? 0) + hours));

        if (!projectMap.has(projectKey)) projectMap.set(projectKey, { name: projectName, hours: 0, people: new Set() });
        const proj = projectMap.get(projectKey)!;
        proj.hours = round(proj.hours + hours);
        proj.people.add(userId);
      }

      const totalHours = round([...peopleMap.values()].reduce((s, p) => s + p.hours, 0));

      const people = [...peopleMap.entries()].map(([id, p]) => ({
        id,
        name: p.name,
        totalHours: p.hours,
        projects: [...p.projects.entries()].map(([projectKey, hours]) => ({
          projectKey,
          projectName: projectMap.get(projectKey)?.name ?? projectKey,
          hours,
          percent: totalHours > 0 ? round((hours / totalHours) * 100) : 0,
        })),
      }));

      const projects = [...projectMap.entries()].map(([projectKey, p]) => ({
        projectKey,
        projectName: p.name,
        hours: p.hours,
        people: p.people.size,
        percent: totalHours > 0 ? round((p.hours / totalHours) * 100) : 0,
      }));

      return {
        period: { year, month, from, to },
        totalHours,
        totalWorklogs: entries.length,
        totalPeople: peopleMap.size,
        totalProjects: projectMap.size,
        people,
        projects,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Harvest actuals] Error:', error);
    return NextResponse.json(emptyResponse);
  }
}
