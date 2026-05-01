'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Database, Clock, FolderKanban, Save, CheckCircle, RefreshCw } from 'lucide-react';

type PMTool = 'jira' | 'asana';
type TimeTool = 'tempo' | 'toggl';

interface ProjectConfig {
  key: string;
  name: string;
  type: 'internal' | 'delivery';
}

export default function AdminPage() {
  const [pmTool, setPmTool] = useState<PMTool>('jira');
  const [timeTool, setTimeTool] = useState<TimeTool>('tempo');
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch projects from the active PM tool API
  const fetchProjects = useCallback(async (tool: PMTool) => {
    setLoadingProjects(true);
    try {
      const endpoint = tool === 'asana' ? '/api/asana' : '/api/jira';
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const issues = data.issues ?? [];

      // Extract unique projects from issues
      const projectMap = new Map<string, { key: string; name: string }>();
      for (const issue of issues) {
        const key = issue.fields?.project?.key;
        const name = issue.fields?.project?.name;
        if (key && name && !projectMap.has(key)) {
          projectMap.set(key, { key, name });
        }
      }

      // Load saved types from localStorage, default new ones to 'internal'
      const savedProjects: ProjectConfig[] = JSON.parse(localStorage.getItem('ct_projects') ?? '[]');
      const savedMap = new Map(savedProjects.map((p) => [p.key, p.type]));

      const fetched: ProjectConfig[] = Array.from(projectMap.values()).map((p) => ({
        key: p.key,
        name: p.name,
        type: savedMap.get(p.key) ?? 'internal',
      }));

      setProjects(fetched);
    } catch (err) {
      console.error('[Admin] Failed to fetch projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Load saved config on mount, then fetch projects
  useEffect(() => {
    const storedPm = (localStorage.getItem('ct_pm_tool') as PMTool) ?? 'jira';
    const storedTime = (localStorage.getItem('ct_time_tool') as TimeTool) ?? 'tempo';
    setPmTool(storedPm);
    setTimeTool(storedTime);
    fetchProjects(storedPm);
  }, [fetchProjects]);

  // Re-fetch projects when PM tool changes
  const handlePmToolChange = (tool: PMTool) => {
    setPmTool(tool);
    fetchProjects(tool);
  };

  const handleSave = () => {
    localStorage.setItem('ct_pm_tool', pmTool);
    localStorage.setItem('ct_time_tool', timeTool);
    localStorage.setItem('ct_projects', JSON.stringify(projects));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleProjectType = (key: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, type: p.type === 'internal' ? 'delivery' : 'internal' } : p,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-slate-900 rounded-lg">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">Configure integrations and project settings</p>
          </div>
        </div>

        {/* Project Management Tool */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-slate-600" />
            <h2 className="font-semibold text-slate-800">Project Management</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Choose which tool to pull tasks from</p>
          <div className="grid grid-cols-2 gap-3">
            {(['jira', 'asana'] as PMTool[]).map((tool) => (
              <button
                key={tool}
                onClick={() => handlePmToolChange(tool)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  pmTool === tool
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800 capitalize">{tool}</span>
                  {pmTool === tool && <CheckCircle className="h-4 w-4 text-slate-900" />}
                </div>
                <span className="text-xs text-slate-500">
                  {tool === 'jira' ? 'Jira REST API v3' : 'Asana API v1'}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
            Active in app: <strong>{process.env.NEXT_PUBLIC_PM_TOOL ?? 'jira'}</strong>
            {process.env.NEXT_PUBLIC_PM_TOOL !== pmTool && (
              <span className="ml-2 text-amber-600">
                ⚠️ Set <code>NEXT_PUBLIC_PM_TOOL={pmTool}</code> in .env.local and restart to apply
              </span>
            )}
          </div>
        </div>

        {/* Time Tracking Tool */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-slate-600" />
            <h2 className="font-semibold text-slate-800">Time Tracking</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Choose which tool to pull time actuals from</p>
          <div className="grid grid-cols-2 gap-3">
            {(['tempo', 'toggl'] as TimeTool[]).map((tool) => (
              <button
                key={tool}
                onClick={() => setTimeTool(tool)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  timeTool === tool
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800 capitalize">{tool}</span>
                  {timeTool === tool && <CheckCircle className="h-4 w-4 text-slate-900" />}
                </div>
                <span className="text-xs text-slate-500">
                  {tool === 'tempo' ? 'Tempo API v4 (Jira plugin)' : 'Toggl Track API v9'}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
            Active in app: <strong>{process.env.NEXT_PUBLIC_TIME_TOOL ?? 'tempo'}</strong>
            {process.env.NEXT_PUBLIC_TIME_TOOL !== timeTool && (
              <span className="ml-2 text-amber-600">
                ⚠️ Set <code>NEXT_PUBLIC_TIME_TOOL={timeTool}</code> in .env.local and restart to apply
              </span>
            )}
          </div>
        </div>

        {/* Project Categories */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Project Categories</h2>
            </div>
            <button
              onClick={() => fetchProjects(pmTool)}
              disabled={loadingProjects}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Refresh projects"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loadingProjects ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Toggle each project between Internal (ops/overhead) and Delivery (client-facing)
          </p>

          {loadingProjects ? (
            <div className="flex items-center gap-2 py-4 text-sm text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Fetching projects from {pmTool}...
            </div>
          ) : projects.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No projects found</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200"
                >
                  <div>
                    <span className="font-medium text-slate-800">{project.name}</span>
                    <span className="ml-2 text-xs text-slate-400">{project.key}</span>
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

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
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
          To switch active integrations restart the app after updating{' '}
          <code className="bg-slate-100 px-1 rounded">.env.local</code>
        </p>
      </div>
    </div>
  );
}