'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverdueBlock from '@/components/dashboard/OverdueBlock';
import UpcomingWork from '@/components/dashboard/UpcomingWork';
import TaskSearch from '@/components/dashboard/TaskSearch';
import OpsDetails from '@/components/dashboard/OpsDetails';
import TimeActualsTab from '@/components/dashboard/TimeActualsTab';
import { REFRESH_INTERVAL_MS, categorizeStatus, STATUS_SORT_ORDER } from '@/lib/constants';
import type { JiraIssue, FilterValue, EpicProgress } from '@/types';

export default function Dashboard() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchIssues = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const res = await fetch('/api/jira');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIssues(data.issues ?? []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  useEffect(() => {
    const interval = setInterval(() => fetchIssues(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchIssues]);

  const isActuals = filter === 'actuals';

  const areaIssues = useMemo(() => {
    if (filter === 'all' || isActuals) return issues;
    return issues.filter((i) => i.fields.project.key === filter);
  }, [issues, filter, isActuals]);

  const overdueTasks = useMemo(() => {
    return areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      const due = new Date(i.fields.duedate);
      due.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due < today && categorizeStatus(i.fields.status.name) !== 'done';
    });
  }, [areaIssues]);

  const allActiveTasks = useMemo(() => {
    return areaIssues
      .filter((i) => categorizeStatus(i.fields.status.name) !== 'done')
      .sort((a, b) => {
        const aDate = a.fields.duedate ? new Date(a.fields.duedate).getTime() : Infinity;
        const bDate = b.fields.duedate ? new Date(b.fields.duedate).getTime() : Infinity;
        if (aDate !== bDate) return aDate - bDate;
        return (STATUS_SORT_ORDER[categorizeStatus(a.fields.status.name)] ?? 3)
          - (STATUS_SORT_ORDER[categorizeStatus(b.fields.status.name)] ?? 3);
      });
  }, [areaIssues]);

  const epicProgress = useMemo(() => {
    const progress: Record<string, EpicProgress> = {};
    areaIssues.forEach((issue) => {
      if (issue.fields.parent) {
        const epicKey = issue.fields.parent.key;
        if (!progress[epicKey]) {
          progress[epicKey] = { name: issue.fields.parent.fields.summary, total: 0, done: 0, projectKey: issue.fields.project.key };
        }
        progress[epicKey].total += 1;
        if (categorizeStatus(issue.fields.status.name) === 'done') progress[epicKey].done += 1;
      }
    });
    return progress;
  }, [areaIssues]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  const showArea = filter === 'all';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-3 py-4 md:px-8 md:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-900">Control Tower</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">Real-time operations dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-slate-400 hidden sm:block">
              {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={() => fetchIssues(true)}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 md:mb-6 -mx-3 px-3 md:mx-0 md:px-0">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="VBTLEGAL">Legal</TabsTrigger>
              <TabsTrigger value="VBTFINANCE">Finance</TabsTrigger>
              <TabsTrigger value="VBTGTM">GTM & Sales</TabsTrigger>
              <TabsTrigger value="VBTOP">Operations</TabsTrigger>
              <TabsTrigger
                value="actuals"
                className="bg-indigo-600 text-white data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
              >
                Time Actuals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isActuals && <TimeActualsTab />}

        {!isActuals && (
          <div className="space-y-4">
            {/* 1. Overdue */}
            <OverdueBlock tasks={overdueTasks} showArea={showArea} />

            {/* 2. Due in the Next X Days */}
            <UpcomingWork issues={areaIssues} showArea={showArea} />

            {/* 3. In Progress + Search */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Find Tasks
              </h2>
              <TaskSearch tasks={allActiveTasks} showArea={showArea} activeFilter={filter} />
            </div>

            {/* 4. Ops Details */}
            <OpsDetails issues={issues} filteredIssues={areaIssues} epicProgress={epicProgress} />
          </div>
        )}
      </div>
    </div>
  );
}
