'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2, AlertTriangle, Target, Send, Search, X, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────
interface StatusHistory {
  week_of: string;
  status: 'green' | 'yellow' | 'red';
}

interface Project {
  id: string;
  name: string;
  owner: string;
  phase: string;
  jira_key: string | null;
  client_name: string | null;
  type: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  rate: number | null;
  current_status: 'green' | 'yellow' | 'red' | null;
  update_note: string | null;
  next_milestone: string | null;
  blockers: string | null;
  last_updated: string | null;
  updated_by: string | null;
  status_history: StatusHistory[];
}

type ViewMode = 'grid' | 'by-pm';
type FilterRAG = 'all' | 'green' | 'yellow' | 'red' | 'blockers' | 'needs-update';

// ── Helpers ────────────────────────────────────────────────────
const RAG_DOT_COLORS = {
  green: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
  yellow: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)] animate-pulse',
  red: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)] animate-pulse',
  none: 'bg-slate-300',
} as const;

const SMALL_DOT = {
  green: 'bg-emerald-400',
  yellow: 'bg-amber-400',
  red: 'bg-red-400',
} as const;

function StatusDots({ history }: { history: StatusHistory[] }) {
  if (history.length === 0) return null;
  const recent = history.slice(-10);
  return (
    <div className="flex items-center gap-[3px]">
      {recent.map((h, i) => (
        <span key={i} className={`w-[6px] h-[6px] rounded-full ${SMALL_DOT[h.status]} opacity-70`} />
      ))}
    </div>
  );
}

/** Compute trend from status_history: improving, stable, declining, or unknown. */
type Trend = 'improving' | 'declining' | 'stable' | 'unknown';

const RAG_SCORE: Record<string, number> = { green: 3, yellow: 2, red: 1 };

function computeTrend(history: StatusHistory[]): Trend {
  if (history.length < 2) return 'unknown';
  // Compare last 3 weeks average vs prior 3 weeks average
  const recent = history.slice(-3);
  const prior = history.slice(-6, -3);
  if (prior.length === 0) {
    // Only have <6 weeks, compare last 2 entries
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const lastScore = RAG_SCORE[last.status] ?? 0;
    const prevScore = RAG_SCORE[prev.status] ?? 0;
    if (lastScore > prevScore) return 'improving';
    if (lastScore < prevScore) return 'declining';
    return 'stable';
  }
  const recentAvg = recent.reduce((s, h) => s + (RAG_SCORE[h.status] ?? 0), 0) / recent.length;
  const priorAvg = prior.reduce((s, h) => s + (RAG_SCORE[h.status] ?? 0), 0) / prior.length;
  const diff = recentAvg - priorAvg;
  if (diff > 0.3) return 'improving';
  if (diff < -0.3) return 'declining';
  return 'stable';
}

const TREND_CONFIG = {
  improving: { arrow: '↑', color: 'text-emerald-500', label: 'Improving' },
  declining: { arrow: '↓', color: 'text-red-500', label: 'Declining' },
  stable: { arrow: '→', color: 'text-slate-400', label: 'Stable' },
  unknown: { arrow: '', color: '', label: '' },
} as const;

function TrendArrow({ history }: { history: StatusHistory[] }) {
  const trend = computeTrend(history);
  if (trend === 'unknown') return null;
  const cfg = TREND_CONFIG[trend];
  return (
    <span className={`text-xs font-bold ${cfg.color}`} title={cfg.label}>
      {cfg.arrow}
    </span>
  );
}

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function ownerFirstName(owner: string): string {
  return owner.split(' ')[0];
}

// ── Main Component ─────────────────────────────────────────────
export default function DeliveryTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRAG, setFilterRAG] = useState<FilterRAG>('all');
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Update form
  const [formProjectId, setFormProjectId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'green' | 'yellow' | 'red'>('green');
  const [formNote, setFormNote] = useState('');
  const [formMilestone, setFormMilestone] = useState('');
  const [formBlockers, setFormBlockers] = useState('');
  const [formUpdatedBy, setFormUpdatedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProjects(json.projects ?? []);
    } catch (err) {
      console.error('[ProjectHealth] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ── Derived data ──────────────────────────────────────────
  const activeProjects = useMemo(() => projects.filter((p) => p.phase === 'active'), [projects]);

  const counts = useMemo(() => ({
    active: activeProjects.length,
    green: activeProjects.filter((p) => p.current_status === 'green').length,
    yellow: activeProjects.filter((p) => p.current_status === 'yellow').length,
    red: activeProjects.filter((p) => p.current_status === 'red').length,
    blockers: activeProjects.filter((p) => p.blockers).length,
    needsUpdate: activeProjects.filter((p) => !p.current_status || (daysSince(p.last_updated) ?? 999) > 7).length,
    declining: activeProjects.filter((p) => computeTrend(p.status_history) === 'declining').length,
    improving: activeProjects.filter((p) => computeTrend(p.status_history) === 'improving').length,
  }), [activeProjects]);

  const projectsWithBlockers = useMemo(
    () => activeProjects.filter((p) => p.blockers),
    [activeProjects],
  );

  const owners = useMemo(() => {
    const map = new Map<string, number>();
    activeProjects.forEach((p) => {
      map.set(p.owner, (map.get(p.owner) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [activeProjects]);

  const filtered = useMemo(() => {
    let result = activeProjects;

    if (filterRAG === 'green') result = result.filter((p) => p.current_status === 'green');
    else if (filterRAG === 'yellow') result = result.filter((p) => p.current_status === 'yellow');
    else if (filterRAG === 'red') result = result.filter((p) => p.current_status === 'red');
    else if (filterRAG === 'blockers') result = result.filter((p) => p.blockers);
    else if (filterRAG === 'needs-update') result = result.filter((p) => !p.current_status || (daysSince(p.last_updated) ?? 999) > 7);

    if (filterOwner !== 'all') result = result.filter((p) => p.owner === filterOwner);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.client_name?.toLowerCase().includes(q) ||
        p.update_note?.toLowerCase().includes(q),
      );
    }

    // Sort: red → yellow → no status → green
    const ragOrder: Record<string, number> = { red: 0, yellow: 1 };
    return result.sort((a, b) => {
      const aO = ragOrder[a.current_status ?? ''] ?? (a.current_status ? 3 : 2);
      const bO = ragOrder[b.current_status ?? ''] ?? (b.current_status ? 3 : 2);
      if (aO !== bO) return aO - bO;
      return a.name.localeCompare(b.name);
    });
  }, [activeProjects, filterRAG, filterOwner, search]);

  // Group by PM
  const groupedByOwner = useMemo(() => {
    const map = new Map<string, Project[]>();
    filtered.forEach((p) => {
      if (!map.has(p.owner)) map.set(p.owner, []);
      map.get(p.owner)!.push(p);
    });
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  // ── Actions ───────────────────────────────────────────────
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setFormProjectId(null);
    } else {
      setExpandedId(id);
      setFormProjectId(null);
    }
  };

  const openUpdateForm = (project: Project) => {
    setFormProjectId(project.id);
    setFormStatus(project.current_status ?? 'green');
    setFormNote(project.update_note ?? '');
    setFormMilestone(project.next_milestone ?? '');
    setFormBlockers(project.blockers ?? '');
    setFormUpdatedBy(project.owner);
  };

  const submitUpdate = async () => {
    if (!formProjectId || !formNote.trim() || !formUpdatedBy.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: formProjectId,
          status: formStatus,
          update_note: formNote,
          next_milestone: formMilestone || null,
          blockers: formBlockers || null,
          updated_by: formUpdatedBy,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchProjects();
      setFormProjectId(null);
    } catch (err) {
      console.error('[ProjectHealth] Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render helpers ────────────────────────────────────────
  const renderCard = (project: Project) => {
    const isExpanded = expandedId === project.id;
    const isUpdating = formProjectId === project.id;
    const rag = project.current_status;
    const stale = !rag || (daysSince(project.last_updated) ?? 999) > 7;

    return (
      <div
        key={project.id}
        onClick={() => !isUpdating && toggleExpand(project.id)}
        className={`
          rounded-xl border transition-all cursor-pointer
          ${isExpanded ? 'col-span-full bg-white shadow-lg border-slate-200' : 'bg-white hover:shadow-md hover:-translate-y-[1px] border-slate-200'}
          ${rag === 'yellow' && !isExpanded ? 'border-amber-300' : ''}
          ${rag === 'red' && !isExpanded ? 'border-red-300' : ''}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center gap-1 mt-[5px] shrink-0">
              <span className={`w-[10px] h-[10px] rounded-full ${RAG_DOT_COLORS[rag ?? 'none']}`} />
              <TrendArrow history={project.status_history} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-900 leading-tight">{project.name}</div>
              {project.client_name && project.client_name !== project.name && (
                <div className="text-[11px] text-slate-400 mt-0.5">{project.client_name}</div>
              )}
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              {ownerFirstName(project.owner)}
            </span>
          </div>

          {/* Status dots */}
          <div className="mb-2.5">
            <StatusDots history={project.status_history} />
          </div>

          {/* Note preview */}
          {!isExpanded && (
            <>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {project.update_note || (stale ? 'No update this week' : '')}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                {project.next_milestone ? (
                  <span className="text-[11px] text-indigo-500 font-mono flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />{project.next_milestone}
                  </span>
                ) : <span />}
                <div className="flex items-center gap-2">
                  {stale && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                      Needs update
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">
                    {project.type}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Expanded content */}
          {isExpanded && !isUpdating && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  This Week&apos;s Update
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.update_note || 'No update submitted yet.'}
                </p>
                {project.updated_by && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    — {project.updated_by}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                {project.next_milestone && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Next Milestone
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      {project.next_milestone}
                    </div>
                  </div>
                )}
                {project.blockers && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Blocker
                    </div>
                    <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
                      {project.blockers}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">{project.type}</span>
                  {project.start_date && (
                    <span className="font-mono">Started {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  )}
                </div>
              </div>

              {/* Update button */}
              <div className="col-span-full">
                <button
                  onClick={(e) => { e.stopPropagation(); openUpdateForm(project); }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Submit weekly update
                </button>
              </div>
            </div>
          )}

          {/* Update form */}
          {isUpdating && (
            <div className="mt-4 pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
              <div className="text-xs font-semibold text-slate-500 mb-3">Submit Weekly Update</div>

              {/* RAG selector */}
              <div className="flex gap-2 mb-3">
                {(['green', 'yellow', 'red'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                      formStatus === s
                        ? s === 'green' ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : s === 'yellow' ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-150'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="This week's update..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-2 bg-slate-50"
              />

              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={formMilestone}
                  onChange={(e) => setFormMilestone(e.target.value)}
                  placeholder="Next milestone..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
                <input
                  type="text"
                  value={formBlockers}
                  onChange={(e) => setFormBlockers(e.target.value)}
                  placeholder="Blockers..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
                <button
                  onClick={submitUpdate}
                  disabled={submitting || !formNote.trim() || !formUpdatedBy.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Loading / Empty ───────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm">Loading project health...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">No projects found. Check Supabase connection.</p>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Metric Strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {[
          { key: 'all' as FilterRAG, value: counts.active, label: 'Active', color: 'text-slate-800', topBorder: 'bg-slate-300' },
          { key: 'green' as FilterRAG, value: counts.green, label: 'Green', color: 'text-emerald-600', topBorder: 'bg-emerald-400' },
          { key: 'yellow' as FilterRAG, value: counts.yellow, label: 'Yellow', color: 'text-amber-600', topBorder: 'bg-amber-400' },
          { key: 'red' as FilterRAG, value: counts.red, label: 'Red', color: 'text-red-600', topBorder: 'bg-red-400' },
          { key: 'blockers' as FilterRAG, value: counts.blockers, label: 'Blockers', color: 'text-indigo-600', topBorder: 'bg-indigo-400' },
          { key: 'needs-update' as FilterRAG, value: counts.needsUpdate, label: 'Need Update', color: 'text-slate-500', topBorder: 'bg-slate-300' },
        ].map(({ key, value, label, color, topBorder }) => (
          <button
            key={key}
            onClick={() => { setFilterRAG(filterRAG === key ? 'all' : key); setFilterOwner('all'); }}
            className={`relative overflow-hidden rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-all ${
              filterRAG === key
                ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${topBorder}`} />
            <div className={`text-xl sm:text-2xl font-bold tracking-tight leading-none mb-1 ${color}`}>{value}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
          </button>
        ))}
      </div>

      {/* ── Blockers Banner ───────────────────────────────────── */}
      {projectsWithBlockers.length > 0 && filterRAG !== 'needs-update' && (
        <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-amber-400 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            Active Blockers
          </div>
          {projectsWithBlockers.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-b-0">
              <span className="text-sm font-semibold text-slate-700 sm:min-w-[160px] shrink-0">{p.name}</span>
              <span className="text-sm text-slate-500 leading-relaxed">{p.blockers}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Declining Trend Banner ─────────────────────────────── */}
      {counts.declining > 0 && filterRAG === 'all' && (
        <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-red-400 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-500 mb-3">
            <span className="text-sm font-bold">↓</span>
            {counts.declining} Project{counts.declining !== 1 ? 's' : ''} Trending Down
          </div>
          {activeProjects
            .filter((p) => computeTrend(p.status_history) === 'declining')
            .map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-2 sm:min-w-[160px] shrink-0">
                  <span className={`w-[8px] h-[8px] rounded-full ${RAG_DOT_COLORS[p.current_status ?? 'none']}`} />
                  <span className="text-sm font-semibold text-slate-700">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDots history={p.status_history} />
                  <span className="text-xs text-slate-400">
                    {p.update_note ? p.update_note.slice(0, 80) + (p.update_note.length > 80 ? '...' : '') : 'No recent update'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 -mx-1 px-1 sm:mx-0 sm:px-0">
        <button
          onClick={() => setFilterOwner('all')}
          className={`px-3 py-1 rounded-full text-xs border transition-all ${
            filterOwner === 'all'
              ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {owners.map(([owner, count]) => (
          <button
            key={owner}
            onClick={() => setFilterOwner(filterOwner === owner ? 'all' : owner)}
            className={`px-3 py-1 rounded-full text-xs border transition-all ${
              filterOwner === owner
                ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            {ownerFirstName(owner)} ({count})
          </button>
        ))}

        <div className="relative flex-1 min-w-[140px] sm:min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-[11px] transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('by-pm')}
            className={`px-3 py-1 text-[11px] transition-all ${viewMode === 'by-pm' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
          >
            By PM
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {(filterRAG !== 'all' || filterOwner !== 'all' || search.trim()) && (
        <div className="flex items-center gap-2 flex-wrap">
          {filterRAG !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600">
              {filterRAG}
              <button onClick={() => setFilterRAG('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterOwner !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600">
              {filterOwner}
              <button onClick={() => setFilterOwner('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button
            onClick={() => { setFilterRAG('all'); setFilterOwner('all'); setSearch(''); }}
            className="text-[11px] text-slate-400 hover:text-slate-600"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Project Grid / By PM ──────────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filtered.map(renderCard)}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByOwner.map(([owner, ownerProjects]) => (
            <div key={owner}>
              <div className="flex items-center gap-3 pb-2 mb-3 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-700">{owner}</span>
                <span className="text-xs text-slate-400 font-mono">{ownerProjects.length}</span>
                <div className="flex gap-1 ml-auto">
                  {ownerProjects.map((p) => (
                    <span key={p.id} className={`w-[6px] h-[6px] rounded-full ${SMALL_DOT[p.current_status ?? 'green']}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {ownerProjects.map(renderCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">
          No projects match the current filters
        </div>
      )}
    </div>
  );
}
