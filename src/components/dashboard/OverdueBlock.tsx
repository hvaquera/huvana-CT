'use client';

import TaskCard from './TaskCard';
import type { JiraIssue } from '@/types';

interface OverdueBlockProps {
  tasks: JiraIssue[];
  showArea?: boolean;
}

export default function OverdueBlock({ tasks, showArea = false }: OverdueBlockProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="rounded-xl bg-red-50/70 border border-red-200 p-3 md:p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <span className="text-sm font-semibold text-red-800">
          {tasks.length} Overdue Task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-2">
        {tasks
          .sort((a, b) => {
            const dA = a.fields.duedate ? new Date(a.fields.duedate).getTime() : 0;
            const dB = b.fields.duedate ? new Date(b.fields.duedate).getTime() : 0;
            return dA - dB; // most overdue first
          })
          .map((task) => (
            <TaskCard key={task.key} issue={task} showArea={showArea} compact />
          ))}
      </div>
    </div>
  );
}
