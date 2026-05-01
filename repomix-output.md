This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
public/
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
src/
  app/
    api/
      auth/
        [...nextauth]/
          route.ts
      jira/
        delivery/
          route.ts
        delivery-all/
          route.ts
        route.ts
      projects/
        status/
          route.ts
        route.ts
      slack/
        digest/
          route.ts
      tempo/
        actuals/
          route.ts
        route.ts
    auth/
      signin/
        page.tsx
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard/
      reports/
        ReportCard.tsx
        utils.ts
      DeliveryTab.tsx
      KPIsTab.tsx
      LoadingProgress.tsx
      Next10Days.tsx
      OpsDetails.tsx
      OverdueBlock.tsx
      ReportsTab.tsx
      TaskCard.tsx
      TaskSearch.tsx
      TimeActualsTab.tsx
      UpcomingWork.tsx
    ui/
      badge.tsx
      button.tsx
      card.tsx
      select.tsx
      tabs.tsx
    Providers.tsx
  lib/
    api.ts
    auth.ts
    constants.ts
    supabase.ts
    utils.ts
  types/
    index.ts
supabase/
  migrations/
    001_project_status.sql
    002_psa_compatible_schema.sql
  notion_export.csv
  seed_data.sql
  seed.ts
.gitignore
components.json
eslint.config.mjs
middleware.ts
next.config.ts
package.json
postcss.config.mjs
README.md
route.ts
tsconfig.json
vercel.json
```

# Files

## File: public/file.svg
````xml
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: src/app/api/auth/[...nextauth]/route.ts
````typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
````

## File: src/app/api/projects/status/route.ts
````typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/projects/status
 * Submit a weekly status update for a project.
 * Upserts on (project_id, week_of) so PMs can edit their update within the same week.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_id, status, update_note, next_milestone, blockers, updated_by } = body;

    if (!project_id || !status || !updated_by) {
      return NextResponse.json(
        { error: 'project_id, status, and updated_by are required' },
        { status: 400 },
      );
    }

    if (!['green', 'yellow', 'red'].includes(status)) {
      return NextResponse.json({ error: 'status must be green, yellow, or red' }, { status: 400 });
    }

    // Calculate Monday of current week
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const weekOf = monday.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('project_status_updates')
      .upsert(
        {
          project_id,
          week_of: weekOf,
          status,
          update_note: update_note || '',
          next_milestone: next_milestone || null,
          blockers: blockers || null,
          updated_by,
        },
        { onConflict: 'project_id,week_of' },
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ update: data });
  } catch (error) {
    console.error('[ProjectStatus] POST error:', error);
    return NextResponse.json({ error: 'Failed to submit status update' }, { status: 500 });
  }
}
````

## File: src/app/api/projects/route.ts
````typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface ProjectWithStatus {
  id: string;
  name: string;
  owner: string;
  phase: string;
  jira_key: string | null;
  client_name: string | null;
  type: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  rate: number | null;
  current_status: 'green' | 'yellow' | 'red' | null;
  update_note: string | null;
  next_milestone: string | null;
  blockers: string | null;
  last_updated: string | null;
  updated_by: string | null;
  status_history: { week_of: string; status: 'green' | 'yellow' | 'red' }[];
}

/**
 * GET /api/projects
 * Returns all projects from Supabase with current status and 12-week history.
 * Projects are managed in Supabase (seeded from PSA / Notion), NOT auto-synced from Jira.
 */
export async function GET() {
  try {
    // Get all projects with client name
    const { data: projects, error: projErr } = await supabase
      .from('projects')
      .select('*, clients(name)')
      .order('name');

    if (projErr) throw projErr;
    if (!projects || projects.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // Get current status per project
    const { data: currentStatuses, error: csErr } = await supabase
      .from('project_current_status')
      .select('*');

    if (csErr) throw csErr;

    // Get status history (last 12 weeks)
    const { data: history, error: histErr } = await supabase
      .from('project_status_history')
      .select('*');

    if (histErr) throw histErr;

    // Build maps
    const currentMap = new Map<string, (typeof currentStatuses)[0]>();
    for (const cs of currentStatuses ?? []) {
      currentMap.set(cs.project_id, cs);
    }

    const historyMap = new Map<string, { week_of: string; status: string }[]>();
    for (const h of history ?? []) {
      if (!historyMap.has(h.project_id)) historyMap.set(h.project_id, []);
      historyMap.get(h.project_id)!.push({ week_of: h.week_of, status: h.status });
    }

    // Merge
    const result: ProjectWithStatus[] = projects.map((p: Record<string, unknown>) => {
      const cs = currentMap.get(p.id as string);
      const clientData = p.clients as { name: string } | null;
      return {
        id: p.id as string,
        name: p.name as string,
        owner: (p.owner as string) ?? 'Unassigned',
        phase: p.status as string,
        jira_key: p.jira_key as string | null,
        client_name: clientData?.name ?? null,
        type: p.type as string,
        start_date: p.start_date as string | null,
        end_date: p.end_date as string | null,
        budget: p.budget as number | null,
        rate: p.rate as number | null,
        current_status: (cs?.status as 'green' | 'yellow' | 'red') ?? null,
        update_note: cs?.update_note ?? null,
        next_milestone: cs?.next_milestone ?? null,
        blockers: cs?.blockers ?? null,
        last_updated: cs?.updated_at ?? null,
        updated_by: cs?.updated_by ?? null,
        status_history: (historyMap.get(p.id as string) ?? []) as ProjectWithStatus['status_history'],
      };
    });

    return NextResponse.json({ projects: result });
  } catch (error) {
    console.error('[Projects] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * Manually create a project (for non-Jira projects).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, owner, type, status, jira_key, client_id } = body;

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        owner: owner || 'Unassigned',
        type: type || 'hourly',
        status: status || 'active',
        jira_key: jira_key || null,
        client_id: client_id || null,
        start_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error('[Projects] POST error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
````

## File: src/app/api/tempo/route.ts
````typescript
import { NextResponse } from 'next/server';
import { fetchTempoWorklogs, OPS_PROJECTS, round, toDateStr } from '@/lib/api';
import type { OpsTempoResponse, OpsAreaHours, OpsPersonHours } from '@/types';

/** Compute Monday-based week and month boundaries. */
function getDateRange() {
  const now = new Date();

  // This week (Monday → Sunday)
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    weekStart: toDateStr(weekStart),
    weekEnd: toDateStr(weekEnd),
    monthStart: toDateStr(monthStart),
    today: toDateStr(now),
  };
}

interface NormalizedWorklog {
  date: string;
  authorAccountId: string;
  authorName: string;
  issueKey: string | null;
  projectKey: string | null;
  hours: number;
}

export async function GET() {
  try {
    const dates = getDateRange();
    const rawWorklogs = await fetchTempoWorklogs(dates.monthStart, dates.today);

    // Normalize and filter to ops projects
    const opsWorklogs: NormalizedWorklog[] = rawWorklogs
      .map((wl) => {
        const issueKey = wl.issue?.key ?? null;
        return {
          date: wl.startDate,
          authorAccountId: wl.author?.accountId ?? 'unknown',
          authorName: wl.author?.displayName ?? 'Unknown',
          issueKey,
          projectKey: issueKey?.split('-')[0] ?? null,
          hours: (wl.timeSpentSeconds ?? 0) / 3600,
        };
      })
      .filter((w) => w.projectKey !== null && OPS_PROJECTS.includes(w.projectKey as (typeof OPS_PROJECTS)[number]));

    // Aggregate by area, person, and issue
    const byArea: Record<string, { month: number; week: number }> = {};
    for (const proj of OPS_PROJECTS) byArea[proj] = { month: 0, week: 0 };

    const byPerson = new Map<string, { name: string; month: number; week: number }>();
    const byIssue = new Map<string, { month: number; week: number }>();

    for (const wl of opsWorklogs) {
      const isThisWeek = wl.date >= dates.weekStart && wl.date <= dates.weekEnd;

      // Area
      if (byArea[wl.projectKey!]) {
        byArea[wl.projectKey!].month += wl.hours;
        if (isThisWeek) byArea[wl.projectKey!].week += wl.hours;
      }

      // Person
      const existing = byPerson.get(wl.authorAccountId);
      if (existing) {
        existing.month += wl.hours;
        if (isThisWeek) existing.week += wl.hours;
      } else {
        byPerson.set(wl.authorAccountId, {
          name: wl.authorName,
          month: wl.hours,
          week: isThisWeek ? wl.hours : 0,
        });
      }

      // Issue
      if (wl.issueKey) {
        const issueEntry = byIssue.get(wl.issueKey);
        if (issueEntry) {
          issueEntry.month += wl.hours;
          if (isThisWeek) issueEntry.week += wl.hours;
        } else {
          byIssue.set(wl.issueKey, { month: wl.hours, week: isThisWeek ? wl.hours : 0 });
        }
      }
    }

    // Format response
    const areaHours: OpsAreaHours[] = Object.entries(byArea).map(([key, val]) => ({
      projectKey: key,
      monthHours: round(val.month),
      weekHours: round(val.week),
    }));

    const personHours: OpsPersonHours[] = [...byPerson.entries()]
      .map(([id, val]) => ({ accountId: id, name: val.name, monthHours: round(val.month), weekHours: round(val.week) }))
      .sort((a, b) => b.monthHours - a.monthHours);

    const issueHours: Record<string, { monthHours: number; weekHours: number }> = {};
    for (const [key, val] of byIssue) {
      issueHours[key] = { monthHours: round(val.month), weekHours: round(val.week) };
    }

    const totalMonth = round(opsWorklogs.reduce((s, w) => s + w.hours, 0));
    const totalWeek = round(opsWorklogs.filter((w) => w.date >= dates.weekStart && w.date <= dates.weekEnd).reduce((s, w) => s + w.hours, 0));

    const response: OpsTempoResponse = { totalMonth, totalWeek, areaHours, personHours, issueHours, dates };
    return NextResponse.json(response);
  } catch (error) {
    console.error('[Tempo/Ops] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Tempo data' }, { status: 500 });
  }
}
````

## File: src/app/auth/signin/page.tsx
````typescript
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            VBT Control Tower
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Sign in with your VBT Google account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error === 'AccessDenied'
              ? 'Access restricted to @verybigthings.com accounts.'
              : 'Something went wrong. Please try again.'}
          </div>
        )}

        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-slate-400 text-center mt-6">
          Only @verybigthings.com accounts are allowed.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
````

## File: src/app/globals.css
````css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
````

## File: src/components/dashboard/reports/ReportCard.tsx
````typescript
import React from 'react';

interface ReportCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}

export default function ReportCard({ title, subtitle, children, icon: Icon, action }: ReportCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function StatPill({ label, value, color, sub }: { label: string; value: number | string; color?: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
      <div className={`text-xl font-bold ${color ?? 'text-slate-700'}`}>{value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}
````

## File: src/components/dashboard/reports/utils.ts
````typescript
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
````

## File: src/components/dashboard/KPIsTab.tsx
````typescript
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Zap, Clock, Snowflake, BarChart3, Gauge, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { categorizeStatus, AREA_MAP } from '@/lib/constants';
import LoadingProgress from './LoadingProgress';
import type { JiraIssue, ActualsResponse } from '@/types';

const JIRA_BROWSE_URL = 'https://verybigthings.atlassian.net/browse';

interface KPIsTabProps {
  jiraIssues: JiraIssue[];
}

type TimePeriod = 'week' | 'month' | 'lastMonth';

function resolveAreaName(projectKey: string): string {
  return AREA_MAP[projectKey as keyof typeof AREA_MAP] ?? projectKey;
}

function formatDisplayName(name: string): string {
  if (!name) return '';
  return name.replace(/\s*\[.*?\]\s*/g, '').replace(/\(.*?\)/g, '').trim();
}

// ─── KPI Computation ──────────────────────────────────────────

interface KPIValue {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'flat';
  trendPercent: number;
  status: 'green' | 'yellow' | 'red';
  label: string;
  detail?: string;
}

interface AreaKPIs {
  area: string;
  executionVelocity: KPIValue;
  avgCycleTime: KPIValue;
  staleRatio: KPIValue;
  timesheetCompliance: KPIValue;
  responsiveness: KPIValue;
  commitmentReliability: KPIValue;
}

function computeKPI(current: number, previous: number, thresholds: { green: (v: number) => boolean; yellow: (v: number) => boolean }, label: string, invertTrend?: boolean, detail?: string): KPIValue {
  const diff = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const absDiff = Math.abs(diff);
  let trend: 'up' | 'down' | 'flat' = absDiff < 3 ? 'flat' : diff > 0 ? 'up' : 'down';
  const status = thresholds.green(current) ? 'green' : thresholds.yellow(current) ? 'yellow' : 'red';
  return { current, previous, trend, trendPercent: Math.round(absDiff), status, label, detail };
}

function computeAreaKPIs(
  area: string,
  issues: JiraIssue[],
  prevIssues: JiraIssue[],
  tempoData: ActualsResponse | null,
  prevTempoData: ActualsResponse | null,
  period: TimePeriod
): AreaKPIs {
  const now = new Date();
  const opsProjectKeys = Object.keys(AREA_MAP);
  const areaKeys = opsProjectKeys.filter(k => resolveAreaName(k) === area);

  const areaIssuesRaw = issues.filter(i => areaKeys.includes(i.fields.project.key));
  // Exclude recurring tasks from KPIs — they're tracked separately in Reports
  const areaIssues = areaIssuesRaw.filter(i => categorizeStatus(i.fields.status.name) !== 'recurring');

  // ── Execution Velocity ──
  // What % of non-done tasks at start of period have reached Done?
  // Simpler: of current In Progress + Done tasks, what fraction is Done?
  // Only count Done tasks that were actually completed this period
  let periodStart: Date;
  let periodEnd: Date = now;
  if (period === 'week') {
    periodStart = new Date(now);
    const day = periodStart.getDay();
    periodStart.setDate(periodStart.getDate() - (day === 0 ? 6 : day - 1));
    periodStart.setHours(0, 0, 0, 0);
  } else if (period === 'lastMonth') {
    const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    periodStart = new Date(ly, lm, 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth(), 1); // first day of current month
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const currentInProgressForVelocity = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'inProgress');
  const currentBlocked = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'blocked');
  const currentDone = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'done');
  const currentTodo = areaIssues.filter(i => categorizeStatus(i.fields.status.name) === 'todo');

  // Done this period = tasks whose statuscategorychangedate falls within [periodStart, periodEnd)
  const doneInPeriod = currentDone.filter(i => {
    const scd = i.fields.statuscategorychangedate ? new Date(i.fields.statuscategorychangedate) : null;
    return scd && scd >= periodStart && scd < periodEnd;
  });

  // Denominator = tasks that were "active" = currently In Progress + Done in period
  const workedOn = currentInProgressForVelocity.length + doneInPeriod.length;
  const velocityCurrent = workedOn > 0 ? Math.round((doneInPeriod.length / workedOn) * 100) : 100;
  const velocityPrev = 0;

  const executionVelocity = computeKPI(
    velocityCurrent, velocityPrev,
    { green: v => v >= 70, yellow: v => v >= 50 },
    `${doneInPeriod.length} done, ${currentInProgressForVelocity.length} active`,
    false,
    `${currentTodo.length} to-do, ${currentBlocked.length} blocked`
  );

  // ── Average Cycle Time ──
  // For each Done task: days from created → statuscategorychangedate (when it moved to Done)
  const completedWithDates = doneInPeriod.filter(i => i.fields.statuscategorychangedate && i.fields.created);
  let avgCycle = 0;
  if (completedWithDates.length > 0) {
    const cycleTimes = completedWithDates.map(i => {
      const created = new Date(i.fields.created!);
      const doneDate = new Date(i.fields.statuscategorychangedate!);
      return Math.max(1, Math.floor((doneDate.getTime() - created.getTime()) / 86400000));
    });
    avgCycle = Math.round(cycleTimes.reduce((s, d) => s + d, 0) / cycleTimes.length);
  }

  const avgCycleTime = computeKPI(
    avgCycle, 0,
    { green: v => v <= 7, yellow: v => v <= 14 },
    avgCycle > 0 ? `${avgCycle} days avg` : 'No data',
    true,
    completedWithDates.length > 0 ? `Based on ${completedWithDates.length} completed tasks` : 'No completed tasks in period'
  );

  // ── Stale Work Ratio ──
  const stale = currentInProgressForVelocity.filter(i => {
    if (!i.fields.updated) return false;
    if (!i.fields.assignee) return false;
    if (i.fields.assignee?.active === false) return false;
    const daysSince = Math.floor((now.getTime() - new Date(i.fields.updated).getTime()) / 86400000);
    return daysSince >= 3 && daysSince <= 90;
  });
  const stalePercent = currentInProgressForVelocity.length > 0 ? Math.round((stale.length / currentInProgressForVelocity.length) * 100) : 0;

  const staleRatio = computeKPI(
    stalePercent, 0,
    { green: v => v < 15, yellow: v => v <= 30 },
    `${stale.length} of ${currentInProgressForVelocity.length} stale`,
    true,
    stale.length > 0 ? `${stale.map(i => i.key).slice(0, 3).join(', ')}${stale.length > 3 ? '...' : ''}` : 'All tasks active'
  );

  // ── Timesheet Compliance (matched by Jira accountId) ──
  const opsAssigneeMap = new Map<string, string>(); // accountId → displayName
  areaIssues.forEach(i => {
    if (i.fields.assignee?.accountId && i.fields.assignee?.active !== false) {
      const s = categorizeStatus(i.fields.status.name);
      if (s === 'inProgress' || s === 'todo') {
        opsAssigneeMap.set(i.fields.assignee.accountId, formatDisplayName(i.fields.assignee.displayName));
      }
    }
  });

  let compliancePercent = 100;
  let complianceDetail = '';
  if (tempoData) {
    const tempoIds = new Set(tempoData.people.map(p => p.id));
    const logging = [...opsAssigneeMap.keys()].filter(id => tempoIds.has(id));
    const notLogging = [...opsAssigneeMap.entries()].filter(([id]) => !tempoIds.has(id));
    compliancePercent = opsAssigneeMap.size > 0 ? Math.round((logging.length / opsAssigneeMap.size) * 100) : 100;
    complianceDetail = notLogging.length > 0 ? `Not logging: ${notLogging.slice(0, 4).map(([, name]) => name.split(' ')[0]).join(', ')}${notLogging.length > 4 ? '...' : ''}` : 'Everyone logging';
  }

  const timesheetCompliance = computeKPI(
    compliancePercent, 0,
    { green: v => v >= 100, yellow: v => v >= 80 },
    `${compliancePercent}%`,
    false,
    complianceDetail
  );

  // ── Responsiveness (Pickup Speed) ──
  const startedInPeriod = areaIssues.filter(i => {
    const s = categorizeStatus(i.fields.status.name);
    if (s !== 'inProgress' && s !== 'done') return false;
    const scd = i.fields.statuscategorychangedate ? new Date(i.fields.statuscategorychangedate) : null;
    return scd && scd >= periodStart;
  });

  let avgPickup = 0;
  if (startedInPeriod.length > 0) {
    const pickupTimes = startedInPeriod.map(i => {
      const created = new Date(i.fields.statuscategorychangedate!);
      const started = i.fields.updated ? new Date(i.fields.updated) : created;
      return Math.max(0, Math.floor((started.getTime() - created.getTime()) / 86400000));
    }).filter(d => d < 90); // filter outliers
    avgPickup = pickupTimes.length > 0 ? Math.round(pickupTimes.reduce((s, d) => s + d, 0) / pickupTimes.length) : 0;
  }

  const responsiveness = computeKPI(
    avgPickup, 0,
    { green: v => v < 3, yellow: v => v <= 7 },
    avgPickup > 0 ? `${avgPickup} days avg` : '< 1 day',
    true,
    `Based on ${startedInPeriod.length} tasks started`
  );

  // ── Commitment Reliability ──
  const completedWithDue = doneInPeriod.filter(i => i.fields.duedate);
  let onTimePercent = 100;
  if (completedWithDue.length > 0) {
    const onTime = completedWithDue.filter(i => {
      const due = new Date(i.fields.duedate!);
      const finished = new Date(i.fields.updated!);
      due.setHours(23, 59, 59, 999);
      return finished <= due;
    });
    onTimePercent = Math.round((onTime.length / completedWithDue.length) * 100);
  }

  const commitmentReliability = computeKPI(
    onTimePercent, 0,
    { green: v => v >= 85, yellow: v => v >= 70 },
    completedWithDue.length > 0 ? `${onTimePercent}% on time` : 'No due-dated tasks',
    false,
    completedWithDue.length > 0 ? `${completedWithDue.length} tasks with due dates` : 'Set due dates to track this'
  );

  return {
    area,
    executionVelocity,
    avgCycleTime,
    staleRatio,
    timesheetCompliance,
    responsiveness,
    commitmentReliability,
  };
}

// ─── KPI Card Component ──────────────────────────────────────

const statusColors = {
  green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  yellow: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
};

const kpiIcons: Record<string, React.ReactNode> = {
  executionVelocity: <Zap className="w-4 h-4" />,
  avgCycleTime: <Clock className="w-4 h-4" />,
  staleRatio: <Snowflake className="w-4 h-4" />,
  timesheetCompliance: <BarChart3 className="w-4 h-4" />,
  responsiveness: <Gauge className="w-4 h-4" />,
  commitmentReliability: <Target className="w-4 h-4" />,
};

const kpiNames: Record<string, string> = {
  executionVelocity: 'Execution Velocity',
  avgCycleTime: 'Avg Cycle Time',
  staleRatio: 'Stale Work Ratio',
  timesheetCompliance: 'Timesheet Compliance',
  responsiveness: 'Responsiveness',
  commitmentReliability: 'Commitment Reliability',
};

function KPICell({ name, value }: { name: string; value: KPIValue }) {
  const colors = statusColors[value.status];
  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-3 transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={colors.text}>{kpiIcons[name]}</span>
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">{kpiNames[name]}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${colors.text}`}>
          {name === 'avgCycleTime' || name === 'responsiveness'
            ? (value.current > 0 ? `${value.current}d` : '<1d')
            : `${value.current}%`
          }
        </span>
      </div>
      <div className="mt-1.5 text-[11px] text-slate-500">{value.label}</div>
      {value.detail && <div className="mt-0.5 text-[10px] text-slate-400">{value.detail}</div>}
    </div>
  );
}

// ─── Area Card ────────────────────────────────────────────────

function AreaKPICard({ data }: { data: AreaKPIs }) {
  const [expanded, setExpanded] = useState(true);
  const kpiEntries: [string, KPIValue][] = [
    ['executionVelocity', data.executionVelocity],
    ['avgCycleTime', data.avgCycleTime],
    ['staleRatio', data.staleRatio],
    ['timesheetCompliance', data.timesheetCompliance],
    ['responsiveness', data.responsiveness],
    ['commitmentReliability', data.commitmentReliability],
  ];

  // Overall health: count greens
  const greens = kpiEntries.filter(([, v]) => v.status === 'green').length;
  const reds = kpiEntries.filter(([, v]) => v.status === 'red').length;
  const overallColor = reds >= 3 ? 'text-red-600' : greens >= 4 ? 'text-emerald-600' : 'text-amber-600';
  const overallDot = reds >= 3 ? 'bg-red-500' : greens >= 4 ? 'bg-emerald-500' : 'bg-amber-500';
  const overallLabel = reds >= 3 ? 'Needs Attention' : greens >= 4 ? 'Healthy' : 'Some Friction';

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${overallDot} shadow-sm`} />
          <h3 className="text-base font-bold text-slate-800">{data.area}</h3>
          <span className={`text-xs font-semibold ${overallColor}`}>{overallLabel}</span>
          <span className="text-[10px] text-slate-400">{greens}/6 green</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini status dots */}
          <div className="flex gap-1">
            {kpiEntries.map(([name, v]) => (
              <div key={name} className={`w-1.5 h-1.5 rounded-full ${statusColors[v.status].dot}`} title={kpiNames[name]} />
            ))}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {expanded && (
        <CardContent className="pt-0 pb-4 px-5">
          <div className="grid grid-cols-3 gap-3">
            {kpiEntries.map(([name, value]) => (
              <KPICell key={name} name={name} value={value} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Overall Health Summary ───────────────────────────────────

function HealthSummary({ areas }: { areas: AreaKPIs[] }) {
  const allKPIs = areas.flatMap(a => [
    a.executionVelocity, a.avgCycleTime, a.staleRatio,
    a.timesheetCompliance, a.responsiveness, a.commitmentReliability,
  ]);
  const greens = allKPIs.filter(k => k.status === 'green').length;
  const yellows = allKPIs.filter(k => k.status === 'yellow').length;
  const reds = allKPIs.filter(k => k.status === 'red').length;
  const total = allKPIs.length;
  const healthScore = Math.round((greens / total) * 100);

  const overallStatus = healthScore >= 70 ? 'Healthy' : healthScore >= 45 ? 'Some Friction' : 'Needs Attention';
  const overallColor = healthScore >= 70 ? 'text-emerald-600' : healthScore >= 45 ? 'text-amber-600' : 'text-red-600';
  const overallBg = healthScore >= 70 ? 'from-emerald-50 to-emerald-100/50' : healthScore >= 45 ? 'from-amber-50 to-amber-100/50' : 'from-red-50 to-red-100/50';

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${overallBg} border border-slate-200/60 p-5 mb-5`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-3xl font-black ${overallColor}`}>{healthScore}%</span>
            <span className={`text-sm font-bold ${overallColor}`}>{overallStatus}</span>
          </div>
          <p className="text-xs text-slate-500">Ops Health Score — percentage of KPIs in green across all areas</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{greens}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Green</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">{yellows}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Yellow</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{reds}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Red</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────

export default function KPIsTab({ jiraIssues }: KPIsTabProps) {
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [tempoData, setTempoData] = useState<ActualsResponse | null>(null);
  const [prevTempoData, setPrevTempoData] = useState<ActualsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTempo = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const cy = now.getFullYear(), cm = now.getMonth() + 1;
      const pm = cm === 1 ? 12 : cm - 1, py = cm === 1 ? cy - 1 : cy;
      const [r1, r2] = await Promise.all([
        fetch(`/api/tempo/actuals?year=${cy}&month=${cm}`),
        fetch(`/api/tempo/actuals?year=${py}&month=${pm}`),
      ]);
      if (r1.ok) setTempoData(await r1.json());
      if (r2.ok) setPrevTempoData(await r2.json());
    } catch (err) {
      console.error('[KPIs] Tempo error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTempo(); }, [fetchTempo]);

  const areas = ['Legal', 'Finance', 'GTM & Sales', 'Operations'];

  const areaKPIs = useMemo(() => {
    if (!jiraIssues.length) return [];
    const activeTempo = period === 'lastMonth' ? prevTempoData : tempoData;
    return areas.map(area => computeAreaKPIs(area, jiraIssues, [], activeTempo, prevTempoData, period));
  }, [jiraIssues, tempoData, prevTempoData, period]);

  if (loading || !jiraIssues.length) {
    return (
      <div className="py-8">
        <LoadingProgress
          steps={['Loading Jira data...', 'Fetching Tempo hours...', 'Computing KPIs...']}
          intervalMs={1500}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Ops KPIs</h2>
          <p className="text-xs text-slate-500">Performance signals across all operational areas</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setPeriod('week')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${period === 'week' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${period === 'month' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('lastMonth')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${period === 'lastMonth' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Overall Health */}
      <HealthSummary areas={areaKPIs} />

      {/* Area Cards */}
      {areaKPIs.map(data => (
        <AreaKPICard key={data.area} data={data} />
      ))}

      {/* Legend */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
        <div className="grid grid-cols-3 gap-4 text-[11px]">
          <div>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="font-semibold text-emerald-700">Green — On Track</span></div>
            <p className="text-slate-500">KPI is within healthy range. No action needed.</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="font-semibold text-amber-700">Yellow — Watch</span></div>
            <p className="text-slate-500">KPI is trending toward concern. Monitor and prepare.</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="font-semibold text-red-700">Red — Act Now</span></div>
            <p className="text-slate-500">KPI needs immediate attention. Review with area lead.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/dashboard/LoadingProgress.tsx
````typescript
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProgressProps {
  /** Steps to show in sequence, e.g. ["Fetching Jira tasks...", "Loading delivery data..."] */
  steps: string[];
  /** How long (ms) to auto-advance between steps. Default: 2500 */
  intervalMs?: number;
  /** Optional subtitle below the progress bar */
  subtitle?: string;
}

/**
 * Animated loading indicator with a progress bar and rotating status messages.
 * Simulates progress through steps at a fixed interval since we can't
 * get real-time progress from serverless API routes.
 */
export default function LoadingProgress({ steps, intervalMs = 2500, subtitle }: LoadingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (steps.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        // Stay on the last step (don't loop)
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [steps.length, intervalMs]);

  const progress = steps.length > 1
    ? Math.min(((currentStep + 1) / steps.length) * 100, 95) // Never hit 100% until actually done
    : 30; // Single step: show indeterminate-ish

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="h-7 w-7 animate-spin text-indigo-500 mb-4" />

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status message */}
      <p className="text-sm text-slate-500 font-medium transition-opacity duration-300">
        {steps[currentStep] ?? steps[steps.length - 1]}
      </p>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
````

## File: src/components/dashboard/Next10Days.tsx
````typescript
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TaskCard from './TaskCard';
import { categorizeStatus, NEXT_DAYS, AREA_MAP } from '@/lib/constants';
import type { JiraIssue, AreaKey } from '@/types';

interface Next10DaysProps {
  issues: JiraIssue[];
  showArea?: boolean;
}

export default function Next10Days({ issues, showArea = false }: Next10DaysProps) {
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  // Compute the next N days window
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + NEXT_DAYS);

  // Filter: has due date, due within window, not done, not overdue
  const upcoming = issues.filter((i) => {
    if (!i.fields.duedate) return false;
    if (categorizeStatus(i.fields.status.name) === 'done') return false;
    const due = new Date(i.fields.duedate);
    due.setHours(0, 0, 0, 0);
    return due >= today && due <= futureDate;
  }).sort((a, b) => {
    return new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime();
  });

  // Group by person
  const byPerson = new Map<string, { name: string; tasks: JiraIssue[] }>();
  for (const task of upcoming) {
    const name = task.fields.assignee?.displayName ?? 'Unassigned';
    const existing = byPerson.get(name);
    if (existing) {
      existing.tasks.push(task);
    } else {
      byPerson.set(name, { name, tasks: [task] });
    }
  }

  const sortedPeople = [...byPerson.entries()]
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => b.tasks.length - a.tasks.length);

  const maxTasks = sortedPeople.length > 0 ? sortedPeople[0].tasks.length : 1;

  // Group by area (for All tab)
  const byArea = new Map<string, number>();
  if (showArea) {
    for (const task of upcoming) {
      const area = (AREA_MAP as Record<string, string>)[task.fields.project.key] ?? task.fields.project.key;
      byArea.set(area, (byArea.get(area) ?? 0) + 1);
    }
  }

  // Color palette for workload bars
  const barColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">Next {NEXT_DAYS} Days</h3>
          <span className="text-2xl font-bold text-green-600">0</span>
        </div>
        <p className="text-sm text-slate-400">No tasks due in the next {NEXT_DAYS} days. Clear runway.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Next {NEXT_DAYS} Days</h3>
        <span className="text-2xl font-bold text-indigo-600">{upcoming.length}</span>
      </div>

      {/* Area breakdown (All tab only) */}
      {showArea && byArea.size > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...byArea.entries()].sort((a, b) => b[1] - a[1]).map(([area, count]) => (
            <span key={area} className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">
              {area}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Workload bars — click to expand */}
      <div className="space-y-2 mb-4">
        {sortedPeople.map((person, idx) => {
          const isExpanded = expandedPerson === person.key;
          const percent = Math.round((person.tasks.length / maxTasks) * 100);
          const color = barColors[idx % barColors.length];
          const isHeavy = person.tasks.length >= maxTasks * 0.7 && person.tasks.length > 2;

          return (
            <div key={person.key}>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setExpandedPerson(isExpanded ? null : person.key)}
              >
                <span className="text-[13px] font-medium text-slate-700 w-24 truncate group-hover:text-slate-900">
                  {person.name}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                </div>
                <span className={`text-xs font-semibold w-6 text-right ${isHeavy ? 'text-red-600' : 'text-slate-500'}`}>
                  {person.tasks.length}
                </span>
                <span className="text-slate-400 w-4">
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </span>
              </div>

              {/* Expanded: show this person's tasks */}
              {isExpanded && (
                <div className="ml-0 md:ml-26 mt-2 mb-3 space-y-1.5 pl-2 border-l-2 border-slate-100">
                  {person.tasks.map((task) => (
                    <TaskCard key={task.key} issue={task} showArea={showArea} compact />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
````

## File: src/components/dashboard/OverdueBlock.tsx
````typescript
'use client';

import TaskCard from './TaskCard';
import type { JiraIssue } from '@/types';

interface OverdueBlockProps {
  tasks: JiraIssue[];
  showArea?: boolean;
}

export default function OverdueBlock({ tasks, showArea = false }: OverdueBlockProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="rounded-xl bg-red-50/70 border border-red-200 p-3 md:p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <span className="text-sm font-semibold text-red-800">
          {tasks.length} Overdue Task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-2">
        {tasks
          .sort((a, b) => {
            const dA = a.fields.duedate ? new Date(a.fields.duedate).getTime() : 0;
            const dB = b.fields.duedate ? new Date(b.fields.duedate).getTime() : 0;
            return dA - dB; // most overdue first
          })
          .map((task) => (
            <TaskCard key={task.key} issue={task} showArea={showArea} compact />
          ))}
      </div>
    </div>
  );
}
````

## File: src/components/dashboard/TaskSearch.tsx
````typescript
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
````

## File: src/components/ui/badge.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
````

## File: src/components/ui/button.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
````

## File: src/components/ui/card.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
````

## File: src/components/ui/select.tsx
````typescript
"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
````

## File: src/components/ui/tabs.tsx
````typescript
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "rounded-lg p-[3px] group-data-[orientation=horizontal]/tabs:h-9 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 data-[state=active]:text-foreground",
        "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
````

## File: src/components/Providers.tsx
````typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
````

## File: src/lib/api.ts
````typescript
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
````

## File: src/lib/auth.ts
````typescript
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const ALLOWED_DOMAIN = 'verybigthings.com';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email ?? '';
      return email.endsWith(`@${ALLOWED_DOMAIN}`);
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
````

## File: src/lib/supabase.ts
````typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
````

## File: src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: supabase/migrations/001_project_status.sql
````sql
-- ============================================================
-- Control Tower: Project Status Tracker
-- Migration: 001_project_status.sql
-- ============================================================

-- Project status enum
CREATE TYPE project_phase AS ENUM ('active', 'support', 'completed');
CREATE TYPE project_rag AS ENUM ('green', 'yellow', 'red');

-- ── Main projects table ──────────────────────────────────────
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,                    -- PM name
  phase project_phase NOT NULL DEFAULT 'active',
  jira_project_key TEXT UNIQUE,             -- optional link to Jira (unique for sync)
  client_name TEXT,                       -- optional grouping
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Weekly status updates ────────────────────────────────────
-- One row per project per week. This is what PMs fill in.
CREATE TABLE project_status_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,                  -- Monday of the reporting week
  status project_rag NOT NULL DEFAULT 'green',
  update_note TEXT NOT NULL DEFAULT '',   -- "This Week's Update"
  next_milestone TEXT,                    -- "Next milestone & date"
  blockers TEXT,                          -- "Questions/Blockers"
  updated_by TEXT NOT NULL,               -- who submitted this update
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One update per project per week
  UNIQUE(project_id, week_of)
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_project_status_project ON project_status_updates(project_id);
CREATE INDEX idx_project_status_week ON project_status_updates(week_of DESC);
CREATE INDEX idx_projects_phase ON projects(phase);

-- ── Helper view: latest status per project ───────────────────
CREATE VIEW project_current_status AS
SELECT DISTINCT ON (p.id)
  p.id AS project_id,
  p.name,
  p.owner,
  p.phase,
  p.jira_project_key,
  p.client_name,
  psu.status,
  psu.update_note,
  psu.next_milestone,
  psu.blockers,
  psu.week_of,
  psu.updated_by,
  psu.updated_at
FROM projects p
LEFT JOIN project_status_updates psu ON psu.project_id = p.id
ORDER BY p.id, psu.week_of DESC;

-- ── Helper view: status history (last 12 weeks) ─────────────
CREATE VIEW project_status_history AS
SELECT
  p.id AS project_id,
  p.name,
  psu.week_of,
  psu.status
FROM projects p
JOIN project_status_updates psu ON psu.project_id = p.id
WHERE psu.week_of >= CURRENT_DATE - INTERVAL '12 weeks'
ORDER BY p.id, psu.week_of ASC;
````

## File: supabase/migrations/002_psa_compatible_schema.sql
````sql
-- ============================================================
-- Control Tower: Combined Schema
-- PSA-compatible core tables + Control Tower status layer
-- ============================================================

-- Drop existing Control Tower tables if they exist
DROP VIEW IF EXISTS project_status_history CASCADE;
DROP VIEW IF EXISTS project_current_status CASCADE;
DROP TABLE IF EXISTS project_status_updates CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ============================================================
-- ENUMS (PSA-compatible)
-- ============================================================

DO $$ BEGIN
  CREATE TYPE person_type AS ENUM ('internal', 'vendor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('fixed', 'retainer', 'hourly', 'internal');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_rag AS ENUM ('green', 'yellow', 'red');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- CLIENTS (PSA-compatible)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  qb_customer_id TEXT UNIQUE,
  hubspot_company_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PEOPLE (PSA-compatible)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type person_type NOT NULL DEFAULT 'internal',
  role TEXT NOT NULL DEFAULT 'Developer',
  level TEXT,
  hours_per_day DECIMAL(3, 1) NOT NULL DEFAULT 8.0,
  jira_account_id TEXT,
  tempo_account_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROJECTS (PSA-compatible)
-- ============================================================

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  type project_type NOT NULL DEFAULT 'hourly',
  status project_status NOT NULL DEFAULT 'active',
  category TEXT,
  stage TEXT,

  -- Identifiers
  jira_key TEXT UNIQUE,
  qb_memo_keyword TEXT,

  -- Dates
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,

  -- Financials
  rate DECIMAL(10, 2),
  budget DECIMAL(12, 2),

  -- Invoicing
  net_terms INTEGER DEFAULT 30,
  invoicing_cycle TEXT,
  invoicing_notes TEXT,

  -- Ownership
  owner TEXT,

  -- Metadata
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROJECT STATUS UPDATES (Control Tower layer)
-- This is what PMs fill in weekly — the human intelligence layer
-- ============================================================

CREATE TABLE public.project_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,
  status project_rag NOT NULL DEFAULT 'green',
  update_note TEXT NOT NULL DEFAULT '',
  next_milestone TEXT,
  blockers TEXT,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, week_of)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_jira_key ON public.projects(jira_key);
CREATE INDEX idx_people_active ON public.people(is_active);
CREATE INDEX idx_people_jira ON public.people(jira_account_id);
CREATE INDEX idx_project_status_project ON public.project_status_updates(project_id);
CREATE INDEX idx_project_status_week ON public.project_status_updates(week_of DESC);

-- ============================================================
-- VIEWS
-- ============================================================

-- Latest status per project
CREATE VIEW project_current_status AS
SELECT DISTINCT ON (p.id)
  p.id AS project_id,
  p.name,
  p.owner,
  p.status AS phase,
  p.jira_key,
  c.name AS client_name,
  psu.status,
  psu.update_note,
  psu.next_milestone,
  psu.blockers,
  psu.week_of,
  psu.updated_by,
  psu.updated_at
FROM projects p
LEFT JOIN clients c ON c.id = p.client_id
LEFT JOIN project_status_updates psu ON psu.project_id = p.id
ORDER BY p.id, psu.week_of DESC;

-- Status history (last 12 weeks)
CREATE VIEW project_status_history AS
SELECT
  p.id AS project_id,
  p.name,
  psu.week_of,
  psu.status
FROM projects p
JOIN project_status_updates psu ON psu.project_id = p.id
WHERE psu.week_of >= CURRENT_DATE - INTERVAL '12 weeks'
ORDER BY p.id, psu.week_of ASC;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_people
  BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_status_updates
  BEFORE UPDATE ON public.project_status_updates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
````

## File: supabase/notion_export.csv
````
Project Name,Last Edited,Last status change,Next milestone & date,Owner,Phase,Questions/Blockers,Status,Status History,This Week's Update
Admazing,"February 12, 2026 7:02 AM","February 12, 2026",,Danijel Latin,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 ,"The client is resolving their overdue invoices, but still one left. We have received a new batch of tasks. The progress is steady and the client is satisfied."
SME - Algebra,"February 12, 2026 7:07 AM","February 12, 2026",,Danijel Latin,Active,,🟢 Green,🟡🟢🟢🟢🟢🟢🟢🟢🟢🟢,All of the changes have been delivered. The client is gathering student feedback.
SME - Avela,"February 12, 2026 7:02 AM","February 12, 2026",,Danijel Latin,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢,Megan is working on her side to set everything up for the project. We have very little work left to do after she’s done. Davor will be reviewing the leftover work tomorrow.
SME - Stars,"February 12, 2026 7:07 AM","February 12, 2026","Feb 12th, next stage launch to production",Danijel Latin,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢,Today is a big deploy to production (moved from 15th) and we feel good about it. After that we’re moving to the next batch of tasks.
bMedia,"December 19, 2025 1:09 AM","November 25, 2025",Next week PoC will be delivered,Marianna Schiavino,Completed,,🟢 Green,🟢🟢 ,"Estimated project completion 12/19. "
CityFurniture - AIDaaS,"February 12, 2026 7:05 AM","February 12, 2026",,Danijel Latin,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢,We have sent the last batch of updated documents. Our turnaround is on average two days. We have also met and discussed the plan for the upcoming workshop which Marianna and I completed yesterday evening and will send it for review today.
Clear Packaging,"February 4, 2026 11:57 AM","February 4, 2026",Module 2 development,Alex Wood,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢 🟢🟢 ,"Module 1 complete, working on Module 2.  Client approved ~30 hours for a design discovery on the dashboard which we’ll start in Feb.  Good progress "
Drawbridge,"February 12, 2026 7:06 AM","February 12, 2026",,Danijel Latin,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟡🟢 ,"We are delivering tasks either on time or ahead of time. We have started working with their new developer and the relationship seems to be positive. Overall we have received zero negative feedback, and our impression is that the client is happy.
Jordan reached out asking for a meeting between them and us, as they are looking for Nikica’s feedback on some new AI initiatives they are starting."
Encore Vet Group,"December 16, 2025 6:03 AM","November 27, 2025",,Danijel Latin,Completed,,🟢 Green, 🟢 ,"Delivered all key documents, now trying to set up a follow up meeting to see if they want to move forward."
Flagler / Azamara,"January 8, 2026 1:57 AM","December 18, 2025",,Danijel Latin,Completed,,🟢 Green,🟢🟢🟢🟢 ,AI Sprint is done. We are meeting today to debrief them on the Competitive Intelligence effort. Next step will be to create an estimate.
ID Fund,"February 12, 2026 3:38 AM","February 12, 2026",,Veljko Dragšić,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟢,"Nothing new, going good as usual. That big rebranding/migration is scheduled for February 🤞"
LocalDrive,"December 18, 2025 7:15 AM","November 27, 2025",,Danijel Latin,Support,,🟢 Green,🟢🟢🟢🟢 ,In maintenance mode. Running platform tests and fixing issues if and when they come up.
MyLogistics.AI,"February 12, 2026 7:11 AM","February 12, 2026","Meeting on 2/12 with goal to close out phase 1, Phase 2 SOW",Amber Gapinski,Active,,🟢 Green,🟢🟢 🟢 🟢 🟢  🟢  🟢  🟢 🟢🟢,"Meeting with Client today with the intent to close out phase 1. Client working on document for VBT for phase 2 SOW. "
New Wave Loans,"February 12, 2026 7:10 AM","February 12, 2026","VO mockups in progress ",Amber Gapinski,Active,,🟡 Yellow,🟢🟢 🟡🟡🟡🟡🟡🟡🟡🟡,"Working on VO Mock ups.. Client looking forward to them so we can take next steps. "
Office Practicum - Consulting / Support,"January 5, 2026 8:43 AM","December 17, 2025",Delivering deck and discovery report,Erica Briones,Completed,,🟢 Green,🟢🟢🟢🟢 ,We had a meeting with SF vendor on Monday we received the proposal. I think it will help them a lot and will be another OP win.
Online Vacation Center,"February 12, 2026 3:41 AM","February 12, 2026",,Veljko Dragšić,Active,,🟢 Green, 🟢🟢🟢🟢🟢🟢🟢🟢,"We are in support mode. Stephen gave verbal approval for two SoWs that we are preparing now. 
- support for the website $5k/mo for 6mo
- CRM research $15k

Based on CRM research, we will most prob move with AI automation for customer agents — ~75k
"
Optima,"February 4, 2026 11:58 AM","February 4, 2026"," Need all access points",Alex Wood,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢🟢 ,Working on both individual track items (reusable components) and track integration themselves.  Still fighting to get access everywhere we need (almost solved).  Need to start mapping out workflows w/ client.
ST Paper,"February 12, 2026 3:44 AM","February 12, 2026",,Veljko Dragšić,Support,,🟢 Green,🟢🟢🟡🟢🟢N/A,No update - haven’t heard back from Sahil. Only some questions re PowerBI coming from their team.
The Shade Store,"February 12, 2026 7:12 AM","February 12, 2026",Meeting with client on the Production workflow on 2/20,Amber Gapinski,Active,,🟢 Green,🟢🟢 🟢 🟢 🟢 🟢 🟢 🟢  🟢,"Received items for P0 of Rendering, this has an impact on the what they are calling PRoduction workflows. Tentative scheduled meeting on Friday 2/20"
WAGL,"January 8, 2026 1:57 AM","December 18, 2025",,Danijel Latin,Completed,,🟢 Green,🟢🟢🟢🟢 ,Performing minor bug fixes and providing support to the client. We consider the project to be done because the client made so many changes it’s difficult for us to maintain it without investing significant amount of hours.
World Emblem,"February 4, 2026 11:59 AM","February 4, 2026",V1.5 working version EOW,Alex Wood,Active,,🟢 Green, 🟢 🟡🟡🟢🟢🟢🟢🟢🟢,"V1.2 continuing to be launched in waves.  A few UX/UI updates, but component feedback has been good.  Been a ton of work for our team on this.  Continuing to be responsive to features, build out V1.5 and keep everything moving."
World Emblem - AIDaaS,"February 11, 2026 11:46 AM","February 11, 2026",Having all teams complete the Prompt Engineering Training,Erica Briones,Active,"This is a short month, we need to deliver 77hs, that is mainly on me and Nikica, but I'm at a time where OP needs me a lot. So I'm concerned if we will deliver the total amount of hours.",🟢 Green,🟢🟢🟢🟢🟢🟢🟢,The initiatives started to generate ROI. Numbers look promising.
Xavier University,"February 4, 2026 12:00 PM","February 4, 2026",Chat infrastructure and support in UI,Alex Wood,Active,,🟢 Green,🟢🟢🟢 🟢🟢🟢🟢🟢🟢,Finalizing service integrations & continuing to deploy to TestFlight.  Brought another Bitovi dev to roll off another.  Good progress
ZeroFox,"February 11, 2026 11:45 AM","February 11, 2026",Send future work estimates,Erica Briones,Active,,🟢 Green,🟢🟢🟢🟢🟢🟢🟢 ,We presented the discovery report and the client asked for the future work estimates 🙂
Sitemark,"January 8, 2026 6:24 AM","January 8, 2026",,Danijel Latin,Support,,,🟢,"Completed the project, providing small support."
Certify-Ed - Platform,"December 18, 2025 7:15 AM","December 11, 2025",,Danijel Latin,Support,,,🟢🟢🟢🟢,Fixed an infrastructure issue.
RPM Raceway,"November 24, 2025 4:12 AM",,,Tibor Kranjčec,Support,,,,
Flexcare,"January 8, 2026 6:25 AM","January 8, 2026",,Danijel Latin,Support,,,,Sent an estimate for 8 hrs of work. Waiting on feedback. They reported an issue w/ Android. Will have Tin look into it after next week.
GOST,"January 8, 2026 6:24 AM","January 8, 2026",,Danijel Latin,Support,,,🟢,Estimate for 35 hrs sent. Estimate got approved. They have requested one more estimate for another project.
Carnival,"January 28, 2026 11:12 AM","January 21, 2026",Get signature!,Alex Wood,Completed,,🟢 Green,🟢🟢🟢🟢🟢 ,"Working on SOW signature.  Client is ready for kick-off on 2/1.  Should transition this to @Amber Gapinski "
Grant Thornton,"January 28, 2026 11:11 AM","January 28, 2026",Start follow ups in early January,Alex Wood,Completed,,🟢 Green,🟢🟢🟢 🟢 ,"Same update 1/28 - We have completed both R&D’s but expect a really slow process to get to production.  Might need to pull some levers here on GT side (i.e connect w/ CTO) to try to expedite.  "
Revelocity,"January 28, 2026 11:11 AM","January 28, 2026",Meeting in Feb,Alex Wood,Completed,,🟢 Green,🟢🟢🟢🟢 ,Meeting with client in Feb now
Encoda,"February 5, 2026 6:48 AM","February 4, 2026",Deliverables in next two weeks,Alex Wood,Active,,🟢 Green,🟢🟢🟢🟢🟢 🟢,"Had a client checkpoint meeting for opportunity mapping on Monday.  Client was really happy with outcome.  They are prioritizing opportunities for early next week.  A lot of work to go here, but heading in right direction to wrap up in next couple weeks and push for an Add AI to Product project(s)."
TrackFrame,"February 11, 2026 11:51 AM","February 11, 2026","v0.3.0-beta (Feb 28, 2025) - ""Production Ready"" Complete",Erica Briones,Active,Access to client's environment so we can test our concepts,🟢 Green,🟡🟡🟡🟢,"The dev team had a good session on Monday 02/09/2026. We unblock some important definitions: refine for integration layer, components will be built logic-less, authorization via CanAccess and Paras will research a workflow engine."
OP: Wave 1,"February 11, 2026 11:57 AM","February 11, 2026",Complete foundation Backlog and Plan,Erica Briones,Active,Component library selection,🟢 Green,🟢🟢🟢🟢,"The team is starting to find its velocity. We are still reviewing the backlog and working on user personas and journeys. Falling a little behind on the design system, the client will approve the component library today."
OP: Billers + EHR,"February 12, 2026 3:40 AM","February 11, 2026",,Erica Briones,Active,,🟢 Green,🟢🟢🟢🟢,"We had several meetings with the client this week, and the discovery is evolving as expected."
Bond,"February 4, 2026 11:57 AM","February 4, 2026",,Alex Wood,Active,"Do we know the client team yet? ",🟢 Green,🟢,"SOW signed, working to connect w/ project team"
````

## File: supabase/seed_data.sql
````sql
-- ============================================================
-- Control Tower: Seed Data
-- Real clients and projects from VBT Notion tracker (Feb 2026)
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Clear existing data
TRUNCATE project_status_updates CASCADE;
TRUNCATE projects CASCADE;
TRUNCATE clients CASCADE;

-- ============================================================
-- CLIENTS
-- ============================================================

INSERT INTO clients (id, name) VALUES
  ('819e9c4e-7b46-4ce2-a68b-fe64a9bc20ec', 'Admazing'),
  ('f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'SME (School Management Enterprise)'),
  ('4f0c5458-8189-4452-9177-67859d2b6e81', 'bMedia'),
  ('fa15fd18-4d71-43ee-af93-3772d2896cdb', 'City Furniture'),
  ('8f4be4c4-e8f5-4b8e-8772-2ca2f995f184', 'Clear Packaging'),
  ('08e77528-3ef8-4b8a-a63f-59ec2ecc017d', 'Drawbridge'),
  ('18b8c280-e53c-4fd1-ad68-357e983933d8', 'Encore Vet Group'),
  ('ca66a992-f1f5-432f-be09-337bddd32210', 'Flagler / Azamara'),
  ('dbaf0008-bb42-4dfd-ac63-fc2bea8f9c9e', 'ID Fund'),
  ('a9a737aa-3652-4c07-b363-a2612e5b5183', 'LocalDrive'),
  ('3b64926a-df10-4786-9c45-e147cc004e88', 'MyLogistics.AI'),
  ('92809c4f-5aed-4fb4-8901-a7c849012f54', 'New Wave Loans'),
  ('da2ee52b-a7e3-4066-9e63-b41976687fd2', 'Office Practicum'),
  ('ecd56c77-83e8-49ed-a648-cbce0b4259fd', 'Online Vacation Center'),
  ('21bf7230-5de7-4fce-82a0-59b0b41dc941', 'Optima'),
  ('e3e5c51d-4eea-484c-b8ba-ad754dcb86d9', 'ST Paper'),
  ('f1aa4a30-381f-4b08-97f4-1c8d7c29afa6', 'The Shade Store'),
  ('bd2f8a52-647e-4c43-863b-b26fc97c62b1', 'WAGL'),
  ('acfdafca-c120-42dd-b69b-991b973f890e', 'World Emblem'),
  ('4acb560b-f050-4b6d-9b66-34499690fe2e', 'Xavier University'),
  ('3ebbcb98-747c-41ee-bdba-23e2637d3c78', 'ZeroFox'),
  ('d8eaf80d-6de9-4295-90d8-aeea81fc69d5', 'Sitemark'),
  ('3937760f-ca11-499f-a1d2-5318e15bca3d', 'Certify-Ed'),
  ('d03186a9-aa2b-4f25-93c2-fb3f448b5c4c', 'RPM Raceway'),
  ('f0e649af-dee1-4905-a2e7-201ab4cbf044', 'Flexcare'),
  ('d2c729b0-0aba-42ae-8a58-6a9a62fbbcf8', 'GOST'),
  ('00412753-fa4f-42ea-b14f-f820743755f4', 'Carnival'),
  ('1c54f934-4898-48f2-a40d-4ff661098983', 'Grant Thornton'),
  ('6dbcdabb-5c87-4943-b276-cc2a42a15a96', 'Revelocity'),
  ('bad11a72-7140-4825-9fb0-50ebde7aa6b5', 'Encoda'),
  ('ec6886c9-62bc-49e5-ba80-37b9e1461202', 'TrackFrame'),
  ('179e5123-0281-434f-b732-e58acf2dcf13', 'Bond');

-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO projects (id, name, client_id, type, status, owner, start_date) VALUES
  ('3e66abef-ed67-4afe-add5-ffa2c6a99a6f', 'Admazing', '819e9c4e-7b46-4ce2-a68b-fe64a9bc20ec', 'retainer', 'active', 'Danijel Latin', '2025-01-01'),
  ('29cbb00f-f851-4e8e-920f-860a3764ce40', 'SME - Algebra', 'f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'fixed', 'active', 'Danijel Latin', '2025-01-01'),
  ('443e1c60-6603-4c75-a68e-f412762c5589', 'SME - Avela', 'f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'fixed', 'active', 'Danijel Latin', '2025-01-01'),
  ('a659cf44-6f25-45f9-80b9-d217d7afaff4', 'SME - Stars', 'f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'fixed', 'active', 'Danijel Latin', '2025-01-01'),
  ('293e5599-6d56-42e7-be81-22039563e0e7', 'bMedia', '4f0c5458-8189-4452-9177-67859d2b6e81', 'fixed', 'completed', 'Marianna Schiavino', '2025-10-01'),
  ('65a94050-84a5-4677-997e-ea0df632ad8f', 'CityFurniture - AIDaaS', 'fa15fd18-4d71-43ee-af93-3772d2896cdb', 'retainer', 'active', 'Danijel Latin', '2025-01-01'),
  ('8f129917-e941-454d-a603-ca25c5e41151', 'Clear Packaging', '8f4be4c4-e8f5-4b8e-8772-2ca2f995f184', 'fixed', 'active', 'Alex Wood', '2025-06-01'),
  ('ec48d1b9-0046-40bc-83e1-a9aae926798e', 'Drawbridge', '08e77528-3ef8-4b8a-a63f-59ec2ecc017d', 'retainer', 'active', 'Danijel Latin', '2025-01-01'),
  ('0ce4e00a-8eb2-440f-b2aa-6a7427f2e618', 'Encore Vet Group', '18b8c280-e53c-4fd1-ad68-357e983933d8', 'fixed', 'completed', 'Danijel Latin', '2025-09-01'),
  ('16d43650-e7dc-493e-b671-a6cb368ab324', 'Flagler / Azamara', 'ca66a992-f1f5-432f-be09-337bddd32210', 'fixed', 'completed', 'Danijel Latin', '2025-09-01'),
  ('5e3fc1b6-d38e-4d30-bbdc-0f0c19862230', 'ID Fund', 'dbaf0008-bb42-4dfd-ac63-fc2bea8f9c9e', 'retainer', 'active', 'Veljko Dragšić', '2025-01-01'),
  ('5bfa0883-475f-440b-8b7e-88a65fed0844', 'LocalDrive', 'a9a737aa-3652-4c07-b363-a2612e5b5183', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('f6dec078-0bb8-4f34-9ae8-11ce0f2c1af4', 'MyLogistics.AI', '3b64926a-df10-4786-9c45-e147cc004e88', 'fixed', 'active', 'Amber Gapinski', '2025-06-01'),
  ('00a5760b-15a1-44cb-ad1c-2e138257fbf6', 'New Wave Loans', '92809c4f-5aed-4fb4-8901-a7c849012f54', 'fixed', 'active', 'Amber Gapinski', '2025-06-01'),
  ('0288d505-1008-43d6-8f5e-867d9779779d', 'Office Practicum - Consulting / Support', 'da2ee52b-a7e3-4066-9e63-b41976687fd2', 'hourly', 'completed', 'Erica Briones', '2025-09-01'),
  ('2dc19e0b-c933-4782-bc9c-f3bea310b521', 'Online Vacation Center', 'ecd56c77-83e8-49ed-a648-cbce0b4259fd', 'retainer', 'active', 'Veljko Dragšić', '2025-01-01'),
  ('2a759d6e-f18e-46f0-8870-4cdb8e257fbf', 'Optima', '21bf7230-5de7-4fce-82a0-59b0b41dc941', 'fixed', 'active', 'Alex Wood', '2025-06-01'),
  ('e7f86ccb-f6d8-4bbf-a022-7bda590d9e8e', 'ST Paper', 'e3e5c51d-4eea-484c-b8ba-ad754dcb86d9', 'retainer', 'active', 'Veljko Dragšić', '2025-01-01'),
  ('3c2ac2a9-7c11-4de0-ac32-aea3ba11b17e', 'The Shade Store', 'f1aa4a30-381f-4b08-97f4-1c8d7c29afa6', 'fixed', 'active', 'Amber Gapinski', '2025-06-01'),
  ('39c66c48-6b29-43b5-8634-ff06cf7b3211', 'WAGL', 'bd2f8a52-647e-4c43-863b-b26fc97c62b1', 'fixed', 'completed', 'Danijel Latin', '2025-01-01'),
  ('d6ae6781-72d6-49fc-8f9c-ca11e00472d9', 'World Emblem', 'acfdafca-c120-42dd-b69b-991b973f890e', 'fixed', 'active', 'Alex Wood', '2025-01-01'),
  ('e081f428-886c-48b1-9455-cf17f5cca4ec', 'World Emblem - AIDaaS', 'acfdafca-c120-42dd-b69b-991b973f890e', 'retainer', 'active', 'Erica Briones', '2025-06-01'),
  ('c094315e-2d04-4085-96ff-db7fc98809ef', 'Xavier University', '4acb560b-f050-4b6d-9b66-34499690fe2e', 'fixed', 'active', 'Alex Wood', '2025-06-01'),
  ('6b4eb511-2c47-425e-830e-15f06ec42f48', 'ZeroFox', '3ebbcb98-747c-41ee-bdba-23e2637d3c78', 'fixed', 'active', 'Erica Briones', '2025-09-01'),
  ('734463f4-1a46-4f35-8154-6168f07d2c59', 'Sitemark', 'd8eaf80d-6de9-4295-90d8-aeea81fc69d5', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('3130e28d-7041-4d73-a0e0-fc6959d4ec99', 'Certify-Ed - Platform', '3937760f-ca11-499f-a1d2-5318e15bca3d', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('f7b79b01-3e2c-4ed6-a1c4-f6f339249675', 'RPM Raceway', 'd03186a9-aa2b-4f25-93c2-fb3f448b5c4c', 'retainer', 'active', 'Tibor Kranjčec', '2024-01-01'),
  ('ad798e4f-8ef2-41ac-b0f2-dff6f40eda1f', 'Flexcare', 'f0e649af-dee1-4905-a2e7-201ab4cbf044', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('7920ce76-18d7-468c-a51e-cf14a4df803b', 'GOST', 'd2c729b0-0aba-42ae-8a58-6a9a62fbbcf8', 'hourly', 'active', 'Danijel Latin', '2024-01-01'),
  ('072b58f4-2031-497b-a208-47cb505585f3', 'Carnival', '00412753-fa4f-42ea-b14f-f820743755f4', 'fixed', 'completed', 'Alex Wood', '2025-09-01'),
  ('527a048d-fd6f-48c1-81aa-17a0e5480717', 'Grant Thornton', '1c54f934-4898-48f2-a40d-4ff661098983', 'fixed', 'completed', 'Alex Wood', '2025-06-01'),
  ('1ccf3c69-f2f2-42f0-8051-9f75db815dd7', 'Revelocity', '6dbcdabb-5c87-4943-b276-cc2a42a15a96', 'fixed', 'completed', 'Alex Wood', '2025-09-01'),
  ('bb7c77dc-5c2a-4a84-8e58-c799643e51a6', 'Encoda', 'bad11a72-7140-4825-9fb0-50ebde7aa6b5', 'fixed', 'active', 'Alex Wood', '2025-12-01'),
  ('4b33777f-edfe-428d-80cb-ac70b2b280c7', 'TrackFrame', 'ec6886c9-62bc-49e5-ba80-37b9e1461202', 'fixed', 'active', 'Erica Briones', '2025-09-01'),
  ('b9f26d65-12ef-4495-9194-a3db1ebdfd4e', 'OP: Wave 1', 'da2ee52b-a7e3-4066-9e63-b41976687fd2', 'fixed', 'active', 'Erica Briones', '2025-10-01'),
  ('df69d287-c36e-4943-abbe-f588b4e70b4e', 'OP: Billers + EHR', 'da2ee52b-a7e3-4066-9e63-b41976687fd2', 'fixed', 'active', 'Erica Briones', '2025-12-01'),
  ('47867755-e5b8-4e49-92a0-fb2f33b89d27', 'Bond', '179e5123-0281-434f-b732-e58acf2dcf13', 'fixed', 'active', 'Alex Wood', '2026-01-01');

-- ============================================================
-- INITIAL STATUS UPDATES (from Notion, week of Feb 10 2026)
-- ============================================================

INSERT INTO project_status_updates (project_id, week_of, status, update_note, next_milestone, blockers, updated_by) VALUES
  ('3e66abef-ed67-4afe-add5-ffa2c6a99a6f', '2026-02-09', 'green', 'The client is resolving their overdue invoices, but still one left. We have received a new batch of tasks. The progress is steady and the client is satisfied.', NULL, NULL, 'Danijel Latin'),
  ('29cbb00f-f851-4e8e-920f-860a3764ce40', '2026-02-09', 'green', 'All of the changes have been delivered. The client is gathering student feedback.', NULL, NULL, 'Danijel Latin'),
  ('443e1c60-6603-4c75-a68e-f412762c5589', '2026-02-09', 'green', 'Megan is working on her side to set everything up for the project. We have very little work left to do after she is done.', NULL, NULL, 'Danijel Latin'),
  ('a659cf44-6f25-45f9-80b9-d217d7afaff4', '2026-02-09', 'green', 'Today is a big deploy to production (moved from 15th) and we feel good about it. After that we are moving to the next batch of tasks.', 'Feb 12th, next stage launch to production', NULL, 'Danijel Latin'),
  ('65a94050-84a5-4677-997e-ea0df632ad8f', '2026-02-09', 'green', 'We have sent the last batch of updated documents. Our turnaround is on average two days.', NULL, NULL, 'Danijel Latin'),
  ('8f129917-e941-454d-a603-ca25c5e41151', '2026-02-09', 'green', 'Module 1 complete, working on Module 2. Client approved ~30 hours for a design discovery on the dashboard.', 'Module 2 development', NULL, 'Alex Wood'),
  ('ec48d1b9-0046-40bc-83e1-a9aae926798e', '2026-02-09', 'green', 'We are delivering tasks either on time or ahead of time. Started working with their new developer, relationship is positive.', NULL, NULL, 'Danijel Latin'),
  ('5e3fc1b6-d38e-4d30-bbdc-0f0c19862230', '2026-02-09', 'green', 'Nothing new, going good as usual. Big rebranding/migration is scheduled for February.', NULL, NULL, 'Veljko Dragšić'),
  ('f6dec078-0bb8-4f34-9ae8-11ce0f2c1af4', '2026-02-09', 'green', 'Meeting with Client today with the intent to close out phase 1. Client working on document for VBT for phase 2 SOW.', 'Close out phase 1, Phase 2 SOW', NULL, 'Amber Gapinski'),
  ('00a5760b-15a1-44cb-ad1c-2e138257fbf6', '2026-02-09', 'yellow', 'Working on VO Mock ups. Client looking forward to them so we can take next steps.', 'VO mockups in progress', NULL, 'Amber Gapinski'),
  ('2dc19e0b-c933-4782-bc9c-f3bea310b521', '2026-02-09', 'green', 'We are in support mode. Stephen gave verbal approval for two SoWs that we are preparing now.', NULL, NULL, 'Veljko Dragšić'),
  ('2a759d6e-f18e-46f0-8870-4cdb8e257fbf', '2026-02-09', 'green', 'Working on both individual track items and track integration. Still fighting to get access everywhere we need.', 'Need all access points', NULL, 'Alex Wood'),
  ('e7f86ccb-f6d8-4bbf-a022-7bda590d9e8e', '2026-02-09', 'green', 'No update - have not heard back from Sahil. Only some questions re PowerBI coming from their team.', NULL, NULL, 'Veljko Dragšić'),
  ('3c2ac2a9-7c11-4de0-ac32-aea3ba11b17e', '2026-02-09', 'green', 'Received items for P0 of Rendering. Tentative meeting scheduled on Friday 2/20.', 'Meeting with client on Production workflow 2/20', NULL, 'Amber Gapinski'),
  ('d6ae6781-72d6-49fc-8f9c-ca11e00472d9', '2026-02-09', 'green', 'V1.2 continuing to be launched in waves. Component feedback has been good. Building out V1.5.', 'V1.5 working version EOW', NULL, 'Alex Wood'),
  ('e081f428-886c-48b1-9455-cf17f5cca4ec', '2026-02-09', 'green', 'The initiatives started to generate ROI. Numbers look promising.', 'All teams complete Prompt Engineering Training', 'Short month, need to deliver 77hs. Concerned about capacity with OP demands.', 'Erica Briones'),
  ('c094315e-2d04-4085-96ff-db7fc98809ef', '2026-02-09', 'green', 'Finalizing service integrations and continuing to deploy to TestFlight. Good progress.', 'Chat infrastructure and support in UI', NULL, 'Alex Wood'),
  ('6b4eb511-2c47-425e-830e-15f06ec42f48', '2026-02-09', 'green', 'We presented the discovery report and the client asked for the future work estimates.', 'Send future work estimates', NULL, 'Erica Briones'),
  ('bb7c77dc-5c2a-4a84-8e58-c799643e51a6', '2026-02-09', 'green', 'Client checkpoint meeting for opportunity mapping. Client was really happy with outcome.', 'Deliverables in next two weeks', NULL, 'Alex Wood'),
  ('4b33777f-edfe-428d-80cb-ac70b2b280c7', '2026-02-09', 'green', 'Dev team had a good session. Unblocked important definitions for integration layer.', 'v0.3.0-beta (Feb 28) - Production Ready', 'Access to client environment so we can test our concepts', 'Erica Briones'),
  ('b9f26d65-12ef-4495-9194-a3db1ebdfd4e', '2026-02-09', 'green', 'Team is starting to find its velocity. Reviewing backlog and working on user personas.', 'Complete foundation Backlog and Plan', 'Component library selection', 'Erica Briones'),
  ('df69d287-c36e-4943-abbe-f588b4e70b4e', '2026-02-09', 'green', 'Several meetings with the client this week, discovery is evolving as expected.', NULL, NULL, 'Erica Briones'),
  ('47867755-e5b8-4e49-92a0-fb2f33b89d27', '2026-02-09', 'green', 'SOW signed, working to connect with project team.', NULL, 'Do we know the client team yet?', 'Alex Wood');

-- Verify
SELECT 'Clients: ' || COUNT(*)::text FROM clients
UNION ALL
SELECT 'Projects: ' || COUNT(*)::text FROM projects
UNION ALL
SELECT 'Active projects: ' || COUNT(*)::text FROM projects WHERE status = 'active'
UNION ALL
SELECT 'Status updates: ' || COUNT(*)::text FROM project_status_updates;
````

## File: supabase/seed.ts
````typescript
/**
 * Seed script: Import Notion Weekly Project Status Tracker into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=xxx npx tsx supabase/seed.ts
 *
 * This reads the exported Notion CSV and creates:
 *   1. One row per project in `projects` table
 *   2. One status update per project in `project_status_updates` (current week)
 *   3. Historical status dots parsed into individual weekly entries
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Parse CSV manually (no deps) ────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, '')); // strip BOM
  const rows: Record<string, string>[] = [];

  let i = 1;
  while (i < lines.length) {
    let line = lines[i];
    // Handle multi-line quoted fields
    while (line && (line.split('"').length - 1) % 2 !== 0 && i + 1 < lines.length) {
      i++;
      line += '\n' + lines[i];
    }
    if (line.trim()) {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });
      rows.push(row);
    }
    i++;
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Map Notion data to our schema ────────────────────────────
function parsePhase(phase: string): 'active' | 'support' | 'completed' {
  const p = phase.toLowerCase();
  if (p.includes('support')) return 'support';
  if (p.includes('complete')) return 'completed';
  return 'active';
}

function parseRAG(status: string): 'green' | 'yellow' | 'red' {
  if (status.includes('🔴') || status.toLowerCase().includes('red')) return 'red';
  if (status.includes('🟡') || status.toLowerCase().includes('yellow')) return 'yellow';
  return 'green';
}

function parseStatusHistory(history: string): ('green' | 'yellow' | 'red')[] {
  const dots: ('green' | 'yellow' | 'red')[] = [];
  for (const ch of history) {
    if (ch === '🟢') dots.push('green');
    else if (ch === '🟡') dots.push('yellow');
    else if (ch === '🔴') dots.push('red');
  }
  return dots;
}

function getMondayOfWeek(weeksAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 1 - weeksAgo * 7); // Monday
  return d.toISOString().split('T')[0];
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const csvPath = path.join(__dirname, 'notion_export.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`Place your Notion CSV export at: ${csvPath}`);
    process.exit(1);
  }

  const text = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(text);

  console.log(`Parsed ${rows.length} projects from Notion export\n`);

  for (const row of rows) {
    const name = row['Project Name'];
    if (!name) continue;

    const owner = row['Owner'] || 'Unassigned';
    const phase = parsePhase(row['Phase'] || 'active');
    const currentStatus = parseRAG(row['Status'] || '');
    const update = row["This Week's Update"] || '';
    const milestone = row['Next milestone & date'] || '';
    const blockers = row['Questions/Blockers'] || '';
    const historyDots = parseStatusHistory(row['Status History'] || '');

    // 1. Insert project
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({ name, owner, phase })
      .select('id')
      .single();

    if (projErr) {
      console.error(`  ✗ Failed to insert project "${name}":`, projErr.message);
      continue;
    }

    console.log(`✓ ${name} (${phase}) — ${owner}`);

    // 2. Insert historical status entries (dots = most recent last)
    // Each dot represents one week, working backwards from current week
    for (let i = 0; i < historyDots.length; i++) {
      const weeksAgo = historyDots.length - 1 - i;
      const weekOf = getMondayOfWeek(weeksAgo);

      const isCurrentWeek = weeksAgo === 0;

      await supabase.from('project_status_updates').upsert({
        project_id: project.id,
        week_of: weekOf,
        status: historyDots[i],
        update_note: isCurrentWeek ? update : '',
        next_milestone: isCurrentWeek ? milestone : null,
        blockers: isCurrentWeek ? blockers : null,
        updated_by: owner,
      }, { onConflict: 'project_id,week_of' });
    }

    // If no history dots but has current status, insert current week
    if (historyDots.length === 0 && currentStatus) {
      await supabase.from('project_status_updates').upsert({
        project_id: project.id,
        week_of: getMondayOfWeek(0),
        status: currentStatus,
        update_note: update,
        next_milestone: milestone || null,
        blockers: blockers || null,
        updated_by: owner,
      }, { onConflict: 'project_id,week_of' });
    }
  }

  console.log('\n✅ Seed complete!');
}

main().catch(console.error);
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
.env*.local
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
````

## File: eslint.config.mjs
````javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
````

## File: middleware.ts
````typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware — Google OAuth gate.
 *
 * Protects every route except:
 *   • /api/auth/*       — NextAuth's own endpoints
 *   • /api/slack/digest — cron-triggered, uses its own DIGEST_SECRET_KEY
 *   • /auth/signin      — the sign-in page itself
 *   • /_next, /favicon   — static assets
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — skip auth check
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/slack/digest') ||
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // API routes → 401 JSON; pages → redirect to sign-in
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
````

## File: postcss.config.mjs
````javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
````

## File: route.ts
````typescript
import { NextResponse } from 'next/server';

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

export async function GET() {
  try {
    const projects = ['VBTLEGAL', 'VBTFINANCE', 'VBTGTM', 'VBTOP'];
    const allIssues: any[] = [];

    for (const project of projects) {
      const jql = `project = ${project} ORDER BY created DESC`;
      const response = await fetch(
        `${JIRA_BASE_URL}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch ${project}:`, response.statusText);
        continue;
      }

      const data = await response.json();
      allIssues.push(...data.issues);
    }

    return NextResponse.json({ issues: allIssues });
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
````

## File: vercel.json
````json
{
  "crons": [
    {
      "path": "/api/slack/digest?type=monday",
      "schedule": "0 13 * * 1"
    },
    {
      "path": "/api/slack/digest?type=friday",
      "schedule": "0 21 * * 5"
    }
  ]
}
````

## File: src/app/layout.tsx
````typescript
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VBT Control Tower',
  description: 'Real-time operations dashboard — Jira issues, Tempo time tracking, and team analytics.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
````

## File: src/components/dashboard/TimeActualsTab.tsx
````typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { MONTH_NAMES } from '@/lib/constants';
import LoadingProgress from './LoadingProgress';
import type { ActualsResponse, ActualsPerson, ActualsProjectTotal, ActualsView } from '@/types';

const JIRA_BROWSE_URL = 'https://verybigthings.atlassian.net/browse';

export default function TimeActualsTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<ActualsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ActualsView>('person');
  const [search, setSearch] = useState('');
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const fetchActuals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tempo/actuals?year=${year}&month=${month}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ActualsResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('[TimeActuals] Fetch error:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchActuals();
  }, [fetchActuals]);

  const navigateMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear -= 1; }
    if (newMonth > 12) { newMonth = 1; newYear += 1; }
    setMonth(newMonth);
    setYear(newYear);
    setExpandedPerson(null);
    setExpandedProject(null);
    setExpandedTask(null);
    setSearch('');
  };

  const searchLower = search.toLowerCase();

  const filteredPeople: ActualsPerson[] = data?.people.filter(
    (p) => p.name.toLowerCase().includes(searchLower) || p.projects.some((proj) => proj.projectKey.toLowerCase().includes(searchLower)),
  ) ?? [];

  const filteredProjects: ActualsProjectTotal[] = data?.projects.filter(
    (p) => p.projectKey.toLowerCase().includes(searchLower) || p.projectName.toLowerCase().includes(searchLower),
  ) ?? [];

  // Toggle helpers
  const togglePerson = (id: string) => {
    setExpandedPerson(expandedPerson === id ? null : id);
    setExpandedProject(null);
    setExpandedTask(null);
  };

  const toggleProject = (personId: string, projectKey: string) => {
    const key = `${personId}:${projectKey}`;
    setExpandedProject(expandedProject === key ? null : key);
    setExpandedTask(null);
  };

  const toggleTask = (personId: string, projectKey: string, issueKey: string) => {
    const key = `${personId}:${projectKey}:${issueKey}`;
    setExpandedTask(expandedTask === key ? null : key);
  };

  // Loading
  if (loading) {
    return (
      <LoadingProgress
        steps={[
          `Fetching ${MONTH_NAMES[month - 1]} ${year} worklogs...`,
          'Resolving Jira projects...',
          'Mapping people to tasks...',
          'Calculating hours breakdown...',
        ]}
        intervalMs={2000}
      />
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-slate-500">No data available for this month.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(-1)} className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">←</button>
          <span className="px-4 py-2 font-medium text-slate-700 bg-white rounded-lg border border-slate-200 min-w-[160px] text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button onClick={() => navigateMonth(1)} className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">→</button>
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setView('person')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'person' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            By Person
          </button>
          <button
            onClick={() => setView('project')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'project' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            By Project
          </button>
        </div>

        <input
          type="text"
          placeholder="Search person or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Hours</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{data.totalHours.toLocaleString()}h</div>
            <p className="text-xs text-slate-400 mt-1">{data.totalWorklogs.toLocaleString()} worklogs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">People</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalPeople}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Projects</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalProjects}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Avg / Person</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalPeople > 0 ? Math.round(data.totalHours / data.totalPeople) : 0}h</div>
          </CardContent>
        </Card>
      </div>

      {/* By Person View */}
      {view === 'person' && (
        <div className="space-y-3">
          {filteredPeople.map((person, idx) => {
            const isPersonExpanded = expandedPerson === person.id;

            return (
              <Card
                key={person.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="py-4">
                  {/* Person Header — always clickable */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => togglePerson(person.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-medium text-slate-900">{person.name}</div>
                        <div className="text-xs text-slate-500">{person.projects.length} project{person.projects.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">{person.totalHours}h</span>
                      <span className="text-slate-400">
                        {isPersonExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Level 2: Projects */}
                  {isPersonExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      {person.projects.map((proj) => {
                        const projDrillKey = `${person.id}:${proj.projectKey}`;
                        const isProjExpanded = expandedProject === projDrillKey;
                        const hasTasks = proj.tasks && proj.tasks.length > 0;

                        return (
                          <div key={proj.projectKey}>
                            {/* Project row */}
                            <div
                              className={`flex justify-between items-center text-sm mb-1 ${hasTasks ? 'cursor-pointer group' : ''}`}
                              onClick={() => hasTasks && toggleProject(person.id, proj.projectKey)}
                            >
                              <span className="text-slate-700 flex items-center gap-1.5">
                                <span className="font-medium">{proj.projectKey}</span>
                                {proj.projectName !== proj.projectKey && (
                                  <span className="text-slate-400">({proj.projectName})</span>
                                )}
                                {hasTasks && (
                                  <span className="text-slate-300 group-hover:text-slate-500">
                                    {isProjExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  </span>
                                )}
                              </span>
                              <span className="font-medium">{proj.hours}h</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${proj.percent}%` }} />
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{proj.percent}% of their time</div>

                            {/* Level 3: Tasks per project */}
                            {isProjExpanded && hasTasks && (
                              <div className="mt-2 ml-2 space-y-0.5 border-l-2 border-indigo-100 pl-3">
                                {proj.tasks.map((task) => {
                                  const taskDrillKey = `${person.id}:${proj.projectKey}:${task.issueKey}`;
                                  const isTaskExpanded = expandedTask === taskDrillKey;
                                  const hasEntries = task.entries && task.entries.length > 0;

                                  return (
                                    <div key={task.issueKey}>
                                      {/* Task row */}
                                      <div
                                        className={`flex items-center justify-between py-1.5 ${hasEntries ? 'cursor-pointer group' : ''}`}
                                        onClick={() => hasEntries && toggleTask(person.id, proj.projectKey, task.issueKey)}
                                      >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <a
                                            href={`${JIRA_BROWSE_URL}/${task.issueKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] font-mono text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 shrink-0"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {task.issueKey}
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                          <span className="text-xs text-slate-600 truncate">
                                            {task.summary !== task.issueKey ? task.summary : ''}
                                          </span>
                                          {hasEntries && (
                                            <span className="text-slate-300 group-hover:text-slate-500 shrink-0">
                                              {isTaskExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 shrink-0 ml-2">{task.hours}h</span>
                                      </div>

                                      {/* Level 4: Time entries */}
                                      {isTaskExpanded && hasEntries && (
                                        <div className="ml-4 mb-2 border-l-2 border-slate-100 pl-3">
                                          {task.entries.map((entry, eIdx) => (
                                            <div key={`${task.issueKey}-${eIdx}`} className="flex items-start justify-between py-1 text-[12px]">
                                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                                <span className="text-slate-400 shrink-0 tabular-nums">{entry.date}</span>
                                                <span className="text-slate-500 truncate">
                                                  {entry.comment || <span className="italic text-slate-300">No comment</span>}
                                                </span>
                                              </div>
                                              <span className="text-slate-500 font-medium shrink-0 ml-2 tabular-nums">{entry.hours}h</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {filteredPeople.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">No people found matching &ldquo;{search}&rdquo;</div>
          )}
        </div>
      )}

      {/* By Project View */}
      {view === 'project' && (
        <div className="space-y-3">
          {filteredProjects.map((proj, idx) => (
            <Card key={proj.projectKey}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-medium text-slate-900">{proj.projectKey}</div>
                      {proj.projectName !== proj.projectKey && (
                        <div className="text-xs text-slate-500">{proj.projectName}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">{proj.hours}h</div>
                    <div className="text-xs text-slate-500">{proj.people} {proj.people === 1 ? 'person' : 'people'} · {proj.percent}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">No projects found matching &ldquo;{search}&rdquo;</div>
          )}
        </div>
      )}
    </div>
  );
}
````

## File: src/app/api/jira/delivery/route.ts
````typescript
import { NextResponse } from 'next/server';
import { fetchJson, withCache, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

interface JiraProject {
  key: string;
  name: string;
  archived?: boolean;
  isPrivate?: boolean;
  style?: string;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * GET /api/jira/delivery
 *
 * Fetches active Jira projects (excluding VBT ops), queries each individually
 * so one bad/archived project doesn't kill the others.
 * Results cached for 10 minutes.
 */
export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('delivery', CACHE_TTL, async () => {
      // 1. Discover all Jira projects
      const projects = await fetchJson<JiraProject[]>(
        `${JIRA_BASE}/rest/api/3/project`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );

      // 2. Filter: exclude ops projects and archived ones
      const opsSet = new Set<string>(OPS_PROJECTS);
      const clientProjects = projects.filter(
        (p) => !opsSet.has(p.key) && !p.archived,
      );

      if (clientProjects.length === 0) {
        return { issues: [] as JiraApiResponse['issues'], projects: [] as { key: string; name: string }[] };
      }

      // 3. Query each project individually with Promise.allSettled
      // This way one invalid project doesn't kill others
      const fetchPromises = clientProjects.map(async (proj) => {
        const jql = `project = "${proj.key}" AND statusCategory != Done ORDER BY duedate ASC, updated DESC`;
        const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;

        const data = await fetchJson<JiraSearchResponse>(url, {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
        });

        return { project: proj, issues: data.issues };
      });

      const results = await Promise.allSettled(fetchPromises);

      const allIssues: JiraApiResponse['issues'] = [];
      const activeProjects: { key: string; name: string }[] = [];

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.issues.length > 0) {
          allIssues.push(...r.value.issues);
          activeProjects.push({ key: r.value.project.key, name: r.value.project.name });
        }
        // Silently skip rejected (archived, no access, deleted projects)
      }

      activeProjects.sort((a, b) => a.name.localeCompare(b.name));

      return { issues: allIssues, projects: activeProjects };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Delivery] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery projects' }, { status: 500 });
  }
}
````

## File: src/components/dashboard/OpsDetails.tsx
````typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AREA_MAP, CHART_COLORS, categorizeStatus } from '@/lib/constants';
import type { JiraIssue, EpicProgress } from '@/types';

interface OpsDetailsProps {
  issues: JiraIssue[];
  filteredIssues: JiraIssue[];
  epicProgress: Record<string, EpicProgress>;
}

export default function OpsDetails({ issues, filteredIssues, epicProgress }: OpsDetailsProps) {
  const [open, setOpen] = useState(false);

  // Filter out epics for status counts — epics tracked separately in epic progress
  const nonEpicIssues = filteredIssues.filter((i) => i.fields.issuetype?.name?.toLowerCase() !== 'epic');

  const statusCounts = {
    todo: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'todo').length,
    inProgress: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress').length,
    recurring: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'recurring').length,
    done: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'done').length,
  };

  // Determine which areas are represented in the filtered view
  const activeAreaKeys = new Set(filteredIssues.map((i) => i.fields.project.key));
  const isFiltered = activeAreaKeys.size < Object.keys(AREA_MAP).length;

  const areaData = Object.entries(AREA_MAP)
    .filter(([key]) => activeAreaKeys.has(key))
    .map(([key, name]) => ({
      name,
      value: filteredIssues.filter((i) => i.fields.project.key === key).length,
    }));

  const assigneeChartData = Object.entries(
    filteredIssues.reduce<Record<string, number>>((acc, issue) => {
      const name = issue.fields.assignee?.displayName ?? 'Unassigned';
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const epicSummaryByArea = Object.entries(AREA_MAP)
    .filter(([key]) => activeAreaKeys.has(key))
    .map(([key, name]) => {
      const areaEpics = Object.entries(epicProgress).filter(([, epic]) => epic.projectKey === key);
      return {
        key, name,
        totalEpics: areaEpics.length,
        doneEpics: areaEpics.filter(([, e]) => e.done === e.total && e.total > 0).length,
      };
    });

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm hover:border-slate-400 hover:text-slate-500 transition-colors"
      >
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {open ? 'Hide' : 'Show'} Details — Stats, Charts & Area Breakdown
      </button>

      {open && (
        <div className="mt-4 space-y-6 animate-in fade-in duration-300">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{filteredIssues.length}</div>
              <div className="text-xs text-slate-500 mt-1">Total Tasks</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
              <div className="text-xs text-slate-500 mt-1">In Progress</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.done}</div>
              <div className="text-xs text-slate-500 mt-1">Done</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-500">{statusCounts.todo}</div>
              <div className="text-xs text-slate-500 mt-1">To Do</div>
            </div>
          </div>

          {/* Progress by Area */}
          <Card>
            <CardHeader><CardTitle>Progress by Area</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(AREA_MAP)
                  .filter(([key]) => activeAreaKeys.has(key))
                  .map(([key, name]) => {
                    const areaIssues = filteredIssues.filter((i) => i.fields.project.key === key);
                    const done = areaIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'done').length;
                    const total = areaIssues.length;
                    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700">{name}</span>
                          <span className="text-xs text-slate-500">{done}/{total} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Epic Progress */}
          <Card>
            <CardHeader><CardTitle>Epic Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {epicSummaryByArea.map(({ key, name, totalEpics, doneEpics }) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-medium text-slate-500 mb-1">{name}</div>
                    <div className="text-xl font-bold text-slate-900">{doneEpics}/{totalEpics}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Epics done</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Tasks by Area</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={areaData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {areaData.map((_, i) => <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tasks by Assignee</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={assigneeChartData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
````

## File: src/components/dashboard/TaskCard.tsx
````typescript
'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { getStatusConfig, categorizeStatus, formatDueDate, formatDisplayName, JIRA_BROWSE_URL } from '@/lib/constants';
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
          <span className="text-xs text-slate-500">{formatDisplayName(issue.fields.assignee.displayName)}</span>
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
````

## File: package.json
````json
{
  "name": "vbt-controltower",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.4",
    "@supabase/supabase-js": "^2.95.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.563.0",
    "next": "16.1.6",
    "next-auth": "^4.24.13",
    "radix-ui": "^1.4.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
````

## File: README.md
````markdown
# VBT Control Tower

Real-time operations dashboard for VBT, built with Next.js 16 + TypeScript + Tailwind CSS.

## What It Does

**Ops Dashboard (Tabs: All, Legal, Finance, GTM & Sales, Operations)**
- **Overdue Block** — red section always at the top showing tasks past due with animated pulse indicator
- **Next 10 Days** — forward-looking workload view (not calendar-week). Shows tasks due in the next 10 days, grouped by person with workload bars. Click any person to expand and see their specific tasks.
- **All Tasks List** — sorted by due date ascending, with quick inline filter (type any name, area, status, or Jira key). Click any task to expand its description inline without leaving the dashboard.
- **Ops Details** (collapsible) — total/in-progress/done counts, area progress bars, epic progress, pie charts, assignee distribution. Collapsed by default to keep focus on actionable items.

**Time Actuals Tab**
- Pulls all Tempo worklogs for any month across the entire organization
- Resolves Tempo `issue.id` → Jira issue key via Jira API
- Resolves Tempo `author.accountId` → display names via Jira user API
- Month navigation with By Person and By Project views
- In-memory cache (10 min TTL) to reduce API calls

**Mobile-First Design**
- Minimal padding/gutters on mobile — maximum content real estate
- Horizontally-scrolling tabs
- Stacked task cards (title → meta → Jira key)
- Responsive breakpoints throughout all components

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict — no `any` in production code)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Charts:** Recharts
- **APIs:** Jira REST API v2/v3, Tempo v4 API
- **Deployment:** Vercel

## Project Structure

```
src/
  types/
    index.ts                          # Shared TypeScript types (Jira, Tempo, UI)
  lib/
    api.ts                            # Typed fetch helpers, Tempo pagination, caching
    constants.ts                      # Status config, area map, date helpers
  app/
    layout.tsx                        # Root layout
    page.tsx                          # Main dashboard (tab routing, data fetching)
    api/
      jira/route.ts                   # Jira issues for ops areas
      tempo/
        route.ts                      # Tempo worklogs for ops areas (weekly/monthly)
        actuals/route.ts              # Tempo worklogs for ALL projects (monthly)
  components/
    dashboard/
      TaskCard.tsx                    # Reusable task card with expandable description
      OverdueBlock.tsx                # Red overdue section
      Next10Days.tsx                  # Forward-looking workload + expandable people
      OpsDetails.tsx                  # Collapsible stats, charts, epic progress
      TimeActualsTab.tsx              # Full month time actuals with person/project views
    ui/                               # shadcn/ui primitives (Card, Badge, Tabs, Select)
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Jira API
JIRA_BASE_URL=https://verybigthings.atlassian.net
JIRA_EMAIL=your-email@verybigthings.com
JIRA_API_TOKEN=your-jira-api-token

# Tempo API
TEMPO_TOKEN=your-tempo-api-token
```

### How to get the tokens:

**Jira API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token
3. Use your Atlassian email as `JIRA_EMAIL` and the token as `JIRA_API_TOKEN`

**Tempo API Token:**
1. In Jira → Tempo → Settings → API Integration
2. Create a new token with full read access to worklogs
3. Use as `TEMPO_TOKEN`

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## API Endpoints

### `GET /api/jira`
Returns Jira issues from ops projects (VBTLEGAL, VBTFINANCE, VBTGTM, VBTOP) with summary, status, assignee, duedate, priority, project, parent, and description fields.

### `GET /api/tempo`
Returns aggregated Tempo hours for ops projects. Current week + month breakdown by area, person, and issue.

### `GET /api/tempo/actuals?year=2026&month=1`
Returns all Tempo worklogs for the specified month across ALL projects. Includes 10-minute in-memory cache.

**Response shape:**
```json
{
  "period": { "year": 2026, "month": 1, "from": "2026-01-01", "to": "2026-01-31" },
  "totalHours": 4521.4,
  "totalPeople": 49,
  "totalProjects": 47,
  "people": [{ "id": "...", "name": "Alex Wood", "totalHours": 199.6, "projects": [...] }],
  "projects": [{ "projectKey": "XU", "hours": 742.4, "people": 6, "percent": 16 }]
}
```

## Integration with PSA

The `/api/tempo/actuals` route is designed to drop into the PSA project:

1. Copy `src/app/api/tempo/actuals/route.ts` + `src/lib/api.ts` + `src/types/index.ts`
2. Add env vars (`TEMPO_TOKEN`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_BASE_URL`)
3. Wire the response into the PSA Actuals vs Plan UI

Same stack (Next.js + TypeScript + Tailwind) ensures zero friction on integration.
````

## File: src/app/api/jira/delivery-all/route.ts
````typescript
import { NextResponse } from 'next/server';
import { fetchJson, withCache, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

interface JiraProject {
  key: string;
  name: string;
  archived?: boolean;
}

const CACHE_TTL = 10 * 60 * 1000;

/**
 * GET /api/jira/delivery-all
 *
 * Same as /api/jira/delivery but INCLUDES Done tasks (needed for Reports tab to count completions).
 * Only fetches tasks updated in the last 90 days to avoid ancient archived noise.
 */
export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('delivery-all', CACHE_TTL, async () => {
      const projects = await fetchJson<JiraProject[]>(
        `${JIRA_BASE}/rest/api/3/project`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );

      const opsSet = new Set<string>(OPS_PROJECTS);
      const clientProjects = projects.filter((p) => !opsSet.has(p.key) && !p.archived);

      if (clientProjects.length === 0) {
        return { issues: [] as JiraApiResponse['issues'] };
      }

      // Include ALL statuses but only tasks updated in last 90 days to avoid ancient noise
      const results = await Promise.allSettled(
        clientProjects.map(async (proj) => {
          const jql = `project = "${proj.key}" AND updated >= -90d AND issuetype != Epic ORDER BY updated DESC`;
          const url = `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate`;
          return fetchJson<JiraSearchResponse>(url, {
            Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json',
          });
        }),
      );

      const allIssues: JiraApiResponse['issues'] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') allIssues.push(...r.value.issues);
      }

      return { issues: allIssues };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Delivery-All] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
````

## File: src/app/api/tempo/actuals/route.ts
````typescript
import { NextResponse } from 'next/server';
import { fetchTempoWorklogs, fetchJson, JIRA_BASE, JIRA_AUTH, round, withCache } from '@/lib/api';
import { formatDisplayName } from '@/lib/constants';
import type { ActualsResponse, ActualsPerson, ActualsProjectTotal } from '@/types';

// ─── Issue Resolution ────────────────────────────────────────────────────────

interface ResolvedIssue {
  key: string;
  summary: string;
  projectKey: string;
  projectName: string;
}

/**
 * Resolve Tempo issue IDs to Jira issue keys + project info + summary.
 *
 * Uses bulk JQL search (`id in (...)`) instead of individual /issue/{id} calls.
 * This reduces ~250 API calls to ~5, avoiding rate limits and timeouts
 * that caused false "unlinked" entries on slower connections.
 */
async function resolveIssueIds(issueIds: string[]): Promise<Map<string, ResolvedIssue>> {
  const cache = new Map<string, ResolvedIssue>();
  const BATCH_SIZE = 50; // JQL supports up to ~50 IDs per query

  for (let i = 0; i < issueIds.length; i += BATCH_SIZE) {
    const batch = issueIds.slice(i, i + BATCH_SIZE);
    const jql = `id in (${batch.join(',')})`;
    try {
      const data = await fetchJson<{ issues: Array<{ id: string; key: string; fields: { summary: string; project: { key: string; name: string } } }> }>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${BATCH_SIZE}&fields=project,summary`,
        { Authorization: `Basic ${JIRA_AUTH}` },
      );
      for (const issue of data.issues) {
        cache.set(String(issue.id), {
          key: issue.key,
          summary: issue.fields.summary,
          projectKey: issue.fields.project.key,
          projectName: issue.fields.project.name,
        });
      }
    } catch (err) {
      console.error(`[resolveIssueIds] Batch failed for ${batch.length} issues:`, err);
      // Fallback: resolve individually for this batch
      const results = await Promise.allSettled(
        batch.map(async (issueId) => {
          const d = await fetchJson<{ key: string; fields: { summary: string; project: { key: string; name: string } } }>(
            `${JIRA_BASE}/rest/api/2/issue/${issueId}?fields=project,summary`,
            { Authorization: `Basic ${JIRA_AUTH}` },
          );
          return { issueId, key: d.key, summary: d.fields.summary, projectKey: d.fields.project.key, projectName: d.fields.project.name };
        }),
      );
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { issueId, ...resolved } = result.value;
          cache.set(issueId, resolved);
        }
      }
    }
  }

  return cache;
}

// ─── User Name Resolution ────────────────────────────────────────────────────

interface JiraUser {
  accountId: string;
  displayName: string;
}

/**
 * Resolve Tempo account IDs to display names via Jira user API.
 * Uses parallel batches of 25 for faster resolution.
 */
async function resolveUserNames(accountIds: string[]): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  const BATCH_SIZE = 25;

  for (let i = 0; i < accountIds.length; i += BATCH_SIZE) {
    const batch = accountIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (accountId) => {
        const data = await fetchJson<JiraUser>(
          `${JIRA_BASE}/rest/api/2/user?accountId=${accountId}`,
          { Authorization: `Basic ${JIRA_AUTH}` },
        );
        return { accountId, displayName: data.displayName };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        cache.set(result.value.accountId, result.value.displayName);
      }
    }
  }

  return cache;
}

// ─── Route Handler ───────────────────────────────────────────────────────────

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()), 10);
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1), 10);

  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const cacheKey = `actuals-${year}-${month}`;

  try {
    const data = await withCache<ActualsResponse>(cacheKey, CACHE_TTL, async () => {
      // 1. Fetch all worklogs for the month
      const worklogs = await fetchTempoWorklogs(from, to);

      // 2. Collect ALL unique issue IDs for summary resolution
      const allIssueIds = new Set<string>();
      const keyToIdMap = new Map<string, string>(); // issue.key → issue.id for cross-referencing
      for (const w of worklogs) {
        if (w.issue?.id) {
          allIssueIds.add(String(w.issue.id));
          if (w.issue.key) keyToIdMap.set(w.issue.key, String(w.issue.id));
        }
      }
      const issueCache = await resolveIssueIds([...allIssueIds]);
      const unresolved = [...allIssueIds].filter((id) => !issueCache.has(id));
      if (unresolved.length > 0) {
        console.warn(`[Tempo/Actuals] ${unresolved.length}/${allIssueIds.size} issues failed to resolve:`, unresolved.slice(0, 10));
      }
      console.log(`[Tempo/Actuals] Resolved ${issueCache.size}/${allIssueIds.size} issues from ${worklogs.length} worklogs`);

      // 3. Resolve user account IDs → display names
      const uniqueAccountIds = [...new Set(worklogs.map((w) => w.author?.accountId).filter(Boolean))] as string[];
      const userCache = await resolveUserNames(uniqueAccountIds);

      // 4. Build person × project × task matrix
      const personMap = new Map<string, { name: string; totalHours: number; projects: Map<string, { projectName: string; hours: number; tasks: Map<string, { summary: string; hours: number; entries: Array<{ date: string; hours: number; comment: string }> }> }> }>();
      const projectTotals = new Map<string, { projectName: string; hours: number; peopleSet: Set<string> }>();
      let totalHours = 0;

      for (const wl of worklogs) {
        const authorId = wl.author?.accountId ?? 'unknown';
        const authorName = formatDisplayName(wl.author?.displayName || userCache.get(authorId) || authorId);
        const hours = (wl.timeSpentSeconds ?? 0) / 3600;
        totalHours += hours;

        // Resolve project + issue key from cache
        // Note: Tempo v4 never returns issue.key, only issue.id
        let projectKey = '(unlinked)';
        let projectName = '(No Jira Issue)';
        let issueKey = '(no-issue)';

        if (wl.issue?.id) {
          const resolved = issueCache.get(String(wl.issue.id));
          if (resolved) {
            issueKey = resolved.key;
            projectKey = resolved.projectKey;
            projectName = resolved.projectName;
          }
        }

        // Use Jira issue summary (from resolver), fall back to issue key, never use Tempo description as title
        const resolvedIssue = wl.issue?.id ? issueCache.get(String(wl.issue.id)) : undefined;
        const taskSummary = resolvedIssue?.summary || issueKey;
        const timeEntry = { date: wl.startDate, hours, comment: wl.description || '' };

        // Accumulate person data
        if (!personMap.has(authorId)) {
          personMap.set(authorId, { name: authorName, totalHours: 0, projects: new Map() });
        }
        const person = personMap.get(authorId)!;
        person.totalHours += hours;

        const personProj = person.projects.get(projectKey);
        if (personProj) {
          personProj.hours += hours;
          const existingTask = personProj.tasks.get(issueKey);
          if (existingTask) {
            existingTask.hours += hours;
            existingTask.entries.push(timeEntry);
          } else {
            personProj.tasks.set(issueKey, { summary: taskSummary, hours, entries: [timeEntry] });
          }
        } else {
          const tasks = new Map<string, { summary: string; hours: number; entries: Array<{ date: string; hours: number; comment: string }> }>();
          tasks.set(issueKey, { summary: taskSummary, hours, entries: [timeEntry] });
          person.projects.set(projectKey, { projectName, hours, tasks });
        }

        // Accumulate project totals
        if (!projectTotals.has(projectKey)) {
          projectTotals.set(projectKey, { projectName, hours: 0, peopleSet: new Set() });
        }
        const projTotal = projectTotals.get(projectKey)!;
        projTotal.hours += hours;
        projTotal.peopleSet.add(authorId);
      }

      // 5. Format response
      const people: ActualsPerson[] = [...personMap.entries()]
        .map(([id, p]) => ({
          id,
          name: p.name,
          totalHours: round(p.totalHours),
          projects: [...p.projects.entries()]
            .map(([key, proj]) => ({
              projectKey: key,
              projectName: proj.projectName,
              hours: round(proj.hours),
              percent: p.totalHours > 0 ? Math.round((proj.hours / p.totalHours) * 100) : 0,
              tasks: [...proj.tasks.entries()]
                .map(([issueKey, task]) => ({
                  issueKey,
                  summary: task.summary,
                  hours: round(task.hours),
                  entries: task.entries
                    .map((e) => ({ date: e.date, hours: round(e.hours), comment: e.comment }))
                    .sort((a, b) => a.date.localeCompare(b.date)),
                }))
                .sort((a, b) => b.hours - a.hours),
            }))
            .sort((a, b) => b.hours - a.hours),
        }))
        .sort((a, b) => b.totalHours - a.totalHours);

      const projects: ActualsProjectTotal[] = [...projectTotals.entries()]
        .map(([key, p]) => ({
          projectKey: key,
          projectName: p.projectName,
          hours: round(p.hours),
          people: p.peopleSet.size,
          percent: totalHours > 0 ? Math.round((p.hours / totalHours) * 100) : 0,
        }))
        .sort((a, b) => b.hours - a.hours);

      return {
        period: { year, month, from, to },
        totalHours: round(totalHours),
        totalWorklogs: worklogs.length,
        totalPeople: personMap.size,
        totalProjects: projectTotals.size,
        people,
        projects,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Tempo/Actuals] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Tempo actuals' }, { status: 500 });
  }
}
````

## File: src/components/dashboard/DeliveryTab.tsx
````typescript
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2, AlertTriangle, Target, Send, Search, X, ChevronRight } from 'lucide-react';
import LoadingProgress from './LoadingProgress';

// ── Types ──────────────────────────────────────────────────────
interface StatusHistory {
  week_of: string;
  status: 'green' | 'yellow' | 'red';
}

interface Project {
  id: string;
  name: string;
  owner: string;
  phase: string;
  jira_key: string | null;
  client_name: string | null;
  type: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  rate: number | null;
  current_status: 'green' | 'yellow' | 'red' | null;
  update_note: string | null;
  next_milestone: string | null;
  blockers: string | null;
  last_updated: string | null;
  updated_by: string | null;
  status_history: StatusHistory[];
}

type ViewMode = 'grid' | 'by-pm';
type FilterRAG = 'all' | 'green' | 'yellow' | 'red' | 'blockers' | 'needs-update';

// ── Helpers ────────────────────────────────────────────────────
const RAG_DOT_COLORS = {
  green: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
  yellow: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)] animate-pulse',
  red: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)] animate-pulse',
  none: 'bg-slate-300',
} as const;

const SMALL_DOT = {
  green: 'bg-emerald-400',
  yellow: 'bg-amber-400',
  red: 'bg-red-400',
} as const;

function StatusDots({ history }: { history: StatusHistory[] }) {
  if (history.length === 0) return null;
  const recent = history.slice(-10);
  return (
    <div className="flex items-center gap-[3px]">
      {recent.map((h, i) => (
        <span key={i} className={`w-[6px] h-[6px] rounded-full ${SMALL_DOT[h.status]} opacity-70`} />
      ))}
    </div>
  );
}

/** Compute trend from status_history: improving, stable, declining, or unknown. */
type Trend = 'improving' | 'declining' | 'stable' | 'unknown';

const RAG_SCORE: Record<string, number> = { green: 3, yellow: 2, red: 1 };

function computeTrend(history: StatusHistory[]): Trend {
  if (history.length < 2) return 'unknown';
  // Compare last 3 weeks average vs prior 3 weeks average
  const recent = history.slice(-3);
  const prior = history.slice(-6, -3);
  if (prior.length === 0) {
    // Only have <6 weeks, compare last 2 entries
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const lastScore = RAG_SCORE[last.status] ?? 0;
    const prevScore = RAG_SCORE[prev.status] ?? 0;
    if (lastScore > prevScore) return 'improving';
    if (lastScore < prevScore) return 'declining';
    return 'stable';
  }
  const recentAvg = recent.reduce((s, h) => s + (RAG_SCORE[h.status] ?? 0), 0) / recent.length;
  const priorAvg = prior.reduce((s, h) => s + (RAG_SCORE[h.status] ?? 0), 0) / prior.length;
  const diff = recentAvg - priorAvg;
  if (diff > 0.3) return 'improving';
  if (diff < -0.3) return 'declining';
  return 'stable';
}

const TREND_CONFIG = {
  improving: { arrow: '↑', color: 'text-emerald-500', label: 'Improving' },
  declining: { arrow: '↓', color: 'text-red-500', label: 'Declining' },
  stable: { arrow: '→', color: 'text-slate-400', label: 'Stable' },
  unknown: { arrow: '', color: '', label: '' },
} as const;

function TrendArrow({ history }: { history: StatusHistory[] }) {
  const trend = computeTrend(history);
  if (trend === 'unknown') return null;
  const cfg = TREND_CONFIG[trend];
  return (
    <span className={`text-xs font-bold ${cfg.color}`} title={cfg.label}>
      {cfg.arrow}
    </span>
  );
}

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function ownerFirstName(owner: string): string {
  return owner.split(' ')[0];
}

// ── Main Component ─────────────────────────────────────────────
export default function DeliveryTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRAG, setFilterRAG] = useState<FilterRAG>('all');
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Update form
  const [formProjectId, setFormProjectId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'green' | 'yellow' | 'red'>('green');
  const [formNote, setFormNote] = useState('');
  const [formMilestone, setFormMilestone] = useState('');
  const [formBlockers, setFormBlockers] = useState('');
  const [formUpdatedBy, setFormUpdatedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProjects(json.projects ?? []);
    } catch (err) {
      console.error('[ProjectHealth] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ── Derived data ──────────────────────────────────────────
  const activeProjects = useMemo(() => projects.filter((p) => p.phase === 'active'), [projects]);

  const counts = useMemo(() => ({
    active: activeProjects.length,
    green: activeProjects.filter((p) => p.current_status === 'green').length,
    yellow: activeProjects.filter((p) => p.current_status === 'yellow').length,
    red: activeProjects.filter((p) => p.current_status === 'red').length,
    blockers: activeProjects.filter((p) => p.blockers).length,
    needsUpdate: activeProjects.filter((p) => !p.current_status || (daysSince(p.last_updated) ?? 999) > 7).length,
    declining: activeProjects.filter((p) => computeTrend(p.status_history) === 'declining').length,
    improving: activeProjects.filter((p) => computeTrend(p.status_history) === 'improving').length,
  }), [activeProjects]);

  const projectsWithBlockers = useMemo(
    () => activeProjects.filter((p) => p.blockers),
    [activeProjects],
  );

  const owners = useMemo(() => {
    const map = new Map<string, number>();
    activeProjects.forEach((p) => {
      map.set(p.owner, (map.get(p.owner) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [activeProjects]);

  const filtered = useMemo(() => {
    let result = activeProjects;

    if (filterRAG === 'green') result = result.filter((p) => p.current_status === 'green');
    else if (filterRAG === 'yellow') result = result.filter((p) => p.current_status === 'yellow');
    else if (filterRAG === 'red') result = result.filter((p) => p.current_status === 'red');
    else if (filterRAG === 'blockers') result = result.filter((p) => p.blockers);
    else if (filterRAG === 'needs-update') result = result.filter((p) => !p.current_status || (daysSince(p.last_updated) ?? 999) > 7);

    if (filterOwner !== 'all') result = result.filter((p) => p.owner === filterOwner);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.client_name?.toLowerCase().includes(q) ||
        p.update_note?.toLowerCase().includes(q),
      );
    }

    // Sort: red → yellow → no status → green
    const ragOrder: Record<string, number> = { red: 0, yellow: 1 };
    return result.sort((a, b) => {
      const aO = ragOrder[a.current_status ?? ''] ?? (a.current_status ? 3 : 2);
      const bO = ragOrder[b.current_status ?? ''] ?? (b.current_status ? 3 : 2);
      if (aO !== bO) return aO - bO;
      return a.name.localeCompare(b.name);
    });
  }, [activeProjects, filterRAG, filterOwner, search]);

  // Group by PM
  const groupedByOwner = useMemo(() => {
    const map = new Map<string, Project[]>();
    filtered.forEach((p) => {
      if (!map.has(p.owner)) map.set(p.owner, []);
      map.get(p.owner)!.push(p);
    });
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  // ── Actions ───────────────────────────────────────────────
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setFormProjectId(null);
    } else {
      setExpandedId(id);
      setFormProjectId(null);
    }
  };

  const openUpdateForm = (project: Project) => {
    setFormProjectId(project.id);
    setFormStatus(project.current_status ?? 'green');
    setFormNote(project.update_note ?? '');
    setFormMilestone(project.next_milestone ?? '');
    setFormBlockers(project.blockers ?? '');
    setFormUpdatedBy(project.owner);
  };

  const submitUpdate = async () => {
    if (!formProjectId || !formNote.trim() || !formUpdatedBy.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: formProjectId,
          status: formStatus,
          update_note: formNote,
          next_milestone: formMilestone || null,
          blockers: formBlockers || null,
          updated_by: formUpdatedBy,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchProjects();
      setFormProjectId(null);
    } catch (err) {
      console.error('[ProjectHealth] Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render helpers ────────────────────────────────────────
  const renderCard = (project: Project) => {
    const isExpanded = expandedId === project.id;
    const isUpdating = formProjectId === project.id;
    const rag = project.current_status;
    const stale = !rag || (daysSince(project.last_updated) ?? 999) > 7;

    return (
      <div
        key={project.id}
        onClick={() => !isUpdating && toggleExpand(project.id)}
        className={`
          rounded-xl border transition-all cursor-pointer
          ${isExpanded ? 'col-span-full bg-white shadow-lg border-slate-200' : 'bg-white hover:shadow-md hover:-translate-y-[1px] border-slate-200'}
          ${rag === 'yellow' && !isExpanded ? 'border-amber-300' : ''}
          ${rag === 'red' && !isExpanded ? 'border-red-300' : ''}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center gap-1 mt-[5px] shrink-0">
              <span className={`w-[10px] h-[10px] rounded-full ${RAG_DOT_COLORS[rag ?? 'none']}`} />
              <TrendArrow history={project.status_history} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-900 leading-tight">{project.name}</div>
              {project.client_name && project.client_name !== project.name && (
                <div className="text-[11px] text-slate-400 mt-0.5">{project.client_name}</div>
              )}
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              {ownerFirstName(project.owner)}
            </span>
          </div>

          {/* Status dots */}
          <div className="mb-2.5">
            <StatusDots history={project.status_history} />
          </div>

          {/* Note preview */}
          {!isExpanded && (
            <>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {project.update_note || (stale ? 'No update this week' : '')}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                {project.next_milestone ? (
                  <span className="text-[11px] text-indigo-500 font-mono flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />{project.next_milestone}
                  </span>
                ) : <span />}
                <div className="flex items-center gap-2">
                  {stale && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                      Needs update
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">
                    {project.type}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Expanded content */}
          {isExpanded && !isUpdating && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  This Week&apos;s Update
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.update_note || 'No update submitted yet.'}
                </p>
                {project.updated_by && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    — {project.updated_by}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                {project.next_milestone && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Next Milestone
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      {project.next_milestone}
                    </div>
                  </div>
                )}
                {project.blockers && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Blocker
                    </div>
                    <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
                      {project.blockers}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">{project.type}</span>
                  {project.start_date && (
                    <span className="font-mono">Started {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  )}
                </div>
              </div>

              {/* Update button */}
              <div className="col-span-full">
                <button
                  onClick={(e) => { e.stopPropagation(); openUpdateForm(project); }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Submit weekly update
                </button>
              </div>
            </div>
          )}

          {/* Update form */}
          {isUpdating && (
            <div className="mt-4 pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
              <div className="text-xs font-semibold text-slate-500 mb-3">Submit Weekly Update</div>

              {/* RAG selector */}
              <div className="flex gap-2 mb-3">
                {(['green', 'yellow', 'red'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                      formStatus === s
                        ? s === 'green' ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : s === 'yellow' ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-150'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="This week's update..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-2 bg-slate-50"
              />

              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={formMilestone}
                  onChange={(e) => setFormMilestone(e.target.value)}
                  placeholder="Next milestone..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
                <input
                  type="text"
                  value={formBlockers}
                  onChange={(e) => setFormBlockers(e.target.value)}
                  placeholder="Blockers..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
                <button
                  onClick={submitUpdate}
                  disabled={submitting || !formNote.trim() || !formUpdatedBy.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Loading / Empty ───────────────────────────────────────
  if (loading) {
    return (
      <LoadingProgress
        steps={[
          'Discovering active projects...',
          'Loading delivery tasks...',
          'Calculating project health...',
        ]}
        intervalMs={2200}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">No projects found. Check Supabase connection.</p>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Metric Strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {[
          { key: 'all' as FilterRAG, value: counts.active, label: 'Active', color: 'text-slate-800', topBorder: 'bg-slate-300' },
          { key: 'green' as FilterRAG, value: counts.green, label: 'Green', color: 'text-emerald-600', topBorder: 'bg-emerald-400' },
          { key: 'yellow' as FilterRAG, value: counts.yellow, label: 'Yellow', color: 'text-amber-600', topBorder: 'bg-amber-400' },
          { key: 'red' as FilterRAG, value: counts.red, label: 'Red', color: 'text-red-600', topBorder: 'bg-red-400' },
          { key: 'blockers' as FilterRAG, value: counts.blockers, label: 'Blockers', color: 'text-indigo-600', topBorder: 'bg-indigo-400' },
          { key: 'needs-update' as FilterRAG, value: counts.needsUpdate, label: 'Need Update', color: 'text-slate-500', topBorder: 'bg-slate-300' },
        ].map(({ key, value, label, color, topBorder }) => (
          <button
            key={key}
            onClick={() => { setFilterRAG(filterRAG === key ? 'all' : key); setFilterOwner('all'); }}
            className={`relative overflow-hidden rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-all ${
              filterRAG === key
                ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${topBorder}`} />
            <div className={`text-xl sm:text-2xl font-bold tracking-tight leading-none mb-1 ${color}`}>{value}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
          </button>
        ))}
      </div>

      {/* ── Blockers Banner ───────────────────────────────────── */}
      {projectsWithBlockers.length > 0 && filterRAG !== 'needs-update' && (
        <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-amber-400 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            Active Blockers
          </div>
          {projectsWithBlockers.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-b-0">
              <span className="text-sm font-semibold text-slate-700 sm:min-w-[160px] shrink-0">{p.name}</span>
              <span className="text-sm text-slate-500 leading-relaxed">{p.blockers}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Declining Trend Banner ─────────────────────────────── */}
      {counts.declining > 0 && filterRAG === 'all' && (
        <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-red-400 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-500 mb-3">
            <span className="text-sm font-bold">↓</span>
            {counts.declining} Project{counts.declining !== 1 ? 's' : ''} Trending Down
          </div>
          {activeProjects
            .filter((p) => computeTrend(p.status_history) === 'declining')
            .map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-2 sm:min-w-[160px] shrink-0">
                  <span className={`w-[8px] h-[8px] rounded-full ${RAG_DOT_COLORS[p.current_status ?? 'none']}`} />
                  <span className="text-sm font-semibold text-slate-700">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDots history={p.status_history} />
                  <span className="text-xs text-slate-400">
                    {p.update_note ? p.update_note.slice(0, 80) + (p.update_note.length > 80 ? '...' : '') : 'No recent update'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 -mx-1 px-1 sm:mx-0 sm:px-0">
        <button
          onClick={() => setFilterOwner('all')}
          className={`px-3 py-1 rounded-full text-xs border transition-all ${
            filterOwner === 'all'
              ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {owners.map(([owner, count]) => (
          <button
            key={owner}
            onClick={() => setFilterOwner(filterOwner === owner ? 'all' : owner)}
            className={`px-3 py-1 rounded-full text-xs border transition-all ${
              filterOwner === owner
                ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            {ownerFirstName(owner)} ({count})
          </button>
        ))}

        <div className="relative flex-1 min-w-[140px] sm:min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-[11px] transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('by-pm')}
            className={`px-3 py-1 text-[11px] transition-all ${viewMode === 'by-pm' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
          >
            By PM
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {(filterRAG !== 'all' || filterOwner !== 'all' || search.trim()) && (
        <div className="flex items-center gap-2 flex-wrap">
          {filterRAG !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600">
              {filterRAG}
              <button onClick={() => setFilterRAG('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterOwner !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600">
              {filterOwner}
              <button onClick={() => setFilterOwner('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button
            onClick={() => { setFilterRAG('all'); setFilterOwner('all'); setSearch(''); }}
            className="text-[11px] text-slate-400 hover:text-slate-600"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Project Grid / By PM ──────────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filtered.map(renderCard)}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByOwner.map(([owner, ownerProjects]) => (
            <div key={owner}>
              <div className="flex items-center gap-3 pb-2 mb-3 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-700">{owner}</span>
                <span className="text-xs text-slate-400 font-mono">{ownerProjects.length}</span>
                <div className="flex gap-1 ml-auto">
                  {ownerProjects.map((p) => (
                    <span key={p.id} className={`w-[6px] h-[6px] rounded-full ${SMALL_DOT[p.current_status ?? 'green']}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {ownerProjects.map(renderCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">
          No projects match the current filters
        </div>
      )}
    </div>
  );
}
````

## File: src/components/dashboard/UpcomingWork.tsx
````typescript
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import TaskCard from './TaskCard';
import { categorizeStatus, formatDisplayName, AREA_MAP } from '@/lib/constants';
import type { JiraIssue } from '@/types';

const DAY_OPTIONS = [5, 7, 10] as const;

interface UpcomingWorkProps {
  issues: JiraIssue[];
  showArea?: boolean;
}

export default function UpcomingWork({ issues, showArea = false }: UpcomingWorkProps) {
  const [days, setDays] = useState<number>(7);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  // Active tasks (not done, not epics, not recurring)
  const activeTasks = issues.filter((i) => {
    const s = categorizeStatus(i.fields.status.name);
    if (s === 'done' || s === 'recurring') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    return true;
  });

  // Tasks with no due date (recurring already excluded above)
  const noDueDateCount = activeTasks.filter((i) => !i.fields.duedate).length;

  // Due within window, not done, not overdue
  const upcoming = activeTasks.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate);
    due.setHours(0, 0, 0, 0);
    return due >= today && due <= futureDate;
  }).sort((a, b) => {
    return new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime();
  });

  // Group by person
  const byPerson = new Map<string, { name: string; tasks: JiraIssue[] }>();
  for (const task of upcoming) {
    // Skip tasks assigned to deactivated users
    if (task.fields.assignee?.active === false) continue;
    const name = formatDisplayName(task.fields.assignee?.displayName ?? 'Unassigned');
    const existing = byPerson.get(name);
    if (existing) {
      existing.tasks.push(task);
    } else {
      byPerson.set(name, { name, tasks: [task] });
    }
  }

  const sortedPeople = [...byPerson.entries()]
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => b.tasks.length - a.tasks.length);

  const maxTasks = sortedPeople.length > 0 ? sortedPeople[0].tasks.length : 1;

  // Area breakdown (All tab)
  const byArea = new Map<string, number>();
  if (showArea) {
    for (const task of upcoming) {
      const area = (AREA_MAP as Record<string, string>)[task.fields.project.key] ?? task.fields.project.key;
      byArea.set(area, (byArea.get(area) ?? 0) + 1);
    }
  }

  const barColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 md:p-4">
      {/* Header + Day Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-slate-700">Due in the Next</h3>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => { setDays(d); setExpandedPerson(null); }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  days === d
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        <span className={`text-2xl font-bold ${upcoming.length > 0 ? 'text-indigo-600' : 'text-green-600'}`}>
          {upcoming.length}
        </span>
      </div>

      {/* No due date nudge */}
      {noDueDateCount > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="text-xs text-amber-700">
            <span className="font-semibold">{noDueDateCount} active task{noDueDateCount !== 1 ? 's' : ''}</span> missing a due date — not shown above
          </span>
        </div>
      )}

      {/* Empty state */}
      {upcoming.length === 0 && (
        <p className="text-sm text-slate-400 py-2">
          No tasks due in the next {days} days. Clear runway.
        </p>
      )}

      {upcoming.length > 0 && (
        <>
          {/* Area breakdown chips (All tab only) */}
          {showArea && byArea.size > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[...byArea.entries()].sort((a, b) => b[1] - a[1]).map(([area, count]) => (
                <span key={area} className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                  {area}: {count}
                </span>
              ))}
            </div>
          )}

          {/* Workload bars — click to expand */}
          <div className="space-y-1.5">
            {sortedPeople.map((person, idx) => {
              const isExpanded = expandedPerson === person.key;
              const percent = Math.round((person.tasks.length / maxTasks) * 100);
              const color = barColors[idx % barColors.length];
              const isHeavy = person.tasks.length >= maxTasks * 0.7 && person.tasks.length > 2;

              return (
                <div key={person.key}>
                  <div
                    className="flex items-center gap-2 cursor-pointer group py-1"
                    onClick={() => setExpandedPerson(isExpanded ? null : person.key)}
                  >
                    <span className="text-[13px] font-medium text-slate-700 w-28 truncate group-hover:text-slate-900">
                      {person.name}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-6 text-right ${isHeavy ? 'text-red-600' : 'text-slate-500'}`}>
                      {person.tasks.length}
                    </span>
                    <span className="text-slate-300 w-4 group-hover:text-slate-500">
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-1.5 mb-3 space-y-1.5 pl-3 border-l-2 border-slate-100">
                      {person.tasks.map((task) => (
                        <TaskCard key={task.key} issue={task} showArea={showArea} compact />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
````

## File: src/lib/constants.ts
````typescript
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
  'blocked': { label: 'Blocked / In Review', color: 'text-red-700', bgColor: 'bg-red-100' },
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
  if (s.includes('blocked') || s.includes('in review')) return 'blocked';
  if (
    s.includes('progress') ||
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

/**
 * Normalize Jira display names.
 * Converts "firstname.lastname" → "Firstname Lastname".
 * Leaves proper names like "Hugo Vaquera" unchanged.
 */
export function formatDisplayName(name: string): string {
  if (!name) return 'Unassigned';
  if (!name.includes(' ') && name.includes('.')) {
    return name.split('.').map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
  }
  return name;
}
````

## File: src/app/api/jira/route.ts
````typescript
import { NextResponse } from 'next/server';
import { fetchJson, withCache, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS } from '@/lib/api';
import type { JiraApiResponse } from '@/types';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  if (!JIRA_AUTH || JIRA_AUTH === Buffer.from(':').toString('base64')) {
    return NextResponse.json({ error: 'Jira credentials not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('jira-ops', CACHE_TTL, async () => {
      const projectList = OPS_PROJECTS.join(', ');

      // Two parallel JQL queries instead of 8 sequential ones
      const [activeData, doneData] = await Promise.all([
        fetchJson<JiraSearchResponse>(
          `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
            `project in (${projectList}) AND statusCategory != Done AND issuetype != Epic ORDER BY updated DESC`
          )}&maxResults=200&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate,created`,
          { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
        ),
        fetchJson<JiraSearchResponse>(
          `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
            `project in (${projectList}) AND statusCategory = Done AND issuetype != Epic AND updated >= -90d ORDER BY updated DESC`
          )}&maxResults=200&fields=summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate,created`,
          { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
        ),
      ]);

      return { issues: [...activeData.issues, ...doneData.issues] } satisfies JiraApiResponse;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Jira] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch Jira issues' }, { status: 500 });
  }
}
````

## File: src/types/index.ts
````typescript
/**
 * Shared type definitions for VBT Control Tower.
 *
 * These types are used across API routes and frontend components
 * to ensure end-to-end type safety.
 */

// ─── Jira ────────────────────────────────────────────────────────────────────

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee: { displayName: string; active?: boolean; accountId?: string } | null;
    created?: string;
    duedate: string | null;
    priority: { name: string };
    project: { key: string; name: string };
    parent?: { key: string; fields: { summary: string } };
    issuetype?: { name: string; hierarchyLevel?: number };
    description?: unknown;
    updated?: string;
    statuscategorychangedate?: string;
  };
}

export interface JiraApiResponse {
  issues: JiraIssue[];
}

// ─── Tempo (raw API) ─────────────────────────────────────────────────────────

export interface TempoWorklog {
  tempoWorklogId: number;
  issue: { self: string; id: number; key?: string };
  timeSpentSeconds: number;
  billableSeconds: number;
  startDate: string;
  startTime: string;
  description: string;
  author: { accountId: string; displayName?: string };
  attributes: { values: unknown[] };
}

export interface TempoPagedResponse {
  self: string;
  metadata: { count: number; offset: number; limit: number; next?: string };
  results: TempoWorklog[];
}

// ─── Ops Tempo (processed) ───────────────────────────────────────────────────

export interface OpsAreaHours {
  projectKey: string;
  monthHours: number;
  weekHours: number;
}

export interface OpsPersonHours {
  accountId: string;
  name: string;
  monthHours: number;
  weekHours: number;
}

export interface OpsTempoResponse {
  totalMonth: number;
  totalWeek: number;
  areaHours: OpsAreaHours[];
  personHours: OpsPersonHours[];
  issueHours: Record<string, { monthHours: number; weekHours: number }>;
  dates: { weekStart: string; weekEnd: string; monthStart: string; today: string };
}

// ─── Time Actuals (processed) ────────────────────────────────────────────────

export interface ActualsTimeEntry {
  date: string;
  hours: number;
  comment: string;
}

export interface ActualsTask {
  issueKey: string;
  summary: string;
  hours: number;
  entries: ActualsTimeEntry[];
}

export interface ActualsProject {
  projectKey: string;
  projectName: string;
  hours: number;
  percent: number;
  tasks: ActualsTask[];
}

export interface ActualsPerson {
  id: string;
  name: string;
  totalHours: number;
  projects: ActualsProject[];
}

export interface ActualsProjectTotal {
  projectKey: string;
  projectName: string;
  hours: number;
  people: number;
  percent: number;
}

export interface ActualsResponse {
  period: { year: number; month: number; from: string; to: string };
  totalHours: number;
  totalWorklogs: number;
  totalPeople: number;
  totalProjects: number;
  people: ActualsPerson[];
  projects: ActualsProjectTotal[];
}

// ─── Dashboard UI ────────────────────────────────────────────────────────────

export type AreaKey = 'VBTLEGAL' | 'VBTFINANCE' | 'VBTGTM' | 'VBTOP';
export type FilterValue = 'all' | AreaKey | 'actuals' | 'delivery' | 'kpis' | 'reports';
export type StatusCategory = 'todo' | 'inProgress' | 'recurring' | 'blocked' | 'done' | 'other';
export type ActualsView = 'person' | 'project';

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

export interface EpicProgress {
  name: string;
  total: number;
  done: number;
  projectKey: string;
}
````

## File: src/app/api/slack/digest/route.ts
````typescript
import { NextResponse } from 'next/server';
import { fetchJson, fetchTempoWorklogs, JIRA_BASE, JIRA_AUTH, OPS_PROJECTS, round } from '@/lib/api';
import { formatDisplayName } from '@/lib/constants';
import type { JiraIssue, JiraApiResponse } from '@/types';

// ─── Config ──────────────────────────────────────────────────────────────────

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? '';
const JIRA_BROWSE = 'https://verybigthings.atlassian.net/browse';

const AREA_MAP: Record<string, string> = {
  VBTLEGAL: 'Legal', VBTFINANCE: 'Finance', VBTGTM: 'GTM & Sales', VBTOP: 'Operations',
};

// ─── Types ───────────────────────────────────────────────────────────────────

type DigestType = 'monday' | 'friday';

interface JiraSearchResponse {
  issues: JiraApiResponse['issues'];
  total: number;
}

interface TempoWeekData {
  total: number;
  byPerson: Record<string, number>;
  byProject: Record<string, number>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categorize(statusName: string): string {
  const s = statusName.toLowerCase();
  if (s.includes('done') || s.includes('closed')) return 'done';
  if (s.includes('recurring')) return 'recurring';
  if (s.includes('progress') || s.includes('document sent') || s.includes('docusign')) return 'inProgress';
  return 'other';
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.floor((d1.getTime() - d2.getTime()) / 86400000);
}

function resolveArea(projectKey: string): string {
  return AREA_MAP[projectKey] ?? projectKey;
}

// ─── Jira Data Fetching ───────────────────────────────────────────────────────

const FIELDS = 'summary,status,assignee,duedate,priority,project,parent,issuetype,description,updated,statuscategorychangedate';

/**
 * Fetch ops issues — same pattern as /api/jira/route.ts (two parallel JQL queries).
 */
async function fetchOpsIssues(): Promise<JiraIssue[]> {
  const projectList = OPS_PROJECTS.join(', ');
  try {
    const [activeData, doneData] = await Promise.all([
      fetchJson<JiraSearchResponse>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
          `project in (${projectList}) AND statusCategory != Done ORDER BY updated DESC`
        )}&maxResults=200&fields=${FIELDS}`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      ),
      fetchJson<JiraSearchResponse>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(
          `project in (${projectList}) AND statusCategory = Done AND updated >= -90d ORDER BY updated DESC`
        )}&maxResults=200&fields=${FIELDS}`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      ),
    ]);
    return [...activeData.issues, ...doneData.issues];
  } catch (err) {
    console.error('[Digest] Failed to fetch ops issues:', err);
    return [];
  }
}

// ─── Tempo Data Fetching ──────────────────────────────────────────────────────

/**
 * Resolve Tempo issue IDs to project keys — same bulk JQL approach as
 * /api/tempo/actuals/route.ts, which is how the app already solved the
 * "unlinked" problem. Tempo v4 returns issue.id (not issue.key), so we
 * must resolve IDs to keys ourselves.
 */
async function resolveIssueIds(issueIds: string[]): Promise<Map<string, string>> {
  // id → projectKey
  const cache = new Map<string, string>();
  const BATCH_SIZE = 50;

  for (let i = 0; i < issueIds.length; i += BATCH_SIZE) {
    const batch = issueIds.slice(i, i + BATCH_SIZE);
    try {
      const data = await fetchJson<{ issues: Array<{ id: string; fields: { project: { key: string } } }> }>(
        `${JIRA_BASE}/rest/api/3/search/jql?jql=${encodeURIComponent(`id in (${batch.join(',')})`)}&maxResults=${BATCH_SIZE}&fields=project`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );
      for (const issue of data.issues) {
        cache.set(String(issue.id), issue.fields.project.key);
      }
    } catch (err) {
      console.error(`[Digest] resolveIssueIds batch failed:`, err);
    }
  }

  return cache;
}

/**
 * Resolve account IDs to display names — same approach as actuals route.
 * Falls back to accountId string if Jira lookup fails.
 */
async function resolveUserNames(accountIds: string[]): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  const results = await Promise.allSettled(
    accountIds.map(async (accountId) => {
      const data = await fetchJson<{ displayName: string }>(
        `${JIRA_BASE}/rest/api/2/user?accountId=${accountId}`,
        { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
      );
      return { accountId, displayName: data.displayName };
    }),
  );
  for (const r of results) {
    if (r.status === 'fulfilled') {
      cache.set(r.value.accountId, r.value.displayName);
    }
  }
  return cache;
}

/**
 * Fetch and aggregate Tempo hours for a given week.
 * weeksBack = 0 → current week, 1 → last week.
 *
 * Uses the same ID-based resolution as /api/tempo/actuals/route.ts to fix the
 * (unlinked) / "1 person" bug — Tempo v4 never returns issue.key or
 * author.displayName directly, so we resolve them via Jira.
 */
async function fetchTempoWeekData(weeksBack: number): Promise<TempoWeekData | null> {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - weeksBack * 7);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const from = monday.toISOString().split('T')[0];
    const to = sunday.toISOString().split('T')[0];

    const worklogs = await fetchTempoWorklogs(from, to);
    if (worklogs.length === 0) return { total: 0, byPerson: {}, byProject: {} };

    // Resolve issue IDs → project keys
    const allIssueIds = [...new Set(worklogs.map((w) => w.issue?.id).filter(Boolean).map(String))];
    const issueToProject = await resolveIssueIds(allIssueIds);

    // Resolve account IDs → display names (for any without displayName)
    const allAccountIds = [...new Set(worklogs.map((w) => w.author?.accountId).filter(Boolean))] as string[];
    const userNames = await resolveUserNames(allAccountIds);

    let total = 0;
    // Key by accountId to deduplicate correctly, same as /api/tempo/route.ts
    const personMap = new Map<string, { name: string; hours: number }>();
    const byProject: Record<string, number> = {};

    for (const wl of worklogs) {
      const hours = (wl.timeSpentSeconds ?? 0) / 3600;
      total += hours;

      // Person
      const accountId = wl.author?.accountId ?? 'unknown';
      const displayName = wl.author?.displayName || userNames.get(accountId) || accountId;
      const existing = personMap.get(accountId);
      if (existing) {
        existing.hours += hours;
      } else {
        personMap.set(accountId, { name: formatDisplayName(displayName), hours });
      }

      // Project — resolve via issue ID, same as actuals route
      if (wl.issue?.id) {
        const projKey = issueToProject.get(String(wl.issue.id));
        if (projKey) {
          byProject[projKey] = (byProject[projKey] ?? 0) + hours;
        }
        // unlinked (unresolved) hours still count toward total but not byProject
      }
    }

    // Flatten personMap to name-keyed record for block builder
    const byPerson: Record<string, number> = {};
    for (const [, { name, hours }] of personMap) {
      byPerson[name] = (byPerson[name] ?? 0) + hours;
    }

    return { total, byPerson, byProject };
  } catch (err) {
    console.error('[Digest] Tempo fetch error:', err);
    return null;
  }
}

// ─── Monday Digest ────────────────────────────────────────────────────────────

function buildMondayDigest(
  opsIssues: JiraIssue[],
  tempoLastWeek: TempoWeekData | null,
): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (5 - (today.getDay() || 7)));

  /**
   * Bug fix — deactivated users: filter at the source before any counting,
   * not just in the display loops. Mirrors how the ops tab works.
   */
  const filterActive = (issues: JiraIssue[]): JiraIssue[] =>
    issues.filter((i) => {
      const s = categorize(i.fields.status.name);
      if (s === 'done' || s === 'recurring') return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false; // epics are containers, not tasks
      if (!i.fields.assignee) return false;               // unassigned = no owner, not actionable
      if (i.fields.assignee.active === false) return false; // deactivated user
      return true;
    });

  const activeOps = filterActive(opsIssues);
  const allActive = activeOps;

  const recurringCount = opsIssues.filter(
    (i) => categorize(i.fields.status.name) === 'recurring',
  ).length;

  // ── Overdue ──
  const overdue = allActive
    .filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      const daysLate = daysBetween(today, due);
      return due < today && daysLate <= 90; // 90-day cap: ancient overdue = not actionable signal
    })
    .sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime());

  // ── Stale ──
  const opsKeys = new Set<string>(OPS_PROJECTS);
  const stale = allActive
    .filter((i) => {
      if (categorize(i.fields.status.name) !== 'inProgress') return false;
      if (!i.fields.updated) return false;
      const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
      const isOps = opsKeys.has(i.fields.project.key);
      const days = daysBetween(today, new Date(i.fields.updated));
      if (days > 90) return false;         // older than 90 days = archaeology, not signal
      if (isEpic && isOps) return false;   // ops epics move slowly, skip
      if (isEpic) return days >= 14;       // delivery epics: 14-day threshold
      return days >= 3;                    // everything else: 3 days
    })
    .sort((a, b) => new Date(a.fields.updated!).getTime() - new Date(b.fields.updated!).getTime());

  // ── Due this week ──
  const dueThisWeek = allActive
    .filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      return due >= today && due <= weekEnd;
    })
    .sort((a, b) => new Date(a.fields.duedate!).getTime() - new Date(b.fields.duedate!).getTime());

  // ── Due this week — grouped by person ──
  const personWork: Record<string, { tasks: string[]; count: number }> = {};
  dueThisWeek.forEach((i) => {
    if (i.fields.assignee?.active === false) return; // belt-and-suspenders
    const name = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned');
    if (!personWork[name]) personWork[name] = { tasks: [], count: 0 };
    personWork[name].count++;
    if (personWork[name].tasks.length < 3) {
      personWork[name].tasks.push(`<${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 50)}`);
    }
  });

  // ── Ops area breakdown ──
  const areaProjectMap: Record<string, string[]> = {
    Legal: ['VBTLEGAL'], Finance: ['VBTFINANCE'], 'GTM & Sales': ['VBTGTM'], Operations: ['VBTOP'],
  };
  const opsAreas = ['Legal', 'Finance', 'GTM & Sales', 'Operations'] as const;

  // ── Timesheet adoption — ops team only ──
  let timesheetLine = '';
  if (tempoLastWeek) {
    const opsAssignees = new Set<string>();
    activeOps.forEach((i) => {
      if (i.fields.assignee?.displayName) opsAssignees.add(i.fields.assignee.displayName);
    });
    const tempoLoggers = new Set(Object.keys(tempoLastWeek.byPerson));
    const logging = [...opsAssignees].filter((n) => tempoLoggers.has(n));
    const notLogging = [...opsAssignees]
      .filter((n) => !tempoLoggers.has(n))
      .map((n) => formatDisplayName(n).split(' ')[0]);
    const pct = opsAssignees.size > 0 ? Math.round((logging.length / opsAssignees.size) * 100) : 100;
    if (notLogging.length === 0) {
      timesheetLine = `📊 Ops timesheet adoption: *100%* ✓`;
    } else if (notLogging.length <= 6) {
      timesheetLine = `📊 Ops timesheet adoption: *${pct}%* (${logging.length}/${opsAssignees.size}) — not logging: ${notLogging.join(', ')}`;
    } else {
      timesheetLine = `📊 Ops timesheet adoption: *${pct}%* (${logging.length}/${opsAssignees.size}) — ${notLogging.length} not logging`;
    }
  }

  // ── Overall verdict ──
  const totalOverdue = overdue.length;
  const totalStale = stale.length;
  let overallEmoji: string;
  let overallVerdict: string;
  if (totalOverdue >= 5 || totalStale >= 8) { overallEmoji = '🔴'; overallVerdict = 'Needs Intervention'; }
  else if (totalOverdue >= 3 || totalStale >= 4) { overallEmoji = '🟡'; overallVerdict = 'Some Friction'; }
  else if (totalOverdue > 0 || totalStale > 0) { overallEmoji = '🟡'; overallVerdict = 'Mostly Healthy'; }
  else { overallEmoji = '🟢'; overallVerdict = 'Running Smooth'; }

  // ── Build blocks ──
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const blocks: object[] = [
    { type: 'header', text: { type: 'plain_text', text: `${overallEmoji} Weekly Pulse — ${overallVerdict}`, emoji: true } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Week of ${dateStr}` }] },
    { type: 'divider' },
  ];

  // Section 1: OPS SNAPSHOT
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*📋 Ops Snapshot*' } });

  for (const area of opsAreas) {
    const keys = areaProjectMap[area];
    const areaIssues = activeOps.filter((i) => keys.includes(i.fields.project.key));
    const areaOverdue = areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      const daysLate = daysBetween(today, due);
      return due < today && daysLate <= 90;
    });
    const worstDays = areaOverdue.length > 0
      ? Math.max(...areaOverdue.map((i) => daysBetween(today, new Date(i.fields.duedate!))))
      : 0;
    const dueCount = areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
      return due >= today && due <= weekEnd;
    }).length;
    const staleCount = areaIssues.filter((i) => {
      if (categorize(i.fields.status.name) !== 'inProgress' || !i.fields.updated) return false;
      const days = daysBetween(today, new Date(i.fields.updated));
      return days >= 3 && days <= 90; // 90-day cap: older = archaeology not signal
    }).length;
    const areaHours = tempoLastWeek
      ? keys.reduce((sum, k) => sum + (tempoLastWeek.byProject[k] ?? 0), 0)
      : 0;

    let signal = '🟢';
    if (areaOverdue.length >= 3 || staleCount >= 3) signal = '🔴';
    else if (areaOverdue.length > 0 || staleCount > 0) signal = '🟡';

    const parts: string[] = [];
    if (areaOverdue.length > 0) parts.push(`*${areaOverdue.length} overdue* (${worstDays}d)`);
    if (staleCount > 0) parts.push(`*${staleCount} stale*`);
    if (areaOverdue.length === 0 && staleCount === 0) parts.push('✓ clean');
    parts.push(`${dueCount} due this week`);
    if (tempoLastWeek) parts.push(`${round(areaHours)}h last week`);

    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `${signal}  *${area}*\n      ${parts.join('  •  ')}` } });
  }

  blocks.push({ type: 'divider' });

  // Section 2: OPERATIONAL HEALTH
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*🏥 Operational Health*' } });

  const healthLines: string[] = [];

  if (overdue.length > 0) {
    const lines = overdue.slice(0, 5).map((i) => {
      const days = daysBetween(today, new Date(i.fields.duedate!));
      const assignee = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
      return `• <${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)} — *${days}d late* (${assignee})`;
    });
    if (overdue.length > 5) lines.push(`_...and ${overdue.length - 5} more_`);
    healthLines.push(`🔴 *Overdue (${overdue.length})*\n${lines.join('\n')}`);
  } else {
    healthLines.push('✅ *No overdue tasks* — clean slate!');
  }

  if (stale.length > 0) {
    const lines = stale.slice(0, 5).map((i) => {
      const days = daysBetween(today, new Date(i.fields.updated!));
      const assignee = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned').split(' ')[0];
      return `• <${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)} — *${days}d silent* (${assignee})`;
    });
    if (stale.length > 5) lines.push(`_...and ${stale.length - 5} more_`);
    healthLines.push(`🟡 *Stale — No Updates in 3+ Days (${stale.length})*\n${lines.join('\n')}`);
  }

  if (timesheetLine) healthLines.push(timesheetLine);

  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: healthLines.join('\n\n') } });
  blocks.push({ type: 'divider' });

  // Footer
  blocks.push({ type: 'divider' });
  const inProgress = allActive.filter((i) => categorize(i.fields.status.name) === 'inProgress').length;
  const noDueDate = allActive.filter((i) => !i.fields.duedate).length;
  blocks.push({
    type: 'context',
    elements: [{
      type: 'mrkdwn',
      text: `📊 *Quick Stats:* ${allActive.length} active  •  ${inProgress} in progress  •  ${overdue.length} overdue  •  ${stale.length} stale  •  ${recurringCount} recurring  •  ${noDueDate} missing due dates  •  <https://controltower-wine.vercel.app|Open Control Tower>`,
    }],
  });

  return blocks;
}

// ─── Friday Digest ────────────────────────────────────────────────────────────

function buildFridayDigest(
  opsIssues: JiraIssue[],
  tempoThisWeek: TempoWeekData | null,
): object[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const opsKeys = new Set<string>(OPS_PROJECTS);
  const weekStart = new Date(today);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  weekStart.setHours(0, 0, 0, 0);

  const allIssues = opsIssues;

  // Completed this week — deactivated users and epics excluded
  const completedThisWeek = allIssues.filter((i) => {
    if (categorize(i.fields.status.name) !== 'done') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    if (i.fields.assignee?.active === false) return false;
    const changed = i.fields.statuscategorychangedate ?? i.fields.updated;
    if (!changed) return false;
    return new Date(changed) >= weekStart;
  });

  const completedByPerson: Record<string, string[]> = {};
  completedThisWeek.forEach((i) => {
    const name = formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned');
    if (!completedByPerson[name]) completedByPerson[name] = [];
    if (completedByPerson[name].length < 3) {
      completedByPerson[name].push(`<${JIRA_BROWSE}/${i.key}|${i.key}> ${i.fields.summary.slice(0, 45)}`);
    }
  });

  const completedByArea: Record<string, number> = {};
  completedThisWeek.forEach((i) => {
    const area = resolveArea(i.fields.project.key);
    completedByArea[area] = (completedByArea[area] ?? 0) + 1;
  });

  // Active — epics, unassigned, and deactivated users excluded
  const active = allIssues.filter((i) => {
    const s = categorize(i.fields.status.name);
    if (s === 'done' || s === 'recurring') return false;
    if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    if (!i.fields.assignee) return false;
    if (i.fields.assignee.active === false) return false;
    return true;
  });

  const overdue = active.filter((i) => {
    if (!i.fields.duedate) return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    const daysLate = daysBetween(today, due);
    return due < today && daysLate <= 90;
  });

  const stale = active.filter((i) => {
    if (categorize(i.fields.status.name) !== 'inProgress') return false;
    if (!i.fields.updated) return false;
    const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
    const isOps = opsKeys.has(i.fields.project.key);
    const days = daysBetween(today, new Date(i.fields.updated));
    if (isEpic && isOps) return false;
    if (isEpic) return days >= 14;
    return days >= 3;
  });

  const blocks: object[] = [
    { type: 'header', text: { type: 'plain_text', text: '📊 Friday Recap — What Happened This Week', emoji: true } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `*${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}*  •  Control Tower Weekly Recap` }] },
    { type: 'divider' },
  ];

  if (completedThisWeek.length > 0) {
    const areaLine = Object.entries(completedByArea)
      .sort(([, a], [, b]) => b - a)
      .map(([area, count]) => `${area}: ${count}`)
      .join('  •  ');
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `✅ *Completed This Week (${completedThisWeek.length})*\n${areaLine}` } });

    const personLines = Object.entries(completedByPerson)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 6)
      .map(([name, tasks]) => {
        const total = completedThisWeek.filter(
          (i) => formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned') === name,
        ).length;
        const extra = total > 3 ? ` _(+${total - 3} more)_` : '';
        return `*${name}* (${total})${extra}\n   ${tasks.join('\n   ')}`;
      });
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: personLines.join('\n\n') } });
  } else {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '⚠️ *No tasks completed this week.* Something might be off.' } });
  }

  blocks.push({ type: 'divider' });

  if (tempoThisWeek && tempoThisWeek.total > 0) {
    const topPeople = Object.entries(tempoThisWeek.byPerson)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, hrs]) => `${name.split(' ')[0]}: ${round(hrs)}h`)
      .join('  •  ');
    const topProjects = Object.entries(tempoThisWeek.byProject)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([proj, hrs]) => `${resolveArea(proj)}: ${round(hrs)}h`)
      .join('  •  ');
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `⏱️ *Hours Logged This Week: ${round(tempoThisWeek.total)}h*\n\n*By person:* ${topPeople}\n*By project:* ${topProjects}` },
    });
    blocks.push({ type: 'divider' });
  }

  const slippedLines: string[] = [];
  if (overdue.length > 0) slippedLines.push(`🔴 *${overdue.length} overdue* — oldest: <${JIRA_BROWSE}/${overdue[0].key}|${overdue[0].key}>`);
  if (stale.length > 0) slippedLines.push(`🟡 *${stale.length} stale* — no updates in 3+ days`);
  if (slippedLines.length > 0) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `⚠️ *Carrying Into Next Week*\n${slippedLines.join('\n')}` } });
  } else {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '🎉 *Clean exit — nothing overdue or stale heading into next week!*' } });
  }

  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `📈 *Week Summary:* ${completedThisWeek.length} completed  •  ${tempoThisWeek ? round(tempoThisWeek.total) + 'h logged' : 'Tempo unavailable'}  •  ${overdue.length} overdue  •  ${stale.length} stale  •  ${active.length} active`,
      }],
    },
  );

  return blocks;
}

// ─── Send to Slack ────────────────────────────────────────────────────────────

async function sendToSlack(blocks: object[]): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.error('[Digest] SLACK_WEBHOOK_URL not configured');
    return false;
  }
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`[Digest] Slack webhook error: ${res.status} ${text}`);
    return false;
  }
  return true;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') ?? 'monday') as DigestType;
  const dryRun = searchParams.get('dry') === 'true';

  const authKey = searchParams.get('key');
  const expectedKey = process.env.DIGEST_SECRET_KEY ?? '';
  if (expectedKey && authKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[Digest] Building ${type} digest (ops-only)...`);

    // Fetch Jira data — ops only (delivery moved to PSA)
    const opsIssues = await fetchOpsIssues();

    console.log(`[Digest] Ops: ${opsIssues.length} issues`);

    if (type === 'monday') {
      // Monday uses last week's Tempo hours for context
      const tempoLastWeek = await fetchTempoWeekData(1).catch(() => null);
      const blocks = buildMondayDigest(opsIssues, tempoLastWeek);

      if (dryRun) {
        return NextResponse.json({
          type, blocks, blockCount: blocks.length,
          opsIssueCount: opsIssues.length,
        });
      }
      const sent = await sendToSlack(blocks);
      return NextResponse.json({ success: sent, type, blockCount: blocks.length, message: sent ? 'Monday digest sent' : 'Failed to send' });

    } else {
      // Friday uses this week's Tempo hours for the recap
      const tempoThisWeek = await fetchTempoWeekData(0).catch(() => null);
      const blocks = buildFridayDigest(opsIssues, tempoThisWeek);

      if (dryRun) {
        return NextResponse.json({ type, blocks, blockCount: blocks.length, issueCount: opsIssues.length });
      }
      const sent = await sendToSlack(blocks);
      return NextResponse.json({ success: sent, type, message: sent ? 'Friday digest sent' : 'Failed to send' });
    }

  } catch (error) {
    console.error('[Digest] Error:', error);
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
````

## File: src/components/dashboard/ReportsTab.tsx
````typescript
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Loader2, TrendingUp, Clock, Users, BarChart3,
  AlertCircle, CheckCircle2, Zap, Grid3X3, ChevronDown, ChevronUp,
  Eye, Send, AlertOctagon, CalendarOff,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { categorizeStatus, AREA_MAP, JIRA_BROWSE_URL, formatDisplayName } from '@/lib/constants';
import LoadingProgress from './LoadingProgress';
import type { JiraIssue, ActualsResponse } from '@/types';

type ReportSection = 'delivery' | 'time' | 'insights' | 'monitor';
type TimePeriod = 'week' | 'month' | 'last-month' | 'all';

const COLORS = ['#4F46E5', '#059669', '#D97706', '#DC2626', '#8B5CF6', '#06B6D4', '#EC4899', '#64748B'];
const GREEN = '#059669';
const AMBER = '#D97706';
const RED = '#DC2626';
const INDIGO = '#4F46E5';
const SLATE = '#64748B';

function getDateRange(period: TimePeriod): { from: Date; to: Date } {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const to = new Date(now);
  switch (period) {
    case 'week': { const from = new Date(now); const day = from.getDay(); from.setDate(from.getDate() - (day === 0 ? 6 : day - 1)); return { from, to }; }
    case 'month': return { from: new Date(now.getFullYear(), now.getMonth(), 1), to };
    case 'last-month': return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
    default: return { from: new Date(2020, 0, 1), to };
  }
}

function resolveAreaName(projectKey: string): string {
  return (AREA_MAP as Record<string, string>)[projectKey] ?? projectKey;
}

function ReportCard({ title, subtitle, children, icon: Icon, action }: { title: string; subtitle?: string; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatPill({ label, value, color = 'text-slate-800', sub }: { label: string; value: string | number; color?: string; sub?: string; }) {
  return (
    <div className="text-center px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
      <div className={`text-xl font-bold leading-none mb-1 ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function PeriodSelector({ value, onChange }: { value: TimePeriod; onChange: (v: TimePeriod) => void }) {
  const opts: Array<{ key: TimePeriod; label: string }> = [
    { key: 'week', label: 'This Week' }, { key: 'month', label: 'This Month' },
    { key: 'last-month', label: 'Last Month' }, { key: 'all', label: 'All Time' },
  ];
  return (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
      {opts.map(({ key, label }) => (
        <button key={key} onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${value === key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >{label}</button>
      ))}
    </div>
  );
}

interface ReportsTabProps { jiraIssues: JiraIssue[]; deliveryIssues: JiraIssue[]; }

/**
 * Reports Tab — four-section analytics dashboard.
 *
 * Sections:
 *  1. Delivery Performance — task completion by person/area, epic progress
 *  2. Time Intelligence — Tempo hours distribution, utilization, peak load days
 *  3. Operational Insights — cross-reference Jira + Tempo, person performance, area scorecard
 *  4. Monitor — health metrics (missing timesheets, ghost tasks, overtime, weekend work)
 *
 * Data sources:
 *  - jiraIssues: ops tasks from /api/jira
 *  - deliveryIssues: client delivery tasks from /api/jira/delivery-all
 *  - tempoData: time tracking from /api/tempo/actuals (fetched on-demand)
 *
 * Deactivated Jira users (active=false) are filtered from all person-level metrics.
 * Display names in "firstname.lastname" format are auto-capitalized via formatDisplayName().
 */
export default function ReportsTab({ jiraIssues, deliveryIssues }: ReportsTabProps) {
  const [tempoData, setTempoData] = useState<ActualsResponse | null>(null);
  const [prevTempoData, setPrevTempoData] = useState<ActualsResponse | null>(null);
  const [tempoLoading, setTempoLoading] = useState(true);
  const [tempoFetched, setTempoFetched] = useState(false);
  const [activeSection, setActiveSection] = useState<ReportSection>('delivery');
  const [deliveryPeriod, setDeliveryPeriod] = useState<TimePeriod>('month');
  const [expandedDeliveryArea, setExpandedDeliveryArea] = useState<string | null>(null);
  const [hoursPerPersonOpen, setHoursPerPersonOpen] = useState(true);
  const [personPerfOpen, setPersonPerfOpen] = useState(true);
  const [copiedNudge, setCopiedNudge] = useState<string | null>(null);
  const [expandedStale, setExpandedStale] = useState<string | null>(null);
  const [recurringMonth, setRecurringMonth] = useState<'current' | 'previous'>('current');

  const fetchTempo = useCallback(async () => {
    if (tempoFetched) return;
    setTempoLoading(true);
    try {
      const now = new Date();
      const cy = now.getFullYear(), cm = now.getMonth() + 1;
      const pm = cm === 1 ? 12 : cm - 1, py = cm === 1 ? cy - 1 : cy;
      const [r1, r2] = await Promise.all([
        fetch(`/api/tempo/actuals?year=${cy}&month=${cm}`),
        fetch(`/api/tempo/actuals?year=${py}&month=${pm}`),
      ]);
      if (r1.ok) setTempoData(await r1.json());
      if (r2.ok) setPrevTempoData(await r2.json());
      setTempoFetched(true);
    } catch (err) { console.error('[Reports] Tempo error:', err); }
    finally { setTempoLoading(false); }
  }, [tempoFetched]);

  // Prefetch Tempo data immediately in background — don't wait for tab switch
  useEffect(() => { fetchTempo(); }, [fetchTempo]);

  const allIssues = useMemo(() => {
    const keys = new Set(jiraIssues.map((i) => i.key));
    const combined = [...jiraIssues];
    deliveryIssues.forEach((i) => { if (!keys.has(i.key)) combined.push(i); });
    return combined;
  }, [jiraIssues, deliveryIssues]);

  const filterByPeriod = useCallback((issues: JiraIssue[], period: TimePeriod, statusFilter?: 'done') => {
    const { from, to } = getDateRange(period);
    return issues.filter((i) => {
      if (statusFilter && categorizeStatus(i.fields.status.name) !== statusFilter) return false;
      if (period === 'all') return statusFilter ? categorizeStatus(i.fields.status.name) === statusFilter : true;
      const ref = i.fields.statuscategorychangedate ? new Date(i.fields.statuscategorychangedate) : i.fields.updated ? new Date(i.fields.updated) : null;
      if (!ref) return false;
      return ref >= from && ref <= to;
    });
  }, []);

  // ── Jira Metrics ───────────────────────────────────────────
  const jiraMetrics = useMemo(() => {
    const issues = allIssues;
    const active = issues.filter((i) => { const s = categorizeStatus(i.fields.status.name); return s !== 'done' && s !== 'recurring'; });
    const recurring = issues.filter((i) => categorizeStatus(i.fields.status.name) === 'recurring');
    const doneInPeriod = filterByPeriod(issues, deliveryPeriod, 'done');
    const inProgress = issues.filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress');
    const withDue = active.filter((i) => i.fields.duedate);
    const overdue = withDue.filter((i) => { const d = new Date(i.fields.duedate!); d.setHours(0,0,0,0); return d < new Date(new Date().setHours(0,0,0,0)); });

    // Stale detection: exclude epics from ops areas entirely, give delivery epics 14-day grace
    const opsProjectKeys = new Set(Object.keys(AREA_MAP));
    const stale = inProgress.filter((i) => {
      if (!i.fields.updated) return false;
      if (!i.fields.assignee) return false; // skip unassigned — no owner, not actionable
      if (i.fields.assignee?.active === false) return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
      const daysSilent = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);
      return daysSilent >= 3 && daysSilent <= 90;
    });

    // Recurring breakdown by area and person
    const recurringByArea: Record<string, number> = {};
    const recurringByPerson: Record<string, string[]> = {};
    const recurringIssueKeys = new Set<string>();
    const recurringKeysByArea: Record<string, Set<string>> = {};
    recurring.forEach((i) => {
      const area = resolveAreaName(i.fields.project.key);
      recurringByArea[area] = (recurringByArea[area] ?? 0) + 1;
      recurringIssueKeys.add(i.key);
      if (!recurringKeysByArea[area]) recurringKeysByArea[area] = new Set();
      recurringKeysByArea[area].add(i.key);
      const name = formatDisplayName(i.fields.assignee?.displayName ?? '');
      if (name) {
        if (!recurringByPerson[name]) recurringByPerson[name] = [];
        if (recurringByPerson[name].length < 5) recurringByPerson[name].push(i.fields.summary.slice(0, 50));
      }
    });

    const personCompleted: Record<string, number> = {};
    doneInPeriod.forEach((i) => { const n = formatDisplayName(i.fields.assignee?.displayName ?? ''); if (n && i.fields.assignee?.active !== false) personCompleted[n] = (personCompleted[n] ?? 0) + 1; });
    const personStale: Record<string, Array<{ key: string; summary: string; project: string; daysSilent: number }>> = {};
    stale.forEach((i) => {
      const n = formatDisplayName(i.fields.assignee?.displayName ?? '');
      if (!n) return; // skip unassigned — no owner, not actionable
      if (i.fields.assignee?.active === false) return;
      if (!personStale[n]) personStale[n] = [];
      const daysSilent = Math.floor((Date.now() - new Date(i.fields.updated!).getTime()) / 86400000);
      personStale[n].push({ key: i.key, summary: i.fields.summary.slice(0, 60), project: i.fields.project.name || i.fields.project.key, daysSilent });
    });
    const personOverdue: Record<string, number> = {};
    overdue.forEach((i) => { const n = formatDisplayName(i.fields.assignee?.displayName ?? ''); if (n && i.fields.assignee?.active !== false) personOverdue[n] = (personOverdue[n] ?? 0) + 1; });

    const opsKeys = new Set(Object.keys(AREA_MAP));
    const areaTasks: Record<string, { total: number; done: number; inProgress: number; overdue: number; isDelivery: boolean; projects?: Record<string, { total: number; done: number; overdue: number }> }> = {};
    issues.forEach((i) => {
      const k = i.fields.project.key, s = categorizeStatus(i.fields.status.name);
      if (opsKeys.has(k)) {
        const a = resolveAreaName(k);
        if (!areaTasks[a]) areaTasks[a] = { total: 0, done: 0, inProgress: 0, overdue: 0, isDelivery: false };
        areaTasks[a].total++; if (s === 'done') areaTasks[a].done++; if (s === 'inProgress') areaTasks[a].inProgress++;
      } else {
        if (!areaTasks['Delivery']) areaTasks['Delivery'] = { total: 0, done: 0, inProgress: 0, overdue: 0, isDelivery: true, projects: {} };
        areaTasks['Delivery'].total++; if (s === 'done') areaTasks['Delivery'].done++; if (s === 'inProgress') areaTasks['Delivery'].inProgress++;
        const pn = i.fields.project.name || k;
        if (!areaTasks['Delivery'].projects![pn]) areaTasks['Delivery'].projects![pn] = { total: 0, done: 0, overdue: 0 };
        areaTasks['Delivery'].projects![pn].total++; if (s === 'done') areaTasks['Delivery'].projects![pn].done++;
      }
    });
    overdue.forEach((i) => {
      const k = i.fields.project.key;
      if (opsKeys.has(k)) { const a = resolveAreaName(k); if (areaTasks[a]) areaTasks[a].overdue++; }
      else { if (areaTasks['Delivery']) { areaTasks['Delivery'].overdue++; const pn = i.fields.project.name || k; if (areaTasks['Delivery'].projects?.[pn]) areaTasks['Delivery'].projects[pn].overdue++; } }
    });

    const epicMap: Record<string, { name: string; total: number; done: number; area: string }> = {};
    issues.forEach((i) => {
      if (i.fields.parent) {
        const k = i.fields.parent.key;
        if (!epicMap[k]) epicMap[k] = { name: i.fields.parent.fields.summary, total: 0, done: 0, area: resolveAreaName(i.fields.project.key) };
        epicMap[k].total++; if (categorizeStatus(i.fields.status.name) === 'done') epicMap[k].done++;
      }
    });

    // Backlog Hygiene: tasks in To-Do/Backlog with no updates for 30+ days
    const now = new Date();
    const backlogStale = issues.filter((i) => {
      if (categorizeStatus(i.fields.status.name) !== 'todo') return false;
      if (!i.fields.updated) return false;
      if (!i.fields.assignee) return false;
      if (i.fields.assignee?.active === false) return false;
      const daysSince = Math.floor((now.getTime() - new Date(i.fields.updated).getTime()) / 86400000);
      return daysSince >= 30;
    });
    const backlogByArea: Record<string, number> = {};
    backlogStale.forEach((i) => {
      const area = resolveAreaName(i.fields.project.key);
      backlogByArea[area] = (backlogByArea[area] ?? 0) + 1;
    });

    return { total: issues.length, active: active.length, doneInPeriod: doneInPeriod.length, overdue: overdue.length, stale: stale.length, recurringCount: recurring.length, recurringByArea, recurringByPerson, recurringIssueKeys, recurringKeysByArea, personCompleted, personStale, personOverdue, areaTasks, epicMap, backlogStaleCount: backlogStale.length, backlogByArea };
  }, [allIssues, deliveryPeriod, filterByPeriod]);

  // ── Tempo Metrics ──────────────────────────────────────────
  const tempoMetrics = useMemo(() => {
    if (!tempoData) return null;
    const prevTotal = prevTempoData?.totalHours ?? 0;
    const hoursDelta = prevTotal > 0 ? Math.round(((tempoData.totalHours - prevTotal) / prevTotal) * 100) : 0;
    const dayOfWeekHours: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    tempoData.people.forEach((p) => p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
      // Parse date as local to avoid timezone shift (Tempo dates are YYYY-MM-DD)
      const parts = e.date.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      dayOfWeekHours[dayNames[d.getDay()]] += e.hours;
    }))));
    const personUtilization: Record<string, { current: number; previous: number; delta: number }> = {};
    tempoData.people.forEach((p) => { personUtilization[p.name] = { current: p.totalHours, previous: 0, delta: 0 }; });
    if (prevTempoData) prevTempoData.people.forEach((p) => { if (personUtilization[p.name]) personUtilization[p.name].previous = p.totalHours; else personUtilization[p.name] = { current: 0, previous: p.totalHours, delta: 0 }; });
    Object.values(personUtilization).forEach((v) => { v.delta = v.previous > 0 ? Math.round(((v.current - v.previous) / v.previous) * 100) : 0; });
    const cleanProjects = tempoData.projects.filter((p) => p.projectKey !== '(unlinked)' && p.projectName !== '(No Jira Issue)');
    const noJiraHours = tempoData.projects.filter((p) => p.projectKey === '(unlinked)' || p.projectName === '(No Jira Issue)').reduce((s, p) => s + p.hours, 0);
    const cleanPeople = tempoData.people.map((p) => ({ ...p, projects: p.projects.filter((pr) => pr.projectKey !== '(unlinked)' && pr.projectName !== '(No Jira Issue)') }));
    return { totalHours: tempoData.totalHours, totalPeople: tempoData.totalPeople, totalProjects: cleanProjects.length, prevTotal, hoursDelta, dayOfWeekHours, personUtilization, people: cleanPeople, projects: cleanProjects, noJiraHours: Math.round(noJiraHours * 10) / 10 };
  }, [tempoData, prevTempoData]);

  // ── Cross Metrics ──────────────────────────────────────────
  const crossMetrics = useMemo(() => {
    if (!jiraMetrics || !tempoMetrics) return null;
    const opsKeys = new Set(Object.keys(AREA_MAP));

    // Build a set of "active" delivery project keys — projects with Tempo hours this month
    const activeDeliveryKeys = new Set<string>();
    tempoMetrics.projects.forEach((p) => {
      if (!opsKeys.has(p.projectKey) && p.hours > 0) activeDeliveryKeys.add(p.projectKey);
    });

    // Area Health: only include delivery sub-projects that have hours this month
    const areaHealth: Array<{ area: string; hours: number; total: number; done: number; inProgress: number; overdue: number; throughputRate: number; isDelivery: boolean; subProjects?: Array<{ name: string; hours: number; total: number; done: number; overdue: number }> }> = [];
    Object.entries(jiraMetrics.areaTasks).forEach(([area, data]) => {
      let hours = 0;
      if (area === 'Delivery') {
        tempoMetrics.projects.forEach((p) => { if (!opsKeys.has(p.projectKey) && p.hours > 0) hours += p.hours; });
      } else {
        const mk = Object.entries(AREA_MAP).filter(([, n]) => n === area).map(([k]) => k);
        tempoMetrics.projects.forEach((p) => { if (mk.includes(p.projectKey)) hours += p.hours; });
      }

      // Filter sub-projects: only show those with hours this month
      const subProjects = data.isDelivery && data.projects ? Object.entries(data.projects)
        .map(([n, pd]) => {
          const tempoProj = tempoMetrics.projects.find((tp) => tp.projectName === n || tp.projectKey === n);
          return { name: n, hours: Math.round(tempoProj?.hours ?? 0), total: pd.total, done: pd.done, overdue: pd.overdue };
        })
        .filter((sp) => sp.hours > 0) // Only active projects with hours this month
        .sort((a, b) => b.hours - a.hours) : undefined;

      // For delivery, recalculate totals based only on active sub-projects
      if (area === 'Delivery' && subProjects) {
        const activeTotals = subProjects.reduce((acc, sp) => ({ total: acc.total + sp.total, done: acc.done + sp.done, overdue: acc.overdue + sp.overdue }), { total: 0, done: 0, overdue: 0 });
        areaHealth.push({ area, hours, total: activeTotals.total, done: activeTotals.done, inProgress: data.inProgress, overdue: activeTotals.overdue, throughputRate: activeTotals.total > 0 ? Math.round((activeTotals.done / activeTotals.total) * 100) : 0, isDelivery: true, subProjects });
      } else {
        areaHealth.push({ area, hours, total: data.total, done: data.done, inProgress: data.inProgress, overdue: data.overdue, throughputRate: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0, isDelivery: data.isDelivery, subProjects });
      }
    });

    // Person Performance: merge Tempo people + Jira-only people (no cap)
    const personPerformance: Array<{ name: string; hours: number; completed: number; overdue: number; stale: number; areas: string[]; hoursPerTask: number | null }> = [];
    const seenPeople = new Set<string>();

    // First: people with Tempo hours
    tempoMetrics.people.forEach((p) => {
      seenPeople.add(p.name);
      const completed = jiraMetrics.personCompleted[p.name] ?? 0;
      const areas = [...new Set(p.projects.map((pr) => resolveAreaName(pr.projectKey)))];
      personPerformance.push({ name: p.name, hours: p.totalHours, completed, overdue: jiraMetrics.personOverdue[p.name] ?? 0, stale: (jiraMetrics.personStale[p.name] ?? []).length, areas, hoursPerTask: completed > 0 ? Math.round((p.totalHours / completed) * 10) / 10 : null });
    });

    // Second: people with Jira activity but no Tempo hours this month
    const allJiraPeople = new Set([...Object.keys(jiraMetrics.personCompleted), ...Object.keys(jiraMetrics.personOverdue), ...Object.keys(jiraMetrics.personStale)]);
    allJiraPeople.forEach((name) => {
      if (seenPeople.has(name) || !name) return;
      seenPeople.add(name);
      const completed = jiraMetrics.personCompleted[name] ?? 0;
      personPerformance.push({ name, hours: 0, completed, overdue: jiraMetrics.personOverdue[name] ?? 0, stale: (jiraMetrics.personStale[name] ?? []).length, areas: [], hoursPerTask: null });
    });

    personPerformance.sort((a, b) => b.hours - a.hours);

    return { areaHealth, personPerformance, activeDeliveryKeys };
  }, [jiraMetrics, tempoMetrics]);

  // ── Monitor Metrics ─────────────────────────────────────────
  const monitorMetrics = useMemo(() => {
    if (!tempoData) return null;

    // Safe date parse: "YYYY-MM-DD" → local Date (avoids UTC timezone shift)
    const parseLocalDate = (s: string) => { const p = s.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); };

    // 1. Missing Timesheets: people with 0 hours last week
    const now = new Date();
    const lastMonday = new Date(now);
    const day = lastMonday.getDay();
    lastMonday.setDate(lastMonday.getDate() - (day === 0 ? 6 : day - 1) - 7);
    lastMonday.setHours(0, 0, 0, 0);
    const lastFriday = new Date(lastMonday);
    lastFriday.setDate(lastMonday.getDate() + 4);
    lastFriday.setHours(23, 59, 59, 999);

    const lastWeekHours: Record<string, number> = {};
    const allPeopleSet = new Set<string>();
    tempoData.people.forEach((p) => {
      allPeopleSet.add(p.name);
      let weekHrs = 0;
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
        const d = parseLocalDate(e.date);
        if (d >= lastMonday && d <= lastFriday) weekHrs += e.hours;
      })));
      lastWeekHours[p.name] = weekHrs;
    });
    const missingTimesheets = [...allPeopleSet].filter((n) => (lastWeekHours[n] ?? 0) === 0).sort();
    const lowTimesheets = [...allPeopleSet].filter((n) => (lastWeekHours[n] ?? 0) > 0 && (lastWeekHours[n] ?? 0) < 20).map((n) => ({ name: n, hours: Math.round((lastWeekHours[n] ?? 0) * 10) / 10 })).sort((a, b) => a.hours - b.hours);

    // 2. Unlinked Time: hours without Jira ticket
    const unlinkedByPerson: Array<{ name: string; hours: number; entries: Array<{ date: string; hours: number; comment: string }> }> = [];
    tempoData.people.forEach((p) => {
      const unlinked: Array<{ date: string; hours: number; comment: string }> = [];
      p.projects.forEach((pr) => {
        if (pr.projectKey === '(unlinked)' || pr.projectName === '(No Jira Issue)') {
          pr.tasks.forEach((t) => t.entries.forEach((e) => unlinked.push({ date: e.date, hours: e.hours, comment: e.comment || t.summary })));
        }
      });
      if (unlinked.length > 0) {
        unlinkedByPerson.push({ name: p.name, hours: Math.round(unlinked.reduce((s, e) => s + e.hours, 0) * 10) / 10, entries: unlinked.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10) });
      }
    });
    unlinkedByPerson.sort((a, b) => b.hours - a.hours);

    // 3. Overtime Watch: days with 9+ hours
    const overtimeDays: Array<{ name: string; date: string; hours: number }> = [];
    tempoData.people.forEach((p) => {
      const dayMap: Record<string, number> = {};
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => { dayMap[e.date] = (dayMap[e.date] ?? 0) + e.hours; })));
      Object.entries(dayMap).forEach(([date, hrs]) => { if (hrs >= 9) overtimeDays.push({ name: p.name, date, hours: Math.round(hrs * 10) / 10 }); });
    });
    overtimeDays.sort((a, b) => b.hours - a.hours);

    // 4. Ghost Tasks: In Progress in Jira with 0 Tempo hours this month
    const tempoIssueKeys = new Set<string>();
    tempoData.people.forEach((p) => p.projects.forEach((pr) => pr.tasks.forEach((t) => { if (t.issueKey) tempoIssueKeys.add(t.issueKey); })));
    const allIssuesCombined = [...(jiraIssues || []), ...(deliveryIssues || [])];
    const ghostTasks = allIssuesCombined.filter((i) => {
      if (categorizeStatus(i.fields.status.name) !== 'inProgress') return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
      if (i.fields.assignee?.active === false) return false;
      const daysSinceUpdate = i.fields.updated ? Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000) : 999;
      return daysSinceUpdate >= 7 && !tempoIssueKeys.has(i.key);
    }).map((i) => ({
      key: i.key, summary: i.fields.summary, assignee: formatDisplayName(i.fields.assignee?.displayName ?? 'Unassigned'),
      daysSilent: i.fields.updated ? Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000) : 999,
      project: i.fields.project.name,
    })).sort((a, b) => b.daysSilent - a.daysSilent);

    // 5. Off-Hours Work: hours on Sat/Sun (safe local parsing)
    const weekendEntries: Array<{ name: string; date: string; hours: number }> = [];
    tempoData.people.forEach((p) => {
      p.projects.forEach((pr) => pr.tasks.forEach((t) => t.entries.forEach((e) => {
        const d = parseLocalDate(e.date).getDay();
        if (d === 0 || d === 6) weekendEntries.push({ name: p.name, date: e.date, hours: e.hours });
      })));
    });
    // Aggregate by person
    const weekendByPerson: Record<string, { hours: number; days: Set<string> }> = {};
    weekendEntries.forEach((e) => {
      if (!weekendByPerson[e.name]) weekendByPerson[e.name] = { hours: 0, days: new Set() };
      weekendByPerson[e.name].hours += e.hours;
      weekendByPerson[e.name].days.add(e.date);
    });
    const weekendWarriors = Object.entries(weekendByPerson).map(([name, d]) => ({ name, hours: Math.round(d.hours * 10) / 10, days: d.days.size })).sort((a, b) => b.hours - a.hours);

    // 6. Zero-Hour People: assigned Jira tasks but 0 Tempo hours this month
    const tempoPeople = new Set(tempoData.people.map((p) => p.name));
    const jiraAssignees = new Set<string>();
    allIssuesCombined.forEach((i) => {
      if (i.fields.assignee?.displayName && i.fields.assignee?.active !== false && categorizeStatus(i.fields.status.name) !== 'done') {
        jiraAssignees.add(formatDisplayName(i.fields.assignee.displayName));
      }
    });
    const zeroPeople = [...jiraAssignees].filter((n) => !tempoPeople.has(n)).sort();

    const weekLabel = `${lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${lastFriday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return { missingTimesheets, lowTimesheets, unlinkedByPerson, overtimeDays, ghostTasks, weekendWarriors, zeroPeople, weekLabel };
  }, [tempoData, jiraIssues, deliveryIssues]);

  const sections: Array<{ key: ReportSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'delivery', label: 'Delivery Performance', icon: CheckCircle2 },
    { key: 'time', label: 'Time Intelligence', icon: Clock },
    { key: 'insights', label: 'Operational Insights', icon: Zap },
    { key: 'monitor', label: 'Monitor', icon: Eye },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 -mx-1 px-1 overflow-x-auto">
        {sections.map(({ key, label, icon: SIcon }) => (
          <button key={key} onClick={() => setActiveSection(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeSection === key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}
          ><SIcon className="w-3.5 h-3.5" />{label}</button>
        ))}
      </div>

      {/* ═══ DELIVERY PERFORMANCE ═══ */}
      {activeSection === 'delivery' && jiraMetrics && (
        <div className="space-y-4">
          <ReportCard title="Tasks Completed per Person" icon={Users} subtitle={`${jiraMetrics.doneInPeriod} tasks completed`}>
            <div className="mb-3"><PeriodSelector value={deliveryPeriod} onChange={setDeliveryPeriod} /></div>
            {Object.keys(jiraMetrics.personCompleted).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No tasks completed in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(180, Object.keys(jiraMetrics.personCompleted).length * 30)}>
                <BarChart data={Object.entries(jiraMetrics.personCompleted).filter(([n]) => n !== 'Unassigned').map(([n, d]) => ({ name: n.split(' ')[0], done: d, overdue: jiraMetrics.personOverdue[n] ?? 0, stale: (jiraMetrics.personStale[n] ?? []).length })).sort((a, b) => b.done - a.done)} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="done" fill={GREEN} name="Done" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="overdue" fill={RED} name="Overdue" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="stale" fill={AMBER} name="Stale" radius={[0, 4, 4, 0]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ReportCard>

          <ReportCard title="Area Breakdown" subtitle="All areas including active delivery projects — click Delivery to expand" icon={BarChart3}>
            <div className="space-y-3">
              {Object.entries(jiraMetrics.areaTasks).sort(([, a], [, b]) => b.total - a.total).map(([area, data]) => {
                const dp = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
                const op = data.total > 0 ? Math.round((data.overdue / data.total) * 100) : 0;
                const isExp = expandedDeliveryArea === area;
                return (
                  <div key={area}>
                    <div className={`flex items-center justify-between mb-1 ${data.isDelivery ? 'cursor-pointer group' : ''}`} onClick={() => data.isDelivery && setExpandedDeliveryArea(isExp ? null : area)}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-700">{area}</span>
                        {data.isDelivery && <span className="text-slate-400">{isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-emerald-600 font-semibold">{data.done} done</span>
                        <span className="text-blue-600">{data.inProgress} active</span>
                        {data.overdue > 0 && <span className="text-red-600 font-semibold">{data.overdue} overdue</span>}
                        <span className="text-slate-400">{data.total} total</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-400" style={{ width: `${dp}%` }} /><div className="h-full bg-red-400" style={{ width: `${op}%` }} />
                    </div>
                    {data.isDelivery && isExp && data.projects && (
                      <div className="mt-2 ml-4 space-y-1.5 border-l-2 border-slate-100 pl-3">
                        {Object.entries(data.projects).sort(([, a], [, b]) => b.total - a.total).map(([pn, pd]) => {
                          const pDone = pd.total > 0 ? Math.round((pd.done / pd.total) * 100) : 0;
                          return (<div key={pn}><div className="flex items-center justify-between mb-0.5"><span className="text-xs text-slate-600">{pn}</span><div className="flex items-center gap-2 text-[10px]"><span className="text-emerald-500">{pd.done}/{pd.total}</span>{pd.overdue > 0 && <span className="text-red-500">{pd.overdue} late</span>}</div></div><div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-emerald-300 rounded-full" style={{ width: `${pDone}%` }} /></div></div>);
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ReportCard>

          <ReportCard title="Epic Progress" subtitle="Completion rate per epic across all areas" icon={TrendingUp}>
            <div className="space-y-2.5">
              {Object.entries(jiraMetrics.epicMap).filter(([, e]) => e.total > 1).sort(([, a], [, b]) => (b.done / b.total) - (a.done / a.total)).slice(0, 15).map(([key, epic]) => {
                const pct = Math.round((epic.done / epic.total) * 100);
                return (<div key={key}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{epic.area}</span><span className="text-xs font-medium text-slate-700 truncate max-w-[250px]">{epic.name}</span></div><span className="text-[11px] font-bold text-slate-500">{epic.done}/{epic.total}</span></div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-400' : pct >= 50 ? 'bg-blue-400' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} /></div></div>);
              })}
            </div>
          </ReportCard>

          {jiraMetrics.stale > 0 && (
            <ReportCard title="Stale Task Frequency" subtitle="Who has tasks with no updates in 3+ days (excludes recurring) — click to expand" icon={AlertCircle}>
              <div className="space-y-0">
                {Object.entries(jiraMetrics.personStale).filter(([, tasks]) => tasks.length > 0).sort(([, a], [, b]) => b.length - a.length).map(([name, tasks]) => {
                  const isExpanded = expandedStale === name;
                  return (
                    <div key={name}>
                      <button onClick={() => setExpandedStale(isExpanded ? null : name)} className="flex items-center justify-between w-full py-2 px-1 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded transition-colors text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">{isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</span>
                          <span className="text-sm text-slate-700">{name}</span>
                        </div>
                        <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">{tasks.length} stale</span>
                      </button>
                      {isExpanded && (
                        <div className="ml-5 mb-2 space-y-1">
                          {tasks.sort((a, b) => b.daysSilent - a.daysSilent).map((t) => (
                            <div key={t.key} className="flex items-center justify-between py-1 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <a href={`${JIRA_BROWSE_URL}/${t.key}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-mono font-semibold shrink-0">{t.key}</a>
                                <span className="text-slate-500 truncate">{t.summary}</span>
                              </div>
                              <span className="text-amber-500 font-medium shrink-0 ml-2">{t.daysSilent}d</span>
                            </div>
                          ))}
                          <div className="text-[10px] text-slate-400 pt-0.5">Project: {tasks[0]?.project}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ReportCard>
          )}

        </div>
      )}

      {/* ═══ TIME INTELLIGENCE ═══ */}
      {activeSection === 'time' && (tempoLoading ? (
        <LoadingProgress
          steps={['Fetching timesheets from Tempo...', 'Resolving Jira projects...', 'Computing time distribution...']}
          intervalMs={2000}
        />
      ) : tempoMetrics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatPill label="Total Hours" value={Math.round(tempoMetrics.totalHours)} color="text-indigo-600" sub={tempoMetrics.hoursDelta !== 0 ? `${tempoMetrics.hoursDelta > 0 ? '+' : ''}${tempoMetrics.hoursDelta}% vs last month` : undefined} />
            <StatPill label="People" value={tempoMetrics.totalPeople} />
            <StatPill label="Projects" value={tempoMetrics.totalProjects} />
            <StatPill label="Avg / Person" value={tempoMetrics.totalPeople > 0 ? Math.round(tempoMetrics.totalHours / tempoMetrics.totalPeople) : 0} sub="hours this month" />
          </div>
          {tempoMetrics.noJiraHours > 0 && (
            <div className="rounded-lg bg-amber-50/70 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              <span className="font-semibold">{tempoMetrics.noJiraHours}h</span> logged without a linked Jira ticket.{' '}
              <button onClick={() => setActiveSection('monitor')} className="text-indigo-600 hover:text-indigo-800 font-semibold underline">See details in Monitor →</button>
            </div>
          )}

          {/* Time Distribution + Peak Load Days — side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportCard title="Time Distribution" icon={Grid3X3}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart><Pie data={tempoMetrics.projects.slice(0, 8).map((p) => ({ name: resolveAreaName(p.projectKey), value: Math.round(p.hours) }))} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={(props: PieLabelRenderProps) => `${props.name ?? ''}: ${Math.round((Number(props.percent) || 0) * 100)}%`}>{tempoMetrics.projects.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ fontSize: 12 }} /></PieChart>
              </ResponsiveContainer>
            </ReportCard>
            <ReportCard title="Peak Load Days" icon={Clock}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({ day: d, hours: Math.round(tempoMetrics.dayOfWeekHours[d] ?? 0) }))} margin={{ left: 0, right: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="hours" fill={INDIGO} radius={[4, 4, 0, 0]}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <Cell key={i} fill={d === 'Sat' || d === 'Sun' ? SLATE : INDIGO} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>

          {/* Hours per Person — collapsible, default expanded */}
          <ReportCard title="Hours per Person" subtitle="This month with month-over-month trend" icon={Users}
            action={<button onClick={() => setHoursPerPersonOpen(!hoursPerPersonOpen)} className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">{hoursPerPersonOpen ? <><ChevronUp className="w-3 h-3" />Collapse</> : <><ChevronDown className="w-3 h-3" />Expand</>}</button>}>
            {hoursPerPersonOpen && (
              <div className="space-y-2">
                {Object.entries(tempoMetrics.personUtilization).sort(([, a], [, b]) => b.current - a.current).map(([name, data]) => {
                  const mx = Math.max(...Object.values(tempoMetrics.personUtilization).map((v) => v.current), 1);
                  return (<div key={name} className="flex items-center gap-2"><span className="text-xs font-medium text-slate-700 w-24 truncate">{name.split(' ')[0]}</span><div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.round((data.current / mx) * 100)}%` }} /></div><span className="text-xs font-bold text-slate-600 w-12 text-right">{Math.round(data.current)}h</span>{data.delta !== 0 && <span className={`text-[10px] font-semibold w-10 text-right ${data.delta > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{data.delta > 0 ? '+' : ''}{data.delta}%</span>}</div>);
                })}
              </div>
            )}
          </ReportCard>

          <ReportCard title="Hours by Project/Area" subtitle="Where time is being spent (excludes unlinked)" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={Math.max(180, Math.min(tempoMetrics.projects.length, 15) * 28)}>
              <BarChart data={tempoMetrics.projects.slice(0, 15).map((p) => ({ name: resolveAreaName(p.projectKey), hours: Math.round(p.hours) }))} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="hours" fill={INDIGO} radius={[0, 4, 4, 0]}>{tempoMetrics.projects.slice(0, 15).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>
        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">No Tempo data available.</p></div>)}

      {/* ═══ OPERATIONAL INSIGHTS ═══ */}
      {activeSection === 'insights' && (tempoLoading ? (
        <LoadingProgress
          steps={['Loading time data...', 'Cross-referencing Jira tasks...', 'Building performance metrics...']}
          intervalMs={2000}
        />
      ) : crossMetrics && jiraMetrics && tempoMetrics ? (
        <div className="space-y-4">
          {/* Recurring Work — top of Operational Insights */}
          {jiraMetrics.recurringCount > 0 && (
            <ReportCard title="Recurring Work" subtitle={`${jiraMetrics.recurringCount} ongoing tasks excluded from stale/overdue counts — high counts may signal automation opportunities`} icon={Clock}>
              <div className="space-y-3">
                {/* Month toggle */}
                {tempoData && (
                  <div className="flex gap-1 mb-1">
                    <button onClick={() => setRecurringMonth('current')} className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${recurringMonth === 'current' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      This Month
                    </button>
                    <button onClick={() => setRecurringMonth('previous')} className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${recurringMonth === 'previous' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      Last Month
                    </button>
                  </div>
                )}
                {(() => {
                  // Compute hours per area from Tempo data matched to recurring issue keys
                  const recurringHoursByArea: Record<string, number> = {};
                  const selectedTempo = recurringMonth === 'current' ? tempoData : prevTempoData;
                  if (selectedTempo && jiraMetrics.recurringKeysByArea) {
                    selectedTempo.people.forEach((p) => {
                      p.projects.forEach((pr) => {
                        pr.tasks.forEach((t) => {
                          if (jiraMetrics.recurringIssueKeys.has(t.issueKey)) {
                            // Find which area this key belongs to
                            for (const [area, keys] of Object.entries(jiraMetrics.recurringKeysByArea)) {
                              if (keys.has(t.issueKey)) {
                                recurringHoursByArea[area] = (recurringHoursByArea[area] ?? 0) + t.hours;
                                break;
                              }
                            }
                          }
                        });
                      });
                    });
                  }
                  const totalRecurringHours = Object.values(recurringHoursByArea).reduce((s, h) => s + h, 0);

                  return (
                    <>
                      <div className="space-y-2">
                        {Object.entries(jiraMetrics.recurringByArea).sort(([, a], [, b]) => b - a).map(([area, count]) => {
                          const color = count >= 25 ? 'bg-red-50 text-red-700 border-red-200' : count >= 15 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                          const dot = count >= 25 ? '🔴' : count >= 15 ? '🟡' : '🟢';
                          const hours = Math.round((recurringHoursByArea[area] ?? 0) * 10) / 10;
                          return (
                            <div key={area} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${color}`}>
                              <span className="text-sm font-medium">{dot} {area}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">{hours}h</span>
                                <span className="text-sm font-bold">{count} tasks</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {totalRecurringHours > 0 && (
                        <div className="text-xs text-slate-500 pt-1 font-medium">
                          Total: {Math.round(totalRecurringHours * 10) / 10}h on recurring work ({recurringMonth === 'current' ? 'this' : 'last'} month)
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400">🟢 &lt;15 tasks  🟡 15–24 tasks  🔴 25+ tasks — consider automating</p>
                    </>
                  );
                })()}
              </div>
            </ReportCard>
          )}

          {/* Backlog Hygiene — tasks sitting in To-Do/Backlog 30+ days */}
          {jiraMetrics.backlogStaleCount > 0 && (
            <ReportCard title="Backlog Hygiene" subtitle={`${jiraMetrics.backlogStaleCount} tasks sitting in To-Do / Backlog for 30+ days — review, update, or delete`} icon={AlertCircle}>
              <div className="space-y-2">
                {Object.entries(jiraMetrics.backlogByArea).sort(([, a], [, b]) => b - a).map(([area, count]) => {
                  const color = count >= 20 ? 'bg-red-50 text-red-700 border-red-200' : count >= 10 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200';
                  return (
                    <div key={area} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${color}`}>
                      <span className="text-sm font-medium">{area}</span>
                      <span className="text-sm font-bold">{count} stale</span>
                    </div>
                  );
                })}
                <p className="text-[10px] text-slate-400 pt-1">Tasks untouched for 30+ days in To-Do or Backlog. Time to clean up or prioritize.</p>
              </div>
            </ReportCard>
          )}

          {/* Area Health — only active projects */}
          <ReportCard title="Area Health Overview" subtitle="Only projects with hours logged this month. Throughput = % of tasks marked Done. Click Delivery to expand per client." icon={TrendingUp}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-200"><th className="text-left py-2 font-semibold text-slate-500">Area</th><th className="text-right py-2 font-semibold text-slate-500">Hours</th><th className="text-right py-2 font-semibold text-slate-500">Tasks</th><th className="text-right py-2 font-semibold text-slate-500">Done</th><th className="text-right py-2 font-semibold text-slate-500">Overdue</th><th className="text-right py-2 font-semibold text-slate-500">Throughput</th></tr></thead>
                <tbody>
                  {crossMetrics.areaHealth.filter((r) => r.hours > 0).sort((a, b) => b.hours - a.hours).map((row) => (
                    <React.Fragment key={row.area}>
                      <tr className={`border-b border-slate-50 ${row.isDelivery ? 'cursor-pointer hover:bg-slate-50' : ''}`} onClick={() => row.isDelivery && setExpandedDeliveryArea(expandedDeliveryArea === 'ins-' + row.area ? null : 'ins-' + row.area)}>
                        <td className="py-2 font-medium text-slate-700"><span className="flex items-center gap-1">{row.area}{row.isDelivery && (expandedDeliveryArea === 'ins-' + row.area ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />)}</span></td>
                        <td className="py-2 text-right text-indigo-600 font-semibold">{Math.round(row.hours)}h</td>
                        <td className="py-2 text-right text-slate-600">{row.total}</td>
                        <td className="py-2 text-right text-emerald-600 font-semibold">{row.done}</td>
                        <td className={`py-2 text-right font-semibold ${row.overdue > 0 ? 'text-red-600' : 'text-slate-400'}`}>{row.overdue}</td>
                        <td className="py-2 text-right"><span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${row.throughputRate >= 60 ? 'bg-emerald-50 text-emerald-600' : row.throughputRate >= 30 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{row.throughputRate}%</span></td>
                      </tr>
                      {row.isDelivery && expandedDeliveryArea === 'ins-' + row.area && row.subProjects?.map((sp) => (
                        <tr key={sp.name} className="border-b border-slate-50 bg-slate-50/50">
                          <td className="py-1.5 pl-6 text-slate-500 text-[11px]">{sp.name}</td>
                          <td className="py-1.5 text-right text-indigo-400 text-[11px]">{sp.hours}h</td>
                          <td className="py-1.5 text-right text-slate-400 text-[11px]">{sp.total}</td>
                          <td className="py-1.5 text-right text-emerald-400 text-[11px]">{sp.done}</td>
                          <td className={`py-1.5 text-right text-[11px] ${sp.overdue > 0 ? 'text-red-400' : 'text-slate-300'}`}>{sp.overdue}</td>
                          <td className="py-1.5 text-right text-[11px] text-slate-400">{sp.total > 0 ? Math.round((sp.done / sp.total) * 100) : 0}%</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>

          {/* Person Performance — ALL people, no cap */}
          <ReportCard title="Person Performance Overview" subtitle="Everyone with Tempo hours or Jira activity this month. Completed = tasks moved to Done. Overdue+Stale = tasks needing attention." icon={Users}
            action={<button onClick={() => setPersonPerfOpen(!personPerfOpen)} className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">{personPerfOpen ? <><ChevronUp className="w-3 h-3" />Collapse</> : <><ChevronDown className="w-3 h-3" />Expand</>}</button>}>
            {personPerfOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {crossMetrics.personPerformance.map((p) => (
                  <div key={p.name} className="rounded-lg border border-slate-200 p-3">
                    <div className="font-semibold text-sm text-slate-800 mb-2">{p.name}</div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-center"><div className="text-lg font-bold text-indigo-600">{Math.round(p.hours)}</div><div className="text-[9px] text-slate-400 uppercase">Hours</div></div>
                      <div className="text-center"><div className={`text-lg font-bold ${p.completed > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>{p.completed}</div><div className="text-[9px] text-slate-400 uppercase">Completed</div></div>
                      <div className="text-center"><div className={`text-lg font-bold ${p.overdue + p.stale > 0 ? 'text-red-600' : 'text-slate-300'}`}>{p.overdue + p.stale}</div><div className="text-[9px] text-slate-400 uppercase">Overdue+Stale</div></div>
                    </div>
                    {p.areas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.areas.slice(0, 4).map((a) => <span key={a} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">{a.length > 14 ? a.slice(0, 12) + '…' : a}</span>)}
                        {p.areas.length > 4 && <span className="text-[9px] text-slate-400">+{p.areas.length - 4}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ReportCard>

        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">Both Jira and Tempo data needed.</p></div>)}

      {/* ═══ MONITOR ═══ */}
      {activeSection === 'monitor' && (tempoLoading ? (
        <LoadingProgress
          steps={['Loading timesheet data...', 'Scanning for anomalies...', 'Checking health metrics...']}
          intervalMs={2000}
        />
      ) : monitorMetrics ? (
        <div className="space-y-4">

          {/* 1. Missing Timesheets */}
          <ReportCard title="Missing Timesheets" subtitle={`Week of ${monitorMetrics.weekLabel} — people who logged zero hours`} icon={CalendarOff}>
            {monitorMetrics.missingTimesheets.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">Everyone submitted last week!</span></div>
            ) : (
              <div className="space-y-2">
                {monitorMetrics.missingTimesheets.map((name) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">0 hours</span>
                      {copiedNudge === name ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />Copied! Paste in Slack
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const msg = `Hey ${name.split(' ')[0]}! 👋 Friendly reminder — it looks like your timesheet for last week (${monitorMetrics.weekLabel}) hasn't been submitted yet. Could you please log your hours when you get a chance? Thanks!`;
                            navigator.clipboard.writeText(msg);
                            setCopiedNudge(name);
                            setTimeout(() => setCopiedNudge(null), 3000);
                          }}
                          className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded font-medium transition-colors flex items-center gap-0.5"
                          title="Copy a friendly reminder to your clipboard, then paste it in Slack"
                        >
                          <Send className="w-3 h-3" />Copy Reminder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {monitorMetrics.lowTimesheets.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-[11px] text-amber-600 font-semibold mb-2">⚠️ Low hours (under 20h):</div>
                <div className="space-y-1">
                  {monitorMetrics.lowTimesheets.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{p.name}</span>
                      <span className="text-amber-600 font-semibold">{p.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ReportCard>

          {/* 3. Overtime Watch — grouped by person */}
          <ReportCard title="Overtime Watch" subtitle="Days with 9+ hours logged — possible burnout risk or data entry error" icon={AlertOctagon}>
            {monitorMetrics.overtimeDays.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">No overtime days this month.</span></div>
            ) : (
              <div className="space-y-2.5">
                {(() => {
                  const grouped: Record<string, { totalHours: number; days: Array<{ date: string; hours: number }> }> = {};
                  monitorMetrics.overtimeDays.forEach((d) => {
                    if (!grouped[d.name]) grouped[d.name] = { totalHours: 0, days: [] };
                    grouped[d.name].totalHours += d.hours;
                    grouped[d.name].days.push({ date: d.date, hours: d.hours });
                  });
                  return Object.entries(grouped)
                    .sort(([, a], [, b]) => b.days.length - a.days.length)
                    .slice(0, 10)
                    .map(([name, data]) => (
                      <div key={name} className="py-1.5 border-b border-slate-50 last:border-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700 font-medium">{name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{data.days.length} day{data.days.length !== 1 ? 's' : ''}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${data.days.length >= 4 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{Math.round(data.totalHours * 10) / 10}h total</span>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {data.days.sort((a, b) => a.date.localeCompare(b.date)).map((day) => (
                            <span key={day.date} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                              {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({day.hours}h)
                            </span>
                          ))}
                        </div>
                      </div>
                    ));
                })()}
              </div>
            )}
          </ReportCard>

          {/* 4. Ghost Tasks */}
          <ReportCard title="Ghost Tasks" subtitle="In Progress 7+ days with zero Tempo hours — assigned but not being worked on" icon={AlertCircle}>
            {monitorMetrics.ghostTasks.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">All In Progress tasks have time logged!</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.ghostTasks.slice(0, 15).map((t) => (
                  <div key={t.key} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <a href={`${JIRA_BROWSE_URL}/${t.key}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline font-medium">{t.key}</a>
                      <span className="text-xs text-slate-500 ml-1.5 truncate">{t.summary.slice(0, 45)}{t.summary.length > 45 ? '…' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] text-slate-400">{t.assignee}</span>
                      <span className="text-[10px] text-red-500 font-semibold">{t.daysSilent}d silent</span>
                    </div>
                  </div>
                ))}
                {monitorMetrics.ghostTasks.length > 15 && <p className="text-[10px] text-slate-400 pt-1">+{monitorMetrics.ghostTasks.length - 15} more</p>}
              </div>
            )}
          </ReportCard>

          {/* 5. Off-Hours Work */}
          <ReportCard title="Off-Hours Work" subtitle="Hours logged on Saturday or Sunday — should be rare and only in exceptional circumstances" icon={Clock}>
            {monitorMetrics.weekendWarriors.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">No weekend work logged this month. As it should be.</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.weekendWarriors.map((w) => (
                  <div key={w.name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{w.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{w.days} day{w.days !== 1 ? 's' : ''}</span>
                      <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">{w.hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ReportCard>

          {/* 6. Zero-Hour People */}
          <ReportCard title="Zero-Hour People" subtitle="Assigned active Jira tasks but no Tempo hours this month" icon={Users}>
            {monitorMetrics.zeroPeople.length === 0 ? (
              <div className="flex items-center gap-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">Everyone with tasks has logged time!</span></div>
            ) : (
              <div className="space-y-1.5">
                {monitorMetrics.zeroPeople.map((name) => (
                  <div key={name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{name}</span>
                    <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">0h logged</span>
                  </div>
                ))}
              </div>
            )}
          </ReportCard>
        </div>
      ) : <div className="text-center py-12 text-slate-400"><p className="text-sm">Tempo data needed for monitoring.</p></div>)}
    </div>
  );
}
````

## File: src/app/page.tsx
````typescript
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2, RefreshCw, ChevronDown, ChevronUp, X, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingProgress from '@/components/dashboard/LoadingProgress';
import OverdueBlock from '@/components/dashboard/OverdueBlock';
import UpcomingWork from '@/components/dashboard/UpcomingWork';
import TaskSearch from '@/components/dashboard/TaskSearch';
import TaskCard from '@/components/dashboard/TaskCard';
import OpsDetails from '@/components/dashboard/OpsDetails';
import TimeActualsTab from '@/components/dashboard/TimeActualsTab';
// Delivery tab hidden — moved to PSA
// import DeliveryTab from '@/components/dashboard/DeliveryTab';
import KPIsTab from '@/components/dashboard/KPIsTab';
import ReportsTab from '@/components/dashboard/ReportsTab';
import { REFRESH_INTERVAL_MS, categorizeStatus, STATUS_SORT_ORDER, AREA_MAP } from '@/lib/constants';
import type { JiraIssue, FilterValue, EpicProgress } from '@/types';

export default function Dashboard() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [deliveryIssues, setDeliveryIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [staleExpanded, setStaleExpanded] = useState(false);
  const [staleDismissed, setStaleDismissed] = useState(false);

  const fetchIssues = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      // Fire all requests in parallel
      const jiraPromise = fetch('/api/jira');
      const deliveryPromise = fetch('/api/jira/delivery');
      const deliveryAllPromise = fetch('/api/jira/delivery-all');

      // Show dashboard as soon as ops data arrives (fastest)
      const jiraRes = await jiraPromise;
      if (jiraRes.ok) {
        const data = await jiraRes.json();
        setIssues(data.issues ?? []);
      }
      setLoading(false); // Render immediately with ops data

      // Delivery data loads in background
      const [deliveryRes, deliveryAllRes] = await Promise.all([deliveryPromise, deliveryAllPromise]);
      if (deliveryAllRes.ok) {
        const data = await deliveryAllRes.json();
        setDeliveryIssues(data.issues ?? []);
      } else if (deliveryRes.ok) {
        const data = await deliveryRes.json();
        setDeliveryIssues(data.issues ?? []);
      }
      setLastRefresh(new Date());
      setStaleDismissed(false);
      setStaleExpanded(false);
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  useEffect(() => {
    const interval = setInterval(() => fetchIssues(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchIssues]);

  const isActuals = filter === 'actuals';
  const isDelivery = filter === 'delivery';
  const isKPIs = filter === 'kpis';

  const areaIssues = useMemo(() => {
    if (filter === 'all' || isActuals || isDelivery || isKPIs) return issues;
    return issues.filter((i) => i.fields.project.key === filter);
  }, [issues, filter, isActuals, isKPIs]);

  const overdueTasks = useMemo(() => {
    return areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
      const due = new Date(i.fields.duedate);
      due.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due < today && categorizeStatus(i.fields.status.name) !== 'done';
    });
  }, [areaIssues]);

  const allActiveTasks = useMemo(() => {
    return areaIssues
      .filter((i) => {
        if (categorizeStatus(i.fields.status.name) === 'done') return false;
        if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
        return true;
      })
      .sort((a, b) => {
        // Status category first: In Progress → Blocked → To Do → Recurring → Other
        const statusDiff = (STATUS_SORT_ORDER[categorizeStatus(a.fields.status.name)] ?? 4)
          - (STATUS_SORT_ORDER[categorizeStatus(b.fields.status.name)] ?? 4);
        if (statusDiff !== 0) return statusDiff;
        // Within same status: due date ascending (no due date last)
        const aDate = a.fields.duedate ? new Date(a.fields.duedate).getTime() : Infinity;
        const bDate = b.fields.duedate ? new Date(b.fields.duedate).getTime() : Infinity;
        return aDate - bDate;
      });
  }, [areaIssues]);

  const epicProgress = useMemo(() => {
    const progress: Record<string, EpicProgress> = {};
    areaIssues.forEach((issue) => {
      if (issue.fields.parent) {
        const epicKey = issue.fields.parent.key;
        if (!progress[epicKey]) {
          progress[epicKey] = { name: issue.fields.parent.fields.summary, total: 0, done: 0, projectKey: issue.fields.project.key };
        }
        progress[epicKey].total += 1;
        if (categorizeStatus(issue.fields.status.name) === 'done') progress[epicKey].done += 1;
      }
    });
    return progress;
  }, [areaIssues]);

  // CT-5: Stale tasks — In Progress with no Jira activity in 3+ days
  const staleTasks = useMemo(() => {
    const opsProjectKeys = new Set(Object.keys(AREA_MAP));
    return areaIssues.filter((i) => {
      if (categorizeStatus(i.fields.status.name) !== 'inProgress') return false;
      if (!i.fields.updated) return false;
      if (i.fields.assignee?.active === false) return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false; // epics are containers, not tasks
      const daysSince = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);
      return daysSince >= 3 && daysSince <= 90;
    });
  }, [areaIssues]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingProgress
          steps={[
            'Connecting to Jira...',
            'Loading ops tasks...',
            'Loading delivery projects...',
            'Building dashboard...',
          ]}
          intervalMs={1800}
          subtitle="First load may take a few seconds"
        />
      </div>
    );
  }

  const showArea = filter === 'all';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-3 py-4 md:px-8 md:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-900">Control Tower</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">Real-time operations dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-slate-400 hidden sm:block">
              {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={() => fetchIssues(true)}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 md:mb-6 -mx-3 px-3 md:mx-0 md:px-0">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="VBTLEGAL">Legal</TabsTrigger>
              <TabsTrigger value="VBTFINANCE">Finance</TabsTrigger>
              <TabsTrigger value="VBTGTM">GTM & Sales</TabsTrigger>
              <TabsTrigger value="VBTOP">Operations</TabsTrigger>
              <TabsTrigger
                value="actuals"
                className="bg-indigo-600 text-white data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
              >
                Time Actuals
              </TabsTrigger>
              <TabsTrigger
                value="kpis"
                className="bg-violet-600 text-white data-[state=active]:bg-violet-700 data-[state=active]:text-white"
              >
                KPIs
              </TabsTrigger>
              {/* Delivery tab hidden — moved to PSA
              <TabsTrigger
                value="delivery"
                className="bg-emerald-600 text-white data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
              >
                Delivery
              </TabsTrigger>
              */}
              <TabsTrigger
                value="reports"
                className="bg-amber-600 text-white data-[state=active]:bg-amber-700 data-[state=active]:text-white"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isActuals && <TimeActualsTab />}
        {filter === 'kpis' && <KPIsTab jiraIssues={issues} />}
        {/* Delivery tab hidden — moved to PSA */}
        {/* {isDelivery && <DeliveryTab />} */}
        {filter === 'reports' && <ReportsTab jiraIssues={issues} deliveryIssues={deliveryIssues} />}

        {!isActuals && !isDelivery && !isKPIs && filter !== 'reports' && (
          <div className="space-y-4">
            {/* 1. Overdue */}
            <OverdueBlock tasks={overdueTasks} showArea={showArea} />

            {/* 1b. Stale Tasks Warning */}
            {staleTasks.length > 0 && !staleDismissed && (
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 px-3 py-2.5 md:px-4 md:py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStaleExpanded(!staleExpanded)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <span className="text-amber-500 text-sm font-bold">⚠</span>
                    <span className="text-xs font-semibold text-amber-700">
                      {staleTasks.length} &quot;In Progress&quot; task{staleTasks.length !== 1 ? 's' : ''} with no updates in 3+ days
                    </span>
                    <span className="text-amber-400">
                      {staleExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <button
                    onClick={() => setStaleDismissed(true)}
                    className="text-amber-400 hover:text-amber-600 p-0.5"
                    title="Dismiss until refresh"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {staleExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200/50 space-y-1.5">
                    {staleTasks
                      .sort((a, b) => {
                        const aAge = a.fields.updated ? new Date(a.fields.updated).getTime() : 0;
                        const bAge = b.fields.updated ? new Date(b.fields.updated).getTime() : 0;
                        return aAge - bAge;
                      })
                      .map((task) => (
                        <TaskCard key={task.key} issue={task} showArea={showArea} compact />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Due in the Next X Days */}
            <UpcomingWork issues={areaIssues} showArea={showArea} />

            {/* 3. In Progress + Search */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Find Tasks
              </h2>
              <TaskSearch tasks={allActiveTasks} showArea={showArea} activeFilter={filter} />
            </div>

            {/* 4. Ops Details */}
            <OpsDetails issues={issues} filteredIssues={areaIssues} epicProgress={epicProgress} />
          </div>
        )}
      </div>
    </div>
  );
}
````
