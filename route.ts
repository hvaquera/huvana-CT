import { NextResponse } from 'next/server';

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

export async function GET() {
  try {
    const projects = ['VBTLEGAL', 'VBTFINANCE', 'VBTGTM', 'VBTOP'];
    const allIssues: any[] = [];

    for (const project of projects) {
      const jql = `project = ${project} ORDER BY created DESC`;
      const response = await fetch(
        `${JIRA_BASE_URL}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch ${project}:`, response.statusText);
        continue;
      }

      const data = await response.json();
      allIssues.push(...data.issues);
    }

    return NextResponse.json({ issues: allIssues });
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}
