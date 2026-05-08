'use client';

import { useMemo, useState } from 'react';
import { User, GitCommit, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { categorizeStatus } from '@/lib/constants';
import type { JiraIssue } from '@/types';

interface PeoplePerformanceTabProps {
  issues: JiraIssue[];
  timeActuals: any;
  githubData: any;
}

interface PersonProfile {
  name: string;
  email: string;
  totalTasks: number;
  doneTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  staleTasks: number;
  projects: string[];
  hoursLogged: number;
  commits: number;
  commitsPerWeek: number;
  repos: string[];
  lastActive: string | null;
  score: number;
  risk: 'strong' | 'steady' | 'watch';
}

export default function PeoplePerformanceTab({ issues, timeActuals, githubData }: PeoplePerformanceTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const people = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Group tasks by person
    const personMap = new Map<string, PersonProfile>();

    for (const issue of issues) {
      const assignee = issue.fields.assignee;
      if (!assignee) continue;
      const name = assignee.displayName;
      const email = assignee.accountId ?? name;

      if (!personMap.has(name)) {
        personMap.set(name, {
          name,
          email,
          totalTasks: 0,
          doneTasks: 0,
          overdueTasks: 0,
          inProgressTasks: 0,
          staleTasks: 0,
          projects: [],
          hoursLogged: 0,
          commits: 0,
          commitsPerWeek: 0,
          repos: [],
          lastActive: null,
          score: 0,
          risk: 'steady',
        });
      }

      const p = personMap.get(name)!;
      p.totalTasks++;

      const status = categorizeStatus(issue.fields.status.name);
      if (status === 'done') p.doneTasks++;
      if (status === 'inProgress') p.inProgressTasks++;

      // Overdue
      if (issue.fields.duedate) {
        const due = new Date(issue.fields.duedate);
        due.setHours(0, 0, 0, 0);
        if (due < now && status !== 'done') p.overdueTasks++;
      }

      // Stale
      if (status === 'inProgress' && issue.fields.updated) {
        const daysSince = Math.floor((Date.now() - new Date(issue.fields.updated).getTime()) / 86400000);
        if (daysSince >= 3) p.staleTasks++;
      }

      // Projects
      const projName = issue.fields.project.name;
      if (!p.projects.includes(projName)) p.projects.push(projName);
    }

    // Merge time actuals
    for (const person of (timeActuals?.people ?? [])) {
      // Match by name (fuzzy)
      const match = Array.from(personMap.values()).find(p =>
        p.name.toLowerCase().includes(person.name.toLowerCase().split(' ')[0]) ||
        person.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
      );
      if (match) {
        match.hoursLogged = person.totalHours ?? 0;
      }
    }

    // Merge GitHub data
    for (const repo of (githubData?.repos ?? [])) {
      for (const contributor of (repo.people ?? [])) {
        const match = Array.from(personMap.values()).find(p =>
          p.name.toLowerCase().includes(contributor.name.toLowerCase().split(' ')[0]) ||
          contributor.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
        );
        if (match) {
          match.commits += contributor.commits ?? 0;
          match.commitsPerWeek += contributor.commitsPerWeek ?? 0;
          if (!match.repos.includes(repo.repo)) match.repos.push(repo.repo);
          if (contributor.daysSinceLastCommit !== null) {
            const lastCommitDate = new Date(Date.now() - (contributor.daysSinceLastCommit * 86400000));
            match.lastActive = lastCommitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        }
      }
    }

    // Calculate score per person
    for (const p of personMap.values()) {
      let score = 70; // baseline
      if (p.totalTasks > 0) {
        score -= Math.round((p.overdueTasks / p.totalTasks) * 30);
        score -= Math.round((p.staleTasks / p.totalTasks) * 20);
        score += Math.round((p.doneTasks / p.totalTasks) * 15);
      }
      if (p.hoursLogged === 0 && p.totalTasks > 0) score -= 15;
      if (p.commits > 10) score += 10;
      score = Math.max(0, Math.min(100, score));
      p.score = score;
      p.risk = score >= 75 ? 'strong' : score >= 50 ? 'steady' : 'watch';
    }

    return Array.from(personMap.values()).sort((a, b) => b.score - a.score);
  }, [issues, timeActuals, githubData]);

  const riskConfig = {
    strong: { label: 'Strong', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
    steady: { label: 'Steady', color: 'text-blue-600',    bg: 'bg-blue-100',    dot: 'bg-blue-500' },
    watch:  { label: 'Watch',  color: 'text-amber-600',   bg: 'bg-amber-100',   dot: 'bg-amber-500' },
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">People Performance</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tasks · Time · Code — unified view per engineer</p>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all capitalize ${
                period === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Team summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{people.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Active Engineers</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {people.filter(p => p.risk === 'strong').length}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Performing Strong</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {people.filter(p => p.risk === 'watch').length}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Need Attention</div>
        </div>
      </div>

      {/* Person cards */}
      {people.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
          No assignees found. Assign tasks in Jira or Asana to see performance data.
        </div>
      ) : (
        people.map(person => {
          const cfg = riskConfig[person.risk];
          const isExpanded = expanded === person.name;

          return (
            <div key={person.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Person header */}
              <div
                onClick={() => setExpanded(isExpanded ? null : person.name)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{person.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">{person.projects.join(', ') || 'No projects'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-slate-900">{person.totalTasks}</div>
                    <div className="text-[10px] text-slate-400">tasks</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-indigo-600">{person.hoursLogged}h</div>
                    <div className="text-[10px] text-slate-400">logged</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-slate-700">{person.commits}</div>
                    <div className="text-[10px] text-slate-400">commits</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      person.score >= 75 ? 'text-emerald-600' : person.score >= 50 ? 'text-blue-600' : 'text-amber-600'
                    }`}>{person.score}</div>
                    <div className="text-[10px] text-slate-400">score</div>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 text-slate-400" />
                    : <ChevronDown className="h-4 w-4 text-slate-400" />
                  }
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] text-slate-500 font-medium">COMPLETED</span>
                      </div>
                      <div className="text-xl font-bold text-emerald-600">{person.doneTasks}</div>
                      <div className="text-[10px] text-slate-400">
                        {person.totalTasks > 0 ? Math.round((person.doneTasks / person.totalTasks) * 100) : 0}% of total
                      </div>
                    </div>

                    <div className={`bg-white rounded-lg p-3 border ${person.overdueTasks > 0 ? 'border-red-200' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle className={`h-3 w-3 ${person.overdueTasks > 0 ? 'text-red-500' : 'text-slate-300'}`} />
                        <span className="text-[10px] text-slate-500 font-medium">OVERDUE</span>
                      </div>
                      <div className={`text-xl font-bold ${person.overdueTasks > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {person.overdueTasks}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {person.staleTasks} stale in-progress
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3 w-3 text-indigo-500" />
                        <span className="text-[10px] text-slate-500 font-medium">TIME LOGGED</span>
                      </div>
                      <div className="text-xl font-bold text-indigo-600">{person.hoursLogged}h</div>
                      <div className="text-[10px] text-slate-400">
                        {person.hoursLogged === 0 ? '⚠️ No time tracked' : 'this month'}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <GitCommit className="h-3 w-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500 font-medium">CODE ACTIVITY</span>
                      </div>
                      <div className="text-xl font-bold text-slate-700">{person.commits}</div>
                      <div className="text-[10px] text-slate-400">
                        {person.commits > 0 ? `${person.commitsPerWeek.toFixed(1)}/week avg` : 'No commits tracked'}
                      </div>
                    </div>
                  </div>

                  {/* Repos */}
                  {person.repos.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium mb-1.5">ACTIVE REPOSITORIES</p>
                      <div className="flex flex-wrap gap-1.5">
                        {person.repos.map(repo => (
                          <span key={repo} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg">
                            {repo.split('/')[1] ?? repo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Performance bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-slate-400 font-medium">PERFORMANCE SCORE</p>
                      <span className="text-xs font-bold text-slate-700">{person.score}/100</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          person.score >= 75 ? 'bg-emerald-500' : person.score >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${person.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Last active */}
                  {person.lastActive && (
                    <p className="text-xs text-slate-400">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Last commit: {person.lastActive}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}