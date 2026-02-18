import { NextResponse } from 'next/server';
import { fetchJson, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const allIssues: JiraApiResponse['issues'] = [];

    for (const project of OPS_PROJECTS) {
      try {
        const jql = `project = ${project} ORDER BY created DESC`;
        const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent,description,updated,statuscategorychangedate`;

        const data = await fetchJson<JiraSearchResponse>(url, {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
        });

        allIssues.push(...data.issues);
      } catch (err) {
        console.error(`[Jira] Failed to fetch project ${project}:`, err);
        // Continue with other projects
      }
    }

    return NextResponse.json({ issues: allIssues } satisfies JiraApiResponse);
  } catch (error) {
    console.error('[Jira] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch Jira issues' }, { status: 500 });
  }
}
