/**
 * GET /api/asana
 * Returns Asana tasks normalized to the same JiraIssue shape
 * so all frontend components work without modification.
 */

import { NextResponse } from 'next/server';
import { fetchJson, withCache, ASANA_BASE, ASANA_ACCESS_TOKEN, ASANA_WORKSPACE_GID } from '@/lib/api';
import type { JiraIssue, AsanaTask, AsanaProject } from '@/types';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const ASANA_HEADERS = { Authorization: `Bearer ${ASANA_ACCESS_TOKEN}` };

const TASK_FIELDS = [
  'gid', 'name', 'completed', 'assignee.name', 'due_on',
  'notes', 'parent.name', 'memberships.section.name',
  'created_at', 'modified_at',
].join(',');

/** Map Asana section name → Jira-style status name */
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

/** Normalize an Asana task → JiraIssue shape */
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
  if (!ASANA_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'ASANA_ACCESS_TOKEN not configured' }, { status: 500 });
  }

  try {
    const result = await withCache('asana-all', CACHE_TTL, async () => {
      // 1. Fetch all projects in workspace
      const { data: projects } = await fetchJson<{ data: AsanaProject[] }>(
        `${ASANA_BASE}/workspaces/${ASANA_WORKSPACE_GID}/projects`,
        ASANA_HEADERS,
      );

      // 2. Fetch tasks for all projects in parallel
      const tasksByProject = await Promise.all(
        projects.map(async (project) => {
          const { data: tasks } = await fetchJson<{ data: AsanaTask[] }>(
            `${ASANA_BASE}/projects/${project.gid}/tasks?opt_fields=${TASK_FIELDS}`,
            ASANA_HEADERS,
          );
          return tasks.map((task) => normalizeTask(task, project));
        }),
      );

      const issues = tasksByProject.flat();
      return { issues };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Asana] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Asana tasks' }, { status: 500 });
  }
}
