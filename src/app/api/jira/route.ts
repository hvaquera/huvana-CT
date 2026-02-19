import { NextResponse } from 'next/server';
import { fetchJson, withCache, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('jira-ops', CACHE_TTL, async () => {
      const projectList = OPS_PROJECTS.join(', ');

      // Two parallel JQL queries instead of 8 sequential ones
      const [activeData, doneData] = await Promise.all([
        fetchJson<JiraSearchResponse>(
          `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
            `project in (${projectList}) AND statusCategory != Done AND issuetype != Epic ORDER BY updated DESC`
          )}&maxResults=200&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`,
          { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
        ),
        fetchJson<JiraSearchResponse>(
          `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
            `project in (${projectList}) AND statusCategory = Done AND issuetype != Epic AND updated >= -90d ORDER BY updated DESC`
          )}&maxResults=200&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`,
          { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
        ),
      ]);

      return { issues: [...activeData.issues, ...doneData.issues] } satisfies JiraApiResponse;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Jira] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch Jira issues' }, { status: 500 });
  }
}
