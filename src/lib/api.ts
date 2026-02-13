/**
 * Shared utilities for API routes.
 *
 * Provides typed fetch helpers, in-memory caching, and constants
 * used across Jira and Tempo API integrations.
 */

import type { TempoWorklog } from '@/types';

// ─── Environment ─────────────────────────────────────────────────────────────

const JIRA_BASE_URL = process.env.JIRA_BASE_URL ?? 'https://verybigthings.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL ?? '';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN ?? '';
const TEMPO_TOKEN = process.env.TEMPO_TOKEN ?? '';

export const JIRA_AUTH = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
export const JIRA_BASE = JIRA_BASE_URL;
export const TEMPO_BASE = 'https://api.tempo.io/4';
export { TEMPO_TOKEN };

/** Internal ops Jira project keys. */
export const OPS_PROJECTS = ['VBTLEGAL', 'VBTFINANCE', 'VBTGTM', 'VBTOP'] as const;

// ─── Typed Fetch ─────────────────────────────────────────────────────────────

/**
 * Fetch JSON with typed response. Throws on non-2xx status.
 */
export async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Tempo Worklogs ──────────────────────────────────────────────────────────

/**
 * Fetch all Tempo worklogs for a date range, handling pagination automatically.
 * Returns up to ~10k worklogs per call (10 pages × 1000).
 */
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

    if (!res.ok) {
      console.error(`[Tempo] API error: ${res.status} ${res.statusText}`);
      break;
    }

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

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Simple in-memory cache with TTL.
 * Returns cached value if fresh, otherwise calls `fetcher` and caches the result.
 */
export async function withCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Round to 1 decimal place. */
export const round = (n: number): number => Math.round(n * 10) / 10;

/** Format a date as YYYY-MM-DD. */
export const toDateStr = (d: Date): string => d.toISOString().split('T')[0];
