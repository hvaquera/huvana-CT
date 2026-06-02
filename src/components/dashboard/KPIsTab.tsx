'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Zap, Clock, Snowflake, BarChart3, Gauge, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { categorizeStatus, AREA_MAP } from '@/lib/constants';
import LoadingProgress from './LoadingProgress';
import type { JiraIssue, ActualsResponse } from '@/types';



interface KPIsTabProps {
  jiraIssues: JiraIssue[];
}

type TimePeriod = 'week' | 'month' | 'lastMonth';

function resolveAreaName(projectKey: string): string {
  return AREA_MAP[projectKey as keyof typeof AREA_MAP] ?? projectKey;
}

function formatDisplayName(name: string): string {
  if (!name) return '';
  return name.replace(/\s*\[.*?\]\s*/g, '').replace(/\(.*?\)/g, '').trim();
}

// ─── KPI Computation ──────────────────────────────────────────

interface KPIValue {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'flat';
  trendPercent: number;
  status: 'green' | 'yellow' | 'red';
  label: string;
  detail?: string;
}

interface AreaKPIs {
  area: string;
  executionVelocity: KPIValue;
  avgCycleTime: KPIValue;
  staleRatio: KPIValue;
  timesheetCompliance: KPIValue;
  responsiveness: KPIValue;
  commitmentReliability: KPIValue;
}

function computeKPI(current: number, previous: number, thresholds: { green: (v: number) => boolean; yellow: (v: number) => boolean }, label: string, invertTrend?: boolean, detail?: string): KPIValue {
  const diff = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const absDiff = Math.abs(diff);
  let trend: 'up' | 'down' | 'flat' = absDiff < 3 ? 'flat' : diff > 0 ? 'up' : 'down';
  const status = thresholds.green(current) ? 'green' : thresholds.yellow(current) ? 'yellow' : 'red';
  return { current, previous, trend, trendPercent: Math.round(absDiff), status, label, detail };
}

function computeAreaKPIs(
  area: string,
  issues: JiraIssue[],
  prevIssues: JiraIssue[],
  tempoData: ActualsResponse | null,
  prevTempoData: ActualsResponse | null,
  period: TimePeriod
): AreaKPIs {
  const now = new Date();
  const opsProjectKeys = Object.keys(AREA_MAP);
  const areaKeys = opsProjectKeys.filter(k => resolveAreaName(k) === area);

  const areaIssuesRaw = issues.filter(i => areaKeys.includes(i.fields.project.key));
  // Exclude recurring tasks from KPIs — they're tracked separately in Reports
  const areaIssues = areaIssuesRaw.filter(i => categorizeStatus(i.fields.status.name) !== 'recurring');

  // ── Execution Velocity ──
  // What % of non-done tasks at start of period have reached Done?
  // Simpler: of current In Progress + Done tasks, what fraction is Done?
  // Only count Done tasks that were actually completed this period
  let periodStart: Date;
  let periodEnd: Date = now;
  if (period === 'week') {
    periodStart = new Date(now);
    const day = periodStart.getDay();
    periodStart.setDate(periodStart.getDate() - (day === 0 ? 6 : day - 1));
    periodStart.setHours(0, 0, 0, 0);
  } else if (period === 'lastMonth') {
    const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    periodStart = new Date(ly, lm, 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth(), 1); // first day of current month
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const currentInProgressForVelocity = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'inProgress');
  const currentBlocked = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'blocked');
  const currentDone = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'done');
  const currentTodo = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'todo');

  // Done this period = tasks whose statuscategorychangedate falls within [periodStart, periodEnd)
  const doneInPeriod = currentDone.filter(i => {
    const scd = i.fields.statuscategorychangedate ? new Date(i.fields.statuscategorychangedate) : null;
    return scd && scd >= periodStart && scd < periodEnd;
  });

  // Denominator = tasks that were "active" = currently In Progress + Done in period
  const workedOn = currentInProgressForVelocity.length + doneInPeriod.length;
  const velocityCurrent = workedOn > 0 ? Math.round((doneInPeriod.length / workedOn) * 100) : 100;
  const velocityPrev = 0;

  const executionVelocity = computeKPI(
    velocityCurrent, velocityPrev,
    { green: v => v >= 70, yellow: v => v >= 50 },
    `${doneInPeriod.length} done, ${currentInProgressForVelocity.length} active`,
    false,
    `${currentTodo.length} to-do, ${currentBlocked.length} blocked`
  );

  // ── Average Cycle Time ──
  // For each Done task: days from created → statuscategorychangedate (when it moved to Done)
  const completedWithDates = doneInPeriod.filter(i => i.fields.statuscategorychangedate && i.fields.created);
  let avgCycle = 0;
  if (completedWithDates.length > 0) {
    const cycleTimes = completedWithDates.map(i => {
      const created = new Date(i.fields.created!);
      const doneDate = new Date(i.fields.statuscategorychangedate!);
      return Math.max(1, Math.floor((doneDate.getTime() - created.getTime()) / 86400000));
    });
    avgCycle = Math.round(cycleTimes.reduce((s, d) => s + d, 0) / cycleTimes.length);
  }

  const avgCycleTime = computeKPI(
    avgCycle, 0,
    { green: v => v <= 7, yellow: v => v <= 14 },
    avgCycle > 0 ? `${avgCycle} days avg` : 'No data',
    true,
    completedWithDates.length > 0 ? `Based on ${completedWithDates.length} completed tasks` : 'No completed tasks in period'
  );

  // ── Stale Work Ratio ──
  const stale = currentInProgressForVelocity.filter(i => {
    if (!i.fields.updated) return false;
    if (!i.fields.assignee) return false;
    if (i.fields.assignee?.active === false) return false;
    const daysSince = Math.floor((now.getTime() - new Date(i.fields.updated).getTime()) / 86400000);
    return daysSince >= 3 && daysSince <= 90;
  });
  const stalePercent = currentInProgressForVelocity.length > 0 ? Math.round((stale.length / currentInProgressForVelocity.length) * 100) : 0;

  const staleRatio = computeKPI(
    stalePercent, 0,
    { green: v => v < 15, yellow: v => v <= 30 },
    `${stale.length} of ${currentInProgressForVelocity.length} stale`,
    true,
    stale.length > 0 ? `${stale.map(i => i.key).slice(0, 3).join(', ')}${stale.length > 3 ? '...' : ''}` : 'All tasks active'
  );

  // ── Timesheet Compliance (matched by Jira accountId) ──
  const opsAssigneeMap = new Map<string, string>(); // accountId → displayName
  areaIssues.forEach(i => {
    if (i.fields.assignee?.accountId && i.fields.assignee?.active !== false) {
      const s = categorizeStatus(i.fields.status.name);
      if (s === 'inProgress' || s === 'todo') {
        opsAssigneeMap.set(i.fields.assignee.accountId, formatDisplayName(i.fields.assignee.displayName));
      }
    }
  });

  let compliancePercent = 100;
  let complianceDetail = '';
  if (tempoData) {
    const tempoIds = new Set((tempoData?.people ?? []).map(p => p.id));
    const logging = [...opsAssigneeMap.keys()].filter(id => tempoIds.has(id));
    const notLogging = [...opsAssigneeMap.entries()].filter(([id]) => !tempoIds.has(id));
    compliancePercent = opsAssigneeMap.size > 0 ? Math.round((logging.length / opsAssigneeMap.size) * 100) : 100;
    complianceDetail = notLogging.length > 0 ? `Not logging: ${notLogging.slice(0, 4).map(([, name]) => name.split(' ')[0]).join(', ')}${notLogging.length > 4 ? '...' : ''}` : 'Everyone logging';
  }

  const timesheetCompliance = computeKPI(
    compliancePercent, 0,
    { green: v => v >= 100, yellow: v => v >= 80 },
    `${compliancePercent}%`,
    false,
    complianceDetail
  );

  // ── Responsiveness (Pickup Speed) ──
  const startedInPeriod = areaIssues.filter(i => {
    const s = categorizeStatus(i.fields.status.name);
    if (s !== 'inProgress' && s !== 'done') return false;
    const scd = i.fields.statuscategorychangedate ? new Date(i.fields.statuscategorychangedate) : null;
    return scd && scd >= periodStart;
  });

  let avgPickup = 0;
  if (startedInPeriod.length > 0) {
    const pickupTimes = startedInPeriod.map(i => {
      const created = new Date(i.fields.statuscategorychangedate!);
      const started = i.fields.updated ? new Date(i.fields.updated) : created;
      return Math.max(0, Math.floor((started.getTime() - created.getTime()) / 86400000));
    }).filter(d => d < 90); // filter outliers
    avgPickup = pickupTimes.length > 0 ? Math.round(pickupTimes.reduce((s, d) => s + d, 0) / pickupTimes.length) : 0;
  }

  const responsiveness = computeKPI(
    avgPickup, 0,
    { green: v => v < 3, yellow: v => v <= 7 },
    avgPickup > 0 ? `${avgPickup} days avg` : '< 1 day',
    true,
    `Based on ${startedInPeriod.length} tasks started`
  );

  // ── Commitment Reliability ──
  const completedWithDue = doneInPeriod.filter(i => i.fields.duedate);
  let onTimePercent = 100;
  if (completedWithDue.length > 0) {
    const onTime = completedWithDue.filter(i => {
      const due = new Date(i.fields.duedate!);
      const finished = new Date(i.fields.updated!);
      due.setHours(23, 59, 59, 999);
      return finished <= due;
    });
    onTimePercent = Math.round((onTime.length / completedWithDue.length) * 100);
  }

  const commitmentReliability = computeKPI(
    onTimePercent, 0,
    { green: v => v >= 85, yellow: v => v >= 70 },
    completedWithDue.length > 0 ? `${onTimePercent}% on time` : 'No due-dated tasks',
    false,
    completedWithDue.length > 0 ? `${completedWithDue.length} tasks with due dates` : 'Set due dates to track this'
  );

  return {
    area,
    executionVelocity,
    avgCycleTime,
    staleRatio,
    timesheetCompliance,
    responsiveness,
    commitmentReliability,
  };
}

// ─── KPI Card Component ──────────────────────────────────────

const statusColors = {
  green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  yellow: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
};

const kpiIcons: Record<string, React.ReactNode> = {
  executionVelocity: <Zap className="w-4 h-4" />,
  avgCycleTime: <Clock className="w-4 h-4" />,
  staleRatio: <Snowflake className="w-4 h-4" />,
  timesheetCompliance: <BarChart3 className="w-4 h-4" />,
  responsiveness: <Gauge className="w-4 h-4" />,
  commitmentReliability: <Target className="w-4 h-4" />,
};

const kpiNames: Record<string, string> = {
  executionVelocity: 'Execution Velocity',
  avgCycleTime: 'Avg Cycle Time',
  staleRatio: 'Stale Work Ratio',
  timesheetCompliance: 'Timesheet Compliance',
  responsiveness: 'Responsiveness',
  commitmentReliability: 'Commitment Reliability',
};

function KPICell({ name, value }: { name: string; value: KPIValue }) {
  const colors = statusColors[value.status];
  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-3 transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={colors.text}>{kpiIcons[name]}</span>
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">{kpiNames[name]}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${colors.text}`}>
          {name === 'avgCycleTime' || name === 'responsiveness'
            ? (value.current > 0 ? `${value.current}d` : '<1d')
            : `${value.current}%`
          }
        </span>
      </div>
      <div className="mt-1.5 text-[11px] text-slate-500">{value.label}</div>
      {value.detail && <div className="mt-0.5 text-[10px] text-slate-400">{value.detail}</div>}
    </div>
  );
}

// ─── Area Card ────────────────────────────────────────────────

function AreaKPICard({ data }: { data: AreaKPIs }) {
  const [expanded, setExpanded] = useState(true);
  const kpiEntries: [string, KPIValue][] = [
    ['executionVelocity', data.executionVelocity],
    ['avgCycleTime', data.avgCycleTime],
    ['staleRatio', data.staleRatio],
    ['timesheetCompliance', data.timesheetCompliance],
    ['responsiveness', data.responsiveness],
    ['commitmentReliability', data.commitmentReliability],
  ];

  // Overall health: count greens
  const greens = kpiEntries.filter(([, v]) => v.status === 'green').length;
  const reds = kpiEntries.filter(([, v]) => v.status === 'red').length;
  const overallColor = reds >= 3 ? 'text-red-600' : greens >= 4 ? 'text-emerald-600' : 'text-amber-600';
  const overallDot = reds >= 3 ? 'bg-red-500' : greens >= 4 ? 'bg-emerald-500' : 'bg-amber-500';
  const overallLabel = reds >= 3 ? 'Needs Attention' : greens >= 4 ? 'Healthy' : 'Some Friction';

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${overallDot} shadow-sm`} />
          <h3 className="text-base font-bold text-slate-800">{data.area}</h3>
          <span className={`text-xs font-semibold ${overallColor}`}>{overallLabel}</span>
          <span className="text-[10px] text-slate-400">{greens}/6 green</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini status dots */}
          <div className="flex gap-1">
            {kpiEntries.map(([name, v]) => (
              <div key={name} className={`w-1.5 h-1.5 rounded-full ${statusColors[v.status].dot}`} title={kpiNames[name]} />
            ))}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {expanded && (
        <CardContent className="pt-0 pb-4 px-5">
          <div className="grid grid-cols-3 gap-3">
            {kpiEntries.map(([name, value]) => (
              <KPICell key={name} name={name} value={value} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Overall Health Summary ───────────────────────────────────

function HealthSummary({ areas }: { areas: AreaKPIs[] }) {
  const allKPIs = areas.flatMap(a => [
    a.executionVelocity, a.avgCycleTime, a.staleRatio,
    a.timesheetCompliance, a.responsiveness, a.commitmentReliability,
  ]);
  const greens = allKPIs.filter(k => k.status === 'green').length;
  const yellows = allKPIs.filter(k => k.status === 'yellow').length;
  const reds = allKPIs.filter(k => k.status === 'red').length;
  const total = allKPIs.length;
  const healthScore = Math.round((greens / total) * 100);

  const overallStatus = healthScore >= 70 ? 'Healthy' : healthScore >= 45 ? 'Some Friction' : 'Needs Attention';
  const overallColor = healthScore >= 70 ? 'text-emerald-600' : healthScore >= 45 ? 'text-amber-600' : 'text-red-600';
  const overallBg = healthScore >= 70 ? 'from-emerald-50 to-emerald-100/50' : healthScore >= 45 ? 'from-amber-50 to-amber-100/50' : 'from-red-50 to-red-100/50';

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${overallBg} border border-slate-200/60 p-5 mb-5`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-3xl font-black ${overallColor}`}>{healthScore}%</span>
            <span className={`text-sm font-bold ${overallColor}`}>{overallStatus}</span>
          </div>
          <p className="text-xs text-slate-500">Ops Health Score — percentage of KPIs in green across all areas</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{greens}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Green</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">{yellows}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Yellow</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{reds}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Red</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────

export default function KPIsTab({ jiraIssues }: KPIsTabProps) {
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [tempoData, setTempoData] = useState<ActualsResponse | null>(null);
  const [prevTempoData, setPrevTempoData] = useState<ActualsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTempo = useCallback(async () => {
    setLoading(true);
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
    } catch (err) {
      console.error('[KPIs] Tempo error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTempo(); }, [fetchTempo]);

  const areas = [...new Set(jiraIssues.map(i => i.fields.project.name))].filter(Boolean).slice(0, 8);

  const areaKPIs = useMemo(() => {
    if (!jiraIssues.length) return [];
    const activeTempo = period === 'lastMonth' ? prevTempoData : tempoData;
    return areas.map(area => computeAreaKPIs(area, jiraIssues, [], activeTempo, prevTempoData, period));
  }, [jiraIssues, tempoData, prevTempoData, period]);

  if (loading || !jiraIssues.length) {
    return (
      <div className="py-8">
        <LoadingProgress
          steps={['Loading Jira data...', 'Fetching Tempo hours...', 'Computing KPIs...']}
          intervalMs={1500}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Ops KPIs</h2>
          <p className="text-xs text-slate-500">Performance signals across all operational areas</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setPeriod('week')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${period === 'week' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${period === 'month' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('lastMonth')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${period === 'lastMonth' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Overall Health */}
      <HealthSummary areas={areaKPIs} />

      {/* Area Cards */}
      {areaKPIs.map(data => (
        <AreaKPICard key={data.area} data={data} />
      ))}

      {/* Legend */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
        <div className="grid grid-cols-3 gap-4 text-[11px]">
          <div>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="font-semibold text-emerald-700">Green — On Track</span></div>
            <p className="text-slate-500">KPI is within healthy range. No action needed.</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="font-semibold text-amber-700">Yellow — Watch</span></div>
            <p className="text-slate-500">KPI is trending toward concern. Monitor and prepare.</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="font-semibold text-red-700">Red — Act Now</span></div>
            <p className="text-slate-500">KPI needs immediate attention. Review with area lead.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
