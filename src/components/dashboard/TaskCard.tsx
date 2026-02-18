'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { getStatusConfig, categorizeStatus, formatDueDate, JIRA_BROWSE_URL } from '@/lib/constants';
import type { JiraIssue } from '@/types';

/** Extract plain text from Jira ADF (Atlassian Document Format) description. */
function extractDescription(desc: unknown): string | null {
  if (!desc || typeof desc !== 'object') return null;
  try {
    const doc = desc as { content?: Array<{ content?: Array<{ text?: string }> }> };
    const parts: string[] = [];
    for (const block of doc.content ?? []) {
      for (const inline of block.content ?? []) {
        if (inline.text) parts.push(inline.text);
      }
    }
    const text = parts.join(' ').trim();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

/** Calculate days since last Jira activity. Returns null if no updated field. */
function daysSinceUpdate(updated: string | undefined): number | null {
  if (!updated) return null;
  const now = new Date();
  const then = new Date(updated);
  return Math.floor((now.getTime() - then.getTime()) / 86400000);
}

const STALE_THRESHOLD_DAYS = 3;
const STALE_WARNING_DAYS = 5;

interface TaskCardProps {
  issue: JiraIssue;
  showArea?: boolean;
  compact?: boolean;
}

export default function TaskCard({ issue, showArea = false, compact = false }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = getStatusConfig(issue.fields.status.name);
  const statusCategory = categorizeStatus(issue.fields.status.name);
  const description = extractDescription(issue.fields.description);

  const dueInfo = issue.fields.duedate
    ? formatDueDate(issue.fields.duedate)
    : null;

  const isOverdue = dueInfo?.isOverdue && statusCategory !== 'done';

  // CT-5: Task Aging — flag In Progress tasks with no activity
  const staleDays = daysSinceUpdate(issue.fields.updated);
  const isStale = statusCategory === 'inProgress' && staleDays !== null && staleDays >= STALE_THRESHOLD_DAYS;
  const isVeryStale = statusCategory === 'inProgress' && staleDays !== null && staleDays >= STALE_WARNING_DAYS;

  const badgeClass: Record<string, string> = {
    inProgress: 'bg-blue-50 text-blue-700',
    todo: 'bg-slate-100 text-slate-600',
    done: 'bg-green-50 text-green-700',
    recurring: 'bg-indigo-50 text-indigo-700',
    other: 'bg-slate-100 text-slate-600',
  };

  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        isOverdue
          ? 'bg-red-50/80 border-red-200 hover:shadow-md hover:border-red-300'
          : isVeryStale
          ? 'bg-amber-50/60 border-amber-200 hover:shadow-md hover:border-amber-300'
          : 'bg-white border-slate-200 hover:shadow-md hover:border-slate-300'
      } ${compact ? 'px-3 py-2.5' : 'px-4 py-3'}`}
      onClick={() => description && setExpanded(!expanded)}
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <h4 className={`font-semibold text-slate-900 leading-snug ${compact ? 'text-[13px]' : 'text-sm'}`}>
          {issue.fields.summary}
        </h4>
        {description && (
          <span className="text-slate-400 shrink-0 mt-0.5">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        )}
      </div>

      {/* Meta Row */}
      <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
        {/* Due date */}
        {dueInfo && (
          <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
            {dueInfo.label}
          </span>
        )}

        {/* Status badge */}
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${badgeClass[statusCategory] ?? badgeClass.other}`}>
          {statusConfig.label}
        </span>

        {/* CT-5: Stale badge */}
        {isStale && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
            isVeryStale
              ? 'bg-red-50 text-red-600'
              : 'bg-amber-50 text-amber-600'
          }`}>
            <AlertCircle className="h-3 w-3" />
            No updates in {staleDays}d
          </span>
        )}

        {/* Assignee */}
        {issue.fields.assignee && (
          <span className="text-xs text-slate-500">{issue.fields.assignee.displayName}</span>
        )}

        {/* Area badge (for All tab) */}
        {showArea && (
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
            {issue.fields.project.name}
          </span>
        )}

        {/* Jira key */}
        <a
          href={`${JIRA_BROWSE_URL}/${issue.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-slate-400 hover:text-blue-600 hover:underline flex items-center gap-0.5 ml-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {issue.key}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* Expandable Description */}
      {expanded && description && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100">
          <p className="text-[13px] text-slate-600 leading-relaxed">{description}</p>
          {staleDays !== null && staleDays >= STALE_THRESHOLD_DAYS && (
            <p className="text-[11px] text-slate-400 mt-1.5">
              Last Jira activity: {staleDays} days ago
            </p>
          )}
        </div>
      )}
    </div>
  );
}
