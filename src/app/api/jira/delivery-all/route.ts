import { NextResponse } from 'next/server';
import { fetchJson, withCache, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

interface JiraProject {
  key: string;
  name: string;
  archived?: boolean;
}

const CACHE_TTL = 10 * 60 * 1000;

/**
 * GET /api/jira/delivery-all
 *
 * Same as /api/jira/delivery but INCLUDES Done tasks (needed for Reports tab to count completions).
 * Only fetches tasks updated in the last 90 days to avoid ancient archived noise.
 */
export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('delivery-all', CACHE_TTL, async () => {
      const projects = await fetchJson<JiraProject[]>(
        `${JIRA_BASE}/rest/api/3/project`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );

      const opsSet = new Set<string>(OPS_PROJECTS);
      const clientProjects = projects.filter((p) => !opsSet.has(p.key) && !p.archived);

      if (clientProjects.length === 0) {
        return { issues: [] as JiraApiResponse['issues'] };
      }

      // Include ALL statuses but only tasks updated in last 90 days to avoid ancient noise
      const results = await Promise.allSettled(
        clientProjects.map(async (proj) => {
          const jql = `project = "${proj.key}" AND updated >= -90d AND issuetype != Epic ORDER BY updated DESC`;
          const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;
          return fetchJson<JiraSearchResponse>(url, {
            Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json',
          });
        }),
      );

      const allIssues: JiraApiResponse['issues'] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') allIssues.push(...r.value.issues);
      }

      return { issues: allIssues };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Delivery-All] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
