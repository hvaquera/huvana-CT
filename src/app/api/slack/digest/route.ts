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

function getWeekRange(): { from: string; to: string; fromDate: Date; toDate: Date } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);
  return {
    from: monday.toISOString().split('T')[0],
    to: friday.toISOString().split('T')[0],
    fromDate: monday,
    toDate: friday,
  };
}

function resolveArea(projectKey: string): string {
  return AREA_MAP[projectKey] ?? projectKey;
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function fetchAllJiraIssues(): Promise<JiraIssue[]> {
  const allIssues: JiraIssue[] = [];

  // Ops projects
  for (const project of OPS_PROJECTS) {
    try {
      const jql = `project = ${project} ORDER BY created DESC`;
      const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;
      const data = await fetchJson<JiraSearchResponse>(url, {
        Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json',
      });
      allIssues.push(...data.issues);
    } catch (err) {
      console.error(`[Digest] Failed to fetch ${project}:`, err);
    }
  }

  // Delivery projects
  try {
    interface JiraProject { key: string; name: string; archived?: boolean }
    const projects = await fetchJson<JiraProject[]>(
      `${JIRA_BASE}/rest/api/3/project`,
      { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
    );
    const opsSet = new Set<string>(OPS_PROJECTS);
    const clientProjects = projects.filter((p) => !opsSet.has(p.key) && !p.archived);

    const results = await Promise.allSettled(
      clientProjects.map(async (proj) => {
        const jql = `project = "${proj.key}" AND statusCategory != Done ORDER BY duedate ASC`;
        const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;
        return fetchJson<JiraSearchResponse>(url, {
          Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json',
        });
      }),
    );
    for (const r of results) {
      if (r.status === 'fulfilled') allIssues.push(...r.value.issues);
    }
  } catch (err) {
    console.error('[Digest] Failed to fetch delivery projects:', err);
  }

  return allIssues;
}

// ─── Digest Builders ─────────────────────────────────────────────────────────

function buildMondayDigest(issues: JiraIssue[], tempoHours: number | null): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (5 - (today.getDay() || 7))); // Friday

  const active = issues.filter((i) => { const s = categorize(i.fields.status.name); return s !== 'done' && s !== 'recurring'; });
  const recurringCount = issues.filter((i) => categorize(i.fields.status.name) === 'recurring').length;

  // Overdue
  const overdue = active.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    return due < today;
  }).sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime());

  // Stale (In Progress, no updates — epics excluded for ops, 14d threshold for delivery)
  const opsKeys = new Set<string>(OPS_PROJECTS);
  const stale = active.filter((i) => {
    if (categorize(i.fields.status.name) !== 'inProgress') return false;
    if (!i.fields.updated) return false;
    const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
    const isOps = opsKeys.has(i.fields.project.key);
    const days = daysBetween(today, new Date(i.fields.updated));
    if (isEpic && isOps) return false;
    if (isEpic) return days >= 14;
    return days >= 3;
  }).sort((a, b) => new Date(a.fields.updated!).getTime() - new Date(b.fields.updated!).getTime());

  // Due this week
  const dueThisWeek = active.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    return due >= today && due <= weekEnd;
  }).sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime());

  // Upcoming by person (skip deactivated users)
  const personWork: Record<string, { tasks: string[]; count: number }> = {};
  dueThisWeek.forEach((i) => {
    if (i.fields.assignee?.active === false) return;
    const name = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned');
    if (!personWork[name]) personWork[name] = { tasks: [], count: 0 };
    personWork[name].count++;
    if (personWork[name].tasks.length < 3) {
      personWork[name].tasks.push(`<${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 50)}`);
    }
  });

  // Build Slack blocks
  const blocks: object[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '📋 Monday Pulse — What\'s Happening This Week', emoji: true },
    },
    {
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `*${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}*  •  Control Tower Weekly Digest` }],
    },
    { type: 'divider' },
  ];

  // Overdue section
  if (overdue.length > 0) {
    const overdueLines = overdue.slice(0, 5).map((i) => {
      const days = daysBetween(today, new Date(i.fields.duedate!));
      const assignee = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
      return `• <${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)} — *${days}d late* (${assignee})`;
    });
    if (overdue.length > 5) overdueLines.push(`_...and ${overdue.length - 5} more_`);

    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `🔴 *Overdue (${overdue.length})*\n${overdueLines.join('\n')}` },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '✅ *No overdue tasks* — clean slate!' },
    });
  }

  // Stale section
  if (stale.length > 0) {
    const staleLines = stale.slice(0, 5).map((i) => {
      const days = daysBetween(today, new Date(i.fields.updated!));
      const assignee = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
      return `• <${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)} — *${days}d silent* (${assignee})`;
    });
    if (stale.length > 5) staleLines.push(`_...and ${stale.length - 5} more_`);

    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `🟡 *Stale — No Updates in 3+ Days (${stale.length})*\n${staleLines.join('\n')}` },
    });
  }

  blocks.push({ type: 'divider' });

  // Due this week by person
  if (Object.keys(personWork).length > 0) {
    const personLines = Object.entries(personWork)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([name, data]) => {
        const taskList = data.tasks.join('\n   ');
        const extra = data.count > 3 ? ` _(+${data.count - 3} more)_` : '';
        return `*${name}* — ${data.count} task${data.count !== 1 ? 's' : ''} due${extra}\n   ${taskList}`;
      });

    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `📅 *Due This Week (${dueThisWeek.length})*\n\n${personLines.join('\n\n')}` },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '📅 *Nothing due this week* — either quiet or missing due dates.' },
    });
  }

  // Quick stats footer
  const inProgress = active.filter((i) => categorize(i.fields.status.name) === 'inProgress').length;
  const noDueDate = active.filter((i) => !i.fields.duedate).length;
  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `📊 *Quick Stats:* ${active.length} active tasks  •  ${inProgress} in progress  •  ${overdue.length} overdue  •  ${stale.length} stale  •  ${recurringCount} recurring  •  ${noDueDate} missing due dates`,
      }],
    },
  );

  return blocks;
}

function buildFridayDigest(
  issues: JiraIssue[],
  tempoHours: { total: number; byPerson: Record<string, number>; byProject: Record<string, number> } | null,
): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const opsKeys = new Set<string>(OPS_PROJECTS);
  const weekStart = new Date(today);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  weekStart.setHours(0, 0, 0, 0);

  // Completed this week (status changed to done this week)
  const completedThisWeek = issues.filter((i) => {
    if (categorize(i.fields.status.name) !== 'done') return false;
    const changed = i.fields.statuscategorychangedate ?? i.fields.updated;
    if (!changed) return false;
    return new Date(changed) >= weekStart;
  });

  // Completed by person (skip deactivated users)
  const completedByPerson: Record<string, string[]> = {};
  completedThisWeek.forEach((i) => {
    if (i.fields.assignee?.active === false) return;
    const name = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned');
    if (!completedByPerson[name]) completedByPerson[name] = [];
    if (completedByPerson[name].length < 3) {
      completedByPerson[name].push(`<${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)}`);
    }
  });

  // Completed by area
  const completedByArea: Record<string, number> = {};
  completedThisWeek.forEach((i) => {
    const area = resolveArea(i.fields.project.key);
    completedByArea[area] = (completedByArea[area] ?? 0) + 1;
  });

  // Still overdue (exclude recurring)
  const active = issues.filter((i) => { const s = categorize(i.fields.status.name); return s !== 'done' && s !== 'recurring'; });
  const overdue = active.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    return due < today;
  });

  // Still stale (same epic logic: ops epics excluded, delivery epics 14d)
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

  // Build blocks
  const blocks: object[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '📊 Friday Recap — What Happened This Week', emoji: true },
    },
    {
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `*${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}*  •  Control Tower Weekly Recap` }],
    },
    { type: 'divider' },
  ];

  // Completed section
  if (completedThisWeek.length > 0) {
    const areaLine = Object.entries(completedByArea)
      .sort(([, a], [, b]) => b - a)
      .map(([area, count]) => `${area}: ${count}`)
      .join('  •  ');

    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `✅ *Completed This Week (${completedThisWeek.length})*\n${areaLine}` },
    });

    const personLines = Object.entries(completedByPerson)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 6)
      .map(([name, tasks]) => {
        const total = completedThisWeek.filter((i) => (i.fields.assignee?.displayName ?? 'Unassigned') === name).length;
        const extra = total > 3 ? ` _(+${total - 3} more)_` : '';
        return `*${name}* (${total})${extra}\n   ${tasks.join('\n   ')}`;
      });

    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: personLines.join('\n\n') },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '⚠️ *No tasks completed this week.* Something might be off.' },
    });
  }

  blocks.push({ type: 'divider' });

  // Tempo hours
  if (tempoHours && tempoHours.total > 0) {
    const topPeople = Object.entries(tempoHours.byPerson)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, hrs]) => `${name.split(' ')[0]}: ${round(hrs)}h`)
      .join('  •  ');

    const topProjects = Object.entries(tempoHours.byProject)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([proj, hrs]) => `${resolveArea(proj)}: ${round(hrs)}h`)
      .join('  •  ');

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `⏱️ *Hours Logged This Week: ${round(tempoHours.total)}h*\n\n*By person:* ${topPeople}\n*By project:* ${topProjects}`,
      },
    });
    blocks.push({ type: 'divider' });
  }

  // What slipped / what's left
  const slippedLines: string[] = [];
  if (overdue.length > 0) slippedLines.push(`🔴 *${overdue.length} overdue* — oldest: ${overdue.length > 0 ? `<${JIRA_BROWSE}/${overdue[0].key}|${overdue[0].key}>` : ''}`);
  if (stale.length > 0) slippedLines.push(`🟡 *${stale.length} stale* — no updates in 3+ days`);
  if (slippedLines.length > 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `⚠️ *Carrying Into Next Week*\n${slippedLines.join('\n')}` },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '🎉 *Clean exit — nothing overdue or stale heading into next week!*' },
    });
  }

  // Footer stats
  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `📈 *Week Summary:* ${completedThisWeek.length} completed  •  ${tempoHours ? round(tempoHours.total) + 'h logged' : 'Tempo unavailable'}  •  ${overdue.length} overdue  •  ${stale.length} stale  •  ${active.length} active`,
      }],
    },
  );

  return blocks;
}

// ─── Tempo Weekly Hours ──────────────────────────────────────────────────────

async function fetchWeeklyTempoHours(): Promise<{ total: number; byPerson: Record<string, number>; byProject: Record<string, number> } | null> {
  try {
    const { from, to } = getWeekRange();
    const worklogs = await fetchTempoWorklogs(from, to);

    let total = 0;
    const byPerson: Record<string, number> = {};
    const byProject: Record<string, number> = {};

    for (const wl of worklogs) {
      const hours = (wl.timeSpentSeconds ?? 0) / 3600;
      total += hours;
      const name = wl.author?.displayName ?? 'Unknown';
      byPerson[name] = (byPerson[name] ?? 0) + hours;
      const projKey = wl.issue?.key?.split('-')[0] ?? '(unlinked)';
      byProject[projKey] = (byProject[projKey] ?? 0) + hours;
    }

    return { total, byPerson, byProject };
  } catch (err) {
    console.error('[Digest] Tempo fetch error:', err);
    return null;
  }
}

// ─── Send to Slack ───────────────────────────────────────────────────────────

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

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') ?? 'monday') as DigestType;
  const dryRun = searchParams.get('dry') === 'true';

  // Auth check (simple secret key)
  const authKey = searchParams.get('key');
  const expectedKey = process.env.DIGEST_SECRET_KEY ?? '';
  if (expectedKey && authKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[Digest] Building ${type} digest...`);

    // Fetch data
    const [issues, tempoWeek] = await Promise.all([
      fetchAllJiraIssues(),
      type === 'friday' ? fetchWeeklyTempoHours() : Promise.resolve(null),
    ]);

    console.log(`[Digest] Fetched ${issues.length} issues`);

    // Build blocks
    const blocks = type === 'monday'
      ? buildMondayDigest(issues, null)
      : buildFridayDigest(issues, tempoWeek);

    // Dry run = return blocks without sending
    if (dryRun) {
      return NextResponse.json({ type, blocks, issueCount: issues.length });
    }

    // Send to Slack
    const sent = await sendToSlack(blocks);

    return NextResponse.json({
      success: sent,
      type,
      issueCount: issues.length,
      message: sent ? `${type} digest sent to Slack` : 'Failed to send to Slack',
    });
  } catch (error) {
    console.error('[Digest] Error:', error);
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 });
  }
}

// POST also supported (for cron services that POST)
export async function POST(request: Request) {
  return GET(request);
}
