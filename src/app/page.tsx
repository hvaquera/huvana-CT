'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { RefreshCw, Settings, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingProgress from '@/components/dashboard/LoadingProgress';
import OverdueBlock from '@/components/dashboard/OverdueBlock';
import UpcomingWork from '@/components/dashboard/UpcomingWork';
import TaskSearch from '@/components/dashboard/TaskSearch';
import TaskCard from '@/components/dashboard/TaskCard';
import OpsDetails from '@/components/dashboard/OpsDetails';
import TimeActualsTab from '@/components/dashboard/TimeActualsTab';
import KPIsTab from '@/components/dashboard/KPIsTab';
import ReportsTab from '@/components/dashboard/ReportsTab';
import ClientHealthTab from '@/components/dashboard/ClientHealthTab';
import PeoplePerformanceTab from '@/components/dashboard/PeoplePerformanceTab';
import AICopilot from '@/components/dashboard/AICopilot';
import { REFRESH_INTERVAL_MS, categorizeStatus, STATUS_SORT_ORDER } from '@/lib/constants';
import type { JiraIssue, EpicProgress } from '@/types';

type TabValue = 'all' | 'ops' | 'delivery' | 'health' | 'people' | 'actuals' | 'kpis' | 'reports';

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
      const endpoint = endpoints[timeTool] ?? '/api/tempo/actuals';
      const now = new Date();
      const res = await fetch(`${endpoint}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
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

  const epicProgress = useMemo(() => {
    const progress: Record<string, EpicProgress> = {};
    filteredIssues.forEach(issue => {
      if (issue.fields.parent) {
        const k = issue.fields.parent.key;
        if (!progress[k]) progress[k] = { name: issue.fields.parent.fields.summary, total: 0, done: 0, projectKey: issue.fields.project.key };
        progress[k].total++;
        if (categorizeStatus(issue.fields.status.name) === 'done') progress[k].done++;
      }
    });
    return progress;
  }, [filteredIssues]);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingProgress
          steps={['Connecting to Jira...', 'Connecting to Asana...', 'Fetching time data...', 'Building dashboard...']}
          intervalMs={1800}
          subtitle="Pulling from all connected tools"
        />
      </div>
    );
  }

  const isTaskTab = ['all', 'ops', 'delivery'].includes(filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-3 py-4 md:px-8 md:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-900">Control Tower</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs md:text-sm text-slate-400">Delivery Intelligence Platform</p>
              {sourceCounts.jira > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Jira {sourceCounts.jira}</span>
              )}
              {sourceCounts.asana > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">Asana {sourceCounts.asana}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-slate-400 hidden sm:block">{lastRefresh.toLocaleTimeString()}</span>
            <button onClick={() => { fetchIssues(true); setLastRefresh(new Date()); }} disabled={isRefreshing} className="p-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <a href="/admin" className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
              <Settings className="h-4 w-4 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 md:mb-6">
          <Tabs value={filter} onValueChange={(v) => { setFilter(v as TabValue); setSelectedDeliveryProject('all'); }}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ops">Operations</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="health" className="bg-emerald-600 text-white data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
                Client Health
              </TabsTrigger>
              <TabsTrigger value="people" className="bg-blue-600 text-white data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                People
              </TabsTrigger>
              <TabsTrigger value="actuals" className="bg-indigo-600 text-white data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
                Time Actuals
              </TabsTrigger>
              <TabsTrigger value="kpis" className="bg-violet-600 text-white data-[state=active]:bg-violet-700 data-[state=active]:text-white">
                KPIs
              </TabsTrigger>
              <TabsTrigger value="reports" className="bg-amber-600 text-white data-[state=active]:bg-amber-700 data-[state=active]:text-white">
                Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filter === 'delivery' && deliveryProjects.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-slate-500">Project:</span>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setSelectedDeliveryProject('all')} className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedDeliveryProject === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                  All Projects
                </button>
                {deliveryProjects.map(p => (
                  <button key={p.key} onClick={() => setSelectedDeliveryProject(p.key)} className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedDeliveryProject === p.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab content */}
        {filter === 'health' && <ClientHealthTab issues={issues} />}
        {filter === 'people' && <PeoplePerformanceTab issues={issues} timeActuals={timeActuals} githubData={githubData} />}
        {filter === 'actuals' && <TimeActualsTab />}
        {filter === 'kpis' && <KPIsTab jiraIssues={issues} />}
        {filter === 'reports' && <ReportsTab jiraIssues={issues} deliveryIssues={[]} />}

        {isTaskTab && (
          <div className="space-y-4">
            <OverdueBlock tasks={overdueTasks} showArea={true} />

            {staleTasks.length > 0 && !staleDismissed && (
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 px-3 py-2.5 md:px-4 md:py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setStaleExpanded(!staleExpanded)} className="flex items-center gap-2 flex-1 text-left">
                    <span className="text-amber-500 text-sm font-bold">⚠</span>
                    <span className="text-xs font-semibold text-amber-700">
                      {staleTasks.length} &quot;In Progress&quot; task{staleTasks.length !== 1 ? 's' : ''} with no updates in 3+ days
                    </span>
                    {staleExpanded ? <ChevronUp className="h-3.5 w-3.5 text-amber-400" /> : <ChevronDown className="h-3.5 w-3.5 text-amber-400" />}
                  </button>
                  <button onClick={() => setStaleDismissed(true)} className="text-amber-400 hover:text-amber-600 p-0.5">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {staleExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200/50 space-y-1.5">
                    {staleTasks.sort((a, b) => (a.fields.updated ? new Date(a.fields.updated).getTime() : 0) - (b.fields.updated ? new Date(b.fields.updated).getTime() : 0))
                      .map(task => <TaskCard key={task.key} issue={task} showArea={true} compact />)}
                  </div>
                )}
              </div>
            )}

            <UpcomingWork issues={filteredIssues} showArea={true} />

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Find Tasks</h2>
              <TaskSearch tasks={allActiveTasks} showArea={true} activeFilter={filter} />
            </div>

            <OpsDetails issues={issues} filteredIssues={filteredIssues} epicProgress={epicProgress} />
          </div>
        )}
      </div>

      <AICopilot tasks={issues} timeActuals={timeActuals} githubData={githubData} />
    </div>
  );
}