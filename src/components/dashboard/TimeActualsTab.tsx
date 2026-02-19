'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { MONTH_NAMES } from '@/lib/constants';
import LoadingProgress from './LoadingProgress';
import type { ActualsResponse, ActualsPerson, ActualsProjectTotal, ActualsView } from '@/types';

const JIRA_BROWSE_URL = 'https://verybigthings.atlassian.net/browse';

export default function TimeActualsTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<ActualsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ActualsView>('person');
  const [search, setSearch] = useState('');
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const fetchActuals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tempo/actuals?year=${year}&month=${month}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ActualsResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('[TimeActuals] Fetch error:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchActuals();
  }, [fetchActuals]);

  const navigateMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear -= 1; }
    if (newMonth > 12) { newMonth = 1; newYear += 1; }
    setMonth(newMonth);
    setYear(newYear);
    setExpandedPerson(null);
    setExpandedProject(null);
    setExpandedTask(null);
    setSearch('');
  };

  const searchLower = search.toLowerCase();

  const filteredPeople: ActualsPerson[] = data?.people.filter(
    (p) => p.name.toLowerCase().includes(searchLower) || p.projects.some((proj) => proj.projectKey.toLowerCase().includes(searchLower)),
  ) ?? [];

  const filteredProjects: ActualsProjectTotal[] = data?.projects.filter(
    (p) => p.projectKey.toLowerCase().includes(searchLower) || p.projectName.toLowerCase().includes(searchLower),
  ) ?? [];

  // Toggle helpers
  const togglePerson = (id: string) => {
    setExpandedPerson(expandedPerson === id ? null : id);
    setExpandedProject(null);
    setExpandedTask(null);
  };

  const toggleProject = (personId: string, projectKey: string) => {
    const key = `${personId}:${projectKey}`;
    setExpandedProject(expandedProject === key ? null : key);
    setExpandedTask(null);
  };

  const toggleTask = (personId: string, projectKey: string, issueKey: string) => {
    const key = `${personId}:${projectKey}:${issueKey}`;
    setExpandedTask(expandedTask === key ? null : key);
  };

  // Loading
  if (loading) {
    return (
      <LoadingProgress
        steps={[
          `Fetching ${MONTH_NAMES[month - 1]} ${year} worklogs...`,
          'Resolving Jira projects...',
          'Mapping people to tasks...',
          'Calculating hours breakdown...',
        ]}
        intervalMs={2000}
      />
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-slate-500">No data available for this month.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(-1)} className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">←</button>
          <span className="px-4 py-2 font-medium text-slate-700 bg-white rounded-lg border border-slate-200 min-w-[160px] text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button onClick={() => navigateMonth(1)} className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">→</button>
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setView('person')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'person' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            By Person
          </button>
          <button
            onClick={() => setView('project')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'project' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            By Project
          </button>
        </div>

        <input
          type="text"
          placeholder="Search person or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Hours</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{data.totalHours.toLocaleString()}h</div>
            <p className="text-xs text-slate-400 mt-1">{data.totalWorklogs.toLocaleString()} worklogs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">People</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalPeople}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Projects</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalProjects}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Avg / Person</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalPeople > 0 ? Math.round(data.totalHours / data.totalPeople) : 0}h</div>
          </CardContent>
        </Card>
      </div>

      {/* By Person View */}
      {view === 'person' && (
        <div className="space-y-3">
          {filteredPeople.map((person, idx) => {
            const isPersonExpanded = expandedPerson === person.id;

            return (
              <Card
                key={person.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="py-4">
                  {/* Person Header — always clickable */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => togglePerson(person.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-medium text-slate-900">{person.name}</div>
                        <div className="text-xs text-slate-500">{person.projects.length} project{person.projects.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">{person.totalHours}h</span>
                      <span className="text-slate-400">
                        {isPersonExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Level 2: Projects */}
                  {isPersonExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      {person.projects.map((proj) => {
                        const projDrillKey = `${person.id}:${proj.projectKey}`;
                        const isProjExpanded = expandedProject === projDrillKey;
                        const hasTasks = proj.tasks && proj.tasks.length > 0;

                        return (
                          <div key={proj.projectKey}>
                            {/* Project row */}
                            <div
                              className={`flex justify-between items-center text-sm mb-1 ${hasTasks ? 'cursor-pointer group' : ''}`}
                              onClick={() => hasTasks && toggleProject(person.id, proj.projectKey)}
                            >
                              <span className="text-slate-700 flex items-center gap-1.5">
                                <span className="font-medium">{proj.projectKey}</span>
                                {proj.projectName !== proj.projectKey && (
                                  <span className="text-slate-400">({proj.projectName})</span>
                                )}
                                {hasTasks && (
                                  <span className="text-slate-300 group-hover:text-slate-500">
                                    {isProjExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  </span>
                                )}
                              </span>
                              <span className="font-medium">{proj.hours}h</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${proj.percent}%` }} />
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{proj.percent}% of their time</div>

                            {/* Level 3: Tasks per project */}
                            {isProjExpanded && hasTasks && (
                              <div className="mt-2 ml-2 space-y-0.5 border-l-2 border-indigo-100 pl-3">
                                {proj.tasks.map((task) => {
                                  const taskDrillKey = `${person.id}:${proj.projectKey}:${task.issueKey}`;
                                  const isTaskExpanded = expandedTask === taskDrillKey;
                                  const hasEntries = task.entries && task.entries.length > 0;

                                  return (
                                    <div key={task.issueKey}>
                                      {/* Task row */}
                                      <div
                                        className={`flex items-center justify-between py-1.5 ${hasEntries ? 'cursor-pointer group' : ''}`}
                                        onClick={() => hasEntries && toggleTask(person.id, proj.projectKey, task.issueKey)}
                                      >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <a
                                            href={`${JIRA_BROWSE_URL}/${task.issueKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] font-mono text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 shrink-0"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {task.issueKey}
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                          <span className="text-xs text-slate-600 truncate">
                                            {task.summary !== task.issueKey ? task.summary : ''}
                                          </span>
                                          {hasEntries && (
                                            <span className="text-slate-300 group-hover:text-slate-500 shrink-0">
                                              {isTaskExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 shrink-0 ml-2">{task.hours}h</span>
                                      </div>

                                      {/* Level 4: Time entries */}
                                      {isTaskExpanded && hasEntries && (
                                        <div className="ml-4 mb-2 border-l-2 border-slate-100 pl-3">
                                          {task.entries.map((entry, eIdx) => (
                                            <div key={`${task.issueKey}-${eIdx}`} className="flex items-start justify-between py-1 text-[12px]">
                                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                                <span className="text-slate-400 shrink-0 tabular-nums">{entry.date}</span>
                                                <span className="text-slate-500 truncate">
                                                  {entry.comment || <span className="italic text-slate-300">No comment</span>}
                                                </span>
                                              </div>
                                              <span className="text-slate-500 font-medium shrink-0 ml-2 tabular-nums">{entry.hours}h</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {filteredPeople.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">No people found matching &ldquo;{search}&rdquo;</div>
          )}
        </div>
      )}

      {/* By Project View */}
      {view === 'project' && (
        <div className="space-y-3">
          {filteredProjects.map((proj, idx) => (
            <Card key={proj.projectKey}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-medium text-slate-900">{proj.projectKey}</div>
                      {proj.projectName !== proj.projectKey && (
                        <div className="text-xs text-slate-500">{proj.projectName}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">{proj.hours}h</div>
                    <div className="text-xs text-slate-500">{proj.people} {proj.people === 1 ? 'person' : 'people'} · {proj.percent}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">No projects found matching &ldquo;{search}&rdquo;</div>
          )}
        </div>
      )}
    </div>
  );
}
