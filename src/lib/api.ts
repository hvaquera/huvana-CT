/**
 * Shared utilities for API routes.
 * Tokens loaded from Supabase ct_workspaces table via getConfig().
 */

import type { TempoWorklog, TogglTimeEntry, TogglProject, TogglUser } from '@/types';
import { getConfig } from './config';

// ─── Dynamic config loader ────────────────────────────────────
export async function getApiConfig() {
  const config = await getConfig();
  return {
    jiraBase:    config?.jira_url    ?? process.env.JIRA_BASE_URL ?? '',
    jiraEmail:   config?.jira_email  ?? process.env.JIRA_EMAIL ?? '',
    jiraToken:   config?.jira_token  ?? process.env.JIRA_API_TOKEN ?? '',
    jiraAuth:    Buffer.from(`${config?.jira_email ?? process.env.JIRA_EMAIL ?? ''}:${config?.jira_token ?? process.env.JIRA_API_TOKEN ?? ''}`).toString('base64'),
    asanaToken:  config?.asana_token ?? process.env.ASANA_ACCESS_TOKEN ?? '',
    asanaWsGid:  config?.asana_workspace_gid ?? process.env.ASANA_WORKSPACE_GID ?? '',
    harvestToken: config?.harvest_token ?? process.env.HARVEST_ACCESS_TOKEN ?? '',
    harvestAccountId: config?.harvest_account_id ?? process.env.HARVEST_ACCOUNT_ID ?? '',
    togglToken:  config?.toggl_token ?? process.env.TOGGL_API_TOKEN ?? '',
    togglWsId:   config?.toggl_workspace_id ?? process.env.TOGGL_WORKSPACE_ID ?? '',
    githubToken: config?.github_token ?? process.env.GITHUB_TOKEN ?? '',
    githubOwner: config?.github_owner ?? process.env.GITHUB_OWNER ?? '',
    anthropicKey: config?.anthropic_key ?? process.env.ANTHROPIC_API_KEY ?? '',
  };
}

// ─── Static exports (kept for backward compat) ───────────────
export const TEMPO_BASE  = 'https://api.tempo.io/4';
export const ASANA_BASE  = 'https://app.asana.com/api/1.0';
export const TOGGL_BASE  = 'https://api.track.toggl.com/api/v9';
export const HARVEST_BASE = 'https://api.harvestapp.com/v2';

export const PM_TOOL   = process.env.NEXT_PUBLIC_PM_TOOL ?? 'jira';
export const TIME_TOOL = process.env.NEXT_PUBLIC_TIME_TOOL ?? 'harvest';

// ─── Typed Fetch ─────────────────────────────────────────────
export async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ─── Toggl ───────────────────────────────────────────────────
export async function fetchTogglUsers(token: string, wsId: string): Promise<Map<number, string>> {
  const auth = 'Basic ' + Buffer.from(`${token}:api_token`).toString('base64');
  const users = await fetchJson<TogglUser[]>(
    `${TOGGL_BASE}/workspaces/${wsId}/workspace_users`,
    { Authorization: auth },
  );
  const map = new Map<number, string>();
  for (const u of users) map.set(u.uid, u.name);
  return map;
}

export async function fetchTogglProjects(token: string, wsId: string): Promise<Map<number, TogglProject>> {
  const auth = 'Basic ' + Buffer.from(`${token}:api_token`).toString('base64');
  const projects = await fetchJson<TogglProject[]>(
    `${TOGGL_BASE}/workspaces/${wsId}/projects`,
    { Authorization: auth },
  );
  const map = new Map<number, TogglProject>();
  for (const p of projects) map.set(p.id, p);
  return map;
}

export async function fetchTogglTimeEntries(token: string, from: string, to: string): Promise<TogglTimeEntry[]> {
  const auth = 'Basic ' + Buffer.from(`${token}:api_token`).toString('base64');
  return fetchJson<TogglTimeEntry[]>(
    `${TOGGL_BASE}/me/time_entries?start_date=${from}&end_date=${to}`,
    { Authorization: auth },
  );
}

// ─── Tempo ───────────────────────────────────────────────────
export async function fetchTempoWorklogs(token: string, from: string, to: string): Promise<TempoWorklog[]> {
  const all: TempoWorklog[] = [];
  let offset = 0;
  while (true) {
    const res = await fetch(
      `${TEMPO_BASE}/worklogs?from=${from}&to=${to}&offset=${offset}&limit=1000`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    );
    if (!res.ok) break;
    const data = await res.json();
    const results = (data.results ?? []) as TempoWorklog[];
    if (!results.length) break;
    all.push(...results);
    if (results.length < 1000) break;
    offset += 1000;
  }
  return all;
}

// ─── Cache ───────────────────────────────────────────────────
interface CacheEntry<T> { data: T; expiresAt: number; }
const cache = new Map<string, CacheEntry<unknown>>();

export async function withCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() < cached.expiresAt) return cached.data;
  const data = await fetcher();
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

export const round = (n: number): number => Math.round(n * 10) / 10;
export const toDateStr = (d: Date): string => d.toISOString().split('T')[0];