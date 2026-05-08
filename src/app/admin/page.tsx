'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings, Database, Clock, FolderKanban, Save, CheckCircle,
  RefreshCw, Plus, Trash2, ChevronDown, ChevronUp, GitBranch,
  Zap, Globe, Lock
} from 'lucide-react';

type PMTool = 'jira' | 'asana' | 'monday' | 'linear' | 'clickup';
type TimeTool = 'tempo' | 'toggl' | 'harvest' | 'clockify';
type RepoTool = 'github' | 'gitlab' | 'bitbucket';

interface ClientWorkspace {
  id: string;
  name: string;
  pmTool: PMTool;
  pmToken: string;
  timeTool: TimeTool;
  timeToken: string;
  repoTool: RepoTool;
  repoToken: string;
  repoOwner: string;
  expanded: boolean;
  status: 'connected' | 'pending' | 'error';
}

interface ProjectConfig {
  key: string;
  name: string;
  type: 'internal' | 'delivery';
  source: string;
}

const PM_TOOLS: { id: PMTool; label: string; description: string; available: boolean }[] = [
  { id: 'jira',    label: 'Jira',      description: 'Atlassian Jira REST API v3',   available: true },
  { id: 'asana',   label: 'Asana',     description: 'Asana API v1',                 available: true },
  { id: 'monday',  label: 'Monday',    description: 'Monday.com GraphQL API',        available: false },
  { id: 'linear',  label: 'Linear',    description: 'Linear API v2',                available: false },
  { id: 'clickup', label: 'ClickUp',   description: 'ClickUp REST API v2',          available: false },
];

const TIME_TOOLS: { id: TimeTool; label: string; description: string; available: boolean }[] = [
  { id: 'tempo',    label: 'Tempo',    description: 'Tempo API v4 (Jira plugin)',   available: true },
  { id: 'toggl',   label: 'Toggl',    description: 'Toggl Track API v9',           available: true },
  { id: 'harvest', label: 'Harvest',  description: 'Harvest API v2',               available: true },
  { id: 'clockify',label: 'Clockify', description: 'Clockify REST API',            available: false },
];

const REPO_TOOLS: { id: RepoTool; label: string; description: string; available: boolean }[] = [
  { id: 'github',    label: 'GitHub',    description: 'GitHub REST API v3',         available: true },
  { id: 'gitlab',    label: 'GitLab',    description: 'GitLab REST API v4',         available: false },
  { id: 'bitbucket', label: 'Bitbucket', description: 'Bitbucket REST API v2',      available: false },
];

const DEFAULT_CLIENTS: ClientWorkspace[] = [
  {
    id: 'internal',
    name: 'Internal (Barrett Ventures)',
    pmTool: 'jira',
    pmToken: '••••••••••••••••',
    timeTool: 'harvest',
    timeToken: '••••••••••••••••',
    repoTool: 'github',
    repoToken: '••••••••••••••••',
    repoOwner: 'hvaquera',
    expanded: false,
    status: 'connected',
  },
  {
    id: 'wmata',
    name: 'WMATA',
    pmTool: 'jira',
    pmToken: '••••••••••••••••',
    timeTool: 'tempo',
    timeToken: '••••••••••••••••',
    repoTool: 'github',
    repoToken: '',
    repoOwner: '',
    expanded: false,
    status: 'connected',
  },
  {
    id: 'tranzito',
    name: 'Tranzito',
    pmTool: 'asana',
    pmToken: '••••••••••••••••',
    timeTool: 'toggl',
    timeToken: '••••••••••••••••',
    repoTool: 'github',
    repoToken: '',
    repoOwner: '',
    expanded: false,
    status: 'connected',
  },
];

export default function AdminPage() {
  const [clients, setClients] = useState<ClientWorkspace[]>(DEFAULT_CLIENTS);
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'clients' | 'projects' | 'integrations'>('clients');

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const [jiraRes, asanaRes] = await Promise.allSettled([
        fetch('/api/jira'),
        fetch('/api/asana'),
      ]);

      const savedProjects: ProjectConfig[] = JSON.parse(localStorage.getItem('ct_projects') ?? '[]');
      const savedMap = new Map(savedProjects.map(p => [p.key, p]));
      const allProjects: ProjectConfig[] = [];

      if (jiraRes.status === 'fulfilled' && jiraRes.value.ok) {
        const data = await jiraRes.value.json();
        const projectMap = new Map<string, string>();
        for (const issue of (data.issues ?? [])) {
          if (!projectMap.has(issue.fields?.project?.key)) {
            projectMap.set(issue.fields.project.key, issue.fields.project.name);
          }
        }
        for (const [key, name] of projectMap) {
          allProjects.push({
            key, name, source: 'Jira',
            type: savedMap.get(key)?.type ?? 'internal',
          });
        }
      }

      if (asanaRes.status === 'fulfilled' && asanaRes.value.ok) {
        const data = await asanaRes.value.json();
        const projectMap = new Map<string, string>();
        for (const issue of (data.issues ?? [])) {
          if (!projectMap.has(issue.fields?.project?.key)) {
            projectMap.set(issue.fields.project.key, issue.fields.project.name);
          }
        }
        for (const [key, name] of projectMap) {
          if (!allProjects.find(p => p.key === key)) {
            allProjects.push({
              key, name, source: 'Asana',
              type: savedMap.get(key)?.type ?? 'delivery',
            });
          }
        }
      }

      setProjects(allProjects);
    } catch (err) {
      console.error('[Admin] Failed to fetch projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ct_projects');
    if (saved) setProjects(JSON.parse(saved));
    fetchProjects();
  }, [fetchProjects]);

  const handleSave = () => {
    localStorage.setItem('ct_projects', JSON.stringify(projects));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleProjectType = (key: string) => {
    setProjects(prev =>
      prev.map(p => p.key === key ? { ...p, type: p.type === 'internal' ? 'delivery' : 'internal' } : p)
    );
  };

  const toggleClient = (id: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, expanded: !c.expanded } : c));
  };

  const addClient = () => {
    const newClient: ClientWorkspace = {
      id: `client-${Date.now()}`,
      name: 'New Client',
      pmTool: 'jira',
      pmToken: '',
      timeTool: 'harvest',
      timeToken: '',
      repoTool: 'github',
      repoToken: '',
      repoOwner: '',
      expanded: true,
      status: 'pending',
    };
    setClients(prev => [...prev, newClient]);
  };

  const removeClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const updateClient = (id: string, field: keyof ClientWorkspace, value: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const statusColor = (status: ClientWorkspace['status']) => {
    if (status === 'connected') return 'bg-emerald-400';
    if (status === 'pending') return 'bg-amber-400';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-sm text-slate-500">Manage clients, integrations and project settings</p>
            </div>
          </div>
          <a href="/" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">← Back to Dashboard</a>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-slate-200">
          {(['clients', 'projects', 'integrations'] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${
                activeSection === s
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s === 'clients' ? '🏢 Client Workspaces' : s === 'projects' ? '📁 Project Categories' : '🔌 Integrations'}
            </button>
          ))}
        </div>

        {/* ── CLIENT WORKSPACES ── */}
        {activeSection === 'clients' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">Each client workspace connects their own tools. One token per tool — read-only.</p>
              <button
                onClick={addClient}
                className="flex items-center gap-1.5 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Client
              </button>
            </div>

            {clients.map(client => (
              <div key={client.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Client header */}
                <div
                  onClick={() => toggleClient(client.id)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${statusColor(client.status)}`} />
                    <span className="font-medium text-slate-800 text-sm">{client.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {client.pmTool}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        {client.timeTool}
                      </span>
                      {client.repoToken && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          <GitBranch className="h-2.5 w-2.5 inline mr-0.5" />{client.repoTool}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {client.id !== 'internal' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeClient(client.id); }}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {client.expanded
                      ? <ChevronUp className="h-4 w-4 text-slate-400" />
                      : <ChevronDown className="h-4 w-4 text-slate-400" />
                    }
                  </div>
                </div>

                {/* Client config */}
                {client.expanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
                    {/* Client name */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Client Name</label>
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400"
                      />
                    </div>

                    {/* PM Tool */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
                        <Database className="h-3 w-3" /> Project Management
                      </label>
                      <div className="grid grid-cols-5 gap-1.5 mb-2">
                        {PM_TOOLS.map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => tool.available && updateClient(client.id, 'pmTool', tool.id)}
                            className={`p-2 rounded-lg border text-xs font-medium transition-all relative ${
                              client.pmTool === tool.id
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : tool.available
                                  ? 'border-slate-200 text-slate-600 hover:border-slate-400'
                                  : 'border-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {tool.label}
                            {!tool.available && (
                              <span className="absolute -top-1 -right-1 text-[8px] bg-slate-200 text-slate-500 px-1 rounded-full">soon</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <input
                          type="password"
                          value={client.pmToken}
                          onChange={(e) => updateClient(client.id, 'pmToken', e.target.value)}
                          placeholder="Paste read-only API token..."
                          className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 font-mono"
                        />
                      </div>
                    </div>

                    {/* Time Tracking */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> Time Tracking
                      </label>
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        {TIME_TOOLS.map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => tool.available && updateClient(client.id, 'timeTool', tool.id)}
                            className={`p-2 rounded-lg border text-xs font-medium transition-all relative ${
                              client.timeTool === tool.id
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : tool.available
                                  ? 'border-slate-200 text-slate-600 hover:border-slate-400'
                                  : 'border-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {tool.label}
                            {!tool.available && (
                              <span className="absolute -top-1 -right-1 text-[8px] bg-slate-200 text-slate-500 px-1 rounded-full">soon</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <input
                          type="password"
                          value={client.timeToken}
                          onChange={(e) => updateClient(client.id, 'timeToken', e.target.value)}
                          placeholder="Paste read-only API token..."
                          className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 font-mono"
                        />
                      </div>
                    </div>

                    {/* Repository */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
                        <GitBranch className="h-3 w-3" /> Code Repository
                        <span className="text-[10px] text-slate-400 font-normal">(optional — enables engineering insights)</span>
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {REPO_TOOLS.map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => tool.available && updateClient(client.id, 'repoTool', tool.id)}
                            className={`p-2 rounded-lg border text-xs font-medium transition-all relative ${
                              client.repoTool === tool.id
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : tool.available
                                  ? 'border-slate-200 text-slate-600 hover:border-slate-400'
                                  : 'border-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {tool.label}
                            {!tool.available && (
                              <span className="absolute -top-1 -right-1 text-[8px] bg-slate-200 text-slate-500 px-1 rounded-full">soon</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <input
                            type="text"
                            value={client.repoOwner}
                            onChange={(e) => updateClient(client.id, 'repoOwner', e.target.value)}
                            placeholder="GitHub org or username (e.g. hvaquera)"
                            className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <input
                            type="password"
                            value={client.repoToken}
                            onChange={(e) => updateClient(client.id, 'repoToken', e.target.value)}
                            placeholder="Paste read-only token (repo:read scope)..."
                            className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`rounded-lg px-3 py-2 text-xs ${
                      client.status === 'connected'
                        ? 'bg-emerald-50 text-emerald-700'
                        : client.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                    }`}>
                      {client.status === 'connected' && '✅ All integrations connected and reading live data'}
                      {client.status === 'pending' && '⏳ Tokens added — save to connect and start reading data'}
                      {client.status === 'error' && '❌ Connection failed — check your tokens and try again'}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* How it works */}
            <div className="bg-slate-900 rounded-xl p-4 text-white mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold">How it works</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold mt-0.5">1</span>
                  <span>Client shares a read-only API token for their tools (Jira, Asana, GitHub, etc.)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold mt-0.5">2</span>
                  <span>Paste the token here — Control Tower connects instantly, no deployment needed</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold mt-0.5">3</span>
                  <span>Tasks, time, and code activity appear unified in the dashboard and AI Co-Pilot</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold mt-0.5">4</span>
                  <span>Client can revoke access anytime — zero risk, full transparency</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECT CATEGORIES ── */}
        {activeSection === 'projects' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-slate-600" />
                <h2 className="font-semibold text-slate-800">Project Categories</h2>
              </div>
              <button
                onClick={fetchProjects}
                disabled={loadingProjects}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                title="Refresh from all connected tools"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loadingProjects ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Toggle each project between Internal (ops/overhead) and Delivery (client-facing). Projects auto-detected from all connected tools.
            </p>

            {loadingProjects ? (
              <div className="flex items-center gap-2 py-4 text-sm text-slate-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Fetching from Jira + Asana...
              </div>
            ) : projects.length === 0 ? (
              <p className="text-sm text-slate-400 py-4">No projects found</p>
            ) : (
              <div className="space-y-2">
                {projects.map(project => (
                  <div
                    key={project.key}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 text-sm">{project.name}</span>
                      <span className="text-xs text-slate-400">{project.key}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        project.source === 'Jira'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {project.source}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleProjectType(project.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        project.type === 'internal'
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {project.type === 'internal' ? '🏠 Internal' : '🚀 Delivery'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INTEGRATIONS STATUS ── */}
        {activeSection === 'integrations' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-4">Current integration status across all connected tools.</p>

            {[
              { name: 'Jira', key: 'JIRA_API_TOKEN', status: 'connected', description: 'barrettventures.atlassian.net', color: 'blue' },
              { name: 'Asana', key: 'ASANA_ACCESS_TOKEN', status: 'connected', description: 'HV Workspace · 2 projects', color: 'purple' },
              { name: 'Harvest', key: 'HARVEST_ACCESS_TOKEN', status: 'connected', description: 'Account 2203031 · 4 projects', color: 'orange' },
              { name: 'Tempo', key: 'TEMPO_TOKEN', status: 'connected', description: 'barrettventures.atlassian.net', color: 'indigo' },
              { name: 'Toggl', key: 'TOGGL_API_TOKEN', status: 'connected', description: 'Workspace 21343185', color: 'pink' },
              { name: 'GitHub', key: 'GITHUB_TOKEN', status: 'connected', description: 'hvaquera · 5 repositories', color: 'slate' },
              { name: 'QuickBooks', key: 'QB_ACCESS_TOKEN', status: 'coming_soon', description: 'Invoice sync — coming soon', color: 'green' },
              { name: 'HubSpot', key: 'HUBSPOT_ACCESS_TOKEN', status: 'coming_soon', description: 'Pipeline sync — coming soon', color: 'orange' },
              { name: 'Monday.com', key: 'MONDAY_TOKEN', status: 'coming_soon', description: 'Project sync — coming soon', color: 'yellow' },
              { name: 'Linear', key: 'LINEAR_TOKEN', status: 'coming_soon', description: 'Issue sync — coming soon', color: 'violet' },
            ].map(integration => (
              <div key={integration.name} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    integration.status === 'connected' ? 'bg-emerald-400' : 'bg-slate-300'
                  }`} />
                  <div>
                    <span className="font-medium text-slate-800 text-sm">{integration.name}</span>
                    <p className="text-xs text-slate-400">{integration.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  integration.status === 'connected'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {integration.status === 'connected' ? '✅ Connected' : '🔜 Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            saved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          {saved ? (
            <><CheckCircle className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Configuration</>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-3">
          Read-only tokens only. Clients can revoke access anytime.
        </p>
      </div>
    </div>
  );
}