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

// ─── Shared Health Computation ───────────────────────────────────────────────

interface HealthResult {
  overdue: JiraIssue[];
  stale: JiraIssue[];
  inProgress: JiraIssue[];
  total: number;
}

function computeHealth(items: JiraIssue[], today: Date): HealthResult {
  const overdue = items.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    return due < today;
  });
  const stale = items.filter((i) => {
    if (categorize(i.fields.status.name) !== 'inProgress') return false;
    if (!i.fields.updated) return false;
    return daysBetween(today, new Date(i.fields.updated)) >= 3;
  });
  const inProgress = items.filter((i) => categorize(i.fields.status.name) === 'inProgress');
  return { overdue, stale, inProgress, total: items.length };
}

function healthVerdict(h: HealthResult): { emoji: string; label: string } {
  if (h.total === 0) return { emoji: '⚪', label: 'No active tasks' };
  if (h.overdue.length >= 3 || h.stale.length >= 3) return { emoji: '🔴', label: 'Action needed' };
  if (h.overdue.length > 0 || h.stale.length > 0) return { emoji: '🟡', label: 'Needs attention' };
  return { emoji: '🟢', label: 'On track' };
}

function worstOffender(h: HealthResult, today: Date): string {
  if (h.overdue.length > 0) {
    const worst = [...h.overdue].sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime())[0];
    const days = daysBetween(today, new Date(worst.fields.duedate!));
    const who = formatDisplayName(worst.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
    return `_Overdue ${days}d: <${JIRA_BROWSE}/${worst.key}|${worst.fields.summary.slice(0, 40)}> (${who})_`;
  }
  if (h.stale.length > 0) {
    const worst = [...h.stale].sort((a, b) => new Date(a.fields.updated!).getTime() - new Date(b.fields.updated!).getTime())[0];
    const days = daysBetween(today, new Date(worst.fields.updated!));
    const who = formatDisplayName(worst.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
    return `_Stale ${days}d: <${JIRA_BROWSE}/${worst.key}|${worst.fields.summary.slice(0, 40)}> (${who})_`;
  }
  return '';
}

// ─── Monday Digest Builder ───────────────────────────────────────────────────

function buildMondayDigest(
  issues: JiraIssue[],
  tempoData: { current: { total: number; byPerson: Record<string, number>; byProject: Record<string, number> }; previous: { total: number; byPerson: Record<string, number>; byProject: Record<string, number> } } | null,
): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (5 - (today.getDay() || 7)));
  const opsKeys = new Set<string>(OPS_PROJECTS);

  // ── Filter: skip epics, done, recurring, deactivated ──
  const allActive = issues.filter((i) => {
    const s = categorize(i.fields.status.name);
    if (s === 'done' || s === 'recurring') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    if (i.fields.assignee?.active === false) return false;
    return true;
  });

  // ── Filter dead delivery projects (90+ days dormant) ──
  const projectLastUpdate: Record<string, Date> = {};
  allActive.forEach((i) => {
    const key = i.fields.project.key;
    const updated = i.fields.updated ? new Date(i.fields.updated) : new Date(0);
    if (!projectLastUpdate[key] || updated > projectLastUpdate[key]) {
      projectLastUpdate[key] = updated;
    }
  });
  const deadProjects = new Set<string>();
  Object.entries(projectLastUpdate).forEach(([key, lastUpdate]) => {
    if (!opsKeys.has(key) && daysBetween(today, lastUpdate) > 90) deadProjects.add(key);
  });
  const active = allActive.filter((i) => !deadProjects.has(i.fields.project.key));

  // ── Split: ops vs delivery ──
  const opsIssues = active.filter((i) => opsKeys.has(i.fields.project.key));
  const deliveryIssues = active.filter((i) => !opsKeys.has(i.fields.project.key));

  // ── Map project keys to area for Tempo hours lookup ──
  const areaProjectKeys: Record<string, string[]> = {
    'Legal': OPS_PROJECTS.filter((k) => resolveArea(k) === 'Legal'),
    'Finance': OPS_PROJECTS.filter((k) => resolveArea(k) === 'Finance'),
    'GTM & Sales': OPS_PROJECTS.filter((k) => resolveArea(k) === 'GTM & Sales'),
    'Operations': OPS_PROJECTS.filter((k) => resolveArea(k) === 'Operations'),
  };

  // ── Ops per-area data ──
  const opsAreas = ['Legal', 'Finance', 'GTM & Sales', 'Operations'] as const;
  type OpsAreaRow = {
    overdue: number;
    worstOverdueDays: number;
    dueThisWeek: number;
    hoursLastWeek: number;
    stale: number;
    signal: string;
  };
  const opsRows: Record<string, OpsAreaRow> = {};

  for (const area of opsAreas) {
    const areaIssues = opsIssues.filter((i) => resolveArea(i.fields.project.key) === area);

    const overdueList = areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      return due < today;
    });

    const worstDays = overdueList.length > 0
      ? Math.max(...overdueList.map((i) => daysBetween(today, new Date(i.fields.duedate!))))
      : 0;

    const dueThisWeek = areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      return due >= today && due <= weekEnd;
    }).length;

    const staleCount = areaIssues.filter((i) => {
      if (categorize(i.fields.status.name) !== 'inProgress') return false;
      if (!i.fields.updated) return false;
      return daysBetween(today, new Date(i.fields.updated)) >= 3;
    }).length;

    // Tempo hours for this area
    let hoursLastWeek = 0;
    if (tempoData) {
      const projKeys = areaProjectKeys[area] ?? [];
      for (const pk of projKeys) {
        hoursLastWeek += tempoData.current.byProject[pk] ?? 0;
      }
    }

    // Signal
    let signal = '🟢';
    if (overdueList.length >= 3 || staleCount >= 3) signal = '🔴';
    else if (overdueList.length > 0 || staleCount > 0) signal = '🟡';

    opsRows[area] = { overdue: overdueList.length, worstOverdueDays: worstDays, dueThisWeek, hoursLastWeek, stale: staleCount, signal };
  }

  // ── Delivery per-project data ──
  const deliveryProjects = new Map<string, { name: string; issues: JiraIssue[] }>();
  deliveryIssues.forEach((i) => {
    const key = i.fields.project.key;
    if (!deliveryProjects.has(key)) {
      deliveryProjects.set(key, { name: i.fields.project.name ?? key, issues: [] });
    }
    deliveryProjects.get(key)!.issues.push(i);
  });

  type DeliveryRow = {
    name: string;
    key: string;
    active: number;
    overdue: number;
    stale: number;
    hoursLastWeek: number;
    signal: string;
  };

  const deliveryRows: DeliveryRow[] = [];
  deliveryProjects.forEach((val, key) => {
    const h = computeHealth(val.issues, today);
    const v = healthVerdict(h);
    const hours = tempoData ? (tempoData.current.byProject[key] ?? 0) : 0;
    deliveryRows.push({
      name: val.name,
      key,
      active: h.total,
      overdue: h.overdue.length,
      stale: h.stale.length,
      hoursLastWeek: hours,
      signal: v.emoji,
    });
  });
  // Sort: problems first, then by active count
  deliveryRows.sort((a, b) => (b.overdue + b.stale) - (a.overdue + a.stale) || b.active - a.active);

  // ── Timesheet Adoption ──
  let timesheetAdoption = '';
  if (tempoData) {
    // People who logged time last week
    const loggers = new Set(Object.keys(tempoData.current.byPerson));
    // All unique active assignees across all active issues
    const allAssignees = new Set<string>();
    active.forEach((i) => {
      if (i.fields.assignee && i.fields.assignee.active !== false && i.fields.assignee.displayName) {
        allAssignees.add(i.fields.assignee.displayName);
      }
    });
    const totalActive = allAssignees.size;
    const totalLogging = [...allAssignees].filter((name) => loggers.has(name)).length;
    const notLogging = [...allAssignees].filter((name) => !loggers.has(name)).map((n) => formatDisplayName(n).split(' ')[0]);
    const pct = totalActive > 0 ? Math.round((totalLogging / totalActive) * 100) : 0;

    if (notLogging.length > 0 && notLogging.length <= 8) {
      timesheetAdoption = `📊 Timesheet adoption: *${pct}%* (${totalLogging}/${totalActive}) — not logging: ${notLogging.join(', ')}`;
    } else if (notLogging.length > 8) {
      timesheetAdoption = `📊 Timesheet adoption: *${pct}%* (${totalLogging}/${totalActive}) — ${notLogging.length} people not logging`;
    } else {
      timesheetAdoption = `📊 Timesheet adoption: *${pct}%* — all active team members logging ✓`;
    }
  }

  // ── Stale summary ──
  const staleSummary: string[] = [];
  for (const area of opsAreas) {
    if (opsRows[area].stale > 0) staleSummary.push(`${area}: ${opsRows[area].stale}`);
  }
  // Delivery stale per project
  const deliveryStaleParts: string[] = [];
  for (const row of deliveryRows) {
    if (row.stale > 0) deliveryStaleParts.push(`${row.name}: ${row.stale}`);
  }

  const totalOpsStale = opsAreas.reduce((sum, a) => sum + opsRows[a].stale, 0);
  const totalDeliveryStale = deliveryRows.reduce((sum, r) => sum + r.stale, 0);

  // ── Overall Verdict ──
  const totalOverdue = opsAreas.reduce((sum, a) => sum + opsRows[a].overdue, 0) + deliveryRows.reduce((sum, r) => sum + r.overdue, 0);
  const totalStale = totalOpsStale + totalDeliveryStale;
  const criticalOverdue = [...opsIssues, ...deliveryIssues].filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    return due < today && daysBetween(today, due) >= 7;
  }).length;

  let overallEmoji: string;
  let overallVerdict: string;
  if (criticalOverdue >= 3 || totalStale >= 5) {
    overallEmoji = '🔴'; overallVerdict = 'Needs Intervention';
  } else if (totalOverdue >= 3 || totalStale >= 3) {
    overallEmoji = '🟡'; overallVerdict = 'Some Friction';
  } else if (totalOverdue > 0 || totalStale > 0) {
    overallEmoji = '🟡'; overallVerdict = 'Mostly Healthy';
  } else {
    overallEmoji = '🟢'; overallVerdict = 'Running Smooth';
  }

  // ════════════════════════════════════════
  // BUILD SLACK BLOCKS
  // ════════════════════════════════════════
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const blocks: object[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${overallEmoji} Weekly Pulse — ${overallVerdict}`, emoji: true },
    },
    {
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `Week of ${dateStr}` }],
    },
    { type: 'divider' },
  ];

  // ── SECTION 1: OPS SNAPSHOT ──
  blocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: '*📋 Ops Snapshot*' },
  });

  for (const area of opsAreas) {
    const r = opsRows[area];
    if (r.overdue === 0 && r.dueThisWeek === 0 && r.stale === 0 && r.hoursLastWeek === 0) continue;

    const parts: string[] = [];
    if (r.overdue > 0) parts.push(`*${r.overdue} overdue* (${r.worstOverdueDays}d)`);
    else parts.push('0 overdue');
    parts.push(`${r.dueThisWeek} due this week`);
    if (tempoData) parts.push(`${round(r.hoursLastWeek)}h logged`);

    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `${r.signal}  *${area}*\n      ${parts.join('  •  ')}` },
    });
  }

  blocks.push({ type: 'divider' });

  // ── SECTION 2: OPERATIONAL HEALTH ──
  blocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: '*🏥 Operational Health*' },
  });

  const healthLines: string[] = [];

  // Stale tasks
  if (totalOpsStale > 0 || totalDeliveryStale > 0) {
    if (totalOpsStale > 0) {
      healthLines.push(`⚠️ *${totalOpsStale} stale in Ops* (${staleSummary.join(', ')})`);
    }
    if (totalDeliveryStale > 0) {
      healthLines.push(`⚠️ *${totalDeliveryStale} stale in Delivery* (${deliveryStaleParts.join(', ')})`);
    }
  } else {
    healthLines.push('✅ No stale tasks — everything is moving');
  }

  // Timesheet adoption
  if (timesheetAdoption) healthLines.push(timesheetAdoption);

  blocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: healthLines.join('\n\n') },
  });

  blocks.push({ type: 'divider' });

  // ── SECTION 3: DELIVERY ──
  blocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: '*🚀 Delivery*' },
  });

  if (deliveryRows.length === 0) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: '_No active delivery projects_' }],
    });
  } else {
    // Show troubled projects with detail
    const troubled = deliveryRows.filter((r) => r.overdue > 0 || r.stale > 0);
    const healthy = deliveryRows.filter((r) => r.overdue === 0 && r.stale === 0 && r.active > 0);

    for (const proj of troubled) {
      const parts: string[] = [];
      parts.push(`${proj.active} active`);
      if (proj.overdue > 0) parts.push(`*${proj.overdue} overdue*`);
      if (proj.stale > 0) parts.push(`*${proj.stale} stale*`);
      if (tempoData) parts.push(`${round(proj.hoursLastWeek)}h`);

      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `${proj.signal}  *${proj.name}* — ${parts.join('  •  ')}` },
      });
    }

    if (healthy.length > 0) {
      const healthyLine = healthy.map((p) => {
        const hrs = tempoData ? `, ${round(p.hoursLastWeek)}h` : '';
        return `${p.name} (${p.active}${hrs})`;
      }).join('  •  ');
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `🟢 On track: ${healthyLine}` }],
      });
    }
  }

  // ── FOOTER ──
  blocks.push({ type: 'divider' });

  if (deadProjects.size > 0) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `_${deadProjects.size} inactive project${deadProjects.size > 1 ? 's' : ''} excluded (90+ days dormant)_` }],
    });
  }

  blocks.push({
    type: 'context',
    elements: [{
      type: 'mrkdwn',
      text: `<https://controltower-three.vercel.app|Open Control Tower> for full details`,
    }],
  });

  return blocks;
}

// ─── Friday Digest Builder ───────────────────────────────────────────────────

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

  const completedThisWeek = issues.filter((i) => {
    if (categorize(i.fields.status.name) !== 'done') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    const changed = i.fields.statuscategorychangedate ?? i.fields.updated;
    if (!changed) return false;
    return new Date(changed) >= weekStart;
  });

  const completedByPerson: Record<string, string[]> = {};
  completedThisWeek.forEach((i) => {
    if (i.fields.assignee?.active === false) return;
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

  const active = issues.filter((i) => { const s = categorize(i.fields.status.name); return s !== 'done' && s !== 'recurring'; });
  const overdue = active.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    return due < today;
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
        const total = completedThisWeek.filter((i) => formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned') === name).length;
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

  if (tempoHours && tempoHours.total > 0) {
    const topPeople = Object.entries(tempoHours.byPerson)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, hrs]) => `${formatDisplayName(name).split(' ')[0]}: ${round(hrs)}h`)
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

  const slippedLines: string[] = [];
  if (overdue.length > 0) slippedLines.push(`🔴 *${overdue.length} overdue* — oldest: <${JIRA_BROWSE}/${overdue[0].key}|${overdue[0].key}>`);
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

function getWeekRangeOffset(weeksBack: number): { from: string; to: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) - (weeksBack * 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toISOString().split('T')[0],
    to: sunday.toISOString().split('T')[0],
  };
}

async function fetchTempoWeekData(weeksBack: number): Promise<{ total: number; byPerson: Record<string, number>; byProject: Record<string, number> }> {
  const { from, to } = getWeekRangeOffset(weeksBack);
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
}

async function fetchWeeklyTempoHours(): Promise<{ total: number; byPerson: Record<string, number>; byProject: Record<string, number> } | null> {
  try {
    return await fetchTempoWeekData(0);
  } catch (err) {
    console.error('[Digest] Tempo fetch error:', err);
    return null;
  }
}

async function fetchWeekOverWeekTempo(): Promise<{ current: { total: number; byPerson: Record<string, number>; byProject: Record<string, number> }; previous: { total: number; byPerson: Record<string, number>; byProject: Record<string, number> } } | null> {
  try {
    const [current, previous] = await Promise.all([
      fetchTempoWeekData(1),
      fetchTempoWeekData(2),
    ]);
    return { current, previous };
  } catch (err) {
    console.error('[Digest] Tempo WoW fetch error:', err);
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

  const authKey = searchParams.get('key');
  const expectedKey = process.env.DIGEST_SECRET_KEY ?? '';
  if (expectedKey && authKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[Digest] Building ${type} digest...`);

    const [issues, tempoWeek, tempoWoW] = await Promise.all([
      fetchAllJiraIssues(),
      type === 'friday' ? fetchWeeklyTempoHours() : Promise.resolve(null),
      type === 'monday' ? fetchWeekOverWeekTempo() : Promise.resolve(null),
    ]);

    console.log(`[Digest] Fetched ${issues.length} issues`);

    const blocks = type === 'monday'
      ? buildMondayDigest(issues, tempoWoW)
      : buildFridayDigest(issues, tempoWeek);

    if (dryRun) {
      return NextResponse.json({ type, blocks, issueCount: issues.length });
    }

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

export async function POST(request: Request) {
  return GET(request);
}
