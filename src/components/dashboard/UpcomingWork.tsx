'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import TaskCard from './TaskCard';
import { categorizeStatus, formatDisplayName, AREA_MAP } from '@/lib/constants';
import type { JiraIssue } from '@/types';

const DAY_OPTIONS = [5, 7, 10] as const;

interface UpcomingWorkProps {
  issues: JiraIssue[];
  showArea?: boolean;
}

export default function UpcomingWork({ issues, showArea = false }: UpcomingWorkProps) {
  const [days, setDays] = useState<number>(7);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  // Active tasks (not done, not epics, not recurring)
  const activeTasks = issues.filter((i) => {
    const s = categorizeStatus(i.fields.status.name);
    if (s === 'done' || s === 'recurring') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    return true;
  });

  // Tasks with no due date (recurring already excluded above)
  const noDueDateCount = activeTasks.filter((i) => !i.fields.duedate).length;

  // Due within window, not done, not overdue
  const upcoming = activeTasks.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate);
    due.setHours(0, 0, 0, 0);
    return due >= today && due <= futureDate;
  }).sort((a, b) => {
    return new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime();
  });

  // Group by person
  const byPerson = new Map<string, { name: string; tasks: JiraIssue[] }>();
  for (const task of upcoming) {
    // Skip tasks assigned to deactivated users
    if (task.fields.assignee?.active === false) continue;
    const name = formatDisplayName(task.fields.assignee?.displayName ?? 'Unassigned');
    const existing = byPerson.get(name);
    if (existing) {
      existing.tasks.push(task);
    } else {
      byPerson.set(name, { name, tasks: [task] });
    }
  }

  const sortedPeople = [...byPerson.entries()]
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => b.tasks.length - a.tasks.length);

  const maxTasks = sortedPeople.length > 0 ? sortedPeople[0].tasks.length : 1;

  // Area breakdown (All tab)
  const byArea = new Map<string, number>();
  if (showArea) {
    for (const task of upcoming) {
      const area = (AREA_MAP as Record<string, string>)[task.fields.project.key] ?? task.fields.project.key;
      byArea.set(area, (byArea.get(area) ?? 0) + 1);
    }
  }

  const barColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 md:p-4">
      {/* Header + Day Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-slate-700">Due in the Next</h3>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => { setDays(d); setExpandedPerson(null); }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  days === d
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        <span className={`text-2xl font-bold ${upcoming.length > 0 ? 'text-indigo-600' : 'text-green-600'}`}>
          {upcoming.length}
        </span>
      </div>

      {/* No due date nudge */}
      {noDueDateCount > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="text-xs text-amber-700">
            <span className="font-semibold">{noDueDateCount} active task{noDueDateCount !== 1 ? 's' : ''}</span> missing a due date — not shown above
          </span>
        </div>
      )}

      {/* Empty state */}
      {upcoming.length === 0 && (
        <p className="text-sm text-slate-400 py-2">
          No tasks due in the next {days} days. Clear runway.
        </p>
      )}

      {upcoming.length > 0 && (
        <>
          {/* Area breakdown chips (All tab only) */}
          {showArea && byArea.size > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[...byArea.entries()].sort((a, b) => b[1] - a[1]).map(([area, count]) => (
                <span key={area} className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                  {area}: {count}
                </span>
              ))}
            </div>
          )}

          {/* Workload bars — click to expand */}
          <div className="space-y-1.5">
            {sortedPeople.map((person, idx) => {
              const isExpanded = expandedPerson === person.key;
              const percent = Math.round((person.tasks.length / maxTasks) * 100);
              const color = barColors[idx % barColors.length];
              const isHeavy = person.tasks.length >= maxTasks * 0.7 && person.tasks.length > 2;

              return (
                <div key={person.key}>
                  <div
                    className="flex items-center gap-2 cursor-pointer group py-1"
                    onClick={() => setExpandedPerson(isExpanded ? null : person.key)}
                  >
                    <span className="text-[13px] font-medium text-slate-700 w-28 truncate group-hover:text-slate-900">
                      {person.name}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-6 text-right ${isHeavy ? 'text-red-600' : 'text-slate-500'}`}>
                      {person.tasks.length}
                    </span>
                    <span className="text-slate-300 w-4 group-hover:text-slate-500">
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-1.5 mb-3 space-y-1.5 pl-3 border-l-2 border-slate-100">
                      {person.tasks.map((task) => (
                        <TaskCard key={task.key} issue={task} showArea={showArea} compact />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
