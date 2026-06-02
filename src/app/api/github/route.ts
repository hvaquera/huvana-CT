/**
 * GET /api/github?repos=hvaquera/huvana-CT,hvaquera/huvana-psa
 *
 * Fetches commits, PRs, and contributor stats from GitHub.
 * Returns normalized engineering activity data for AI analysis.
 */

import { NextResponse } from 'next/server';
import { getApiConfig } from '@/lib/api';

const GH_BASE = 'https://api.github.com';
let GH_TOKEN = "";
let GH_OWNER = "hvaquera";

// Default repos if none specified
const DEFAULT_REPOS = [
  'hvaquera/huvana-CT',
  'hvaquera/huvana-psa',
  'hvaquera/ketz',
  'hvaquera/civix',
  'hvaquera/kiddosaludable',
];

interface GitHubCommit {
  sha: string;
  commit: {
    author: { name: string; email: string; date: string };
    message: string;
  };
  author: { login: string; avatar_url: string } | null;
  parents: { sha: string }[];
}

interface GitHubPR {
  number: number;
  title: string;
  state: string;
  user: { login: string };
  created_at: string;
  merged_at: string | null;
  closed_at: string | null;
  additions?: number;
  deletions?: number;
  changed_files?: number;
  requested_reviewers?: { login: string }[];
}

interface GitHubContributor {
  login: string;
  contributions: number;
  avatar_url: string;
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: ghHeaders(), cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function analyzeRepo(repo: string) {
  const since = new Date();
  since.setDate(since.getDate() - 90); // last 90 days
  const sinceStr = since.toISOString();

  const [commits, prs, contributors] = await Promise.all([
    fetchJson<GitHubCommit[]>(
      `${GH_BASE}/repos/${repo}/commits?per_page=100&since=${sinceStr}`
    ),
    fetchJson<GitHubPR[]>(
      `${GH_BASE}/repos/${repo}/pulls?state=all&per_page=50&sort=updated`
    ),
    fetchJson<GitHubContributor[]>(
      `${GH_BASE}/repos/${repo}/contributors?per_page=50`
    ),
  ]);

  if (!commits) return null;

  // ── Commit analysis ──────────────────────────────────────────────────────
  const commitsByPerson = new Map<string, {
    name: string;
    count: number;
    mergeCommits: number;
    messages: string[];
    dates: string[];
  }>();

  for (const commit of commits) {
    const name = commit.commit.author.name;
    const isMerge = commit.parents.length > 1;
    if (!commitsByPerson.has(name)) {
      commitsByPerson.set(name, { name, count: 0, mergeCommits: 0, messages: [], dates: [] });
    }
    const p = commitsByPerson.get(name)!;
    p.count++;
    if (isMerge) p.mergeCommits++;
    p.messages.push(commit.commit.message.split('\n')[0]);
    p.dates.push(commit.commit.author.date);
  }

  // Velocity: commits per week
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeksInRange = 13; // ~90 days
  const totalCommits = commits.length;
  const avgCommitsPerWeek = Math.round(totalCommits / weeksInRange * 10) / 10;

  // ── Commit frequency by week ─────────────────────────────────────────────
  const weeklyActivity: Record<string, number> = {};
  for (const commit of commits) {
    const date = new Date(commit.commit.author.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weeklyActivity[key] = (weeklyActivity[key] ?? 0) + 1;
  }

  // ── PR analysis ──────────────────────────────────────────────────────────
  const mergedPRs = (prs ?? []).filter(pr => pr.merged_at);
  const openPRs = (prs ?? []).filter(pr => pr.state === 'open');
  
  const avgMergeTimeHours = mergedPRs.length > 0
    ? mergedPRs.reduce((sum, pr) => {
        const created = new Date(pr.created_at).getTime();
        const merged = new Date(pr.merged_at!).getTime();
        return sum + (merged - created) / (1000 * 60 * 60);
      }, 0) / mergedPRs.length
    : null;

  // ── People summary ───────────────────────────────────────────────────────
  const people = Array.from(commitsByPerson.values()).map(p => {
    const recentDates = p.dates.slice(0, 10).map(d => new Date(d));
    const oldestRecent = recentDates.length > 0
      ? Math.min(...recentDates.map(d => d.getTime()))
      : null;
    const daysSinceLastCommit = oldestRecent
      ? Math.floor((Date.now() - Math.max(...p.dates.map(d => new Date(d).getTime()))) / (1000 * 60 * 60 * 24))
      : null;

    return {
      name: p.name,
      commits: p.count,
      mergeCommits: p.mergeCommits,
      directCommits: p.count - p.mergeCommits,
      commitsPerWeek: Math.round(p.count / weeksInRange * 10) / 10,
      daysSinceLastCommit,
      recentMessages: p.messages.slice(0, 5),
    };
  }).sort((a, b) => b.commits - a.commits);

  return {
    repo,
    summary: {
      totalCommits,
      avgCommitsPerWeek,
      totalPRs: (prs ?? []).length,
      mergedPRs: mergedPRs.length,
      openPRs: openPRs.length,
      avgMergeTimeHours: avgMergeTimeHours ? Math.round(avgMergeTimeHours) : null,
      contributors: (contributors ?? []).length,
      periodDays: 90,
    },
    weeklyActivity,
    people,
    recentCommits: commits.slice(0, 10).map(c => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      author: c.commit.author.name,
      date: c.commit.author.date,
      isMerge: c.parents.length > 1,
    })),
  };
}

export async function GET(request: Request) {
  const cfg = await getApiConfig();
  const GH_TOKEN = cfg.githubToken;
  const GH_OWNER = cfg.githubOwner || 'hvaquera';

  if (!GH_TOKEN || !GH_OWNER) {
    return NextResponse.json({ repos: [], people: [], totalCommits: 0 });
  }

  const { searchParams } = new URL(request.url);
  const reposParam = searchParams.get('repos');
  const repos = reposParam ? reposParam.split(',') : DEFAULT_REPOS;

  try {
    const results = await Promise.all(repos.map(analyzeRepo));
    const valid = results.filter(Boolean);

    // Aggregate across all repos
    const allPeople = new Map<string, {
      name: string;
      totalCommits: number;
      repos: string[];
      commitsPerWeek: number;
    }>();

    for (const repo of valid) {
      if (!repo) continue;
      for (const person of repo.people) {
        if (!allPeople.has(person.name)) {
          allPeople.set(person.name, {
            name: person.name,
            totalCommits: 0,
            repos: [],
            commitsPerWeek: 0,
          });
        }
        const p = allPeople.get(person.name)!;
        p.totalCommits += person.commits;
        p.repos.push(repo.repo);
        p.commitsPerWeek = Math.round((p.commitsPerWeek + person.commitsPerWeek) * 10) / 10;
      }
    }

    return NextResponse.json({
      repos: valid,
      aggregated: {
        people: Array.from(allPeople.values()).sort((a, b) => b.totalCommits - a.totalCommits),
        totalRepos: valid.length,
        totalCommits: valid.reduce((s, r) => s + (r?.summary.totalCommits ?? 0), 0),
      },
    });
  } catch (error) {
    console.error('[GitHub] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
