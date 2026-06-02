/**
 * POST /api/ai/chat
 *
 * Natural language chat about your ops data.
 * Maintains conversation history and has full context of tasks, time, and repos.
 */

import { NextResponse } from 'next/server';
import { getApiConfig } from '@/lib/api';

export async function POST(request: Request) {
  const body = await request.json();
  const { message, history, tasks, timeActuals, githubData, context } = body;

  // Build context summary
  const overdueTasks = (tasks ?? []).filter((t: any) => {
    if (!t.fields?.duedate) return false;
    return new Date(t.fields.duedate) < new Date() && t.fields.status?.name !== 'Done';
  });

  const tasksByPerson: Record<string, { total: number; overdue: number; inProgress: number }> = {};
  for (const t of (tasks ?? [])) {
    const person = t.fields?.assignee?.displayName ?? 'Unassigned';
    if (!tasksByPerson[person]) tasksByPerson[person] = { total: 0, overdue: 0, inProgress: 0 };
    tasksByPerson[person].total++;
    if (overdueTasks.includes(t)) tasksByPerson[person].overdue++;
    if (t.fields?.status?.name?.toLowerCase().includes('progress')) tasksByPerson[person].inProgress++;
  }

  const tasksByProject: Record<string, { total: number; overdue: number }> = {};
  for (const t of (tasks ?? [])) {
    const proj = t.fields?.project?.name ?? 'Unknown';
    if (!tasksByProject[proj]) tasksByProject[proj] = { total: 0, overdue: 0 };
    tasksByProject[proj].total++;
    if (overdueTasks.includes(t)) tasksByProject[proj].overdue++;
  }

  const systemPrompt = `You are an AI ops co-pilot for ${context?.company ?? 'a professional services company'}. 
You have access to real-time data from project management, time tracking, and code repositories.

CURRENT DATA CONTEXT:

TASKS:
- Total active tasks: ${(tasks ?? []).length}
- Overdue: ${overdueTasks.length}
- By person: ${Object.entries(tasksByPerson).map(([k,v]) => `${k}: ${v.total} tasks, ${v.overdue} overdue, ${v.inProgress} in progress`).join(' | ')}
- By project: ${Object.entries(tasksByProject).map(([k,v]) => `${k}: ${v.total} tasks, ${v.overdue} overdue`).join(' | ')}

TIME ACTUALS (this month):
- Total hours: ${timeActuals?.totalHours ?? 0}h across ${timeActuals?.totalPeople ?? 0} people
- By person: ${(timeActuals?.people ?? []).slice(0,5).map((p: any) => `${p.name}: ${p.totalHours}h`).join(', ')}
- By project: ${(timeActuals?.projects ?? []).slice(0,5).map((p: any) => `${p.projectName}: ${p.hours}h`).join(', ')}

CODE REPOSITORIES (last 90 days):
${(githubData?.repos ?? []).map((r: any) => 
  `- ${r.repo}: ${r.summary?.totalCommits} commits, ${r.summary?.avgCommitsPerWeek}/week, ${r.summary?.openPRs} open PRs
   Contributors: ${r.people?.map((p: any) => `${p.name} (${p.commits} commits, ${p.commitsPerWeek}/wk)`).join(', ')}`
).join('\n') || '- No repository data'}

INSTRUCTIONS:
- Answer questions naturally and conversationally
- Always cite specific numbers from the data
- If asked about a specific person, synthesize their tasks, time, AND code activity
- If data is missing for something, say so honestly
- Be concise — 2-4 sentences unless a longer answer is clearly needed
- When identifying risks, always suggest a concrete action
- You can reason about complexity: more hours on fewer tasks can mean harder work, not less
- Never make up data that isn't in the context above`;

  // Build messages array with history
  const messages = [
    ...(history ?? []).map((h: { role: string; content: string }) => ({
      role: h.role,
      content: h.content,
    })),
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': (await getApiConfig()).anthropicKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    const data = await response.json();
    const reply = data.content?.[0]?.text ?? 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[AI Chat] Error:', error);
    return NextResponse.json({
      reply: 'I\'m having trouble connecting right now. Please add your Anthropic API key in Admin → Integrations.',
    });
  }
}