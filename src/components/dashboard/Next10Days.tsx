'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TaskCard from './TaskCard';
import { categorizeStatus, NEXT_DAYS, AREA_MAP } from '@/lib/constants';
import type { JiraIssue, AreaKey } from '@/types';

interface Next10DaysProps {
  issues: JiraIssue[];
  showArea?: boolean;
}

export default function Next10Days({ issues, showArea = false }: Next10DaysProps) {
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  // Compute the next N days window
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + NEXT_DAYS);

  // Filter: has due date, due within window, not done, not overdue
  const upcoming = issues.filter((i) => {
    if (!i.fields.duedate) return false;
    if (categorizeStatus(i.fields.status.name) === 'done') return false;
    const due = new Date(i.fields.duedate);
    due.setHours(0, 0, 0, 0);
    return due >= today && due <= futureDate;
  }).sort((a, b) => {
    return new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime();
  });

  // Group by person
  const byPerson = new Map<string, { name: string; tasks: JiraIssue[] }>();
  for (const task of upcoming) {
    const name = task.fields.assignee?.displayName ?? 'Unassigned';
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

  // Group by area (for All tab)
  const byArea = new Map<string, number>();
  if (showArea) {
    for (const task of upcoming) {
      const area = (AREA_MAP as Record<string, string>)[task.fields.project.key] ?? task.fields.project.key;
      byArea.set(area, (byArea.get(area) ?? 0) + 1);
    }
  }

  // Color palette for workload bars
  const barColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">Next {NEXT_DAYS} Days</h3>
          <span className="text-2xl font-bold text-green-600">0</span>
        </div>
        <p className="text-sm text-slate-400">No tasks due in the next {NEXT_DAYS} days. Clear runway.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Next {NEXT_DAYS} Days</h3>
        <span className="text-2xl font-bold text-indigo-600">{upcoming.length}</span>
      </div>

      {/* Area breakdown (All tab only) */}
      {showArea && byArea.size > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...byArea.entries()].sort((a, b) => b[1] - a[1]).map(([area, count]) => (
            <span key={area} className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">
              {area}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Workload bars — click to expand */}
      <div className="space-y-2 mb-4">
        {sortedPeople.map((person, idx) => {
          const isExpanded = expandedPerson === person.key;
          const percent = Math.round((person.tasks.length / maxTasks) * 100);
          const color = barColors[idx % barColors.length];
          const isHeavy = person.tasks.length >= maxTasks * 0.7 && person.tasks.length > 2;

          return (
            <div key={person.key}>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setExpandedPerson(isExpanded ? null : person.key)}
              >
                <span className="text-[13px] font-medium text-slate-700 w-24 truncate group-hover:text-slate-900">
                  {person.name}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                </div>
                <span className={`text-xs font-semibold w-6 text-right ${isHeavy ? 'text-red-600' : 'text-slate-500'}`}>
                  {person.tasks.length}
                </span>
                <span className="text-slate-400 w-4">
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </span>
              </div>

              {/* Expanded: show this person's tasks */}
              {isExpanded && (
                <div className="ml-0 md:ml-26 mt-2 mb-3 space-y-1.5 pl-2 border-l-2 border-slate-100">
                  {person.tasks.map((task) => (
                    <TaskCard key={task.key} issue={task} showArea={showArea} compact />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
