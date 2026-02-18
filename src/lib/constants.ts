import type { AreaKey, StatusCategory, StatusConfig } from '@/types';

/** Map Jira project keys → human-readable area names. */
export const AREA_MAP: Record<AreaKey, string> = {
  VBTLEGAL: 'Legal',
  VBTFINANCE: 'Finance',
  VBTGTM: 'GTM & Sales',
  VBTOP: 'Operations',
};

/** Chart color palette. */
export const CHART_COLORS = ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6'];

/** Jira base URL for issue links. */
export const JIRA_BROWSE_URL = 'https://verybigthings.atlassian.net/browse';

/** Auto-refresh interval: 1 hour. */
export const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

/** Status display configuration. */
const STATUS_CONFIG: Record<string, StatusConfig> = {
  'to do': { label: 'To Do', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  'in progress': { label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  'recurring work': { label: 'Recurring', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  'blocked': { label: 'Blocked', color: 'text-red-700', bgColor: 'bg-red-100' },
  'done': { label: 'Done', color: 'text-green-700', bgColor: 'bg-green-100' },
  'document sent': { label: 'Doc Sent', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  'docusign sent': { label: 'Docusign', color: 'text-orange-700', bgColor: 'bg-orange-100' },
};

/** Default status config for unknown statuses. */
const DEFAULT_STATUS: StatusConfig = { label: 'Unknown', color: 'text-slate-700', bgColor: 'bg-slate-100' };

/** Get display config for a Jira status name. */
export function getStatusConfig(statusName: string): StatusConfig {
  return STATUS_CONFIG[statusName.toLowerCase()] ?? { ...DEFAULT_STATUS, label: statusName };
}

/** Categorize a Jira status into a bucket for counting/sorting. */
export function categorizeStatus(statusName: string): StatusCategory {
  const s = statusName.toLowerCase();
  if (s.includes('done') || s.includes('closed') || s.includes('resolved') || s.includes('completed')) return 'done';
  if (s.includes('recurring')) return 'recurring';
  if (s.includes('blocked')) return 'blocked';
  if (
    s.includes('progress') ||
    s.includes('in review') ||
    s.includes('active') ||
    s.includes('working') ||
    s.includes('development') ||
    s.includes('design') ||
    s.includes('testing') ||
    s.includes('document sent') ||
    s.includes('docusign') ||
    s.includes('pending')
  ) return 'inProgress';
  if (s.includes('to do') || s.includes('backlog') || s.includes('not specified') || s.includes('open') || s.includes('new')) return 'todo';
  return 'other';
}

/** Time filter options for task list. */
export const TIME_FILTERS: Record<string, string> = {
  all: 'All Tasks',
  'this-week': 'This Week',
  'this-month': 'This Month',
  'due-this-week': 'Due This Week',
  'due-this-month': 'Due This Month',
};

/** Month names for display. */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Number of forward-looking days for the "Coming Up" section. */
export const NEXT_DAYS = 10;

/** Sort priority for status categories (lower = higher priority). */
export const STATUS_SORT_ORDER: Record<StatusCategory, number> = {
  inProgress: 0,
  blocked: 1,
  todo: 2,
  recurring: 3,
  other: 4,
  done: 5,
};

/**
 * Format a due date relative to today.
 * Returns "Today", "Tomorrow", "In 3 days", "Feb 18", etc.
 */
export function formatDueDate(duedate: string): { label: string; isOverdue: boolean; daysUntil: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(duedate);
  due.setHours(0, 0, 0, 0);
  const diffMs = due.getTime() - today.getTime();
  const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return { label: `${Math.abs(daysUntil)}d overdue`, isOverdue: true, daysUntil };
  if (daysUntil === 0) return { label: 'Due Today', isOverdue: false, daysUntil };
  if (daysUntil === 1) return { label: 'Due Tomorrow', isOverdue: false, daysUntil };
  return {
    label: `Due ${new Date(duedate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    isOverdue: false,
    daysUntil,
  };
}
