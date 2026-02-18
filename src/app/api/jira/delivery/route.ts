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
  isPrivate?: boolean;
  style?: string;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * GET /api/jira/delivery
 *
 * Fetches active Jira projects (excluding VBT ops), queries each individually
 * so one bad/archived project doesn't kill the others.
 * Results cached for 10 minutes.
 */
export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('delivery', CACHE_TTL, async () => {
      // 1. Discover all Jira projects
      const projects = await fetchJson<JiraProject[]>(
        `${JIRA_BASE}/rest/api/3/project`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );

      // 2. Filter: exclude ops projects and archived ones
      const opsSet = new Set<string>(OPS_PROJECTS);
      const clientProjects = projects.filter(
        (p) => !opsSet.has(p.key) && !p.archived,
      );

      if (clientProjects.length === 0) {
        return { issues: [] as JiraApiResponse['issues'], projects: [] as { key: string; name: string }[] };
      }

      // 3. Query each project individually with Promise.allSettled
      // This way one invalid project doesn't kill others
      const fetchPromises = clientProjects.map(async (proj) => {
        const jql = `project = "${proj.key}" AND statusCategory != Done ORDER BY duedate ASC, updated DESC`;
        const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,status,assignee,duedate,priority,project,parent,description,updated,statuscategorychangedate`;

        const data = await fetchJson<JiraSearchResponse>(url, {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
        });

        return { project: proj, issues: data.issues };
      });

      const results = await Promise.allSettled(fetchPromises);

      const allIssues: JiraApiResponse['issues'] = [];
      const activeProjects: { key: string; name: string }[] = [];

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.issues.length > 0) {
          allIssues.push(...r.value.issues);
          activeProjects.push({ key: r.value.project.key, name: r.value.project.name });
        }
        // Silently skip rejected (archived, no access, deleted projects)
      }

      activeProjects.sort((a, b) => a.name.localeCompare(b.name));

      return { issues: allIssues, projects: activeProjects };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Delivery] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery projects' }, { status: 500 });
  }
}
