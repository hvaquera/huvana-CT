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
