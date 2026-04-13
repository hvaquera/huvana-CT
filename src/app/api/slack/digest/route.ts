import { NextResponse } from 'next/server';
import { fetchJson, fetchTempoWorklogs, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS, round } from '@/lib/api';
import { formatDisplayName } from '@/lib/constants';
import type { JiraIssue, JiraApiResponse } from '@/types';

// ─── Config ──────────────────────────────────────────────────────────────────

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? '';
const JIRA_BROWSE = 'https://verybigthings.atlassian.net/browse';

const AREA_MAP: Record<string, string> = {
  VBTLEGAL: 'Legal', VBTFINANCE: 'Finance', VBTGTM: 'GTM & Sales', VBTOP: 'Operations',
};

// ─── Types ───────────────────────────────────────────────────────────────────

type DigestType = 'monday' | 'friday';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

interface TempoWeekData {
  total: number;
  byPerson: Record<string, number>;
  byProject: Record<string, number>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categorize(statusName: string): string {
  const s = statusName.toLowerCase();
  if (s.includes('done') || s.includes('closed')) return 'done';
  if (s.includes('recurring')) return 'recurring';
  if (s.includes('progress') || s.includes('document sent') || s.includes('docusign')) return 'inProgress';
  return 'other';
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.floor((d1.getTime() - d2.getTime()) / 86400000);
}

function resolveArea(projectKey: string): string {
  return AREA_MAP[projectKey] ?? projectKey;
}

// ─── Jira Data Fetching ───────────────────────────────────────────────────────

const FIELDS = 'summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate';

/**
 * Fetch ops issues — same pattern as /api/jira/route.ts (two parallel JQL queries).
 */
async function fetchOpsIssues(): Promise<JiraIssue[]> {
  const projectList = OPS_PROJECTS.join(', ');
  try {
    const [activeData, doneData] = await Promise.all([
      fetchJson<JiraSearchResponse>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
          `project in (${projectList}) AND statusCategory != Done ORDER BY updated DESC`
        )}&maxResults=200&fields=${FIELDS}`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      ),
      fetchJson<JiraSearchResponse>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
          `project in (${projectList}) AND statusCategory = Done AND updated >= -90d ORDER BY updated DESC`
        )}&maxResults=200&fields=${FIELDS}`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      ),
    ]);
    return [...activeData.issues, ...doneData.issues];
  } catch (err) {
    console.error('[Digest] Failed to fetch ops issues:', err);
    return [];
  }
}

// ─── Tempo Data Fetching ──────────────────────────────────────────────────────

/**
 * Resolve Tempo issue IDs to project keys — same bulk JQL approach as
 * /api/tempo/actuals/route.ts, which is how the app already solved the
 * "unlinked" problem. Tempo v4 returns issue.id (not issue.key), so we
 * must resolve IDs to keys ourselves.
 */
async function resolveIssueIds(issueIds: string[]): Promise<Map<string, string>> {
  // id → projectKey
  const cache = new Map<string, string>();
  const BATCH_SIZE = 50;

  for (let i = 0; i < issueIds.length; i += BATCH_SIZE) {
    const batch = issueIds.slice(i, i + BATCH_SIZE);
    try {
      const data = await fetchJson<{ issues: Array<{ id: string; fields: { project: { key: string } } }> }>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(`id in (${batch.join(',')})`)}&maxResults=${BATCH_SIZE}&fields=project`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );
      for (const issue of data.issues) {
        cache.set(String(issue.id), issue.fields.project.key);
      }
    } catch (err) {
      console.error(`[Digest] resolveIssueIds batch failed:`, err);
    }
  }

  return cache;
}

/**
 * Resolve account IDs to display names — same approach as actuals route.
 * Falls back to accountId string if Jira lookup fails.
 */
async function resolveUserNames(accountIds: string[]): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  const results = await Promise.allSettled(
    accountIds.map(async (accountId) => {
      const data = await fetchJson<{ displayName: string }>(
        `${JIRA_BASE}/rest/api/2/user?accountId=${accountId}`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );
      return { accountId, displayName: data.displayName };
    }),
  );
  for (const r of results) {
    if (r.status === 'fulfilled') {
      cache.set(r.value.accountId, r.value.displayName);
    }
  }
  return cache;
}

/**
 * Fetch and aggregate Tempo hours for a given week.
 * weeksBack = 0 → current week, 1 → last week.
 *
 * Uses the same ID-based resolution as /api/tempo/actuals/route.ts to fix the
 * (unlinked) / "1 person" bug — Tempo v4 never returns issue.key or
 * author.displayName directly, so we resolve them via Jira.
 */
async function fetchTempoWeekData(weeksBack: number): Promise<TempoWeekData | null> {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - weeksBack * 7);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const from = monday.toISOString().split('T')[0];
    const to = sunday.toISOString().split('T')[0];

    const worklogs = await fetchTempoWorklogs(from, to);
    if (worklogs.length === 0) return { total: 0, byPerson: {}, byProject: {} };

    // Resolve issue IDs → project keys
    const allIssueIds = [...new Set(worklogs.map((w) => w.issue?.id).filter(Boolean).map(String))];
    const issueToProject = await resolveIssueIds(allIssueIds);

    // Resolve account IDs → display names (for any without displayName)
    const allAccountIds = [...new Set(worklogs.map((w) => w.author?.accountId).filter(Boolean))] as string[];
    const userNames = await resolveUserNames(allAccountIds);

    let total = 0;
    // Key by accountId to deduplicate correctly, same as /api/tempo/route.ts
    const personMap = new Map<string, { name: string; hours: number }>();
    const byProject: Record<string, number> = {};

    for (const wl of worklogs) {
      const hours = (wl.timeSpentSeconds ?? 0) / 3600;
      total += hours;

      // Person
      const accountId = wl.author?.accountId ?? 'unknown';
      const displayName = wl.author?.displayName || userNames.get(accountId) || accountId;
      const existing = personMap.get(accountId);
      if (existing) {
        existing.hours += hours;
      } else {
        personMap.set(accountId, { name: formatDisplayName(displayName), hours });
      }

      // Project — resolve via issue ID, same as actuals route
      if (wl.issue?.id) {
        const projKey = issueToProject.get(String(wl.issue.id));
        if (projKey) {
          byProject[projKey] = (byProject[projKey] ?? 0) + hours;
        }
        // unlinked (unresolved) hours still count toward total but not byProject
      }
    }

    // Flatten personMap to name-keyed record for block builder
    const byPerson: Record<string, number> = {};
    for (const [, { name, hours }] of personMap) {
      byPerson[name] = (byPerson[name] ?? 0) + hours;
    }

    return { total, byPerson, byProject };
  } catch (err) {
    console.error('[Digest] Tempo fetch error:', err);
    return null;
  }
}

// ─── Monday Digest ────────────────────────────────────────────────────────────

function buildMondayDigest(
  opsIssues: JiraIssue[],
  tempoLastWeek: TempoWeekData | null,
): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (5 - (today.getDay() || 7)));

  /**
   * Bug fix — deactivated users: filter at the source before any counting,
   * not just in the display loops. Mirrors how the ops tab works.
   */
  const filterActive = (issues: JiraIssue[]): JiraIssue[] =>
    issues.filter((i) => {
      const s = categorize(i.fields.status.name);
      if (s === 'done' || s === 'recurring') return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false; // epics are containers, not tasks
      if (!i.fields.assignee) return false;               // unassigned = no owner, not actionable
      if (i.fields.assignee.active === false) return false; // deactivated user
      return true;
    });

  const activeOps = filterActive(opsIssues);
  const allActive = activeOps;

  const recurringCount = opsIssues.filter(
    (i) => categorize(i.fields.status.name) === 'recurring',
  ).length;

  // ── Overdue ──
  const overdue = allActive
    .filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      const daysLate = daysBetween(today, due);
      return due < today && daysLate <= 90; // 90-day cap: ancient overdue = not actionable signal
    })
    .sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime());

  // ── Stale ──
  const opsKeys = new Set<string>(OPS_PROJECTS);
  const stale = allActive
    .filter((i) => {
      if (categorize(i.fields.status.name) !== 'inProgress') return false;
      if (!i.fields.updated) return false;
      const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
      const isOps = opsKeys.has(i.fields.project.key);
      const days = daysBetween(today, new Date(i.fields.updated));
      if (days > 90) return false;         // older than 90 days = archaeology, not signal
      if (isEpic && isOps) return false;   // ops epics move slowly, skip
      if (isEpic) return days >= 14;       // delivery epics: 14-day threshold
      return days >= 3;                    // everything else: 3 days
    })
    .sort((a, b) => new Date(a.fields.updated!).getTime() - new Date(b.fields.updated!).getTime());

  // ── Due this week ──
  const dueThisWeek = allActive
    .filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      return due >= today && due <= weekEnd;
    })
    .sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime());

  // ── Due this week — grouped by person ──
  const personWork: Record<string, { tasks: string[]; count: number }> = {};
  dueThisWeek.forEach((i) => {
    if (i.fields.assignee?.active === false) return; // belt-and-suspenders
    const name = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned');
    if (!personWork[name]) personWork[name] = { tasks: [], count: 0 };
    personWork[name].count++;
    if (personWork[name].tasks.length < 3) {
      personWork[name].tasks.push(`<${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 50)}`);
    }
  });

  // ── Ops area breakdown ──
  const areaProjectMap: Record<string, string[]> = {
    Legal: ['VBTLEGAL'], Finance: ['VBTFINANCE'], 'GTM & Sales': ['VBTGTM'], Operations: ['VBTOP'],
  };
  const opsAreas = ['Legal', 'Finance', 'GTM & Sales', 'Operations'] as const;

  // ── Timesheet adoption — ops team only ──
  let timesheetLine = '';
  if (tempoLastWeek) {
    const opsAssignees = new Set<string>();
    activeOps.forEach((i) => {
      if (i.fields.assignee?.displayName) opsAssignees.add(i.fields.assignee.displayName);
    });
    const tempoLoggers = new Set(Object.keys(tempoLastWeek.byPerson));
    const logging = [...opsAssignees].filter((n) => tempoLoggers.has(n));
    const notLogging = [...opsAssignees]
      .filter((n) => !tempoLoggers.has(n))
      .map((n) => formatDisplayName(n).split(' ')[0]);
    const pct = opsAssignees.size > 0 ? Math.round((logging.length / opsAssignees.size) * 100) : 100;
    if (notLogging.length === 0) {
      timesheetLine = `📊 Ops timesheet adoption: *100%* ✓`;
    } else if (notLogging.length <= 6) {
      timesheetLine = `📊 Ops timesheet adoption: *${pct}%* (${logging.length}/${opsAssignees.size}) — not logging: ${notLogging.join(', ')}`;
    } else {
      timesheetLine = `📊 Ops timesheet adoption: *${pct}%* (${logging.length}/${opsAssignees.size}) — ${notLogging.length} not logging`;
    }
  }

  // ── Overall verdict ──
  const totalOverdue = overdue.length;
  const totalStale = stale.length;
  let overallEmoji: string;
  let overallVerdict: string;
  if (totalOverdue >= 5 || totalStale >= 8) { overallEmoji = '🔴'; overallVerdict = 'Needs Intervention'; }
  else if (totalOverdue >= 3 || totalStale >= 4) { overallEmoji = '🟡'; overallVerdict = 'Some Friction'; }
  else if (totalOverdue > 0 || totalStale > 0) { overallEmoji = '🟡'; overallVerdict = 'Mostly Healthy'; }
  else { overallEmoji = '🟢'; overallVerdict = 'Running Smooth'; }

  // ── Build blocks ──
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const blocks: object[] = [
    { type: 'header', text: { type: 'plain_text', text: `${overallEmoji} Weekly Pulse — ${overallVerdict}`, emoji: true } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Week of ${dateStr}` }] },
    { type: 'divider' },
  ];

  // Section 1: OPS SNAPSHOT
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*📋 Ops Snapshot*' } });

  for (const area of opsAreas) {
    const keys = areaProjectMap[area];
    const areaIssues = activeOps.filter((i) => keys.includes(i.fields.project.key));
    const areaOverdue = areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      const daysLate = daysBetween(today, due);
      return due < today && daysLate <= 90;
    });
    const worstDays = areaOverdue.length > 0
      ? Math.max(...areaOverdue.map((i) => daysBetween(today, new Date(i.fields.duedate!))))
      : 0;
    const dueCount = areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      return due >= today && due <= weekEnd;
    }).length;
    const staleCount = areaIssues.filter((i) => {
      if (categorize(i.fields.status.name) !== 'inProgress' || !i.fields.updated) return false;
      const days = daysBetween(today, new Date(i.fields.updated));
      return days >= 3 && days <= 90; // 90-day cap: older = archaeology not signal
    }).length;
    const areaHours = tempoLastWeek
      ? keys.reduce((sum, k) => sum + (tempoLastWeek.byProject[k] ?? 0), 0)
      : 0;

    let signal = '🟢';
    if (areaOverdue.length >= 3 || staleCount >= 3) signal = '🔴';
    else if (areaOverdue.length > 0 || staleCount > 0) signal = '🟡';

    const parts: string[] = [];
    if (areaOverdue.length > 0) parts.push(`*${areaOverdue.length} overdue* (${worstDays}d)`);
    if (staleCount > 0) parts.push(`*${staleCount} stale*`);
    if (areaOverdue.length === 0 && staleCount === 0) parts.push('✓ clean');
    parts.push(`${dueCount} due this week`);
    if (tempoLastWeek) parts.push(`${round(areaHours)}h last week`);

    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `${signal}  *${area}*\n      ${parts.join('  •  ')}` } });
  }

  blocks.push({ type: 'divider' });

  // Section 2: OPERATIONAL HEALTH
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*🏥 Operational Health*' } });

  const healthLines: string[] = [];

  if (overdue.length > 0) {
    const lines = overdue.slice(0, 5).map((i) => {
      const days = daysBetween(today, new Date(i.fields.duedate!));
      const assignee = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
      return `• <${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)} — *${days}d late* (${assignee})`;
    });
    if (overdue.length > 5) lines.push(`_...and ${overdue.length - 5} more_`);
    healthLines.push(`🔴 *Overdue (${overdue.length})*\n${lines.join('\n')}`);
  } else {
    healthLines.push('✅ *No overdue tasks* — clean slate!');
  }

  if (stale.length > 0) {
    const lines = stale.slice(0, 5).map((i) => {
      const days = daysBetween(today, new Date(i.fields.updated!));
      const assignee = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
      return `• <${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)} — *${days}d silent* (${assignee})`;
    });
    if (stale.length > 5) lines.push(`_...and ${stale.length - 5} more_`);
    healthLines.push(`🟡 *Stale — No Updates in 3+ Days (${stale.length})*\n${lines.join('\n')}`);
  }

  if (timesheetLine) healthLines.push(timesheetLine);

  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: healthLines.join('\n\n') } });
  blocks.push({ type: 'divider' });

  // Footer
  blocks.push({ type: 'divider' });
  const inProgress = allActive.filter((i) => categorize(i.fields.status.name) === 'inProgress').length;
  const noDueDate = allActive.filter((i) => !i.fields.duedate).length;
  blocks.push({
    type: 'context',
    elements: [{
      type: 'mrkdwn',
      text: `📊 *Quick Stats:* ${allActive.length} active  •  ${inProgress} in progress  •  ${overdue.length} overdue  •  ${stale.length} stale  •  ${recurringCount} recurring  •  ${noDueDate} missing due dates  •  <https://controltower-wine.vercel.app|Open Control Tower>`,
    }],
  });

  return blocks;
}

// ─── Friday Digest ────────────────────────────────────────────────────────────

function buildFridayDigest(
  opsIssues: JiraIssue[],
  tempoThisWeek: TempoWeekData | null,
): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const opsKeys = new Set<string>(OPS_PROJECTS);
  const weekStart = new Date(today);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  weekStart.setHours(0, 0, 0, 0);

  const allIssues = opsIssues;

  // Completed this week — deactivated users and epics excluded
  const completedThisWeek = allIssues.filter((i) => {
    if (categorize(i.fields.status.name) !== 'done') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    if (i.fields.assignee?.active === false) return false;
    const changed = i.fields.statuscategorychangedate ?? i.fields.updated;
    if (!changed) return false;
    return new Date(changed) >= weekStart;
  });

  const completedByPerson: Record<string, string[]> = {};
  completedThisWeek.forEach((i) => {
    const name = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned');
    if (!completedByPerson[name]) completedByPerson[name] = [];
    if (completedByPerson[name].length < 3) {
      completedByPerson[name].push(`<${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)}`);
    }
  });

  const completedByArea: Record<string, number> = {};
  completedThisWeek.forEach((i) => {
    const area = resolveArea(i.fields.project.key);
    completedByArea[area] = (completedByArea[area] ?? 0) + 1;
  });

  // Active — epics, unassigned, and deactivated users excluded
  const active = allIssues.filter((i) => {
    const s = categorize(i.fields.status.name);
    if (s === 'done' || s === 'recurring') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    if (!i.fields.assignee) return false;
    if (i.fields.assignee.active === false) return false;
    return true;
  });

  const overdue = active.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    const daysLate = daysBetween(today, due);
    return due < today && daysLate <= 90;
  });

  const stale = active.filter((i) => {
    if (categorize(i.fields.status.name) !== 'inProgress') return false;
    if (!i.fields.updated) return false;
    const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
    const isOps = opsKeys.has(i.fields.project.key);
    const days = daysBetween(today, new Date(i.fields.updated));
    if (isEpic && isOps) return false;
    if (isEpic) return days >= 14;
    return days >= 3;
  });

  const blocks: object[] = [
    { type: 'header', text: { type: 'plain_text', text: '📊 Friday Recap — What Happened This Week', emoji: true } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `*${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}*  •  Control Tower Weekly Recap` }] },
    { type: 'divider' },
  ];

  if (completedThisWeek.length > 0) {
    const areaLine = Object.entries(completedByArea)
      .sort(([, a], [, b]) => b - a)
      .map(([area, count]) => `${area}: ${count}`)
      .join('  •  ');
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `✅ *Completed This Week (${completedThisWeek.length})*\n${areaLine}` } });

    const personLines = Object.entries(completedByPerson)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 6)
      .map(([name, tasks]) => {
        const total = completedThisWeek.filter(
          (i) => formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned') === name,
        ).length;
        const extra = total > 3 ? ` _(+${total - 3} more)_` : '';
        return `*${name}* (${total})${extra}\n   ${tasks.join('\n   ')}`;
      });
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: personLines.join('\n\n') } });
  } else {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '⚠️ *No tasks completed this week.* Something might be off.' } });
  }

  blocks.push({ type: 'divider' });

  if (tempoThisWeek && tempoThisWeek.total > 0) {
    const topPeople = Object.entries(tempoThisWeek.byPerson)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, hrs]) => `${name.split(' ')[0]}: ${round(hrs)}h`)
      .join('  •  ');
    const topProjects = Object.entries(tempoThisWeek.byProject)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([proj, hrs]) => `${resolveArea(proj)}: ${round(hrs)}h`)
      .join('  •  ');
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `⏱️ *Hours Logged This Week: ${round(tempoThisWeek.total)}h*\n\n*By person:* ${topPeople}\n*By project:* ${topProjects}` },
    });
    blocks.push({ type: 'divider' });
  }

  const slippedLines: string[] = [];
  if (overdue.length > 0) slippedLines.push(`🔴 *${overdue.length} overdue* — oldest: <${JIRA_BROWSE}/${overdue[0].key}|${overdue[0].key}>`);
  if (stale.length > 0) slippedLines.push(`🟡 *${stale.length} stale* — no updates in 3+ days`);
  if (slippedLines.length > 0) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `⚠️ *Carrying Into Next Week*\n${slippedLines.join('\n')}` } });
  } else {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '🎉 *Clean exit — nothing overdue or stale heading into next week!*' } });
  }

  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `📈 *Week Summary:* ${completedThisWeek.length} completed  •  ${tempoThisWeek ? round(tempoThisWeek.total) + 'h logged' : 'Tempo unavailable'}  •  ${overdue.length} overdue  •  ${stale.length} stale  •  ${active.length} active`,
      }],
    },
  );

  return blocks;
}

// ─── Send to Slack ────────────────────────────────────────────────────────────

async function sendToSlack(blocks: object[]): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.error('[Digest] SLACK_WEBHOOK_URL not configured');
    return false;
  }
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`[Digest] Slack webhook error: ${res.status} ${text}`);
    return false;
  }
  return true;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') ?? 'monday') as DigestType;
  const dryRun = searchParams.get('dry') === 'true';

  const authKey = searchParams.get('key');
  const expectedKey = process.env.DIGEST_SECRET_KEY ?? '';
  if (expectedKey && authKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[Digest] Building ${type} digest (ops-only)...`);

    // Fetch Jira data — ops only (delivery moved to PSA)
    const opsIssues = await fetchOpsIssues();

    console.log(`[Digest] Ops: ${opsIssues.length} issues`);

    if (type === 'monday') {
      // Monday uses last week's Tempo hours for context
      const tempoLastWeek = await fetchTempoWeekData(1).catch(() => null);
      const blocks = buildMondayDigest(opsIssues, tempoLastWeek);

      if (dryRun) {
        return NextResponse.json({
          type, blocks, blockCount: blocks.length,
          opsIssueCount: opsIssues.length,
        });
      }
      const sent = await sendToSlack(blocks);
      return NextResponse.json({ success: sent, type, blockCount: blocks.length, message: sent ? 'Monday digest sent' : 'Failed to send' });

    } else {
      // Friday uses this week's Tempo hours for the recap
      const tempoThisWeek = await fetchTempoWeekData(0).catch(() => null);
      const blocks = buildFridayDigest(opsIssues, tempoThisWeek);

      if (dryRun) {
        return NextResponse.json({ type, blocks, blockCount: blocks.length, issueCount: opsIssues.length });
      }
      const sent = await sendToSlack(blocks);
      return NextResponse.json({ success: sent, type, message: sent ? 'Friday digest sent' : 'Failed to send' });
    }

  } catch (error) {
    console.error('[Digest] Error:', error);
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
