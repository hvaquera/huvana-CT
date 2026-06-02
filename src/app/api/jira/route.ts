import { NextResponse } from 'next/server';
import { withCache, getApiConfig } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  isLast: boolean;
}

const CACHE_TTL = 10 * 60 * 1000;

export async function GET() {
  const cfg = await getApiConfig();

  if (!cfg.jiraToken || !cfg.jiraEmail) {
    return NextResponse.json({ issues: [] });
  }

  const HEADERS = {
    Authorization: `Basic ${cfg.jiraAuth}`,
    Accept: 'application/json',
  };

  try {
    const result = await withCache('jira-all', CACHE_TTL, async () => {
      const [activeData, doneData] = await Promise.all([
        fetch(
          `${cfg.jiraBase}/rest/api/3/search/jql?jql=${encodeURIComponent('updated >= -90d AND statusCategory != Done AND issuetype != Epic ORDER BY updated DESC')}&maxResults=200&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate,created`,
          { headers: HEADERS, cache: 'no-store' }
        ).then(r => r.json() as Promise<JiraSearchResponse>),
        fetch(
          `${cfg.jiraBase}/rest/api/3/search/jql?jql=${encodeURIComponent('updated >= -14d AND statusCategory = Done AND issuetype != Epic ORDER BY updated DESC')}&maxResults=50&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate,created`,
          { headers: HEADERS, cache: 'no-store' }
        ).then(r => r.json() as Promise<JiraSearchResponse>),
      ]);
      return { issues: [...(activeData.issues ?? []), ...(doneData.issues ?? [])] };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Jira] Error:', error);
    return NextResponse.json({ issues: [], error: String(error) });
  }
}
