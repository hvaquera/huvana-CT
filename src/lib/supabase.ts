import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CTWorkspace {
  id: string;
  owner_email: string;
  jira_url: string | null;
  jira_email: string | null;
  jira_token: string | null;
  asana_token: string | null;
  asana_workspace_gid: string | null;
  harvest_token: string | null;
  harvest_account_id: string | null;
  toggl_token: string | null;
  toggl_workspace_id: string | null;
  github_token: string | null;
  github_owner: string | null;
  anthropic_key: string | null;
}

export async function getWorkspace(email: string): Promise<CTWorkspace | null> {
  const { data, error } = await supabase
    .from('ct_workspaces')
    .select('*')
    .eq('owner_email', email)
    .single();
  if (error || !data) return null;
  return data as CTWorkspace;
}

export async function upsertWorkspace(email: string, fields: Partial<CTWorkspace>): Promise<void> {
  await supabase
    .from('ct_workspaces')
    .upsert({ owner_email: email, ...fields, updated_at: new Date().toISOString() })
    .eq('owner_email', email);
}

export async function getProjects(workspaceId: string) {
  const { data } = await supabase
    .from('ct_projects')
    .select('*')
    .eq('workspace_id', workspaceId);
  return data ?? [];
}

export async function upsertProject(workspaceId: string, project: { key: string; name: string; source: string; type: string }) {
  await supabase
    .from('ct_projects')
    .upsert({ workspace_id: workspaceId, ...project });
}