'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AREA_MAP, CHART_COLORS, categorizeStatus } from '@/lib/constants';
import type { JiraIssue, EpicProgress } from '@/types';

interface OpsDetailsProps {
  issues: JiraIssue[];
  filteredIssues: JiraIssue[];
  epicProgress: Record<string, EpicProgress>;
}

export default function OpsDetails({ issues, filteredIssues, epicProgress }: OpsDetailsProps) {
  const [open, setOpen] = useState(false);

  // Filter out epics for status counts — epics tracked separately in epic progress
  const nonEpicIssues = filteredIssues.filter((i) => i.fields.issuetype?.name?.toLowerCase() !== 'epic');

  const statusCounts = {
    todo: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'todo').length,
    inProgress: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'inProgress').length,
    recurring: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'recurring').length,
    done: nonEpicIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'done').length,
  };

  // Determine which areas are represented in the filtered view
  const activeAreaKeys = new Set(filteredIssues.map((i) => i.fields.project.key));
  const isFiltered = activeAreaKeys.size < Object.keys(AREA_MAP).length;

  const areaData = Object.entries(AREA_MAP)
    .filter(([key]) => activeAreaKeys.has(key))
    .map(([key, name]) => ({
      name,
      value: filteredIssues.filter((i) => i.fields.project.key === key).length,
    }));

  const assigneeChartData = Object.entries(
    filteredIssues.reduce<Record<string, number>>((acc, issue) => {
      const name = issue.fields.assignee?.displayName ?? 'Unassigned';
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const epicSummaryByArea = Object.entries(AREA_MAP)
    .filter(([key]) => activeAreaKeys.has(key))
    .map(([key, name]) => {
      const areaEpics = Object.entries(epicProgress).filter(([, epic]) => epic.projectKey === key);
      return {
        key, name,
        totalEpics: areaEpics.length,
        doneEpics: areaEpics.filter(([, e]) => e.done === e.total && e.total > 0).length,
      };
    });

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm hover:border-slate-400 hover:text-slate-500 transition-colors"
      >
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {open ? 'Hide' : 'Show'} Details — Stats, Charts & Area Breakdown
      </button>

      {open && (
        <div className="mt-4 space-y-6 animate-in fade-in duration-300">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{filteredIssues.length}</div>
              <div className="text-xs text-slate-500 mt-1">Total Tasks</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
              <div className="text-xs text-slate-500 mt-1">In Progress</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.done}</div>
              <div className="text-xs text-slate-500 mt-1">Done</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-500">{statusCounts.todo}</div>
              <div className="text-xs text-slate-500 mt-1">To Do</div>
            </div>
          </div>

          {/* Progress by Area */}
          <Card>
            <CardHeader><CardTitle>Progress by Area</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(AREA_MAP)
                  .filter(([key]) => activeAreaKeys.has(key))
                  .map(([key, name]) => {
                    const areaIssues = filteredIssues.filter((i) => i.fields.project.key === key);
                    const done = areaIssues.filter((i) => categorizeStatus(i.fields.status.name) === 'done').length;
                    const total = areaIssues.length;
                    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700">{name}</span>
                          <span className="text-xs text-slate-500">{done}/{total} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Epic Progress */}
          <Card>
            <CardHeader><CardTitle>Epic Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {epicSummaryByArea.map(({ key, name, totalEpics, doneEpics }) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs font-medium text-slate-500 mb-1">{name}</div>
                    <div className="text-xl font-bold text-slate-900">{doneEpics}/{totalEpics}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Epics done</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Tasks by Area</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={areaData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {areaData.map((_, i) => <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tasks by Assignee</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={assigneeChartData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
