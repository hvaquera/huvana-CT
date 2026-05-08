'use client';

import { useMemo, useState } from 'react';
import { User, GitCommit, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, TrendingUp, Heart } from 'lucide-react';
import { categorizeStatus } from '@/lib/constants';
import type { JiraIssue } from '@/types';

interface PeoplePerformanceTabProps {
  issues: JiraIssue[];
  timeActuals: any;
  githubData: any;
}

interface PersonProfile {
  name: string;
  displayName: string;
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
  sentiment: number; // 1-5
  sentimentTrend: 'up' | 'down' | 'stable';
  sentimentNote: string;
}

// Normalize any name format to "First Last"
function normalizeName(raw: string): string {
  if (!raw) return '';
  // Email → take local part before @
  if (raw.includes('@')) {
    const local = raw.split('@')[0];
    return local.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
  }
  // Already has space → proper case
  if (raw.includes(' ')) {
    return raw.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  // dot-separated without @
  if (raw.includes('.')) {
    return raw.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
  }
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Check if two names refer to the same person
function namesMatch(a: string, b: string): boolean {
  const na = normalizeName(a).toLowerCase();
  const nb = normalizeName(b).toLowerCase();
  if (na === nb) return true;
  // Check if first names match (at least)
  const [fa] = na.split(' ');
  const [fb] = nb.split(' ');
  return fa.length > 2 && fa === fb;
}

// Hardcoded sentiment data — replace with Slack bot survey data when available
const SENTIMENT_DATA: Record<string, { score: number; trend: 'up' | 'down' | 'stable'; note: string }> = {
  'Hugo Vaquera': { score: 4.2, trend: 'up', note: 'Energized by new tooling work this sprint' },
  'hugo': { score: 4.2, trend: 'up', note: 'Energized by new tooling work this sprint' },
};

function getSentiment(name: string) {
  const normalized = normalizeName(name);
  return SENTIMENT_DATA[normalized] ?? SENTIMENT_DATA[name] ?? {
    score: 3.8,
    trend: 'stable' as const,
    note: 'Weekly pulse not yet connected — Slack bot coming soon',
  };
}

const sentimentEmoji = (score: number) => {
  if (score >= 4.5) return '😄';
  if (score >= 3.5) return '🙂';
  if (score >= 2.5) return '😐';
  return '😟';
};

export default function PeoplePerformanceTab({ issues, timeActuals, githubData }: PeoplePerformanceTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const people = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const personMap = new Map<string, PersonProfile>();

    // Helper to get or create person by raw name
    const getOrCreate = (rawName: string): PersonProfile | null => {
      if (!rawName) return null;
      const displayName = normalizeName(rawName);
      if (!displayName) return null;

      // Check if this person already exists under a different key
      for (const [key, p] of personMap) {
        if (namesMatch(key, rawName) || namesMatch(p.displayName, rawName)) {
          return p;
        }
      }

      const sentiment = getSentiment(rawName);
      const profile: PersonProfile = {
        name: rawName,
        displayName,
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
        sentiment: sentiment.score,
        sentimentTrend: sentiment.trend,
        sentimentNote: sentiment.note,
      };
      personMap.set(displayName, profile);
      return profile;
    };

    // 1. Tasks from Jira/Asana
    for (const issue of issues) {
      const assignee = issue.fields.assignee;
      if (!assignee) continue;
      const p = getOrCreate(assignee.displayName);
      if (!p) continue;

      p.totalTasks++;
      const status = categorizeStatus(issue.fields.status.name);
      if (status === 'done') p.doneTasks++;
      if (status === 'inProgress') p.inProgressTasks++;

      if (issue.fields.duedate) {
        const due = new Date(issue.fields.duedate);
        due.setHours(0, 0, 0, 0);
        if (due < now && status !== 'done') p.overdueTasks++;
      }

      if (status === 'inProgress' && issue.fields.updated) {
        const daysSince = Math.floor((Date.now() - new Date(issue.fields.updated).getTime()) / 86400000);
        if (daysSince >= 3) p.staleTasks++;
      }

      const projName = issue.fields.project.name;
      if (projName && !p.projects.includes(projName)) p.projects.push(projName);
    }

    // 2. Time actuals — try to match from any source
    const timePeople = timeActuals?.people ?? [];
    for (const tp of timePeople) {
      let matched = false;
      for (const p of personMap.values()) {
        if (namesMatch(p.name, tp.name) || namesMatch(p.displayName, tp.name)) {
          p.hoursLogged = Math.max(p.hoursLogged, tp.totalHours ?? 0);
          matched = true;
          break;
        }
      }
      // If no task match but person has hours — add them
      if (!matched && tp.totalHours > 0) {
        const p = getOrCreate(tp.name);
        if (p) p.hoursLogged = tp.totalHours;
      }
    }

    // 3. GitHub data
    for (const repo of (githubData?.repos ?? [])) {
      for (const contributor of (repo.people ?? [])) {
        let matched = false;
        for (const p of personMap.values()) {
          if (namesMatch(p.name, contributor.name) || namesMatch(p.displayName, contributor.name)) {
            p.commits += contributor.commits ?? 0;
            p.commitsPerWeek += contributor.commitsPerWeek ?? 0;
            if (!p.repos.includes(repo.repo)) p.repos.push(repo.repo);
            if (contributor.daysSinceLastCommit !== null) {
              const lastCommitDate = new Date(Date.now() - (contributor.daysSinceLastCommit * 86400000));
              p.lastActive = lastCommitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            matched = true;
            break;
          }
        }
        if (!matched && (contributor.commits ?? 0) > 0) {
          const p = getOrCreate(contributor.name);
          if (p) {
            p.commits = contributor.commits ?? 0;
            p.commitsPerWeek = contributor.commitsPerWeek ?? 0;
            if (!p.repos.includes(repo.repo)) p.repos.push(repo.repo);
          }
        }
      }
    }

    // 4. Score each person
    for (const p of personMap.values()) {
      let score = 70;
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
          <p className="text-xs text-slate-400 mt-0.5">Tasks · Time · Code · Sentiment — unified view per engineer</p>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`text-xs px-2.5 py-1 rounded-md transition-all capitalize ${period === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Sentiment coming soon banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-violet-500" />
          <div>
            <span className="text-xs font-semibold text-violet-800">Team Pulse — Sentiment Tracking</span>
            <p className="text-[10px] text-violet-500 mt-0.5">Weekly Slack bot survey · Anonymous · 2 questions · Friday PM</p>
          </div>
        </div>
        <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-1 rounded-full font-medium">🔜 Connecting Slack Bot</span>
      </div>

      {/* Team summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{people.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Active Engineers</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{people.filter(p => p.risk === 'strong').length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Performing Strong</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{people.filter(p => p.risk === 'watch').length}</div>
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
          const isExpanded = expanded === person.displayName;

          return (
            <div key={person.displayName} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div onClick={() => setExpanded(isExpanded ? null : person.displayName)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{person.displayName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      {/* Sentiment pill */}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 font-medium">
                        {sentimentEmoji(person.sentiment)} {person.sentiment.toFixed(1)}
                        {person.sentimentTrend === 'up' ? ' ↑' : person.sentimentTrend === 'down' ? ' ↓' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{person.projects.join(', ') || 'No projects assigned'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-slate-900">{person.totalTasks}</div>
                    <div className="text-[10px] text-slate-400">tasks</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-indigo-600">{person.hoursLogged > 0 ? `${person.hoursLogged}h` : '—'}</div>
                    <div className="text-[10px] text-slate-400">logged</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-slate-700">{person.commits > 0 ? person.commits : '—'}</div>
                    <div className="text-[10px] text-slate-400">commits</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${person.score >= 75 ? 'text-emerald-600' : person.score >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>{person.score}</div>
                    <div className="text-[10px] text-slate-400">score</div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </div>

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
                      <div className="text-[10px] text-slate-400">{person.totalTasks > 0 ? Math.round((person.doneTasks / person.totalTasks) * 100) : 0}% of total</div>
                    </div>

                    <div className={`bg-white rounded-lg p-3 border ${person.overdueTasks > 0 ? 'border-red-200' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle className={`h-3 w-3 ${person.overdueTasks > 0 ? 'text-red-500' : 'text-slate-300'}`} />
                        <span className="text-[10px] text-slate-500 font-medium">OVERDUE</span>
                      </div>
                      <div className={`text-xl font-bold ${person.overdueTasks > 0 ? 'text-red-600' : 'text-slate-400'}`}>{person.overdueTasks}</div>
                      <div className="text-[10px] text-slate-400">{person.staleTasks} stale in-progress</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3 w-3 text-indigo-500" />
                        <span className="text-[10px] text-slate-500 font-medium">TIME LOGGED</span>
                      </div>
                      <div className="text-xl font-bold text-indigo-600">{person.hoursLogged > 0 ? `${person.hoursLogged}h` : '—'}</div>
                      <div className="text-[10px] text-slate-400">{person.hoursLogged === 0 ? '⚠️ No time tracked' : 'this month'}</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <GitCommit className="h-3 w-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500 font-medium">CODE ACTIVITY</span>
                      </div>
                      <div className="text-xl font-bold text-slate-700">{person.commits > 0 ? person.commits : '—'}</div>
                      <div className="text-[10px] text-slate-400">{person.commits > 0 ? `${person.commitsPerWeek.toFixed(1)}/week avg` : 'No commits tracked'}</div>
                    </div>
                  </div>

                  {/* Sentiment detail */}
                  <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3 w-3 text-violet-500" />
                        <span className="text-[10px] text-violet-700 font-semibold">TEAM PULSE</span>
                      </div>
                      <span className="text-sm font-bold text-violet-700">
                        {sentimentEmoji(person.sentiment)} {person.sentiment.toFixed(1)}/5
                        <span className="text-[10px] ml-1">{person.sentimentTrend === 'up' ? '↑ improving' : person.sentimentTrend === 'down' ? '↓ declining' : '→ stable'}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-violet-600 italic">&quot;{person.sentimentNote}&quot;</p>
                    <div className="mt-2 h-1.5 bg-violet-200 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(person.sentiment / 5) * 100}%` }} />
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
                      <div className={`h-full rounded-full ${person.score >= 75 ? 'bg-emerald-500' : person.score >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${person.score}%` }} />
                    </div>
                  </div>

                  {person.lastActive && (
                    <p className="text-xs text-slate-400"><TrendingUp className="h-3 w-3 inline mr-1" />Last commit: {person.lastActive}</p>
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