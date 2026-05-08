/**
 * POST /api/ai/insights
 *
 * Generates proactive AI insights from tasks, time, and repo data.
 * Called on dashboard load — no user input needed.
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { tasks, timeActuals, githubData, context } = body;

  // Build a concise data summary for Claude
  const overdueTasks = (tasks ?? []).filter((t: any) => {
    if (!t.fields?.duedate) return false;
    return new Date(t.fields.duedate) < new Date() && t.fields.status?.name !== 'Done';
  });

  const staleTasks = (tasks ?? []).filter((t: any) => {
    if (!t.fields?.updated) return false;
    const daysSince = Math.floor((Date.now() - new Date(t.fields.updated).getTime()) / 86400000);
    return t.fields.status?.name?.toLowerCase().includes('progress') && daysSince >= 3;
  });

  // Group by project
  const projectGroups: Record<string, number> = {};
  for (const t of (tasks ?? [])) {
    const key = t.fields?.project?.name ?? 'Unknown';
    projectGroups[key] = (projectGroups[key] ?? 0) + 1;
  }

  // Time summary
  const timeByProject = (timeActuals?.projects ?? []).map((p: any) => ({
    project: p.projectName,
    hours: p.hours,
    billable: p.billableHours,
  }));

  // GitHub summary
  const ghSummary = (githubData?.repos ?? []).map((r: any) => ({
    repo: r.repo,
    commits: r.summary?.totalCommits,
    avgPerWeek: r.summary?.avgCommitsPerWeek,
    contributors: r.summary?.contributors,
    openPRs: r.summary?.openPRs,
  }));

  const prompt = `You are an AI ops co-pilot for a professional services company called ${context?.company ?? 'the company'}. 
You analyze real-time data from project management tools, time tracking, and code repositories.

Here is the current data snapshot:

TASKS OVERVIEW:
- Total active tasks: ${(tasks ?? []).length}
- Overdue tasks: ${overdueTasks.length}
- Stale "In Progress" tasks (3+ days no update): ${staleTasks.length}
- Projects: ${Object.entries(projectGroups).map(([k,v]) => `${k}: ${v} tasks`).join(', ')}
${overdueTasks.length > 0 ? `- Overdue examples: ${overdueTasks.slice(0,3).map((t: any) => t.fields?.summary).join('; ')}` : ''}
${staleTasks.length > 0 ? `- Stale examples: ${staleTasks.slice(0,3).map((t: any) => t.fields?.summary).join('; ')}` : ''}

TIME ACTUALS (this month):
- Total hours logged: ${timeActuals?.totalHours ?? 0}
- People logging time: ${timeActuals?.totalPeople ?? 0}
${timeByProject.length > 0 ? `- By project: ${timeByProject.map((p: any) => `${p.project}: ${p.hours}h`).join(', ')}` : ''}

CODE REPOSITORY ACTIVITY (last 90 days):
${ghSummary.length > 0 ? ghSummary.map((r: any) => 
  `- ${r.repo}: ${r.commits} commits, ${r.avgPerWeek}/week avg, ${r.openPRs} open PRs`
).join('\n') : '- No repository data available'}

Generate exactly 3-4 concise, actionable insights. Each insight should:
1. Be specific and data-driven (mention actual numbers)
2. Flag risks OR highlight positive trends
3. Suggest a concrete action when there's a problem
4. Be written in plain English, like a smart colleague briefing you

Format your response as a JSON array like this:
[
  {
    "type": "warning|success|info|critical",
    "title": "Short title (5-8 words)",
    "message": "One or two sentences with specific data and action.",
    "metric": "Key number to highlight (e.g. '5 overdue')",
    "action": "What to do about it (optional)"
  }
]

Only return the JSON array, no other text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY ?? '', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    const data = await response.json();
    const text = data.content?.[0]?.text ?? '[]';

    // Parse JSON safely
    const clean = text.replace(/```json|```/g, '').trim();
    const insights = JSON.parse(clean);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('[AI Insights] Error:', error);
    // Return fallback insights if AI fails
    return NextResponse.json({
      insights: [
        {
          type: 'info',
          title: 'AI insights temporarily unavailable',
          message: 'Unable to generate insights right now. Dashboard data is still live.',
          metric: null,
          action: 'Check ANTHROPIC_API_KEY in .env.local',
        },
      ],
    });
  }
}