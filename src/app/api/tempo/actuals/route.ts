import { NextResponse } from 'next/server';
import { fetchTempoWorklogs, fetchJson, JIRA_BASE, JIRA_AUTH, round, withCache } from '@/lib/api';
import { formatDisplayName } from '@/lib/constants';
import type { ActualsResponse, ActualsPerson, ActualsProjectTotal } from '@/types';

// ─── Issue Resolution ────────────────────────────────────────────────────────

interface ResolvedIssue {
  key: string;
  summary: string;
  projectKey: string;
  projectName: string;
}

/**
 * Resolve Tempo issue IDs to Jira issue keys + project info + summary.
 * Tempo v4 returns `issue.id` but not `issue.key`, so we batch-resolve via Jira REST API.
 * Results are cached for 1 hour to minimize API calls.
 */
async function resolveIssueIds(issueIds: string[]): Promise<Map<string, ResolvedIssue>> {
  const cache = new Map<string, ResolvedIssue>();
  const BATCH_SIZE = 10;

  for (let i = 0; i < issueIds.length; i += BATCH_SIZE) {
    const batch = issueIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (issueId) => {
        const data = await fetchJson<{ key: string; fields: { summary: string; project: { key: string; name: string } } }>(
          `${JIRA_BASE}/rest/api/2/issue/${issueId}?fields=project,summary`,
          { Authorization: `Basic ${JIRA_AUTH}` },
        );
        return { issueId, key: data.key, summary: data.fields.summary, projectKey: data.fields.project.key, projectName: data.fields.project.name };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { issueId, ...resolved } = result.value;
        cache.set(issueId, resolved);
      }
    }
  }

  return cache;
}

// ─── User Name Resolution ────────────────────────────────────────────────────

interface JiraUser {
  accountId: string;
  displayName: string;
}

/**
 * Resolve Tempo account IDs to display names via Jira user API.
 * Tempo v4 may return accountId without displayName for some users.
 */
async function resolveUserNames(accountIds: string[]): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  const BATCH_SIZE = 10;

  for (let i = 0; i < accountIds.length; i += BATCH_SIZE) {
    const batch = accountIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (accountId) => {
        const data = await fetchJson<JiraUser>(
          `${JIRA_BASE}/rest/api/2/user?accountId=${accountId}`,
          { Authorization: `Basic ${JIRA_AUTH}` },
        );
        return { accountId, displayName: data.displayName };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        cache.set(result.value.accountId, result.value.displayName);
      }
    }
  }

  return cache;
}

// ─── Route Handler ───────────────────────────────────────────────────────────

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()), 10);
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1), 10);

  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const cacheKey = `actuals-${year}-${month}`;

  try {
    const data = await withCache<ActualsResponse>(cacheKey, CACHE_TTL, async () => {
      // 1. Fetch all worklogs for the month
      const worklogs = await fetchTempoWorklogs(from, to);

      // 2. Collect ALL unique issue IDs for summary resolution
      const allIssueIds = new Set<string>();
      const keyToIdMap = new Map<string, string>(); // issue.key → issue.id for cross-referencing
      for (const w of worklogs) {
        if (w.issue?.id) {
          allIssueIds.add(String(w.issue.id));
          if (w.issue.key) keyToIdMap.set(w.issue.key, String(w.issue.id));
        }
      }
      const issueCache = await resolveIssueIds([...allIssueIds]);

      // 3. Resolve user account IDs → display names
      const uniqueAccountIds = [...new Set(worklogs.map((w) => w.author?.accountId).filter(Boolean))] as string[];
      const userCache = await resolveUserNames(uniqueAccountIds);

      // 4. Build person × project × task matrix
      const personMap = new Map<string, { name: string; totalHours: number; projects: Map<string, { projectName: string; hours: number; tasks: Map<string, { summary: string; hours: number; entries: Array<{ date: string; hours: number; comment: string }> }> }> }>();
      const projectTotals = new Map<string, { projectName: string; hours: number; peopleSet: Set<string> }>();
      let totalHours = 0;

      for (const wl of worklogs) {
        const authorId = wl.author?.accountId ?? 'unknown';
        const authorName = formatDisplayName(wl.author?.displayName || userCache.get(authorId) || authorId);
        const hours = (wl.timeSpentSeconds ?? 0) / 3600;
        totalHours += hours;

        // Resolve project + issue key
        let projectKey = '(unlinked)';
        let projectName = '(No Jira Issue)';
        let issueKey = '(no-issue)';

        if (wl.issue?.key) {
          issueKey = wl.issue.key;
          projectKey = wl.issue.key.split('-')[0];
          projectName = projectKey;
          // Try to get proper summary from resolved cache
          const resolvedById = wl.issue?.id ? issueCache.get(String(wl.issue.id)) : undefined;
          if (resolvedById) {
            projectName = resolvedById.projectName;
          }
        } else if (wl.issue?.id) {
          const resolved = issueCache.get(String(wl.issue.id));
          if (resolved) {
            issueKey = resolved.key;
            projectKey = resolved.projectKey;
            projectName = resolved.projectName;
          }
        }

        // Use Jira issue summary (from resolver), fall back to issue key, never use Tempo description as title
        const resolvedIssue = wl.issue?.id ? issueCache.get(String(wl.issue.id)) : undefined;
        const taskSummary = resolvedIssue?.summary || issueKey;
        const timeEntry = { date: wl.startDate, hours, comment: wl.description || '' };

        // Accumulate person data
        if (!personMap.has(authorId)) {
          personMap.set(authorId, { name: authorName, totalHours: 0, projects: new Map() });
        }
        const person = personMap.get(authorId)!;
        person.totalHours += hours;

        const personProj = person.projects.get(projectKey);
        if (personProj) {
          personProj.hours += hours;
          const existingTask = personProj.tasks.get(issueKey);
          if (existingTask) {
            existingTask.hours += hours;
            existingTask.entries.push(timeEntry);
          } else {
            personProj.tasks.set(issueKey, { summary: taskSummary, hours, entries: [timeEntry] });
          }
        } else {
          const tasks = new Map<string, { summary: string; hours: number; entries: Array<{ date: string; hours: number; comment: string }> }>();
          tasks.set(issueKey, { summary: taskSummary, hours, entries: [timeEntry] });
          person.projects.set(projectKey, { projectName, hours, tasks });
        }

        // Accumulate project totals
        if (!projectTotals.has(projectKey)) {
          projectTotals.set(projectKey, { projectName, hours: 0, peopleSet: new Set() });
        }
        const projTotal = projectTotals.get(projectKey)!;
        projTotal.hours += hours;
        projTotal.peopleSet.add(authorId);
      }

      // 5. Format response
      const people: ActualsPerson[] = [...personMap.entries()]
        .map(([id, p]) => ({
          id,
          name: p.name,
          totalHours: round(p.totalHours),
          projects: [...p.projects.entries()]
            .map(([key, proj]) => ({
              projectKey: key,
              projectName: proj.projectName,
              hours: round(proj.hours),
              percent: p.totalHours > 0 ? Math.round((proj.hours / p.totalHours) * 100) : 0,
              tasks: [...proj.tasks.entries()]
                .map(([issueKey, task]) => ({
                  issueKey,
                  summary: task.summary,
                  hours: round(task.hours),
                  entries: task.entries
                    .map((e) => ({ date: e.date, hours: round(e.hours), comment: e.comment }))
                    .sort((a, b) => a.date.localeCompare(b.date)),
                }))
                .sort((a, b) => b.hours - a.hours),
            }))
            .sort((a, b) => b.hours - a.hours),
        }))
        .sort((a, b) => b.totalHours - a.totalHours);

      const projects: ActualsProjectTotal[] = [...projectTotals.entries()]
        .map(([key, p]) => ({
          projectKey: key,
          projectName: p.projectName,
          hours: round(p.hours),
          people: p.peopleSet.size,
          percent: totalHours > 0 ? Math.round((p.hours / totalHours) * 100) : 0,
        }))
        .sort((a, b) => b.hours - a.hours);

      return {
        period: { year, month, from, to },
        totalHours: round(totalHours),
        totalWorklogs: worklogs.length,
        totalPeople: personMap.size,
        totalProjects: projectTotals.size,
        people,
        projects,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Tempo/Actuals] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Tempo actuals' }, { status: 500 });
  }
}
