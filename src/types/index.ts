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

export type AreaKey = 'KAN' | 'WWMATA';
export type FilterValue = 'all' | AreaKey | 'actuals' | 'kpis' | 'reports';
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

// ─── Asana ───────────────────────────────────────────────────────────────────

export interface AsanaTask {
  gid: string;
  name: string;
  completed: boolean;
  assignee: { gid: string; name: string } | null;
  due_on: string | null;
  notes: string;
  parent: { gid: string; name: string } | null;
  memberships: { section: { gid: string; name: string } }[];
  created_at: string;
  modified_at: string;
}

export interface AsanaProject {
  gid: string;
  name: string;
  resource_type: string;
}

export interface AsanaApiResponse {
  issues: JiraIssue[]; // normalized to JiraIssue shape
}

// ─── Toggl ───────────────────────────────────────────────────────────────────

export interface TogglTimeEntry {
  id: number;
  workspace_id: number;
  project_id: number | null;
  task_id: number | null;
  billable: boolean;
  start: string;
  stop: string;
  duration: number; // seconds
  description: string;
  user_id: number;
}

export interface TogglProject {
  id: number;
  name: string;
  client_id: number | null;
  client_name: string | null;
  billable: boolean;
  rate: number | null;
  actual_hours: number | null;
  integration_provider?: string;
  integration_ext_id?: string;
}

export interface TogglUser {
  uid: number;
  name: string;
  email: string;
}
