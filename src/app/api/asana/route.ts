import { NextResponse } from 'next/server';
import { fetchJson, withCache, ASANA_BASE, getApiConfig } from '@/lib/api';
import type { JiraIssue, AsanaTask, AsanaProject } from '@/types';

const CACHE_TTL = 10 * 60 * 1000;

const TASK_FIELDS = [
  'gid', 'name', 'completed', 'assignee.name', 'due_on',
  'notes', 'parent.name', 'memberships.section.name',
  'created_at', 'modified_at',
].join(',');

function normalizeStatus(sectionName: string, completed: boolean): string {
  if (completed) return 'Done';
  const s = sectionName.toLowerCase();
  if (s.includes('progress')) return 'In Progress';
  if (s.includes('block')) return 'Blocked';
  if (s.includes('review')) return 'Blocked';
  if (s.includes('done') || s.includes('complete')) return 'Done';
  if (s.includes('recurring')) return 'Recurring Work';
  return 'To Do';
}

function normalizeTask(task: AsanaTask, project: AsanaProject): JiraIssue {
  const section = task.memberships?.[0]?.section?.name ?? 'To Do';
  const statusName = normalizeStatus(section, task.completed);
  return {
    key: task.gid,
    fields: {
      summary: task.name,
      status: { name: statusName },
      assignee: task.assignee
        ? { displayName: task.assignee.name, active: true, accountId: task.assignee.gid }
        : null,
      duedate: task.due_on ?? null,
      priority: { name: 'Medium' },
      project: { key: project.gid, name: project.name },
      parent: task.parent
        ? { key: task.parent.gid, fields: { summary: task.parent.name } }
        : undefined,
      issuetype: { name: 'Task' },
      description: task.notes ?? null,
      created: task.created_at,
      updated: task.modified_at,
      statuscategorychangedate: task.modified_at,
    },
  };
}

export async function GET() {
  const cfg = await getApiConfig();

  if (!cfg.asanaToken) {
    return NextResponse.json({ issues: [] });
  }

  const ASANA_HEADERS = { Authorization: `Bearer ${cfg.asanaToken}` };

  try {
    const result = await withCache('asana-all', CACHE_TTL, async () => {
      const { data: projects } = await fetchJson<{ data: AsanaProject[] }>(
        `${ASANA_BASE}/workspaces/${cfg.asanaWsGid}/projects`,
        ASANA_HEADERS,
      );

      const tasksByProject = await Promise.all(
        projects.map(async (project) => {
          const { data: tasks } = await fetchJson<{ data: AsanaTask[] }>(
            `${ASANA_BASE}/projects/${project.gid}/tasks?opt_fields=${TASK_FIELDS}`,
            ASANA_HEADERS,
          );
          return tasks.map((task) => normalizeTask(task, project));
        }),
      );

      return { issues: tasksByProject.flat() };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Asana] Error:', error);
    return NextResponse.json({ issues: [], error: String(error) });
  }
}