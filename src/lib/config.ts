import { getWorkspace, CTWorkspace } from './supabase';

const WORKSPACE_EMAIL = process.env.CT_WORKSPACE_EMAIL ?? '';

let cached: CTWorkspace | null = null;
let cacheExpiry = 0;

export async function getConfig(): Promise<CTWorkspace | null> {
  if (cached && Date.now() < cacheExpiry) return cached;
  cached = await getWorkspace(WORKSPACE_EMAIL);
  cacheExpiry = Date.now() + 5 * 60 * 1000;
  return cached;
}

export function invalidateConfig() {
  cached = null;
  cacheExpiry = 0;
}