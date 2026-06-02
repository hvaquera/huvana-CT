import { NextResponse } from 'next/server';
import { fetchTogglTimeEntries, fetchTogglProjects, fetchTogglUsers, withCache, round, getApiConfig } from '@/lib/api';
import type { ActualsResponse } from '@/types';

const CACHE_TTL = 10 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const year  = parseInt(searchParams.get('year')  ?? String(now.getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1));

  const cfg = await getApiConfig();
  if (!cfg.togglToken || !cfg.togglWsId) {
    return NextResponse.json({ period: { year, month, from: `${year}-${String(month).padStart(2,"'0'")}-01`, to: new Date(year, month, 0).toISOString().split("'T'")[0] }, totalHours: 0, totalWorklogs: 0, totalPeople: 0, totalProjects: 0, people: [], projects: [] });
  }

  const from = `${year}-${String(month).padStart(2,'0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;

  try {
    const cacheKey = `toggl-actuals-${year}-${month}`;
    const result = await withCache(cacheKey, CACHE_TTL, async () => {
      const [entries, projectMap, userMap] = await Promise.all([
        fetchTogglTimeEntries(cfg.togglToken!, from, to),
        fetchTogglProjects(cfg.togglToken!, cfg.togglWsId!),
        fetchTogglUsers(cfg.togglToken!, cfg.togglWsId!),
      ]);

      const valid = entries.filter(e => e.duration > 0);
      const totalHours = round(valid.reduce((sum, e) => sum + e.duration, 0) / 3600);

      const byPerson: Record<string, { hours: number; issueCount: number }> = {};
      const byProject: Record<string, number> = {};

      for (const e of valid) {
        const hours = round(e.duration / 3600);
        const name = userMap.get(e.user_id) ?? 'Unknown';
        const proj = projectMap.get(e.project_id ?? 0);
        const projectName = proj ? proj.name : 'No Project';

        if (!byPerson[name]) byPerson[name] = { hours: 0, issueCount: 0 };
        byPerson[name].hours = round(byPerson[name].hours + hours);
        byPerson[name].issueCount++;
        byProject[projectName] = round((byProject[projectName] ?? 0) + hours);
      }

      return { worklogs: valid.slice(0, 200), byPerson, byProject, totalHours, people: [] };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Toggl actuals] Error:', error);
    return NextResponse.json({ period: { year, month, from: `${year}-${String(month).padStart(2,"'0'")}-01`, to: new Date(year, month, 0).toISOString().split("'T'")[0] }, totalHours: 0, totalWorklogs: 0, totalPeople: 0, totalProjects: 0, people: [], projects: [] });
  }
}
