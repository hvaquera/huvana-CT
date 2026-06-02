import { NextResponse } from 'next/server';
import { fetchTempoWorklogs, fetchJson, round, withCache, getApiConfig } from '@/lib/api';

const CACHE_TTL = 15 * 60 * 1000;
const BATCH_SIZE = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year  = parseInt(searchParams.get('year')  ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1));

  const cfg = await getApiConfig();
  if (!cfg.jiraToken) return NextResponse.json({ worklogs: [], byPerson: {}, byProject: {} });

  const JIRA_AUTH = cfg.jiraAuth;
  const JIRA_BASE = cfg.jiraBase;
  const TEMPO_TOKEN = cfg.jiraToken; // tempo uses separate token — check config

  const from = `${year}-${String(month).padStart(2,'0')}-01`;
  const to   = new Date(year, month, 0).toISOString().split('T')[0];
  const cacheKey = `tempo-actuals-${from}-${to}`;

  try {
    const result = await withCache(cacheKey, CACHE_TTL, async () => {
      const worklogs = await fetchTempoWorklogs(cfg.jiraToken!, from, to);
      if (!worklogs.length) return { worklogs: [], byPerson: {}, byProject: {} };

      const issueIds = [...new Set(worklogs.map(w => w.issue?.id).filter(Boolean))];
      const issueMap = new Map<number, { project: string; summary: string }>();

      for (let i = 0; i < issueIds.length; i += BATCH_SIZE) {
        const batch = issueIds.slice(i, i + BATCH_SIZE);
        const jql = `id in (${batch.join(',')})`;
        try {
          const data = await fetchJson<{ issues: { id: string; fields: { project: { key: string }; summary: string } }[] }>(
            `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${BATCH_SIZE}&fields=project,summary`,
            { Authorization: `Basic ${JIRA_AUTH}` },
          );
          for (const issue of data.issues ?? []) {
            issueMap.set(parseInt(issue.id), { project: issue.fields.project.key, summary: issue.fields.summary });
          }
        } catch {}
      }

      const byPerson: Record<string, { hours: number; issueCount: number }> = {};
      const byProject: Record<string, number> = {};

      for (const w of worklogs) {
        const hours = round((w.timeSpentSeconds ?? 0) / 3600);
        const name = w.author?.displayName ?? 'Unknown';
        const issueInfo = w.issue?.id ? issueMap.get(w.issue.id) : null;
        const project = issueInfo?.project ?? 'Unknown';

        if (!byPerson[name]) byPerson[name] = { hours: 0, issueCount: 0 };
        byPerson[name].hours = round(byPerson[name].hours + hours);
        byPerson[name].issueCount++;

        byProject[project] = round((byProject[project] ?? 0) + hours);
      }

      return { worklogs: worklogs.slice(0, 200), byPerson, byProject };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Tempo actuals] Error:', error);
    return NextResponse.json({ worklogs: [], byPerson: {}, byProject: {} });
  }
}
