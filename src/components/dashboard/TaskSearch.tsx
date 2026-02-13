'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import TaskCard from './TaskCard';
import { AREA_MAP, categorizeStatus } from '@/lib/constants';
import type { JiraIssue, AreaKey } from '@/types';

interface TaskSearchProps {
  tasks: JiraIssue[];
  showArea?: boolean;
  /** "all" shows top 3 per area, area tabs show top 5 */
  activeFilter: string;
}

export default function TaskSearch({ tasks, showArea = false, activeFilter }: TaskSearchProps) {
  const [query, setQuery] = useState('');

  // Search results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tasks.filter((i) =>
      i.fields.summary.toLowerCase().includes(q)
      || (i.fields.assignee?.displayName ?? '').toLowerCase().includes(q)
      || i.fields.status.name.toLowerCase().includes(q)
      || i.fields.project.key.toLowerCase().includes(q)
      || (AREA_MAP as Record<string, string>)[i.fields.project.key]?.toLowerCase().includes(q)
      || i.key.toLowerCase().includes(q),
    );
  }, [tasks, query]);

  // In Progress preview (default view when not searching)
  const inProgressPreview = useMemo(() => {
    const inProgress = tasks
      .filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress')
      .sort((a, b) => {
        const aDate = a.fields.duedate ? new Date(a.fields.duedate).getTime() : Infinity;
        const bDate = b.fields.duedate ? new Date(b.fields.duedate).getTime() : Infinity;
        return aDate - bDate;
      });

    if (activeFilter === 'all') {
      // Top 3 per area
      const byArea = new Map<string, JiraIssue[]>();
      for (const task of inProgress) {
        const key = task.fields.project.key;
        const list = byArea.get(key) ?? [];
        if (list.length < 3) list.push(task);
        byArea.set(key, list);
      }
      // Return grouped by area with labels
      const areaKeys = Object.keys(AREA_MAP) as AreaKey[];
      const groups: { area: string; areaKey: string; tasks: JiraIssue[] }[] = [];
      for (const key of areaKeys) {
        const areaTasks = byArea.get(key);
        if (areaTasks && areaTasks.length > 0) {
          groups.push({ area: AREA_MAP[key], areaKey: key, tasks: areaTasks });
        }
      }
      return { type: 'grouped' as const, groups, total: inProgress.length };
    } else {
      // Area tab: top 5
      return { type: 'flat' as const, tasks: inProgress.slice(0, 5), total: inProgress.length };
    }
  }, [tasks, activeFilter]);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, area, status, or Jira key..."
          className="w-full pl-10 pr-16 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
        />
        {hasQuery && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium px-2 py-1 rounded-md hover:bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Results */}
      {hasQuery && (
        <div className="mt-3">
          {searchResults.length > 0 ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {searchResults.map((issue) => (
                  <TaskCard key={issue.key} issue={issue} showArea={showArea} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400">No tasks match &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {/* In Progress Preview (default — no search) */}
      {!hasQuery && (
        <div className="mt-3">
          {inProgressPreview.type === 'grouped' && inProgressPreview.groups.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  In Progress
                </p>
                {inProgressPreview.total > 0 && (
                  <span className="text-[11px] text-slate-400">
                    {inProgressPreview.total} total — showing top 3 per area
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {inProgressPreview.groups.map(({ area, areaKey, tasks: areaTasks }) => (
                  <div key={areaKey}>
                    <p className="text-xs font-medium text-slate-500 mb-1.5">{area}</p>
                    <div className="space-y-1.5">
                      {areaTasks.map((issue) => (
                        <TaskCard key={issue.key} issue={issue} showArea={false} compact />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {inProgressPreview.type === 'flat' && inProgressPreview.tasks.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  In Progress
                </p>
                {inProgressPreview.total > 5 && (
                  <span className="text-[11px] text-slate-400">
                    Showing {inProgressPreview.tasks.length} of {inProgressPreview.total}
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {inProgressPreview.tasks.map((issue) => (
                  <TaskCard key={issue.key} issue={issue} showArea={showArea} />
                ))}
              </div>
            </>
          )}

          {/* No in-progress tasks */}
          {((inProgressPreview.type === 'grouped' && inProgressPreview.groups.length === 0) ||
            (inProgressPreview.type === 'flat' && inProgressPreview.tasks.length === 0)) && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-400">No tasks currently in progress</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
