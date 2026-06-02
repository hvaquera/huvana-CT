'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { getStatusConfig, categorizeStatus, formatDueDate, formatDisplayName, JIRA_BROWSE_URL } from '@/lib/constants';
import type { JiraIssue } from '@/types';

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
  } catch { return null; }
}

function daysSinceUpdate(updated: string | undefined): number | null {
  if (!updated) return null;
  return Math.floor((new Date().getTime() - new Date(updated).getTime()) / 86400000);
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

  const statusCategory = categorizeStatus(issue.fields.status.name);
  const description = extractDescription(issue.fields.description);
  const dueInfo = issue.fields.duedate ? formatDueDate(issue.fields.duedate) : null;
  const isOverdue = dueInfo?.isOverdue && statusCategory !== 'done';
  const staleDays = daysSinceUpdate(issue.fields.updated);
  const isStale = statusCategory === 'inProgress' && staleDays !== null && staleDays >= STALE_THRESHOLD_DAYS;
  const isVeryStale = statusCategory === 'inProgress' && staleDays !== null && staleDays >= STALE_WARNING_DAYS;

  const statusLabels: Record<string, string> = {
    inProgress: 'In Progress',
    todo: 'To Do',
    done: 'Done',
    recurring: 'Recurring',
    other: 'Other',
  };

  const statusStyles: Record<string, string> = {
    inProgress: 'chip chip-indigo',
    todo: 'chip chip-gray',
    done: 'chip chip-green',
    recurring: 'chip chip-indigo',
    other: 'chip chip-gray',
  };

  const isAsana = /^\d{16,}$/.test(issue.key);
  const taskHref = isAsana
    ? `https://app.asana.com/0/${issue.fields.project.key}/${issue.key}`
    : `${JIRA_BROWSE_URL}/${issue.key}`;
  const taskLabel = isAsana ? issue.fields.project.name : issue.key;

  return (
    <div
      className={`card-base transition-all cursor-pointer ${
        isOverdue ? 'border-red-200' : isVeryStale ? 'border-amber-200' : ''
      } ${compact ? '' : 'card-lift'}`}
      style={isOverdue ? { background: '#fff9f9' } : isVeryStale ? { background: '#fffbeb' } : { background: '#fff' }}
      onClick={() => description && setExpanded(!expanded)}
    >
      <div className={compact ? 'px-3 py-2.5' : 'px-4 py-3'}>
        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-[13px] leading-snug" style={{ color: 'var(--foreground)' }}>
            {issue.fields.summary}
          </h4>
          {description && (
            <span className="text-slate-400 shrink-0 mt-0.5">
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-1.5">
          {dueInfo && (
            <span className={`text-[11px] font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
              {dueInfo.label}
            </span>
          )}

          <span className={statusStyles[statusCategory] ?? 'chip chip-gray'}>
            {statusLabels[statusCategory] ?? statusCategory}
          </span>

          {isStale && (
            <span className={`chip ${isVeryStale ? 'chip-red' : 'chip-amber'} flex items-center gap-0.5`}>
              <AlertCircle className="h-2.5 w-2.5" />
              No updates in {staleDays}d
            </span>
          )}

          {issue.fields.assignee && (
            <span className="text-[11px] text-slate-400">
              {formatDisplayName(issue.fields.assignee.displayName)}
            </span>
          )}

          {showArea && (
            <span className="chip chip-gray">{issue.fields.project.name}</span>
          )}

          <a
            href={taskHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-slate-400 hover:text-indigo-600 hover:underline flex items-center gap-0.5 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {taskLabel}
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>

        {/* Description */}
        {expanded && description && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-100">
            <p className="text-[13px] leading-relaxed text-slate-600">{description}</p>
            {staleDays !== null && staleDays >= STALE_THRESHOLD_DAYS && (
              <p className="text-[11px] text-slate-400 mt-1.5">Last activity: {staleDays} days ago</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
