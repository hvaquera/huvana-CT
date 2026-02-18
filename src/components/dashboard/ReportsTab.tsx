'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Loader2, TrendingUp, TrendingDown, Clock, Users, BarChart3,
  AlertCircle, CheckCircle2, Zap, Grid3X3, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { categorizeStatus, AREA_MAP, JIRA_BROWSE_URL } from '@/lib/constants';
import type { JiraIssue, ActualsResponse } from '@/types';

type ReportSection = 'delivery' | 'time' | 'insights';
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

function ReportCard({ title, subtitle, children, icon: Icon }: { title: string; subtitle?: string; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
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
  const [prevTempoData, setPrevTempoData] = useState<ActualsResponse | null>(null);
  const [tempoLoading, setTempoLoading] = useState(true);
  const [tempoFetched, setTempoFetched] = useState(false);
  const [activeSection, setActiveSection] = useState<ReportSection>('delivery');
  const [deliveryPeriod, setDeliveryPeriod] = useState<TimePeriod>('month');
  const [expandedDeliveryArea, setExpandedDeliveryArea] = useState<string | null>(null);

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

  useEffect(() => { if (activeSection !== 'delivery') fetchTempo(); }, [activeSection, fetchTempo]);

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
    const active = issues.filter((i) => categorizeStatus(i.fields.status.name) !== 'done');
    const doneInPeriod = filterByPeriod(issues, deliveryPeriod, 'done');
    const inProgress = issues.filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress');
    const withDue = active.filter((i) => i.fields.duedate);
    const overdue = withDue.filter((i) => { const d = new Date(i.fields.duedate!); d.setHours(0,0,0,0); return d < new Date(new Date().setHours(0,0,0,0)); });
    const stale = inProgress.filter((i) => i.fields.updated && Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000) >= 3);

    const personCompleted: Record<string, number> = {};
    doneInPeriod.forEach((i) => { const n = i.fields.assignee?.displayName ?? 'Unassigned'; personCompleted[n] = (personCompleted[n] ?? 0) + 1; });
    const personStale: Record<string, number> = {};
    stale.forEach((i) => { const n = i.fields.assignee?.displayName ?? 'Unassigned'; personStale[n] = (personStale[n] ?? 0) + 1; });
    const personOverdue: Record<string, number> = {};
    overdue.forEach((i) => { const n = i.fields.assignee?.displayName ?? 'Unassigned'; personOverdue[n] = (personOverdue[n] ?? 0) + 1; });

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

    return { total: issues.length, doneInPeriod: doneInPeriod.length, overdue: overdue.length, stale: stale.length, personCompleted, personStale, personOverdue, areaTasks, epicMap };
  }, [allIssues, deliveryPeriod, filterByPeriod]);

  // ── Tempo Metrics ──────────────────────────────────────────
  const tempoMetrics = useMemo(() => {
    if (!tempoData) return null;
    const prevTotal = prevTempoData?.totalHours ?? 0;
    const hoursDelta = prevTotal > 0 ? Math.round(((tempoData.totalHours - prevTotal) / prevTotal) * 100) : 0;
    const dayOfWeekHours: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    tempoData.people.forEach((p) => p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => { dayOfWeekHours[dayNames[new Date(e.date).getDay()]] += e.hours; }))));
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
    const allocationMatrix: Record<string, Record<string, number>> = {};
    const allAreas = new Set<string>();
    tempoMetrics.people.forEach((p) => { if (!allocationMatrix[p.name]) allocationMatrix[p.name] = {}; p.projects.forEach((pr) => { const a = resolveAreaName(pr.projectKey); allAreas.add(a); allocationMatrix[p.name][a] = (allocationMatrix[p.name][a] ?? 0) + pr.hours; }); });

    const areaHealth: Array<{ area: string; hours: number; total: number; done: number; inProgress: number; overdue: number; throughputRate: number; isDelivery: boolean; subProjects?: Array<{ name: string; hours: number; total: number; done: number; overdue: number }> }> = [];
    Object.entries(jiraMetrics.areaTasks).forEach(([area, data]) => {
      let hours = 0;
      if (area === 'Delivery') { tempoMetrics.projects.forEach((p) => { if (!opsKeys.has(p.projectKey)) hours += p.hours; }); }
      else { const mk = Object.entries(AREA_MAP).filter(([, n]) => n === area).map(([k]) => k); tempoMetrics.projects.forEach((p) => { if (mk.includes(p.projectKey)) hours += p.hours; }); }
      const subProjects = data.isDelivery && data.projects ? Object.entries(data.projects).map(([n, pd]) => {
        const ph = tempoMetrics.projects.find((tp) => tp.projectName === n || tp.projectKey === n)?.hours ?? 0;
        return { name: n, hours: Math.round(ph), total: pd.total, done: pd.done, overdue: pd.overdue };
      }).sort((a, b) => b.total - a.total) : undefined;
      areaHealth.push({ area, hours, total: data.total, done: data.done, inProgress: data.inProgress, overdue: data.overdue, throughputRate: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0, isDelivery: data.isDelivery, subProjects });
    });

    const personPerformance: Array<{ name: string; hours: number; completed: number; overdue: number; stale: number; areas: string[]; hoursPerTask: number | null }> = [];
    tempoMetrics.people.forEach((p) => {
      const completed = jiraMetrics.personCompleted[p.name] ?? 0;
      const areas = [...new Set(p.projects.map((pr) => resolveAreaName(pr.projectKey)))];
      personPerformance.push({ name: p.name, hours: p.totalHours, completed, overdue: jiraMetrics.personOverdue[p.name] ?? 0, stale: jiraMetrics.personStale[p.name] ?? 0, areas, hoursPerTask: completed > 0 ? Math.round((p.totalHours / completed) * 10) / 10 : null });
    });
    personPerformance.sort((a, b) => b.hours - a.hours);
    return { allocationMatrix, allAreas: [...allAreas].sort(), areaHealth, personPerformance };
  }, [jiraMetrics, tempoMetrics]);

  const sections: Array<{ key: ReportSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'delivery', label: 'Delivery Performance', icon: CheckCircle2 },
    { key: 'time', label: 'Time Intelligence', icon: Clock },
    { key: 'insights', label: 'Operational Insights', icon: Zap },
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
                <BarChart data={Object.entries(jiraMetrics.personCompleted).filter(([n]) => n !== 'Unassigned').map(([n, d]) => ({ name: n.split(' ')[0], done: d, overdue: jiraMetrics.personOverdue[n] ?? 0, stale: jiraMetrics.personStale[n] ?? 0 })).sort((a, b) => b.done - a.done)} layout="vertical" margin={{ left: 0, right: 10 }}>
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
            <ReportCard title="Stale Task Frequency" subtitle="Who has tasks with no updates in 3+ days" icon={AlertCircle}>
              <div className="space-y-2">
                {Object.entries(jiraMetrics.personStale).filter(([, c]) => c > 0).sort(([, a], [, b]) => b - a).map(([name, c]) => (
                  <div key={name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{name}</span>
                    <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">{c} stale</span>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}
        </div>
      )}

      {/* ═══ TIME INTELLIGENCE ═══ */}
      {activeSection === 'time' && (tempoLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /><span className="ml-2 text-sm text-slate-400">Loading Tempo data...</span></div>
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
              <span className="font-semibold">{tempoMetrics.noJiraHours}h</span> logged against unresolved Jira issues (time tracked without a linked ticket)
            </div>
          )}
          <ReportCard title="Hours per Person" subtitle="This month with month-over-month trend" icon={Users}>
            <div className="space-y-2">
              {Object.entries(tempoMetrics.personUtilization).sort(([, a], [, b]) => b.current - a.current).map(([name, data]) => {
                const mx = Math.max(...Object.values(tempoMetrics.personUtilization).map((v) => v.current), 1);
                return (<div key={name} className="flex items-center gap-2"><span className="text-xs font-medium text-slate-700 w-24 truncate">{name.split(' ')[0]}</span><div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.round((data.current / mx) * 100)}%` }} /></div><span className="text-xs font-bold text-slate-600 w-12 text-right">{Math.round(data.current)}h</span>{data.delta !== 0 && <span className={`text-[10px] font-semibold w-10 text-right ${data.delta > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{data.delta > 0 ? '+' : ''}{data.delta}%</span>}</div>);
              })}
            </div>
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
          <ReportCard title="Peak Load Days" icon={Clock}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({ day: d, hours: Math.round(tempoMetrics.dayOfWeekHours[d] ?? 0) }))} margin={{ left: 0, right: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="hours" fill={INDIGO} radius={[4, 4, 0, 0]}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <Cell key={i} fill={d === 'Sat' || d === 'Sun' ? SLATE : INDIGO} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>
          <ReportCard title="Time Distribution" icon={Grid3X3}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart><Pie data={tempoMetrics.projects.slice(0, 8).map((p) => ({ name: resolveAreaName(p.projectKey), value: Math.round(p.hours) }))} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={(props: Record<string, unknown>) => `${props.name ?? ''}: ${Math.round(((props.percent as number) ?? 0) * 100)}%`}>{tempoMetrics.projects.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ fontSize: 12 }} /></PieChart>
            </ResponsiveContainer>
          </ReportCard>
        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">No Tempo data available.</p></div>)}

      {/* ═══ OPERATIONAL INSIGHTS ═══ */}
      {activeSection === 'insights' && (tempoLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /><span className="ml-2 text-sm text-slate-400">Loading...</span></div>
      ) : crossMetrics && jiraMetrics && tempoMetrics ? (
        <div className="space-y-4">
          <ReportCard title="Area Health Overview" subtitle="Click Delivery to see per-project breakdown" icon={TrendingUp}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-200"><th className="text-left py-2 font-semibold text-slate-500">Area</th><th className="text-right py-2 font-semibold text-slate-500">Hours</th><th className="text-right py-2 font-semibold text-slate-500">Tasks</th><th className="text-right py-2 font-semibold text-slate-500">Done</th><th className="text-right py-2 font-semibold text-slate-500">Overdue</th><th className="text-right py-2 font-semibold text-slate-500">Throughput</th></tr></thead>
                <tbody>
                  {crossMetrics.areaHealth.sort((a, b) => b.hours - a.hours).map((row) => (
                    <>{/* eslint-disable-next-line react/jsx-key */}
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
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>

          <ReportCard title="Time Allocation Matrix" subtitle="Who spends time where (excludes unlinked)" icon={Grid3X3}>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-200"><th className="text-left py-2 font-semibold text-slate-500 sticky left-0 bg-white">Person</th>{crossMetrics.allAreas.map((a) => <th key={a} className="text-center py-2 font-semibold text-slate-500 px-2 min-w-[60px]">{a.length > 10 ? a.slice(0, 8) + '…' : a}</th>)}<th className="text-center py-2 font-semibold text-slate-500 px-2">Spread</th></tr></thead>
                <tbody>
                  {Object.entries(crossMetrics.allocationMatrix).sort(([, a], [, b]) => Object.values(b).reduce((s, v) => s + v, 0) - Object.values(a).reduce((s, v) => s + v, 0)).map(([name, areas]) => {
                    const total = Object.values(areas).reduce((s, v) => s + v, 0);
                    const ac = Object.values(areas).filter((v) => v > 0).length;
                    return (<tr key={name} className="border-b border-slate-50"><td className="py-1.5 font-medium text-slate-700 sticky left-0 bg-white">{name.split(' ')[0]}</td>{crossMetrics.allAreas.map((a) => { const h = Math.round(areas[a] ?? 0); const p = total > 0 ? Math.round((h / total) * 100) : 0; return <td key={a} className="text-center py-1.5 px-1">{h > 0 ? <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${p >= 50 ? 'bg-indigo-100 text-indigo-700' : p >= 20 ? 'bg-slate-100 text-slate-600' : 'text-slate-400'}`}>{h}h</span> : <span className="text-slate-200">—</span>}</td>; })}<td className="text-center py-1.5"><span className={`text-[10px] font-bold ${ac >= 4 ? 'text-red-500' : ac >= 3 ? 'text-amber-500' : 'text-emerald-500'}`}>{ac}</span></td></tr>);
                  })}
                </tbody>
              </table>
            </div>
          </ReportCard>

          <ReportCard title="Person Performance Overview" subtitle="Hours, completions, issues, and areas per person" icon={Users}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crossMetrics.personPerformance.slice(0, 12).map((p) => (
                <div key={p.name} className="rounded-lg border border-slate-200 p-3">
                  <div className="font-semibold text-sm text-slate-800 mb-2">{p.name}</div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center"><div className="text-lg font-bold text-indigo-600">{Math.round(p.hours)}</div><div className="text-[9px] text-slate-400 uppercase">Hours</div></div>
                    <div className="text-center"><div className="text-lg font-bold text-emerald-600">{p.completed}</div><div className="text-[9px] text-slate-400 uppercase">Done</div></div>
                    <div className="text-center"><div className={`text-lg font-bold ${p.overdue + p.stale > 0 ? 'text-red-600' : 'text-slate-300'}`}>{p.overdue + p.stale}</div><div className="text-[9px] text-slate-400 uppercase">Issues</div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">{p.areas.slice(0, 3).map((a) => <span key={a} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">{a.length > 12 ? a.slice(0, 10) + '…' : a}</span>)}{p.areas.length > 3 && <span className="text-[9px] text-slate-400">+{p.areas.length - 3}</span>}</div>
                    {p.hoursPerTask && <span className="text-[10px] text-slate-400">{p.hoursPerTask}h/task</span>}
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          <ReportCard title="Monthly Ops Scorecard" subtitle="At-a-glance operational health" icon={CheckCircle2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-200 p-3 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Hours</div>
                <div className="text-2xl font-bold text-indigo-600">{Math.round(tempoMetrics.totalHours)}</div>
                {tempoMetrics.hoursDelta !== 0 && <div className={`text-[11px] font-semibold mt-0.5 ${tempoMetrics.hoursDelta > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{tempoMetrics.hoursDelta > 0 ? '↑' : '↓'} {Math.abs(tempoMetrics.hoursDelta)}%</div>}
              </div>
              <div className="rounded-lg border border-slate-200 p-3 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Done</div>
                <div className="text-2xl font-bold text-emerald-600">{jiraMetrics.doneInPeriod}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">this month</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Overdue</div>
                <div className={`text-2xl font-bold ${jiraMetrics.overdue > 5 ? 'text-red-600' : jiraMetrics.overdue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{jiraMetrics.overdue}</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Stale</div>
                <div className={`text-2xl font-bold ${jiraMetrics.stale > 5 ? 'text-red-600' : jiraMetrics.stale > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{jiraMetrics.stale}</div>
              </div>
            </div>
          </ReportCard>
        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">Both Jira and Tempo data needed.</p></div>)}
    </div>
  );
}
