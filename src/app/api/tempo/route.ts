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
