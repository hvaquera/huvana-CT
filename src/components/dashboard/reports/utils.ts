/**
 * Shared utilities for Reports Tab components.
 *
 * Contains date range helpers, area name resolution, and chart constants
 * used across Delivery Performance, Time Intelligence, Operational Insights,
 * and Monitor sections.
 */

import { AREA_MAP } from '@/lib/constants';

// ─── Types ──────────────────────────────────────────────────────────────────

export type TimePeriod = 'week' | 'month' | 'last-month' | 'all';
export type ReportSection = 'delivery' | 'time' | 'insights' | 'monitor';

// ─── Chart Colors ───────────────────────────────────────────────────────────

export const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
export const GREEN = '#22c55e';
export const AMBER = '#f59e0b';
export const RED = '#ef4444';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Get a date range based on the selected time period. */
export function getDateRange(period: TimePeriod): { from: Date; to: Date } {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const to = new Date(now);
  switch (period) {
    case 'week': { const from = new Date(now); const day = from.getDay(); from.setDate(from.getDate() - (day === 0 ? 6 : day - 1)); return { from, to }; }
    case 'month': return { from: new Date(now.getFullYear(), now.getMonth(), 1), to };
    case 'last-month': return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
    default: return { from: new Date(2020, 0, 1), to };
  }
}

/** Resolve a Jira project key to a human-readable area name. */
export function resolveAreaName(projectKey: string): string {
  return (AREA_MAP as Record<string, string>)[projectKey] ?? projectKey;
}

/**
 * Parse "YYYY-MM-DD" as a local date to avoid UTC timezone shift.
 * Direct `new Date("2026-02-02")` interprets as UTC midnight, which can
 * shift to the previous day in US timezones. This safely creates a local date.
 */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
}
