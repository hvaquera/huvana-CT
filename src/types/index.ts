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
    assignee: { displayName: string } | null;
    duedate: string | null;
    priority: { name: string };
    project: { key: string; name: string };
    parent?: { key: string; fields: { summary: string } };
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
export type FilterValue = 'all' | AreaKey | 'actuals' | 'delivery';
export type StatusCategory = 'todo' | 'inProgress' | 'recurring' | 'done' | 'other';
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
