'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  TrendingUp, Clock, Users, BarChart3,
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

type ReportSection = 'delivery' | 'monitor';
type TimePeriod = 'week' | 'month' | 'last-month' | 'all';

const COLORS = ['#4F46E5', '#059669', '#D97706', '#DC2626', '#8B5CF6', '#06B6D4', '#EC4899', '#64748B'];
const GREEN = '#059669';
const AMBER = '#D97706';
const RED = '#DC2626';
const INDIGO = '#4F46E5';

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

export default function ReportsTab({ jiraIssues, deliveryIssues }: ReportsTabProps) {
  const [tempoData, setTempoData] = useState<ActualsResponse | null>(null);
  const [tempoLoading, setTempoLoading] = useState(true);
  const [tempoFetched, setTempoFetched] = useState(false);
  const [activeSection, setActiveSection] = useState<ReportSection>('delivery');
  const [deliveryPeriod, setDeliveryPeriod] = useState<TimePeriod>('month');
  const [expandedDeliveryArea, setExpandedDeliveryArea] = useState<string | null>(null);
  const [expandedStale, setExpandedStale] = useState<string | null>(null);
  const [copiedNudge, setCopiedNudge] = useState<string | null>(null);

  const fetchTempo = useCallback(async () => {
    if (tempoFetched) return;
    setTempoLoading(true);
    try {
      const now = new Date();
      const cy = now.getFullYear(), cm = now.getMonth() + 1;
      const r1 = await fetch(`/api/tempo/actuals?year=${cy}&month=${cm}`);
      if (r1.ok) setTempoData(await r1.json());
      setTempoFetched(true);
    } catch (err) { console.error('[Reports] Tempo error:', err); }
    finally { setTempoLoading(false); }
  }, [tempoFetched]);

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

  const jiraMetrics = useMemo(() => {
    const issues = allIssues;
    const active = issues.filter((i) => { const s = categorizeStatus(i.fields.status.name); return s !== 'done' && s !== 'recurring'; });
    const doneInPeriod = filterByPeriod(issues, deliveryPeriod, 'done');
    const inProgress = issues.filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress');
    const withDue = active.filter((i) => i.fields.duedate);
    const overdue = withDue.filter((i) => { const d = new Date(i.fields.duedate!); d.setHours(0,0,0,0); return d < new Date(new Date().setHours(0,0,0,0)); });

    const stale = inProgress.filter((i) => {
      if (!i.fields.updated || !i.fields.assignee || i.fields.assignee?.active === false) return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
      const daysSilent = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);
      return daysSilent >= 3 && daysSilent <= 90;
    });

    const personCompleted: Record<string, number> = {};
    doneInPeriod.forEach((i) => { const n = formatDisplayName(i.fields.assignee?.displayName ?? ''); if (n && i.fields.assignee?.active !== false) personCompleted[n] = (personCompleted[n] ?? 0) + 1; });

    const personStale: Record<string, Array<{ key: string; summary: string; project: string; daysSilent: number }>> = {};
    stale.forEach((i) => {
      const n = formatDisplayName(i.fields.assignee?.displayName ?? '');
      if (!n || i.fields.assignee?.active === false) return;
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

    return { total: issues.length, active: active.length, doneInPeriod: doneInPeriod.length, overdue: overdue.length, stale: stale.length, personCompleted, personStale, personOverdue, areaTasks, epicMap };
  }, [allIssues, deliveryPeriod, filterByPeriod]);

  const monitorMetrics = useMemo(() => {
    if (!tempoData) return null;
    const parseLocalDate = (s: string) => { const p = s.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); };

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

    const overtimeDays: Array<{ name: string; date: string; hours: number }> = [];
    tempoData.people.forEach((p) => {
      const dayMap: Record<string, number> = {};
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => { dayMap[e.date] = (dayMap[e.date] ?? 0) + e.hours; })));
      Object.entries(dayMap).forEach(([date, hrs]) => { if (hrs >= 9) overtimeDays.push({ name: p.name, date, hours: Math.round(hrs * 10) / 10 }); });
    });

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
      key: i.key, summary: i.fields.summary,
      assignee: formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned'),
      daysSilent: i.fields.updated ? Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000) : 999,
      project: i.fields.project.name,
    })).sort((a, b) => b.daysSilent - a.daysSilent);

    const weekendByPerson: Record<string, { hours: number; days: Set<string> }> = {};
    tempoData.people.forEach((p) => {
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
        const d = parseLocalDate(e.date).getDay();
        if (d === 0 || d === 6) {
          if (!weekendByPerson[p.name]) weekendByPerson[p.name] = { hours: 0, days: new Set() };
          weekendByPerson[p.name].hours += e.hours;
          weekendByPerson[p.name].days.add(e.date);
        }
      })));
    });
    const weekendWarriors = Object.entries(weekendByPerson).map(([name, d]) => ({ name, hours: Math.round(d.hours * 10) / 10, days: d.days.size })).sort((a, b) => b.hours - a.hours);

    const weekLabel = `${lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${lastFriday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return { missingTimesheets, lowTimesheets, overtimeDays, ghostTasks, weekendWarriors, weekLabel };
  }, [tempoData, jiraIssues, deliveryIssues]);

  // Only 2 sections — Delivery Performance and Monitor
  const sections: Array<{ key: ReportSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'delivery', label: 'Delivery Performance', icon: CheckCircle2 },
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
                    <div className={`flex items-center justify-between mb-1 ${data.isDelivery ? 'cursor-pointer' : ''}`} onClick={() => data.isDelivery && setExpandedDeliveryArea(isExp ? null : area)}>
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
            <ReportCard title="Stale Task Frequency" subtitle="Tasks with no updates in 3+ days — click to expand" icon={AlertCircle}>
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

      {/* ═══ MONITOR ═══ */}
      {activeSection === 'monitor' && (tempoLoading ? (
        <LoadingProgress
          steps={['Loading timesheet data...', 'Scanning for anomalies...', 'Checking health metrics...']}
          intervalMs={2000}
        />
      ) : monitorMetrics ? (
        <div className="space-y-4">
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
                          <CheckCircle2 className="w-3 h-3" />Copied!
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const msg = `Hey ${name.split(' ')[0]}! 👋 Friendly reminder — your timesheet for last week (${monitorMetrics.weekLabel}) hasn't been submitted yet. Could you log your hours when you get a chance? Thanks!`;
                            navigator.clipboard.writeText(msg);
                            setCopiedNudge(name);
                            setTimeout(() => setCopiedNudge(null), 3000);
                          }}
                          className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded font-medium transition-colors flex items-center gap-0.5"
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

          <ReportCard title="Overtime Watch" subtitle="Days with 9+ hours logged — possible burnout risk or data entry error" icon={AlertOctagon}>
            {monitorMetrics.overtimeDays.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">No overtime days this month.</span></div>
            ) : (
              <div className="space-y-2.5">
                {(() => {
                  const grouped: Record<string, { totalHours: number; days: Array<{ date: string; hours: number }> }> = {};
                  monitorMetrics.overtimeDays.forEach((d) => {
                    if (!grouped[d.name]) grouped[d.name] = { totalHours: 0, days: [] };
                    grouped[d.name].totalHours += d.hours;
                    grouped[d.name].days.push({ date: d.date, hours: d.hours });
                  });
                  return Object.entries(grouped).sort(([, a], [, b]) => b.days.length - a.days.length).slice(0, 10).map(([name, data]) => (
                    <div key={name} className="py-1.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 font-medium">{name}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${data.days.length >= 4 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{Math.round(data.totalHours * 10) / 10}h total</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </ReportCard>

          <ReportCard title="Ghost Tasks" subtitle="In Progress 7+ days with zero hours logged — assigned but not being worked on" icon={AlertCircle}>
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
              </div>
            )}
          </ReportCard>

          <ReportCard title="Off-Hours Work" subtitle="Hours logged on Saturday or Sunday" icon={Clock}>
            {monitorMetrics.weekendWarriors.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">No weekend work logged this month.</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.weekendWarriors.map((w) => (
                  <div key={w.name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{w.name}</span>
                    <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">{w.hours}h</span>
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