'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { RefreshCw, Settings, ChevronDown, ChevronUp, X, LayoutDashboard, Briefcase, Truck, HeartPulse, Users, Clock, BarChart3, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingProgress from '@/components/dashboard/LoadingProgress';
import OverdueBlock from '@/components/dashboard/OverdueBlock';
import UpcomingWork from '@/components/dashboard/UpcomingWork';
import TaskSearch from '@/components/dashboard/TaskSearch';
import TaskCard from '@/components/dashboard/TaskCard';
import TimeActualsTab from '@/components/dashboard/TimeActualsTab';
import KPIsTab from '@/components/dashboard/KPIsTab';
import ReportsTab from '@/components/dashboard/ReportsTab';
import ClientHealthTab from '@/components/dashboard/ClientHealthTab';
import PeoplePerformanceTab from '@/components/dashboard/PeoplePerformanceTab';
import AICopilot from '@/components/dashboard/AICopilot';
import { REFRESH_INTERVAL_MS, categorizeStatus, STATUS_SORT_ORDER } from '@/lib/constants';
import type { JiraIssue } from '@/types';

type TabValue = 'all' | 'compliance' | 'ops' | 'delivery' | 'health' | 'people' | 'actuals' | 'kpis' | 'reports';

function getProjectCategories() {
  if (typeof window === 'undefined') return { ops: [] as string[], delivery: [] as string[] };
  try {
    const saved = localStorage.getItem('ct_projects');
    if (!saved) return { ops: [] as string[], delivery: [] as string[] };
    const projects = JSON.parse(saved) as { key: string; name: string; type: 'internal' | 'delivery' }[];
    return {
      ops: projects.filter(p => p.type === 'internal').map(p => p.key),
      delivery: projects.filter(p => p.type === 'delivery').map(p => p.key),
    };
  } catch {
    return { ops: [] as string[], delivery: [] as string[] };
  }
}

export default function Dashboard() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TabValue>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [staleExpanded, setStaleExpanded] = useState(false);
  const [staleDismissed, setStaleDismissed] = useState(false);
  const [timeActuals, setTimeActuals] = useState<any>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [selectedDeliveryProject, setSelectedDeliveryProject] = useState<string>('all');
  const [projectCategories, setProjectCategories] = useState({ ops: [] as string[], delivery: [] as string[] });

  useEffect(() => { setProjectCategories(getProjectCategories()); }, []);

  const fetchIssues = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const [jiraRes, asanaRes] = await Promise.allSettled([
        fetch('/api/jira'),
        fetch('/api/asana'),
      ]);
      const allIssues: JiraIssue[] = [];
      if (jiraRes.status === 'fulfilled' && jiraRes.value.ok) {
        const data = await jiraRes.value.json();
        allIssues.push(...(data.issues ?? []));
      }
      if (asanaRes.status === 'fulfilled' && asanaRes.value.ok) {
        const data = await asanaRes.value.json();
        allIssues.push(...(data.issues ?? []));
      }
      setIssues(allIssues);
      setLastRefresh(new Date());
      setStaleDismissed(false);
      setStaleExpanded(false);
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchTimeActuals = useCallback(async () => {
    try {
      const timeTool = localStorage.getItem('ct_time_tool') ?? process.env.NEXT_PUBLIC_TIME_TOOL ?? 'tempo';
      const endpoints: Record<string, string> = { tempo: '/api/tempo/actuals', toggl: '/api/toggl/actuals', harvest: '/api/harvest/actuals' };
      const now = new Date();
      const res = await fetch(`${endpoints[timeTool] ?? '/api/tempo/actuals'}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
      if (res.ok) setTimeActuals(await res.json());
    } catch {}
  }, []);

  const fetchGitHub = useCallback(async () => {
    try {
      const res = await fetch('/api/github');
      if (res.ok) setGithubData(await res.json());
    } catch {}
  }, []);

  useEffect(() => { fetchIssues(); fetchTimeActuals(); fetchGitHub(); }, [fetchIssues, fetchTimeActuals, fetchGitHub]);
  useEffect(() => {
    const interval = setInterval(() => fetchIssues(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchIssues]);

  const filteredIssues = useMemo(() => {
    if (!['all', 'ops', 'delivery'].includes(filter)) return issues;
    if (filter === 'ops') {
      return projectCategories.ops.length > 0
        ? issues.filter(i => projectCategories.ops.includes(i.fields.project.key))
        : issues.filter(i => !projectCategories.delivery.includes(i.fields.project.key));
    }
    if (filter === 'delivery') {
      let base = projectCategories.delivery.length > 0
        ? issues.filter(i => projectCategories.delivery.includes(i.fields.project.key))
        : issues.filter(i => !projectCategories.ops.includes(i.fields.project.key));
      if (selectedDeliveryProject !== 'all') base = base.filter(i => i.fields.project.key === selectedDeliveryProject);
      return base;
    }
    return issues;
  }, [issues, filter, projectCategories, selectedDeliveryProject]);

  const deliveryProjects = useMemo(() => {
    const base = projectCategories.delivery.length > 0
      ? issues.filter(i => projectCategories.delivery.includes(i.fields.project.key))
      : issues;
    const map = new Map<string, string>();
    for (const i of base) map.set(i.fields.project.key, i.fields.project.name);
    return Array.from(map.entries()).map(([key, name]) => ({ key, name }));
  }, [issues, projectCategories]);

  const overdueTasks = useMemo(() => filteredIssues.filter(i => {
    if (!i.fields.duedate || i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    const due = new Date(i.fields.duedate); due.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return due < today && categorizeStatus(i.fields.status.name) !== 'done';
  }), [filteredIssues]);

  const allActiveTasks = useMemo(() => filteredIssues
    .filter(i => categorizeStatus(i.fields.status.name) !== 'done' && i.fields.issuetype?.name?.toLowerCase() !== 'epic')
    .sort((a, b) => {
      const sd = (STATUS_SORT_ORDER[categorizeStatus(a.fields.status.name)] ?? 4) - (STATUS_SORT_ORDER[categorizeStatus(b.fields.status.name)] ?? 4);
      if (sd !== 0) return sd;
      return (a.fields.duedate ? new Date(a.fields.duedate).getTime() : Infinity) - (b.fields.duedate ? new Date(b.fields.duedate).getTime() : Infinity);
    }), [filteredIssues]);

  const staleTasks = useMemo(() => filteredIssues.filter(i => {
    if (categorizeStatus(i.fields.status.name) !== 'inProgress' || !i.fields.updated || i.fields.assignee?.active === false || i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
    const daysSince = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);
    return daysSince >= 3 && daysSince <= 90;
  }), [filteredIssues]);

  const sourceCounts = useMemo(() => ({
    jira: issues.filter(i => /^[A-Z]+-\d+$/.test(i.key)).length,
    asana: issues.filter(i => /^\d{16,}$/.test(i.key)).length,
  }), [issues]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--muted)' }}>
        <LoadingProgress
          steps={['Connecting to Jira...', 'Connecting to Asana...', 'Fetching time data...', 'Building dashboard...']}
          intervalMs={1800}
          subtitle="Pulling from all connected tools"
        />
      </div>
    );
  }

  const isTaskTab = ['all', 'ops', 'delivery'].includes(filter);

  const tabs: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { value: 'all', label: 'All', icon: LayoutDashboard },
    { value: 'ops', label: 'Internal Work', icon: Briefcase },
    { value: 'delivery', label: 'Delivery Work', icon: Truck },
    { value: 'health', label: 'Projects Health', icon: HeartPulse },
    { value: 'people', label: 'People', icon: Users },
    { value: 'actuals', label: 'Time Actuals', icon: Clock },
    { value: 'kpis', label: 'KPIs', icon: BarChart3 },
    { value: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--muted)' }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between" style={{ height: 52 }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'var(--indigo)' }}>
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-white font-medium text-[15px] leading-none">Control Tower</span>
              <span className="text-slate-500 text-[11px] ml-2">Delivery Intelligence</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              {sourceCounts.jira > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                  Jira {sourceCounts.jira}
                </span>
              )}
              {sourceCounts.asana > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }}>
                  Asana {sourceCounts.asana}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] hidden sm:block px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={() => { fetchIssues(true); setLastRefresh(new Date()); }}
              disabled={isRefreshing}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40"
              style={{ color: '#64748b' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <a
              href="/admin"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: '#64748b' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Settings className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div className="bg-white" style={{ borderBottom: '0.5px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Tabs value={filter} onValueChange={(v) => { setFilter(v as TabValue); setSelectedDeliveryProject('all'); }}>
            <TabsList className="flex-nowrap">
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                      {tab.badge}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* ── Delivery project picker ──────────────────────────── */}
      {filter === 'delivery' && deliveryProjects.length > 1 && (
        <div className="bg-white border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2">
            <span className="section-label">Project:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDeliveryProject('all')}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium ${selectedDeliveryProject === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
              >
                All Projects
              </button>
              {deliveryProjects.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelectedDeliveryProject(p.key)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium ${selectedDeliveryProject === p.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

        {/* Specialised tabs */}
        {filter === 'health' && <ClientHealthTab issues={issues} />}
        {filter === 'people' && <PeoplePerformanceTab issues={issues} timeActuals={timeActuals} githubData={githubData} />}
        {filter === 'actuals' && <TimeActualsTab />}
        {filter === 'kpis' && <KPIsTab jiraIssues={issues} />}
        {filter === 'reports' && <ReportsTab jiraIssues={issues} deliveryIssues={[]} />}

        {/* Task tabs */}
        {isTaskTab && (
          <div className="space-y-4">
            <OverdueBlock tasks={overdueTasks} showArea={true} />

            {staleTasks.length > 0 && !staleDismissed && (
              <div className="rounded-xl border px-4 py-3" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                <div className="flex items-center gap-2">
                  <button onClick={() => setStaleExpanded(!staleExpanded)} className="flex items-center gap-2 flex-1 text-left">
                    <span className="text-[13px] font-semibold" style={{ color: '#92400e' }}>
                      ⚠ {staleTasks.length} task{staleTasks.length !== 1 ? 's' : ''} with no updates in 3+ days
                    </span>
                    {staleExpanded ? <ChevronUp className="h-3.5 w-3.5 text-amber-500" /> : <ChevronDown className="h-3.5 w-3.5 text-amber-500" />}
                  </button>
                  <button onClick={() => setStaleDismissed(true)} className="text-amber-400 hover:text-amber-600 p-0.5">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {staleExpanded && (
                  <div className="mt-2.5 pt-2.5 space-y-1.5" style={{ borderTop: '0.5px solid rgba(245,158,11,0.3)' }}>
                    {staleTasks
                      .sort((a, b) => (a.fields.updated ? new Date(a.fields.updated).getTime() : 0) - (b.fields.updated ? new Date(b.fields.updated).getTime() : 0))
                      .map(task => <TaskCard key={task.key} issue={task} showArea={true} compact />)}
                  </div>
                )}
              </div>
            )}

            <UpcomingWork issues={filteredIssues} showArea={true} />

            <div>
              <p className="section-label mb-2">Find Tasks</p>
              <TaskSearch tasks={allActiveTasks} showArea={true} activeFilter={filter} />
            </div>
          </div>
        )}
      </main>

      <AICopilot tasks={issues} timeActuals={timeActuals} githubData={githubData} />
    </div>
  );
}
