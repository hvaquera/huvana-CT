'use client';

import { useMemo } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';
import { categorizeStatus } from '@/lib/constants';
import type { JiraIssue } from '@/types';

interface ClientHealthTabProps {
  issues: JiraIssue[];
}

interface ClientHealth {
  key: string;
  name: string;
  source: string;
  total: number;
  done: number;
  inProgress: number;
  overdue: number;
  stale: number;
  score: number;
  risk: 'healthy' | 'warning' | 'critical';
  insights: string[];
}

function computeHealth(issues: JiraIssue[]): ClientHealth[] {
  // Group by project
  const projectMap = new Map<string, { name: string; source: string; issues: JiraIssue[] }>();

  for (const issue of issues) {
    const key = issue.fields.project.key;
    const name = issue.fields.project.name;
    const source = /^\d{16,}$/.test(issue.key) ? 'Asana' : 'Jira';
    if (!projectMap.has(key)) {
      projectMap.set(key, { name, source, issues: [] });
    }
    projectMap.get(key)!.issues.push(issue);
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return Array.from(projectMap.entries()).map(([key, { name, source, issues: pIssues }]) => {
    const nonEpics = pIssues.filter(i => i.fields.issuetype?.name?.toLowerCase() !== 'epic');
    const total = nonEpics.length;
    const done = nonEpics.filter(i => categorizeStatus(i.fields.status.name) === 'done').length;
    const inProgress = nonEpics.filter(i => categorizeStatus(i.fields.status.name) === 'inProgress').length;

    const overdue = nonEpics.filter(i => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate);
      due.setHours(0, 0, 0, 0);
      return due < now && categorizeStatus(i.fields.status.name) !== 'done';
    }).length;

    const stale = nonEpics.filter(i => {
      if (!i.fields.updated) return false;
      if (categorizeStatus(i.fields.status.name) !== 'inProgress') return false;
      const daysSince = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);
      return daysSince >= 3;
    }).length;

    // Score: 100 - penalties
    let score = 100;
    if (total > 0) {
      score -= Math.round((overdue / total) * 40); // overdue penalty
      score -= Math.round((stale / total) * 30);   // stale penalty
      score += Math.round((done / total) * 10);    // done bonus
    }
    score = Math.max(0, Math.min(100, score));

    const risk: ClientHealth['risk'] = score >= 70 ? 'healthy' : score >= 40 ? 'warning' : 'critical';

    // Generate insights
    const insights: string[] = [];
    if (overdue > 0) insights.push(`${overdue} task${overdue > 1 ? 's' : ''} overdue`);
    if (stale > 0) insights.push(`${stale} stale in-progress task${stale > 1 ? 's' : ''}`);
    if (done > 0 && total > 0) insights.push(`${Math.round((done / total) * 100)}% completion rate`);
    if (inProgress === 0 && done < total) insights.push('No active work in progress');
    if (score >= 80) insights.push('On track for delivery');

    return { key, name, source, total, done, inProgress, overdue, stale, score, risk, insights };
  }).sort((a, b) => a.score - b.score); // worst first
}

const riskConfig = {
  healthy:  { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: CheckCircle,    iconColor: 'text-emerald-500', bar: 'bg-emerald-500', label: 'Healthy' },
  warning:  { bg: 'bg-amber-50',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700',     icon: AlertTriangle,  iconColor: 'text-amber-500',   bar: 'bg-amber-500',   label: 'At Risk' },
  critical: { bg: 'bg-red-50',     border: 'border-red-200',     badge: 'bg-red-100 text-red-700',         icon: AlertTriangle,  iconColor: 'text-red-500',     bar: 'bg-red-500',     label: 'Critical' },
};

export default function ClientHealthTab({ issues }: ClientHealthTabProps) {
  const clients = useMemo(() => computeHealth(issues), [issues]);

  const overallScore = clients.length > 0
    ? Math.round(clients.reduce((s, c) => s + c.score, 0) / clients.length)
    : 0;

  const criticalCount = clients.filter(c => c.risk === 'critical').length;
  const warningCount = clients.filter(c => c.risk === 'warning').length;
  const healthyCount = clients.filter(c => c.risk === 'healthy').length;

  return (
    <div className="space-y-4">

      {/* Overall score */}
      <div className="bg-slate-900 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">Portfolio Health</h2>
            <p className="text-slate-400 text-xs mt-0.5">Across {clients.length} active client projects</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              overallScore >= 70 ? 'text-emerald-400' : overallScore >= 40 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {overallScore}
            </div>
            <div className="text-xs text-slate-400">/ 100</div>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            {healthyCount} Healthy
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            {warningCount} At Risk
          </div>
          <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            {criticalCount} Critical
          </div>
        </div>
      </div>

      {/* Client cards */}
      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
          No projects found. Connect Jira or Asana to see client health.
        </div>
      ) : (
        clients.map(client => {
          const cfg = riskConfig[client.risk];
          const Icon = cfg.icon;
          return (
            <div key={client.key} className={`rounded-xl border p-5 ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${cfg.iconColor} flex-shrink-0`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{client.name}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        client.source === 'Jira' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {client.source}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {client.total} tasks · {client.done} done · {client.inProgress} in progress
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    client.score >= 70 ? 'text-emerald-600' : client.score >= 40 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {client.score}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Health bar */}
              <div className="h-2 bg-white/60 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${cfg.bar}`}
                  style={{ width: `${client.score}%` }}
                />
              </div>

              {/* Stats row */}
              <div className="flex gap-4 mb-3">
                <div className="flex items-center gap-1 text-xs">
                  <div className={`w-2 h-2 rounded-full ${client.overdue > 0 ? 'bg-red-500' : 'bg-slate-300'}`} />
                  <span className={client.overdue > 0 ? 'text-red-600 font-medium' : 'text-slate-400'}>
                    {client.overdue} overdue
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className={`w-2 h-2 rounded-full ${client.stale > 0 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  <span className={client.stale > 0 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                    {client.stale} stale
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="text-slate-500">
                    {client.total > 0 ? Math.round((client.done / client.total) * 100) : 0}% complete
                  </span>
                </div>
              </div>

              {/* Insights */}
              {client.insights.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {client.insights.map((insight, i) => (
                    <span key={i} className="text-[11px] px-2 py-1 bg-white/70 rounded-lg text-slate-600 border border-white/50">
                      {insight}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* What drives the score */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-slate-700">How the health score is calculated</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs text-slate-500">
          <div className="flex items-start gap-1.5">
            <TrendingDown className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
            <span>Overdue tasks reduce score by up to 40 points</span>
          </div>
          <div className="flex items-start gap-1.5">
            <TrendingDown className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Stale in-progress tasks reduce score by up to 30 points</span>
          </div>
          <div className="flex items-start gap-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>Completed tasks add up to 10 bonus points</span>
          </div>
        </div>
      </div>
    </div>
  );
}