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
        // Fetch active (non-Done) tasks first — these are what matter most
        const activeJql = `project = ${project} AND statusCategory != Done ORDER BY updated DESC`;
        const activeUrl = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(activeJql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;

        const activeData = await fetchJson<JiraSearchResponse>(activeUrl, {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
        });
        allIssues.push(...activeData.issues);

        // Also fetch recently completed tasks (last 90 days) for reports
        const doneJql = `project = ${project} AND statusCategory = Done AND updated >= -90d ORDER BY updated DESC`;
        const doneUrl = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(doneJql)}&maxResults=50&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;

        const doneData = await fetchJson<JiraSearchResponse>(doneUrl, {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
        });
        allIssues.push(...doneData.issues);
      } catch (err) {
        console.error(`[Jira] Failed to fetch project ${project}:`, err);
      }
    }

    return NextResponse.json({ issues: allIssues } satisfies JiraApiResponse);
  } catch (error) {
    console.error('[Jira] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch Jira issues' }, { status: 500 });
  }
}
