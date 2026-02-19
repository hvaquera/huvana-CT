'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Loader2, TrendingUp, Clock, Users, BarChart3,
  AlertCircle, CheckCircle2, Zap, Grid3X3, ChevronDown, ChevronUp,
  Eye, Send, AlertOctagon, CalendarOff,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { categorizeStatus, AREA_MAP, JIRA_BROWSE_URL, formatDisplayName } from '@/lib/constants';
import LoadingProgress from './LoadingProgress';
import type { JiraIssue, ActualsResponse } from '@/types';

type ReportSection = 'delivery' | 'time' | 'insights' | 'monitor';
type TimePeriod = 'week' | 'month' | 'last-month' | 'all';

const COLORS = ['#4F46E5', '#059669', '#D97706', '#DC2626', '#8B5CF6', '#06B6D4', '#EC4899', '#64748B'];
const GREEN = '#059669';
const AMBER = '#D97706';
const RED = '#DC2626';
const INDIGO = '#4F46E5';
const SLATE = '#64748B';

function getDateRange(period: TimePeriod): { from: Date; to: Date } {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const to = new Date(now);
  switch (period) {
    case 'week': { const from = new Date(now); const day = from.getDay(); from.setDate(from.getDate() - (day === 0 ? 6 : day - 1)); return { from, to }; }
    case 'month': return { from: new Date(now.getFullYear(), now.getMonth(), 1), to };
    case 'last-month': return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
    default: return { from: new Date(2020, 0, 1), to };
  }
}

function resolveAreaName(projectKey: string): string {
  return (AREA_MAP as Record<string, string>)[projectKey] ?? projectKey;
}

function ReportCard({ title, subtitle, children, icon: Icon, action }: { title: string; subtitle?: string; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatPill({ label, value, color = 'text-slate-800', sub }: { label: string; value: string | number; color?: string; sub?: string; }) {
  return (
    <div className="text-center px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
      <div className={`text-xl font-bold leading-none mb-1 ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function PeriodSelector({ value, onChange }: { value: TimePeriod; onChange: (v: TimePeriod) => void }) {
  const opts: Array<{ key: TimePeriod; label: string }> = [
    { key: 'week', label: 'This Week' }, { key: 'month', label: 'This Month' },
    { key: 'last-month', label: 'Last Month' }, { key: 'all', label: 'All Time' },
  ];
  return (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
      {opts.map(({ key, label }) => (
        <button key={key} onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${value === key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >{label}</button>
      ))}
    </div>
  );
}

interface ReportsTabProps { jiraIssues: JiraIssue[]; deliveryIssues: JiraIssue[]; }

/**
 * Reports Tab — four-section analytics dashboard.
 *
 * Sections:
 *  1. Delivery Performance — task completion by person/area, epic progress
 *  2. Time Intelligence — Tempo hours distribution, utilization, peak load days
 *  3. Operational Insights — cross-reference Jira + Tempo, person performance, area scorecard
 *  4. Monitor — health metrics (missing timesheets, ghost tasks, overtime, weekend work)
 *
 * Data sources:
 *  - jiraIssues: ops tasks from /api/jira
 *  - deliveryIssues: client delivery tasks from /api/jira/delivery-all
 *  - tempoData: time tracking from /api/tempo/actuals (fetched on-demand)
 *
 * Deactivated Jira users (active=false) are filtered from all person-level metrics.
 * Display names in "firstname.lastname" format are auto-capitalized via formatDisplayName().
 */
export default function ReportsTab({ jiraIssues, deliveryIssues }: ReportsTabProps) {
  const [tempoData, setTempoData] = useState<ActualsResponse | null>(null);
  const [prevTempoData, setPrevTempoData] = useState<ActualsResponse | null>(null);
  const [tempoLoading, setTempoLoading] = useState(true);
  const [tempoFetched, setTempoFetched] = useState(false);
  const [activeSection, setActiveSection] = useState<ReportSection>('delivery');
  const [deliveryPeriod, setDeliveryPeriod] = useState<TimePeriod>('month');
  const [expandedDeliveryArea, setExpandedDeliveryArea] = useState<string | null>(null);
  const [hoursPerPersonOpen, setHoursPerPersonOpen] = useState(true);
  const [personPerfOpen, setPersonPerfOpen] = useState(true);
  const [copiedNudge, setCopiedNudge] = useState<string | null>(null);
  const [expandedStale, setExpandedStale] = useState<string | null>(null);

  const fetchTempo = useCallback(async () => {
    if (tempoFetched) return;
    setTempoLoading(true);
    try {
      const now = new Date();
      const cy = now.getFullYear(), cm = now.getMonth() + 1;
      const pm = cm === 1 ? 12 : cm - 1, py = cm === 1 ? cy - 1 : cy;
      const [r1, r2] = await Promise.all([
        fetch(`/api/tempo/actuals?year=${cy}&month=${cm}`),
        fetch(`/api/tempo/actuals?year=${py}&month=${pm}`),
      ]);
      if (r1.ok) setTempoData(await r1.json());
      if (r2.ok) setPrevTempoData(await r2.json());
      setTempoFetched(true);
    } catch (err) { console.error('[Reports] Tempo error:', err); }
    finally { setTempoLoading(false); }
  }, [tempoFetched]);

  // Prefetch Tempo data immediately in background — don't wait for tab switch
  useEffect(() => { fetchTempo(); }, [fetchTempo]);

  const allIssues = useMemo(() => {
    const keys = new Set(jiraIssues.map((i) => i.key));
    const combined = [...jiraIssues];
    deliveryIssues.forEach((i) => { if (!keys.has(i.key)) combined.push(i); });
    return combined;
  }, [jiraIssues, deliveryIssues]);

  const filterByPeriod = useCallback((issues: JiraIssue[], period: TimePeriod, statusFilter?: 'done') => {
    const { from, to } = getDateRange(period);
    return issues.filter((i) => {
      if (statusFilter && categorizeStatus(i.fields.status.name) !== statusFilter) return false;
      if (period === 'all') return statusFilter ? categorizeStatus(i.fields.status.name) === statusFilter : true;
      const ref = i.fields.statuscategorychangedate ? new Date(i.fields.statuscategorychangedate) : i.fields.updated ? new Date(i.fields.updated) : null;
      if (!ref) return false;
      return ref >= from && ref <= to;
    });
  }, []);

  // ── Jira Metrics ───────────────────────────────────────────
  const jiraMetrics = useMemo(() => {
    const issues = allIssues;
    const active = issues.filter((i) => { const s = categorizeStatus(i.fields.status.name); return s !== 'done' && s !== 'recurring'; });
    const recurring = issues.filter((i) => categorizeStatus(i.fields.status.name) === 'recurring');
    const doneInPeriod = filterByPeriod(issues, deliveryPeriod, 'done');
    const inProgress = issues.filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress');
    const withDue = active.filter((i) => i.fields.duedate);
    const overdue = withDue.filter((i) => { const d = new Date(i.fields.duedate!); d.setHours(0,0,0,0); return d < new Date(new Date().setHours(0,0,0,0)); });

    // Stale detection: exclude epics from ops areas entirely, give delivery epics 14-day grace
    const opsProjectKeys = new Set(Object.keys(AREA_MAP));
    const stale = inProgress.filter((i) => {
      if (!i.fields.updated) return false;
      const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
      const isOpsProject = opsProjectKeys.has(i.fields.project.key);
      const daysSilent = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);

      if (isEpic && isOpsProject) return false; // Ops epics: never stale
      if (isEpic) return daysSilent >= 14; // Delivery epics: 14-day threshold
      return daysSilent >= 3; // Regular tasks: 3-day threshold
    });

    // Recurring breakdown by area and person
    const recurringByArea: Record<string, number> = {};
    const recurringByPerson: Record<string, string[]> = {};
    recurring.forEach((i) => {
      const area = resolveAreaName(i.fields.project.key);
      recurringByArea[area] = (recurringByArea[area] ?? 0) + 1;
      const name = formatDisplayName(i.fields.assignee?.displayName ?? '');
      if (name) {
        if (!recurringByPerson[name]) recurringByPerson[name] = [];
        if (recurringByPerson[name].length < 5) recurringByPerson[name].push(i.fields.summary.slice(0, 50));
      }
    });

    const personCompleted: Record<string, number> = {};
    doneInPeriod.forEach((i) => { const n = formatDisplayName(i.fields.assignee?.displayName ?? ''); if (n && i.fields.assignee?.active !== false) personCompleted[n] = (personCompleted[n] ?? 0) + 1; });
    const personStale: Record<string, Array<{ key: string; summary: string; project: string; daysSilent: number }>> = {};
    stale.forEach((i) => {
      const n = formatDisplayName(i.fields.assignee?.displayName ?? '') || 'Unassigned';
      if (i.fields.assignee?.active === false) return;
      if (!personStale[n]) personStale[n] = [];
      const daysSilent = Math.floor((Date.now() - new Date(i.fields.updated!).getTime()) / 86400000);
      personStale[n].push({ key: i.key, summary: i.fields.summary.slice(0, 60), project: i.fields.project.name || i.fields.project.key, daysSilent });
    });
    const personOverdue: Record<string, number> = {};
    overdue.forEach((i) => { const n = formatDisplayName(i.fields.assignee?.displayName ?? ''); if (n && i.fields.assignee?.active !== false) personOverdue[n] = (personOverdue[n] ?? 0) + 1; });

    const opsKeys = new Set(Object.keys(AREA_MAP));
    const areaTasks: Record<string, { total: number; done: number; inProgress: number; overdue: number; isDelivery: boolean; projects?: Record<string, { total: number; done: number; overdue: number }> }> = {};
    issues.forEach((i) => {
      const k = i.fields.project.key, s = categorizeStatus(i.fields.status.name);
      if (opsKeys.has(k)) {
        const a = resolveAreaName(k);
        if (!areaTasks[a]) areaTasks[a] = { total: 0, done: 0, inProgress: 0, overdue: 0, isDelivery: false };
        areaTasks[a].total++; if (s === 'done') areaTasks[a].done++; if (s === 'inProgress') areaTasks[a].inProgress++;
      } else {
        if (!areaTasks['Delivery']) areaTasks['Delivery'] = { total: 0, done: 0, inProgress: 0, overdue: 0, isDelivery: true, projects: {} };
        areaTasks['Delivery'].total++; if (s === 'done') areaTasks['Delivery'].done++; if (s === 'inProgress') areaTasks['Delivery'].inProgress++;
        const pn = i.fields.project.name || k;
        if (!areaTasks['Delivery'].projects![pn]) areaTasks['Delivery'].projects![pn] = { total: 0, done: 0, overdue: 0 };
        areaTasks['Delivery'].projects![pn].total++; if (s === 'done') areaTasks['Delivery'].projects![pn].done++;
      }
    });
    overdue.forEach((i) => {
      const k = i.fields.project.key;
      if (opsKeys.has(k)) { const a = resolveAreaName(k); if (areaTasks[a]) areaTasks[a].overdue++; }
      else { if (areaTasks['Delivery']) { areaTasks['Delivery'].overdue++; const pn = i.fields.project.name || k; if (areaTasks['Delivery'].projects?.[pn]) areaTasks['Delivery'].projects[pn].overdue++; } }
    });

    const epicMap: Record<string, { name: string; total: number; done: number; area: string }> = {};
    issues.forEach((i) => {
      if (i.fields.parent) {
        const k = i.fields.parent.key;
        if (!epicMap[k]) epicMap[k] = { name: i.fields.parent.fields.summary, total: 0, done: 0, area: resolveAreaName(i.fields.project.key) };
        epicMap[k].total++; if (categorizeStatus(i.fields.status.name) === 'done') epicMap[k].done++;
      }
    });

    return { total: issues.length, active: active.length, doneInPeriod: doneInPeriod.length, overdue: overdue.length, stale: stale.length, recurringCount: recurring.length, recurringByArea, recurringByPerson, personCompleted, personStale, personOverdue, areaTasks, epicMap };
  }, [allIssues, deliveryPeriod, filterByPeriod]);

  // ── Tempo Metrics ──────────────────────────────────────────
  const tempoMetrics = useMemo(() => {
    if (!tempoData) return null;
    const prevTotal = prevTempoData?.totalHours ?? 0;
    const hoursDelta = prevTotal > 0 ? Math.round(((tempoData.totalHours - prevTotal) / prevTotal) * 100) : 0;
    const dayOfWeekHours: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    tempoData.people.forEach((p) => p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
      // Parse date as local to avoid timezone shift (Tempo dates are YYYY-MM-DD)
      const parts = e.date.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      dayOfWeekHours[dayNames[d.getDay()]] += e.hours;
    }))));
    const personUtilization: Record<string, { current: number; previous: number; delta: number }> = {};
    tempoData.people.forEach((p) => { personUtilization[p.name] = { current: p.totalHours, previous: 0, delta: 0 }; });
    if (prevTempoData) prevTempoData.people.forEach((p) => { if (personUtilization[p.name]) personUtilization[p.name].previous = p.totalHours; else personUtilization[p.name] = { current: 0, previous: p.totalHours, delta: 0 }; });
    Object.values(personUtilization).forEach((v) => { v.delta = v.previous > 0 ? Math.round(((v.current - v.previous) / v.previous) * 100) : 0; });
    const cleanProjects = tempoData.projects.filter((p) => p.projectKey !== '(unlinked)' && p.projectName !== '(No Jira Issue)');
    const noJiraHours = tempoData.projects.filter((p) => p.projectKey === '(unlinked)' || p.projectName === '(No Jira Issue)').reduce((s, p) => s + p.hours, 0);
    const cleanPeople = tempoData.people.map((p) => ({ ...p, projects: p.projects.filter((pr) => pr.projectKey !== '(unlinked)' && pr.projectName !== '(No Jira Issue)') }));
    return { totalHours: tempoData.totalHours, totalPeople: tempoData.totalPeople, totalProjects: cleanProjects.length, prevTotal, hoursDelta, dayOfWeekHours, personUtilization, people: cleanPeople, projects: cleanProjects, noJiraHours: Math.round(noJiraHours * 10) / 10 };
  }, [tempoData, prevTempoData]);

  // ── Cross Metrics ──────────────────────────────────────────
  const crossMetrics = useMemo(() => {
    if (!jiraMetrics || !tempoMetrics) return null;
    const opsKeys = new Set(Object.keys(AREA_MAP));

    // Build a set of "active" delivery project keys — projects with Tempo hours this month
    const activeDeliveryKeys = new Set<string>();
    tempoMetrics.projects.forEach((p) => {
      if (!opsKeys.has(p.projectKey) && p.hours > 0) activeDeliveryKeys.add(p.projectKey);
    });

    // Area Health: only include delivery sub-projects that have hours this month
    const areaHealth: Array<{ area: string; hours: number; total: number; done: number; inProgress: number; overdue: number; throughputRate: number; isDelivery: boolean; subProjects?: Array<{ name: string; hours: number; total: number; done: number; overdue: number }> }> = [];
    Object.entries(jiraMetrics.areaTasks).forEach(([area, data]) => {
      let hours = 0;
      if (area === 'Delivery') {
        tempoMetrics.projects.forEach((p) => { if (!opsKeys.has(p.projectKey) && p.hours > 0) hours += p.hours; });
      } else {
        const mk = Object.entries(AREA_MAP).filter(([, n]) => n === area).map(([k]) => k);
        tempoMetrics.projects.forEach((p) => { if (mk.includes(p.projectKey)) hours += p.hours; });
      }

      // Filter sub-projects: only show those with hours this month
      const subProjects = data.isDelivery && data.projects ? Object.entries(data.projects)
        .map(([n, pd]) => {
          const tempoProj = tempoMetrics.projects.find((tp) => tp.projectName === n || tp.projectKey === n);
          return { name: n, hours: Math.round(tempoProj?.hours ?? 0), total: pd.total, done: pd.done, overdue: pd.overdue };
        })
        .filter((sp) => sp.hours > 0) // Only active projects with hours this month
        .sort((a, b) => b.hours - a.hours) : undefined;

      // For delivery, recalculate totals based only on active sub-projects
      if (area === 'Delivery' && subProjects) {
        const activeTotals = subProjects.reduce((acc, sp) => ({ total: acc.total + sp.total, done: acc.done + sp.done, overdue: acc.overdue + sp.overdue }), { total: 0, done: 0, overdue: 0 });
        areaHealth.push({ area, hours, total: activeTotals.total, done: activeTotals.done, inProgress: data.inProgress, overdue: activeTotals.overdue, throughputRate: activeTotals.total > 0 ? Math.round((activeTotals.done / activeTotals.total) * 100) : 0, isDelivery: true, subProjects });
      } else {
        areaHealth.push({ area, hours, total: data.total, done: data.done, inProgress: data.inProgress, overdue: data.overdue, throughputRate: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0, isDelivery: data.isDelivery, subProjects });
      }
    });

    // Person Performance: merge Tempo people + Jira-only people (no cap)
    const personPerformance: Array<{ name: string; hours: number; completed: number; overdue: number; stale: number; areas: string[]; hoursPerTask: number | null }> = [];
    const seenPeople = new Set<string>();

    // First: people with Tempo hours
    tempoMetrics.people.forEach((p) => {
      seenPeople.add(p.name);
      const completed = jiraMetrics.personCompleted[p.name] ?? 0;
      const areas = [...new Set(p.projects.map((pr) => resolveAreaName(pr.projectKey)))];
      personPerformance.push({ name: p.name, hours: p.totalHours, completed, overdue: jiraMetrics.personOverdue[p.name] ?? 0, stale: (jiraMetrics.personStale[p.name] ?? []).length, areas, hoursPerTask: completed > 0 ? Math.round((p.totalHours / completed) * 10) / 10 : null });
    });

    // Second: people with Jira activity but no Tempo hours this month
    const allJiraPeople = new Set([...Object.keys(jiraMetrics.personCompleted), ...Object.keys(jiraMetrics.personOverdue), ...Object.keys(jiraMetrics.personStale)]);
    allJiraPeople.forEach((name) => {
      if (seenPeople.has(name) || !name) return;
      seenPeople.add(name);
      const completed = jiraMetrics.personCompleted[name] ?? 0;
      personPerformance.push({ name, hours: 0, completed, overdue: jiraMetrics.personOverdue[name] ?? 0, stale: (jiraMetrics.personStale[name] ?? []).length, areas: [], hoursPerTask: null });
    });

    personPerformance.sort((a, b) => b.hours - a.hours);

    return { areaHealth, personPerformance, activeDeliveryKeys };
  }, [jiraMetrics, tempoMetrics]);

  // ── Monitor Metrics ─────────────────────────────────────────
  const monitorMetrics = useMemo(() => {
    if (!tempoData) return null;

    // Safe date parse: "YYYY-MM-DD" → local Date (avoids UTC timezone shift)
    const parseLocalDate = (s: string) => { const p = s.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); };

    // 1. Missing Timesheets: people with 0 hours last week
    const now = new Date();
    const lastMonday = new Date(now);
    const day = lastMonday.getDay();
    lastMonday.setDate(lastMonday.getDate() - (day === 0 ? 6 : day - 1) - 7);
    lastMonday.setHours(0, 0, 0, 0);
    const lastFriday = new Date(lastMonday);
    lastFriday.setDate(lastMonday.getDate() + 4);
    lastFriday.setHours(23, 59, 59, 999);

    const lastWeekHours: Record<string, number> = {};
    const allPeopleSet = new Set<string>();
    tempoData.people.forEach((p) => {
      allPeopleSet.add(p.name);
      let weekHrs = 0;
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
        const d = parseLocalDate(e.date);
        if (d >= lastMonday && d <= lastFriday) weekHrs += e.hours;
      })));
      lastWeekHours[p.name] = weekHrs;
    });
    const missingTimesheets = [...allPeopleSet].filter((n) => (lastWeekHours[n] ?? 0) === 0).sort();
    const lowTimesheets = [...allPeopleSet].filter((n) => (lastWeekHours[n] ?? 0) > 0 && (lastWeekHours[n] ?? 0) < 20).map((n) => ({ name: n, hours: Math.round((lastWeekHours[n] ?? 0) * 10) / 10 })).sort((a, b) => a.hours - b.hours);

    // 2. Unlinked Time: hours without Jira ticket
    const unlinkedByPerson: Array<{ name: string; hours: number; entries: Array<{ date: string; hours: number; comment: string }> }> = [];
    tempoData.people.forEach((p) => {
      const unlinked: Array<{ date: string; hours: number; comment: string }> = [];
      p.projects.forEach((pr) => {
        if (pr.projectKey === '(unlinked)' || pr.projectName === '(No Jira Issue)') {
          pr.tasks.forEach((t) => t.entries.forEach((e) => unlinked.push({ date: e.date, hours: e.hours, comment: e.comment || t.summary })));
        }
      });
      if (unlinked.length > 0) {
        unlinkedByPerson.push({ name: p.name, hours: Math.round(unlinked.reduce((s, e) => s + e.hours, 0) * 10) / 10, entries: unlinked.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10) });
      }
    });
    unlinkedByPerson.sort((a, b) => b.hours - a.hours);

    // 3. Overtime Watch: days with 9+ hours
    const overtimeDays: Array<{ name: string; date: string; hours: number }> = [];
    tempoData.people.forEach((p) => {
      const dayMap: Record<string, number> = {};
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => { dayMap[e.date] = (dayMap[e.date] ?? 0) + e.hours; })));
      Object.entries(dayMap).forEach(([date, hrs]) => { if (hrs >= 9) overtimeDays.push({ name: p.name, date, hours: Math.round(hrs * 10) / 10 }); });
    });
    overtimeDays.sort((a, b) => b.hours - a.hours);

    // 4. Ghost Tasks: In Progress in Jira with 0 Tempo hours this month
    const tempoIssueKeys = new Set<string>();
    tempoData.people.forEach((p) => p.projects.forEach((pr) => pr.tasks.forEach((t) => { if (t.issueKey) tempoIssueKeys.add(t.issueKey); })));
    const allIssuesCombined = [...(jiraIssues || []), ...(deliveryIssues || [])];
    const ghostTasks = allIssuesCombined.filter((i) => {
      if (categorizeStatus(i.fields.status.name) !== 'inProgress') return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
      if (i.fields.assignee?.active === false) return false;
      const daysSinceUpdate = i.fields.updated ? Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000) : 999;
      return daysSinceUpdate >= 7 && !tempoIssueKeys.has(i.key);
    }).map((i) => ({
      key: i.key, summary: i.fields.summary, assignee: formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned'),
      daysSilent: i.fields.updated ? Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000) : 999,
      project: i.fields.project.name,
    })).sort((a, b) => b.daysSilent - a.daysSilent);

    // 5. Weekend Warriors: hours on Sat/Sun (safe local parsing)
    const weekendEntries: Array<{ name: string; date: string; hours: number }> = [];
    tempoData.people.forEach((p) => {
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
        const d = parseLocalDate(e.date).getDay();
        if (d === 0 || d === 6) weekendEntries.push({ name: p.name, date: e.date, hours: e.hours });
      })));
    });
    // Aggregate by person
    const weekendByPerson: Record<string, { hours: number; days: Set<string> }> = {};
    weekendEntries.forEach((e) => {
      if (!weekendByPerson[e.name]) weekendByPerson[e.name] = { hours: 0, days: new Set() };
      weekendByPerson[e.name].hours += e.hours;
      weekendByPerson[e.name].days.add(e.date);
    });
    const weekendWarriors = Object.entries(weekendByPerson).map(([name, d]) => ({ name, hours: Math.round(d.hours * 10) / 10, days: d.days.size })).sort((a, b) => b.hours - a.hours);

    // 6. Zero-Hour People: assigned Jira tasks but 0 Tempo hours this month
    const tempoPeople = new Set(tempoData.people.map((p) => p.name));
    const jiraAssignees = new Set<string>();
    allIssuesCombined.forEach((i) => {
      if (i.fields.assignee?.displayName && i.fields.assignee?.active !== false && categorizeStatus(i.fields.status.name) !== 'done') {
        jiraAssignees.add(formatDisplayName(i.fields.assignee.displayName));
      }
    });
    const zeroPeople = [...jiraAssignees].filter((n) => !tempoPeople.has(n)).sort();

    const weekLabel = `${lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${lastFriday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return { missingTimesheets, lowTimesheets, unlinkedByPerson, overtimeDays, ghostTasks, weekendWarriors, zeroPeople, weekLabel };
  }, [tempoData, jiraIssues, deliveryIssues]);

  const sections: Array<{ key: ReportSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'delivery', label: 'Delivery Performance', icon: CheckCircle2 },
    { key: 'time', label: 'Time Intelligence', icon: Clock },
    { key: 'insights', label: 'Operational Insights', icon: Zap },
    { key: 'monitor', label: 'Monitor', icon: Eye },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 -mx-1 px-1 overflow-x-auto">
        {sections.map(({ key, label, icon: SIcon }) => (
          <button key={key} onClick={() => setActiveSection(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeSection === key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}
          ><SIcon className="w-3.5 h-3.5" />{label}</button>
        ))}
      </div>

      {/* ═══ DELIVERY PERFORMANCE ═══ */}
      {activeSection === 'delivery' && jiraMetrics && (
        <div className="space-y-4">
          <ReportCard title="Tasks Completed per Person" icon={Users} subtitle={`${jiraMetrics.doneInPeriod} tasks completed`}>
            <div className="mb-3"><PeriodSelector value={deliveryPeriod} onChange={setDeliveryPeriod} /></div>
            {Object.keys(jiraMetrics.personCompleted).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No tasks completed in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(180, Object.keys(jiraMetrics.personCompleted).length * 30)}>
                <BarChart data={Object.entries(jiraMetrics.personCompleted).filter(([n]) => n !== 'Unassigned').map(([n, d]) => ({ name: n.split(' ')[0], done: d, overdue: jiraMetrics.personOverdue[n] ?? 0, stale: (jiraMetrics.personStale[n] ?? []).length })).sort((a, b) => b.done - a.done)} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="done" fill={GREEN} name="Done" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="overdue" fill={RED} name="Overdue" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="stale" fill={AMBER} name="Stale" radius={[0, 4, 4, 0]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ReportCard>

          <ReportCard title="Area Breakdown" subtitle="All areas including active delivery projects — click Delivery to expand" icon={BarChart3}>
            <div className="space-y-3">
              {Object.entries(jiraMetrics.areaTasks).sort(([, a], [, b]) => b.total - a.total).map(([area, data]) => {
                const dp = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
                const op = data.total > 0 ? Math.round((data.overdue / data.total) * 100) : 0;
                const isExp = expandedDeliveryArea === area;
                return (
                  <div key={area}>
                    <div className={`flex items-center justify-between mb-1 ${data.isDelivery ? 'cursor-pointer group' : ''}`} onClick={() => data.isDelivery && setExpandedDeliveryArea(isExp ? null : area)}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-700">{area}</span>
                        {data.isDelivery && <span className="text-slate-400">{isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-emerald-600 font-semibold">{data.done} done</span>
                        <span className="text-blue-600">{data.inProgress} active</span>
                        {data.overdue > 0 && <span className="text-red-600 font-semibold">{data.overdue} overdue</span>}
                        <span className="text-slate-400">{data.total} total</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-400" style={{ width: `${dp}%` }} /><div className="h-full bg-red-400" style={{ width: `${op}%` }} />
                    </div>
                    {data.isDelivery && isExp && data.projects && (
                      <div className="mt-2 ml-4 space-y-1.5 border-l-2 border-slate-100 pl-3">
                        {Object.entries(data.projects).sort(([, a], [, b]) => b.total - a.total).map(([pn, pd]) => {
                          const pDone = pd.total > 0 ? Math.round((pd.done / pd.total) * 100) : 0;
                          return (<div key={pn}><div className="flex items-center justify-between mb-0.5"><span className="text-xs text-slate-600">{pn}</span><div className="flex items-center gap-2 text-[10px]"><span className="text-emerald-500">{pd.done}/{pd.total}</span>{pd.overdue > 0 && <span className="text-red-500">{pd.overdue} late</span>}</div></div><div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-emerald-300 rounded-full" style={{ width: `${pDone}%` }} /></div></div>);
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ReportCard>

          <ReportCard title="Epic Progress" subtitle="Completion rate per epic across all areas" icon={TrendingUp}>
            <div className="space-y-2.5">
              {Object.entries(jiraMetrics.epicMap).filter(([, e]) => e.total > 1).sort(([, a], [, b]) => (b.done / b.total) - (a.done / a.total)).slice(0, 15).map(([key, epic]) => {
                const pct = Math.round((epic.done / epic.total) * 100);
                return (<div key={key}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{epic.area}</span><span className="text-xs font-medium text-slate-700 truncate max-w-[250px]">{epic.name}</span></div><span className="text-[11px] font-bold text-slate-500">{epic.done}/{epic.total}</span></div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-400' : pct >= 50 ? 'bg-blue-400' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} /></div></div>);
              })}
            </div>
          </ReportCard>

          {jiraMetrics.stale > 0 && (
            <ReportCard title="Stale Task Frequency" subtitle="Who has tasks with no updates in 3+ days (excludes recurring) — click to expand" icon={AlertCircle}>
              <div className="space-y-0">
                {Object.entries(jiraMetrics.personStale).filter(([, tasks]) => tasks.length > 0).sort(([, a], [, b]) => b.length - a.length).map(([name, tasks]) => {
                  const isExpanded = expandedStale === name;
                  return (
                    <div key={name}>
                      <button onClick={() => setExpandedStale(isExpanded ? null : name)} className="flex items-center justify-between w-full py-2 px-1 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded transition-colors text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">{isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</span>
                          <span className="text-sm text-slate-700">{name}</span>
                        </div>
                        <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">{tasks.length} stale</span>
                      </button>
                      {isExpanded && (
                        <div className="ml-5 mb-2 space-y-1">
                          {tasks.sort((a, b) => b.daysSilent - a.daysSilent).map((t) => (
                            <div key={t.key} className="flex items-center justify-between py-1 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <a href={`${JIRA_BROWSE_URL}/${t.key}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-mono font-semibold shrink-0">{t.key}</a>
                                <span className="text-slate-500 truncate">{t.summary}</span>
                              </div>
                              <span className="text-amber-500 font-medium shrink-0 ml-2">{t.daysSilent}d</span>
                            </div>
                          ))}
                          <div className="text-[10px] text-slate-400 pt-0.5">Project: {tasks[0]?.project}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ReportCard>
          )}

        </div>
      )}

      {/* ═══ TIME INTELLIGENCE ═══ */}
      {activeSection === 'time' && (tempoLoading ? (
        <LoadingProgress
          steps={['Fetching timesheets from Tempo...', 'Resolving Jira projects...', 'Computing time distribution...']}
          intervalMs={2000}
        />
      ) : tempoMetrics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatPill label="Total Hours" value={Math.round(tempoMetrics.totalHours)} color="text-indigo-600" sub={tempoMetrics.hoursDelta !== 0 ? `${tempoMetrics.hoursDelta > 0 ? '+' : ''}${tempoMetrics.hoursDelta}% vs last month` : undefined} />
            <StatPill label="People" value={tempoMetrics.totalPeople} />
            <StatPill label="Projects" value={tempoMetrics.totalProjects} />
            <StatPill label="Avg / Person" value={tempoMetrics.totalPeople > 0 ? Math.round(tempoMetrics.totalHours / tempoMetrics.totalPeople) : 0} sub="hours this month" />
          </div>
          {tempoMetrics.noJiraHours > 0 && (
            <div className="rounded-lg bg-amber-50/70 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              <span className="font-semibold">{tempoMetrics.noJiraHours}h</span> logged without a linked Jira ticket.{' '}
              <button onClick={() => setActiveSection('monitor')} className="text-indigo-600 hover:text-indigo-800 font-semibold underline">See details in Monitor →</button>
            </div>
          )}

          {/* Time Distribution + Peak Load Days — side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportCard title="Time Distribution" icon={Grid3X3}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart><Pie data={tempoMetrics.projects.slice(0, 8).map((p) => ({ name: resolveAreaName(p.projectKey), value: Math.round(p.hours) }))} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={(props: PieLabelRenderProps) => `${props.name ?? ''}: ${Math.round((Number(props.percent) || 0) * 100)}%`}>{tempoMetrics.projects.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ fontSize: 12 }} /></PieChart>
              </ResponsiveContainer>
            </ReportCard>
            <ReportCard title="Peak Load Days" icon={Clock}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({ day: d, hours: Math.round(tempoMetrics.dayOfWeekHours[d] ?? 0) }))} margin={{ left: 0, right: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="hours" fill={INDIGO} radius={[4, 4, 0, 0]}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <Cell key={i} fill={d === 'Sat' || d === 'Sun' ? SLATE : INDIGO} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>

          {/* Hours per Person — collapsible, default expanded */}
          <ReportCard title="Hours per Person" subtitle="This month with month-over-month trend" icon={Users}
            action={<button onClick={() => setHoursPerPersonOpen(!hoursPerPersonOpen)} className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">{hoursPerPersonOpen ? <><ChevronUp className="w-3 h-3" />Collapse</> : <><ChevronDown className="w-3 h-3" />Expand</>}</button>}>
            {hoursPerPersonOpen && (
              <div className="space-y-2">
                {Object.entries(tempoMetrics.personUtilization).sort(([, a], [, b]) => b.current - a.current).map(([name, data]) => {
                  const mx = Math.max(...Object.values(tempoMetrics.personUtilization).map((v) => v.current), 1);
                  return (<div key={name} className="flex items-center gap-2"><span className="text-xs font-medium text-slate-700 w-24 truncate">{name.split(' ')[0]}</span><div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.round((data.current / mx) * 100)}%` }} /></div><span className="text-xs font-bold text-slate-600 w-12 text-right">{Math.round(data.current)}h</span>{data.delta !== 0 && <span className={`text-[10px] font-semibold w-10 text-right ${data.delta > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{data.delta > 0 ? '+' : ''}{data.delta}%</span>}</div>);
                })}
              </div>
            )}
          </ReportCard>

          <ReportCard title="Hours by Project/Area" subtitle="Where time is being spent (excludes unlinked)" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={Math.max(180, Math.min(tempoMetrics.projects.length, 15) * 28)}>
              <BarChart data={tempoMetrics.projects.slice(0, 15).map((p) => ({ name: resolveAreaName(p.projectKey), hours: Math.round(p.hours) }))} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="hours" fill={INDIGO} radius={[0, 4, 4, 0]}>{tempoMetrics.projects.slice(0, 15).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>
        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">No Tempo data available.</p></div>)}

      {/* ═══ OPERATIONAL INSIGHTS ═══ */}
      {activeSection === 'insights' && (tempoLoading ? (
        <LoadingProgress
          steps={['Loading time data...', 'Cross-referencing Jira tasks...', 'Building performance metrics...']}
          intervalMs={2000}
        />
      ) : crossMetrics && jiraMetrics && tempoMetrics ? (
        <div className="space-y-4">
          {/* Recurring Work — top of Operational Insights */}
          {jiraMetrics.recurringCount > 0 && (
            <ReportCard title="Recurring Work" subtitle={`${jiraMetrics.recurringCount} ongoing tasks excluded from stale/overdue counts`} icon={Clock}>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(jiraMetrics.recurringByArea).sort(([, a], [, b]) => b - a).map(([area, count]) => (
                    <span key={area} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg font-medium">
                      {area}: {count}
                    </span>
                  ))}
                </div>
                <div className="space-y-2 mt-2">
                  {Object.entries(jiraMetrics.recurringByPerson).sort(([, a], [, b]) => b.length - a.length).map(([name, tasks]) => (
                    <div key={name}>
                      <div className="text-xs font-semibold text-slate-700 mb-0.5">{name} ({tasks.length})</div>
                      <div className="flex flex-wrap gap-1">
                        {tasks.map((t, i) => (
                          <span key={i} className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ReportCard>
          )}

          {/* Area Health — only active projects */}
          <ReportCard title="Area Health Overview" subtitle="Only projects with hours logged this month. Throughput = % of tasks marked Done. Click Delivery to expand per client." icon={TrendingUp}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-200"><th className="text-left py-2 font-semibold text-slate-500">Area</th><th className="text-right py-2 font-semibold text-slate-500">Hours</th><th className="text-right py-2 font-semibold text-slate-500">Tasks</th><th className="text-right py-2 font-semibold text-slate-500">Done</th><th className="text-right py-2 font-semibold text-slate-500">Overdue</th><th className="text-right py-2 font-semibold text-slate-500">Throughput</th></tr></thead>
                <tbody>
                  {crossMetrics.areaHealth.filter((r) => r.hours > 0).sort((a, b) => b.hours - a.hours).map((row) => (
                    <React.Fragment key={row.area}>
                      <tr className={`border-b border-slate-50 ${row.isDelivery ? 'cursor-pointer hover:bg-slate-50' : ''}`} onClick={() => row.isDelivery && setExpandedDeliveryArea(expandedDeliveryArea === 'ins-' + row.area ? null : 'ins-' + row.area)}>
                        <td className="py-2 font-medium text-slate-700"><span className="flex items-center gap-1">{row.area}{row.isDelivery && (expandedDeliveryArea === 'ins-' + row.area ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />)}</span></td>
                        <td className="py-2 text-right text-indigo-600 font-semibold">{Math.round(row.hours)}h</td>
                        <td className="py-2 text-right text-slate-600">{row.total}</td>
                        <td className="py-2 text-right text-emerald-600 font-semibold">{row.done}</td>
                        <td className={`py-2 text-right font-semibold ${row.overdue > 0 ? 'text-red-600' : 'text-slate-400'}`}>{row.overdue}</td>
                        <td className="py-2 text-right"><span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${row.throughputRate >= 60 ? 'bg-emerald-50 text-emerald-600' : row.throughputRate >= 30 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{row.throughputRate}%</span></td>
                      </tr>
                      {row.isDelivery && expandedDeliveryArea === 'ins-' + row.area && row.subProjects?.map((sp) => (
                        <tr key={sp.name} className="border-b border-slate-50 bg-slate-50/50">
                          <td className="py-1.5 pl-6 text-slate-500 text-[11px]">{sp.name}</td>
                          <td className="py-1.5 text-right text-indigo-400 text-[11px]">{sp.hours}h</td>
                          <td className="py-1.5 text-right text-slate-400 text-[11px]">{sp.total}</td>
                          <td className="py-1.5 text-right text-emerald-400 text-[11px]">{sp.done}</td>
                          <td className={`py-1.5 text-right text-[11px] ${sp.overdue > 0 ? 'text-red-400' : 'text-slate-300'}`}>{sp.overdue}</td>
                          <td className="py-1.5 text-right text-[11px] text-slate-400">{sp.total > 0 ? Math.round((sp.done / sp.total) * 100) : 0}%</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>

          {/* Person Performance — ALL people, no cap */}
          <ReportCard title="Person Performance Overview" subtitle="Everyone with Tempo hours or Jira activity this month. Completed = tasks moved to Done. Overdue+Stale = tasks needing attention." icon={Users}
            action={<button onClick={() => setPersonPerfOpen(!personPerfOpen)} className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">{personPerfOpen ? <><ChevronUp className="w-3 h-3" />Collapse</> : <><ChevronDown className="w-3 h-3" />Expand</>}</button>}>
            {personPerfOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {crossMetrics.personPerformance.map((p) => (
                  <div key={p.name} className="rounded-lg border border-slate-200 p-3">
                    <div className="font-semibold text-sm text-slate-800 mb-2">{p.name}</div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-center"><div className="text-lg font-bold text-indigo-600">{Math.round(p.hours)}</div><div className="text-[9px] text-slate-400 uppercase">Hours</div></div>
                      <div className="text-center"><div className={`text-lg font-bold ${p.completed > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>{p.completed}</div><div className="text-[9px] text-slate-400 uppercase">Completed</div></div>
                      <div className="text-center"><div className={`text-lg font-bold ${p.overdue + p.stale > 0 ? 'text-red-600' : 'text-slate-300'}`}>{p.overdue + p.stale}</div><div className="text-[9px] text-slate-400 uppercase">Overdue+Stale</div></div>
                    </div>
                    {p.areas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.areas.slice(0, 4).map((a) => <span key={a} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">{a.length > 14 ? a.slice(0, 12) + '…' : a}</span>)}
                        {p.areas.length > 4 && <span className="text-[9px] text-slate-400">+{p.areas.length - 4}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ReportCard>

        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">Both Jira and Tempo data needed.</p></div>)}

      {/* ═══ MONITOR ═══ */}
      {activeSection === 'monitor' && (tempoLoading ? (
        <LoadingProgress
          steps={['Loading timesheet data...', 'Scanning for anomalies...', 'Checking health metrics...']}
          intervalMs={2000}
        />
      ) : monitorMetrics ? (
        <div className="space-y-4">

          {/* 1. Missing Timesheets */}
          <ReportCard title="Missing Timesheets" subtitle={`Week of ${monitorMetrics.weekLabel} — people who logged zero hours`} icon={CalendarOff}>
            {monitorMetrics.missingTimesheets.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">Everyone submitted last week!</span></div>
            ) : (
              <div className="space-y-2">
                {monitorMetrics.missingTimesheets.map((name) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">0 hours</span>
                      {copiedNudge === name ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />Copied! Paste in Slack
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const msg = `Hey ${name.split(' ')[0]}! 👋 Friendly reminder — it looks like your timesheet for last week (${monitorMetrics.weekLabel}) hasn't been submitted yet. Could you please log your hours when you get a chance? Thanks!`;
                            navigator.clipboard.writeText(msg);
                            setCopiedNudge(name);
                            setTimeout(() => setCopiedNudge(null), 3000);
                          }}
                          className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded font-medium transition-colors flex items-center gap-0.5"
                          title="Copy a friendly reminder to your clipboard, then paste it in Slack"
                        >
                          <Send className="w-3 h-3" />Copy Reminder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {monitorMetrics.lowTimesheets.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-[11px] text-amber-600 font-semibold mb-2">⚠️ Low hours (under 20h):</div>
                <div className="space-y-1">
                  {monitorMetrics.lowTimesheets.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{p.name}</span>
                      <span className="text-amber-600 font-semibold">{p.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ReportCard>

          {/* 2. Unlinked Time */}
          <ReportCard title="Time Without Jira Ticket" subtitle="Hours logged this month with no linked issue — click to expand" icon={AlertCircle}>
            {monitorMetrics.unlinkedByPerson.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">All time entries are linked to Jira tickets!</span></div>
            ) : (
              <div className="space-y-2">
                {monitorMetrics.unlinkedByPerson.map((p) => {
                  const isExp = expandedDeliveryArea === 'unlinked-' + p.name;
                  return (
                    <div key={p.name}>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50 cursor-pointer hover:bg-slate-50 rounded" onClick={() => setExpandedDeliveryArea(isExp ? null : 'unlinked-' + p.name)}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{p.name}</span>
                          {isExp ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </div>
                        <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">{p.hours}h unlinked</span>
                      </div>
                      {isExp && (
                        <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-slate-100 pl-3">
                          {p.entries.map((e, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {e.comment || '(no description)'}</span>
                              <span className="text-slate-600 font-medium">{e.hours}h</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ReportCard>

          {/* 3. Overtime Watch */}
          <ReportCard title="Overtime Watch" subtitle="Days with 9+ hours logged — possible burnout risk or data entry error" icon={AlertOctagon}>
            {monitorMetrics.overtimeDays.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">No overtime days this month.</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.overtimeDays.slice(0, 15).map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">{d.name}</span>
                      <span className="text-[10px] text-slate-400">{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${d.hours >= 12 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{d.hours}h</span>
                  </div>
                ))}
                {monitorMetrics.overtimeDays.length > 15 && <p className="text-[10px] text-slate-400 pt-1">+{monitorMetrics.overtimeDays.length - 15} more</p>}
              </div>
            )}
          </ReportCard>

          {/* 4. Ghost Tasks */}
          <ReportCard title="Ghost Tasks" subtitle="In Progress 7+ days with zero Tempo hours — assigned but not being worked on" icon={AlertCircle}>
            {monitorMetrics.ghostTasks.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">All In Progress tasks have time logged!</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.ghostTasks.slice(0, 15).map((t) => (
                  <div key={t.key} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <a href={`${JIRA_BROWSE_URL}/${t.key}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline font-medium">{t.key}</a>
                      <span className="text-xs text-slate-500 ml-1.5 truncate">{t.summary.slice(0, 45)}{t.summary.length > 45 ? '…' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] text-slate-400">{t.assignee}</span>
                      <span className="text-[10px] text-red-500 font-semibold">{t.daysSilent}d silent</span>
                    </div>
                  </div>
                ))}
                {monitorMetrics.ghostTasks.length > 15 && <p className="text-[10px] text-slate-400 pt-1">+{monitorMetrics.ghostTasks.length - 15} more</p>}
              </div>
            )}
          </ReportCard>

          {/* 5. Weekend Warriors */}
          <ReportCard title="Weekend Warriors" subtitle="Team members who logged hours on Saturday or Sunday this month" icon={Clock}>
            {monitorMetrics.weekendWarriors.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">No weekend work logged this month.</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.weekendWarriors.map((w) => (
                  <div key={w.name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{w.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{w.days} day{w.days !== 1 ? 's' : ''}</span>
                      <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">{w.hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ReportCard>

          {/* 6. Zero-Hour People */}
          <ReportCard title="Zero-Hour People" subtitle="Assigned active Jira tasks but no Tempo hours this month" icon={Users}>
            {monitorMetrics.zeroPeople.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">Everyone with tasks has logged time!</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.zeroPeople.map((name) => (
                  <div key={name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{name}</span>
                    <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">0h logged</span>
                  </div>
                ))}
              </div>
            )}
          </ReportCard>
        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">Tempo data needed for monitoring.</p></div>)}
    </div>
  );
}
