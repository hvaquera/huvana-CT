/**
 * Supabase client — DISABLED.
 *
 * Control Tower reads everything from Jira + Tempo APIs directly.
 * No database needed. Project status lives in the PSA.
 *
 * To re-enable: add NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to .env.local
 * and uncomment the code below.
 */

export const supabase = null;

/*
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
*/
