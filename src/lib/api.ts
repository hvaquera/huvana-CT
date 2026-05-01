/**
 * Shared utilities for API routes.
 *
 * Supports Jira + Tempo (primary) and Asana + Toggl (alternative).
 * Active integration is controlled by env vars:
 *   NEXT_PUBLIC_PM_TOOL=jira|asana
 *   NEXT_PUBLIC_TIME_TOOL=tempo|toggl
 */

import type { TempoWorklog, TogglTimeEntry, TogglProject, TogglUser } from '@/types';

// ─── Environment ─────────────────────────────────────────────────────────────

// Jira
const JIRA_BASE_URL = process.env.JIRA_BASE_URL ?? 'https://barrettventures.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL ?? '';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN ?? '';

// Tempo
const TEMPO_TOKEN_VAL = process.env.TEMPO_TOKEN ?? '';

// Asana
const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN ?? '';
const ASANA_WORKSPACE_GID = process.env.ASANA_WORKSPACE_GID ?? '';

// Toggl
const TOGGL_API_TOKEN = process.env.TOGGL_API_TOKEN ?? '';
const TOGGL_WORKSPACE_ID = process.env.TOGGL_WORKSPACE_ID ?? '';

// Active tools
export const PM_TOOL = process.env.NEXT_PUBLIC_PM_TOOL ?? 'jira';
export const TIME_TOOL = process.env.NEXT_PUBLIC_TIME_TOOL ?? 'tempo';

// Exports
export const JIRA_AUTH = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
export const JIRA_BASE = JIRA_BASE_URL;
export const TEMPO_BASE = 'https://api.tempo.io/4';
export const TEMPO_TOKEN = TEMPO_TOKEN_VAL;
export const ASANA_BASE = 'https://app.asana.com/api/1.0';
export const TOGGL_BASE = 'https://api.track.toggl.com/api/v9';
export { ASANA_ACCESS_TOKEN, ASANA_WORKSPACE_GID, TOGGL_API_TOKEN, TOGGL_WORKSPACE_ID };

/** Internal ops Jira project keys. */
export const OPS_PROJECTS = ['KAN'] as const;

/** Delivery (client-facing) Jira project keys. */
export const DELIVERY_PROJECTS = ['WWMATA'] as const;

/** All projects combined. */
export const ALL_PROJECTS = [...OPS_PROJECTS, ...DELIVERY_PROJECTS] as const;

// ─── Typed Fetch ─────────────────────────────────────────────────────────────

export async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ─── Toggl Helpers ───────────────────────────────────────────────────────────

/** Base64 auth header for Toggl API token. */
export function togglAuth(): string {
  return 'Basic ' + Buffer.from(`${TOGGL_API_TOKEN}:api_token`).toString('base64');
}

/**
 * Fetch all Toggl users in workspace → map uid → name.
 */
export async function fetchTogglUsers(): Promise<Map<number, string>> {
  const users = await fetchJson<TogglUser[]>(
    `${TOGGL_BASE}/workspaces/${TOGGL_WORKSPACE_ID}/workspace_users`,
    { Authorization: togglAuth() },
  );
  const map = new Map<number, string>();
  for (const u of users) map.set(u.uid, u.name);
  return map;
}

/**
 * Fetch all Toggl projects in workspace → map id → project.
 */
export async function fetchTogglProjects(): Promise<Map<number, TogglProject>> {
  const projects = await fetchJson<TogglProject[]>(
    `${TOGGL_BASE}/workspaces/${TOGGL_WORKSPACE_ID}/projects`,
    { Authorization: togglAuth() },
  );
  const map = new Map<number, TogglProject>();
  for (const p of projects) map.set(p.id, p);
  return map;
}

/**
 * Fetch all Toggl time entries for a date range.
 */
export async function fetchTogglTimeEntries(from: string, to: string): Promise<TogglTimeEntry[]> {
  if (!TOGGL_API_TOKEN) throw new Error('TOGGL_API_TOKEN not configured');
  return fetchJson<TogglTimeEntry[]>(
    `${TOGGL_BASE}/me/time_entries?start_date=${from}&end_date=${to}`,
    { Authorization: togglAuth() },
  );
}

// ─── Tempo Worklogs ──────────────────────────────────────────────────────────

export async function fetchTempoWorklogs(from: string, to: string): Promise<TempoWorklog[]> {
  if (!TEMPO_TOKEN) throw new Error('TEMPO_TOKEN not configured');
  const all: TempoWorklog[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const url = `${TEMPO_BASE}/worklogs?from=${from}&to=${to}&offset=${offset}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TEMPO_TOKEN}`, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) { console.error(`[Tempo] API error: ${res.status}`); break; }
    const data = await res.json();
    const results = (data.results ?? []) as TempoWorklog[];
    if (results.length === 0) break;
    all.push(...results);
    if (results.length < limit) break;
    offset += limit;
  }
  return all;
}

// ─── In-Memory Cache ─────────────────────────────────────────────────────────

interface CacheEntry<T> { data: T; expiresAt: number; }
const cache = new Map<string, CacheEntry<unknown>>();

export async function withCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() < cached.expiresAt) return cached.data;
  const data = await fetcher();
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const round = (n: number): number => Math.round(n * 10) / 10;
export const toDateStr = (d: Date): string => d.toISOString().split('T')[0];
