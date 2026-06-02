'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, CheckCircle, Eye, EyeOff, RefreshCw, Plus, Trash2, ExternalLink } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface Tool {
  id: string;
  category: 'pm' | 'time' | 'repo' | 'ai';
  name: string;
  token: string;
  extra?: string; // base URL, workspace ID, account ID, etc.
  extra2?: string; // second extra field if needed
  enabled: boolean;
}

interface DetectedProject {
  key: string;
  name: string;
  source: 'jira' | 'asana';
  type: 'internal' | 'delivery';
}

const TOOL_CATALOG = {
  pm: [
    { id: 'jira',    name: 'Jira',    extraLabel: 'Base URL', extra2Label: 'Email', available: true },
    { id: 'asana',   name: 'Asana',   extraLabel: 'Workspace GID', available: true },
    { id: 'linear',  name: 'Linear',  available: false },
    { id: 'monday',  name: 'Monday',  available: false },
    { id: 'clickup', name: 'ClickUp', available: false },
  ],
  time: [
    { id: 'harvest', name: 'Harvest', extraLabel: 'Account ID', available: true },
    { id: 'toggl',   name: 'Toggl',   extraLabel: 'Workspace ID', available: true },
    { id: 'tempo',   name: 'Tempo',   available: true },
    { id: 'clockify',name: 'Clockify',available: false },
  ],
  repo: [
    { id: 'github',    name: 'GitHub',    extraLabel: 'Owner/Org', available: true },
    { id: 'gitlab',    name: 'GitLab',    available: false },
    { id: 'bitbucket', name: 'Bitbucket', available: false },
  ],
  ai: [
    { id: 'anthropic', name: 'Anthropic (Claude)', available: true },
  ],
} as const;

const CATEGORY_LABELS = {
  pm: '📋 Project Management',
  time: '⏱ Time Tracking',
  repo: '💻 Code Repository',
  ai: '🤖 AI Copilot',
};

const DEFAULT_TOOLS: Tool[] = [
  { id: 'jira',      category: 'pm',   name: 'Jira',      token: '', extra: 'https://barrettventures.atlassian.net', extra2: '', enabled: true },
  { id: 'asana',     category: 'pm',   name: 'Asana',     token: '', extra: '', enabled: true },
  { id: 'harvest',   category: 'time', name: 'Harvest',   token: '', extra: '', enabled: true },
  { id: 'toggl',     category: 'time', name: 'Toggl',     token: '', extra: '', enabled: true },
  { id: 'github',    category: 'repo', name: 'GitHub',    token: '', extra: '', enabled: true },
  { id: 'anthropic', category: 'ai',   name: 'Anthropic', token: '', enabled: true },
];

function maskToken(t: string) {
  if (!t || t.length < 8) return t;
  return t.slice(0, 4) + '••••••••' + t.slice(-4);
}

export default function AdminPage() {
  const [tools, setTools] = useState<Tool[]>(DEFAULT_TOOLS);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'integrations' | 'projects'>('integrations');
  const [detectedProjects, setDetectedProjects] = useState<DetectedProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Load from localStorage as fallback
    const saved = localStorage.getItem('ct_tools');
    if (saved) {
      try { setTools(JSON.parse(saved)); } catch {}
    }
    const savedProjects = localStorage.getItem('ct_detected_projects');
    if (savedProjects) {
      try { setDetectedProjects(JSON.parse(savedProjects)); } catch {}
    }
    // Load from Supabase — overrides localStorage with server truth
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(config => {
        if (!config) return;
        setTools(prev => prev.map(t => {
          if (t.id === 'jira')      return { ...t, token: config.jira_token ?? '', extra: config.jira_url ?? '', extra2: config.jira_email ?? '' };
          if (t.id === 'asana')     return { ...t, token: config.asana_token ?? '', extra: config.asana_workspace_gid ?? '' };
          if (t.id === 'harvest')   return { ...t, token: config.harvest_token ?? '', extra: config.harvest_account_id ?? '' };
          if (t.id === 'toggl')     return { ...t, token: config.toggl_token ?? '', extra: config.toggl_workspace_id ?? '' };
          if (t.id === 'github')    return { ...t, token: config.github_token ?? '', extra: config.github_owner ?? '' };
          if (t.id === 'anthropic') return { ...t, token: config.anthropic_key ?? '' };
          return t;
        }));
      })
      .catch(() => {});
  }, []);
  const saveTools = async (updated: Tool[]) => {
    setTools(updated);
    localStorage.setItem('ct_tools', JSON.stringify(updated));

    // Build workspace payload from tools
    const jira    = updated.find(t => t.id === 'jira');
    const asana   = updated.find(t => t.id === 'asana');
    const harvest = updated.find(t => t.id === 'harvest');
    const toggl   = updated.find(t => t.id === 'toggl');
    const github  = updated.find(t => t.id === 'github');
    const anthropic = updated.find(t => t.id === 'anthropic');

    const payload = {
      jira_url:             jira?.extra ?? null,
      jira_email:           jira?.extra2 ?? null,
      jira_token:           jira?.token ?? null,
      asana_token:          asana?.token ?? null,
      asana_workspace_gid:  asana?.extra ?? null,
      harvest_token:        harvest?.token ?? null,
      harvest_account_id:   harvest?.extra ?? null,
      toggl_token:          toggl?.token ?? null,
      toggl_workspace_id:   toggl?.extra ?? null,
      github_token:         github?.token ?? null,
      github_owner:         github?.extra ?? null,
      anthropic_key:        anthropic?.token ?? null,
    };

    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  };

  const updateTool = (id: string, field: keyof Tool, value: string | boolean) => {
    saveTools(tools.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const toggleShow = (id: string) => {
    setShowTokens(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const detectProjects = async () => {
    setLoadingProjects(true);
    try {
      const [jiraRes, asanaRes] = await Promise.allSettled([
        fetch('/api/jira'),
        fetch('/api/asana'),
      ]);
      const saved = localStorage.getItem('ct_detected_projects');
      const savedMap = new Map<string, DetectedProject>(
        saved ? JSON.parse(saved).map((p: DetectedProject) => [p.key, p]) : []
      );
      const detected: DetectedProject[] = [];

      if (jiraRes.status === 'fulfilled' && jiraRes.value.ok) {
        const data = await jiraRes.value.json();
        const seen = new Set<string>();
        for (const issue of (data.issues ?? [])) {
          const key = issue.fields.project.key;
          if (!seen.has(key)) {
            seen.add(key);
            detected.push({
              key,
              name: issue.fields.project.name,
              source: 'jira',
              type: savedMap.get(key)?.type ?? 'delivery',
            });
          }
        }
      }
      if (asanaRes.status === 'fulfilled' && asanaRes.value.ok) {
        const data = await asanaRes.value.json();
        const seen = new Set<string>();
        for (const issue of (data.issues ?? [])) {
          const key = issue.fields.project.key;
          if (!seen.has(key)) {
            seen.add(key);
            detected.push({
              key,
              name: issue.fields.project.name,
              source: 'asana',
              type: savedMap.get(key)?.type ?? 'delivery',
            });
          }
        }
      }
      setDetectedProjects(detected);
      localStorage.setItem('ct_detected_projects', JSON.stringify(detected));
    } catch (e) { console.error(e); }
    finally { setLoadingProjects(false); }
  };

  const setProjectType = (key: string, type: 'internal' | 'delivery') => {
    const updated = detectedProjects.map(p => p.key === key ? { ...p, type } : p);
    setDetectedProjects(updated);
    localStorage.setItem('ct_detected_projects', JSON.stringify(updated));
    // Also sync to ct_projects for backward compat
    localStorage.setItem('ct_projects', JSON.stringify(
      updated.map(p => ({ key: p.key, name: p.name, type: p.type, source: p.source }))
    ));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categories = (['pm', 'time', 'repo', 'ai'] as const);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
      <Settings className="h-6 w-6 text-indigo-600" /> Admin
    </h1>
    <p className="text-sm text-slate-500 mt-0.5">Configure your integrations and project categories</p>
  </div>
  <Link
    href="/"
    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
  >
    ← Back to Dashboard
  </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6">
          {[
            { id: 'integrations', label: '🔌 Integrations' },
            { id: 'projects', label: '📁 Projects' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as typeof activeTab); if (tab.id === 'projects') detectProjects(); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── INTEGRATIONS ── */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {categories.map(cat => {
              const catTools = tools.filter(t => t.category === cat);
              const catalog = TOOL_CATALOG[cat];
              return (
                <div key={cat}>
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <div className="space-y-2">
                    {catalog.map(def => {
                      const tool = catTools.find(t => t.id === def.id);
                      if (!def.available) {
                        return (
                          <div key={def.id} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3 opacity-50">
                            <span className="text-sm text-slate-400 flex-1">{def.name}</span>
                            <span className="text-xs text-slate-300 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">Coming Soon</span>
                          </div>
                        );
                      }
                      if (!tool) return null;
                      const isVisible = showTokens[tool.id];
                      const extraDef = 'extraLabel' in def ? def : null;
                      const extra2Def = 'extra2Label' in def ? def : null;

                      return (
                        <div key={def.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                          {/* Tool header */}
                          <div className="flex items-center gap-3 px-4 py-3">
                            <div className={`w-2 h-2 rounded-full ${tool.token ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className="font-medium text-slate-800 text-sm flex-1">{def.name}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <span className="text-xs text-slate-400">Enabled</span>
                              <div
                                onClick={() => updateTool(tool.id, 'enabled', !tool.enabled)}
                                className={`w-9 h-5 rounded-full transition-colors ${tool.enabled ? 'bg-indigo-600' : 'bg-slate-200'} relative cursor-pointer`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${tool.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                              </div>
                            </label>
                          </div>

                          {/* Fields */}
                          {tool.enabled && (
                            <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 space-y-3">
                              {/* API Token */}
                              <div>
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                                  API Token / Key
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type={isVisible ? 'text' : 'password'}
                                    value={tool.token}
                                    onChange={e => updateTool(tool.id, 'token', e.target.value)}
                                    placeholder="Paste your token here..."
                                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 bg-white font-mono"
                                  />
                                  <button
                                    onClick={() => toggleShow(tool.id)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg"
                                  >
                                    {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Extra field (URL, workspace ID, etc.) */}
                              {extraDef && 'extraLabel' in extraDef && (
                                <div>
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                                    {(extraDef as { extraLabel: string }).extraLabel}
                                  </label>
                                  <input
                                    type="text"
                                    value={tool.extra ?? ''}
                                    onChange={e => updateTool(tool.id, 'extra', e.target.value)}
                                    placeholder={tool.id === 'jira' ? 'https://yourcompany.atlassian.net' : ''}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 bg-white"
                                  />
                                </div>
                              )}

                              {/* Extra2 field (email for Jira) */}
                              {extra2Def && 'extra2Label' in extra2Def && (
                                <div>
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                                    {(extra2Def as { extra2Label: string }).extra2Label}
                                  </label>
                                  <input
                                    type="email"
                                    value={tool.extra2 ?? ''}
                                    onChange={e => updateTool(tool.id, 'extra2', e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 bg-white"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
              <strong>Note:</strong> Tokens are stored locally in your browser for now. In production these will be encrypted server-side. Refresh the dashboard after saving to apply changes.
            </div>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Categorize each detected project as Internal or Delivery.</p>
              <button
                onClick={detectProjects}
                disabled={loadingProjects}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${loadingProjects ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loadingProjects ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400">
                Detecting projects from your connected tools...
              </div>
            ) : detectedProjects.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-sm text-slate-400 mb-3">No projects detected yet.</p>
                <button onClick={detectProjects} className="text-xs text-indigo-600 hover:underline">
                  Run detection
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {detectedProjects.map((p, i) => (
                  <div
                    key={p.key}
                    className={`flex items-center gap-3 px-4 py-3 ${i < detectedProjects.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      p.source === 'jira' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {p.source.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-slate-400 w-16">{p.key}</span>
                    <span className="flex-1 text-sm text-slate-800">{p.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setProjectType(p.key, 'internal')}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          p.type === 'internal'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        ⚙️ Internal
                      </button>
                      <button
                        onClick={() => setProjectType(p.key, 'delivery')}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          p.type === 'delivery'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        🚀 Delivery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500">
              <strong>Internal</strong> projects appear in the &quot;Internal Work&quot; tab and feed Ops KPIs.<br />
              <strong>Delivery</strong> projects appear in the Delivery tab and Client Health.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}