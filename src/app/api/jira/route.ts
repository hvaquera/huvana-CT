import { NextResponse } from 'next/server';
import { withCache, JIRA_BASE, JIRA_AUTH } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  nextPageToken?: string;
  isLast: boolean;
}

const CACHE_TTL = 10 * 60 * 1000;
const HEADERS = {
  Authorization: `Basic ${JIRA_AUTH}`,
  Accept: 'application/json',
};

async function jiraFetch(jql: string, maxResults = 200) {
  const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate,created`;
  const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error(`Jira HTTP ${res.status}`);
  return res.json() as Promise<JiraSearchResponse>;
}

export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('jira-all', CACHE_TTL, async () => {
      const [activeData, doneData] = await Promise.all([
        jiraFetch('updated >= -90d AND statusCategory != Done AND issuetype != Epic ORDER BY updated DESC'),
        jiraFetch('updated >= -14d AND statusCategory = Done AND issuetype != Epic ORDER BY updated DESC', 50),
      ]);

      return {
        issues: [
          ...(activeData.issues ?? []),
          ...(doneData.issues ?? []),
        ],
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Jira] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}