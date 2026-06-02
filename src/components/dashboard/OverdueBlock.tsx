'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TaskCard from './TaskCard';
import type { JiraIssue } from '@/types';

interface OverdueBlockProps {
  tasks: JiraIssue[];
  showArea?: boolean;
}

export default function OverdueBlock({ tasks, showArea = false }: OverdueBlockProps) {
  const [expanded, setExpanded] = useState(true);
  if (tasks.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #fecaca', background: '#fff9f9' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="dot dot-red dot-pulse" />
          <span className="font-semibold text-[13px]" style={{ color: '#991b1b' }}>
            {tasks.length} Overdue Task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-red-400" />
          : <ChevronDown className="h-4 w-4 text-red-400" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2" style={{ borderTop: '0.5px solid #fecaca' }}>
          <div className="pt-3 space-y-2">
            {tasks.map(task => (
              <TaskCard key={task.key} issue={task} showArea={showArea} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
