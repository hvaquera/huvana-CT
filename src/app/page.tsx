'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverdueBlock from '@/components/dashboard/OverdueBlock';
import UpcomingWork from '@/components/dashboard/UpcomingWork';
import TaskSearch from '@/components/dashboard/TaskSearch';
import TaskCard from '@/components/dashboard/TaskCard';
import OpsDetails from '@/components/dashboard/OpsDetails';
import TimeActualsTab from '@/components/dashboard/TimeActualsTab';
import DeliveryTab from '@/components/dashboard/DeliveryTab';
import ReportsTab from '@/components/dashboard/ReportsTab';
import { REFRESH_INTERVAL_MS, categorizeStatus, STATUS_SORT_ORDER, AREA_MAP } from '@/lib/constants';
import type { JiraIssue, FilterValue, EpicProgress } from '@/types';

export default function Dashboard() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [deliveryIssues, setDeliveryIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [staleExpanded, setStaleExpanded] = useState(false);
  const [staleDismissed, setStaleDismissed] = useState(false);

  const fetchIssues = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const [jiraRes, deliveryRes, deliveryAllRes] = await Promise.all([
        fetch('/api/jira'),
        fetch('/api/jira/delivery'),
        fetch('/api/jira/delivery-all'),
      ]);
      if (jiraRes.ok) {
        const data = await jiraRes.json();
        setIssues(data.issues ?? []);
      }
      if (deliveryAllRes.ok) {
        const data = await deliveryAllRes.json();
        setDeliveryIssues(data.issues ?? []);
      } else if (deliveryRes.ok) {
        // Fallback to delivery without Done if delivery-all fails
        const data = await deliveryRes.json();
        setDeliveryIssues(data.issues ?? []);
      }
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

  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  useEffect(() => {
    const interval = setInterval(() => fetchIssues(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchIssues]);

  const isActuals = filter === 'actuals';
  const isDelivery = filter === 'delivery';

  const areaIssues = useMemo(() => {
    if (filter === 'all' || isActuals || isDelivery) return issues;
    return issues.filter((i) => i.fields.project.key === filter);
  }, [issues, filter, isActuals]);

  const overdueTasks = useMemo(() => {
    return areaIssues.filter((i) => {
      if (!i.fields.duedate) return false;
      if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
      const due = new Date(i.fields.duedate);
      due.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due < today && categorizeStatus(i.fields.status.name) !== 'done';
    });
  }, [areaIssues]);

  const allActiveTasks = useMemo(() => {
    return areaIssues
      .filter((i) => {
        if (categorizeStatus(i.fields.status.name) === 'done') return false;
        if (i.fields.issuetype?.name?.toLowerCase() === 'epic') return false;
        return true;
      })
      .sort((a, b) => {
        // Status category first: In Progress → Blocked → To Do → Recurring → Other
        const statusDiff = (STATUS_SORT_ORDER[categorizeStatus(a.fields.status.name)] ?? 4)
          - (STATUS_SORT_ORDER[categorizeStatus(b.fields.status.name)] ?? 4);
        if (statusDiff !== 0) return statusDiff;
        // Within same status: due date ascending (no due date last)
        const aDate = a.fields.duedate ? new Date(a.fields.duedate).getTime() : Infinity;
        const bDate = b.fields.duedate ? new Date(b.fields.duedate).getTime() : Infinity;
        return aDate - bDate;
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

  // CT-5: Stale tasks — In Progress with no Jira activity in 3+ days
  const staleTasks = useMemo(() => {
    const opsProjectKeys = new Set(Object.keys(AREA_MAP));
    return areaIssues.filter((i) => {
      if (categorizeStatus(i.fields.status.name) !== 'inProgress') return false;
      if (!i.fields.updated) return false;
      const isEpic = i.fields.issuetype?.name?.toLowerCase() === 'epic';
      const isOps = opsProjectKeys.has(i.fields.project.key);
      const daysSince = Math.floor((Date.now() - new Date(i.fields.updated).getTime()) / 86400000);
      if (isEpic && isOps) return false; // Ops epics: never stale
      if (isEpic) return daysSince >= 14; // Delivery epics: 14-day threshold
      return daysSince >= 3; // Regular tasks: 3 days
    });
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
              <TabsTrigger
                value="delivery"
                className="bg-emerald-600 text-white data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
              >
                Delivery
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="bg-amber-600 text-white data-[state=active]:bg-amber-700 data-[state=active]:text-white"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isActuals && <TimeActualsTab />}
        {isDelivery && <DeliveryTab />}
        {filter === 'reports' && <ReportsTab jiraIssues={issues} deliveryIssues={deliveryIssues} />}

        {!isActuals && !isDelivery && filter !== 'reports' && (
          <div className="space-y-4">
            {/* 1. Overdue */}
            <OverdueBlock tasks={overdueTasks} showArea={showArea} />

            {/* 1b. Stale Tasks Warning */}
            {staleTasks.length > 0 && !staleDismissed && (
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 px-3 py-2.5 md:px-4 md:py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStaleExpanded(!staleExpanded)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <span className="text-amber-500 text-sm font-bold">⚠</span>
                    <span className="text-xs font-semibold text-amber-700">
                      {staleTasks.length} &quot;In Progress&quot; task{staleTasks.length !== 1 ? 's' : ''} with no updates in 3+ days
                    </span>
                    <span className="text-amber-400">
                      {staleExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <button
                    onClick={() => setStaleDismissed(true)}
                    className="text-amber-400 hover:text-amber-600 p-0.5"
                    title="Dismiss until refresh"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {staleExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200/50 space-y-1.5">
                    {staleTasks
                      .sort((a, b) => {
                        const aAge = a.fields.updated ? new Date(a.fields.updated).getTime() : 0;
                        const bAge = b.fields.updated ? new Date(b.fields.updated).getTime() : 0;
                        return aAge - bAge;
                      })
                      .map((task) => (
                        <TaskCard key={task.key} issue={task} showArea={showArea} compact />
                      ))}
                  </div>
                )}
              </div>
            )}

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
