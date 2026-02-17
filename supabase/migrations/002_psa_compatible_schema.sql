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
