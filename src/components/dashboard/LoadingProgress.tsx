'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProgressProps {
  /** Steps to show in sequence, e.g. ["Fetching Jira tasks...", "Loading delivery data..."] */
  steps: string[];
  /** How long (ms) to auto-advance between steps. Default: 2500 */
  intervalMs?: number;
  /** Optional subtitle below the progress bar */
  subtitle?: string;
}

/**
 * Animated loading indicator with a progress bar and rotating status messages.
 * Simulates progress through steps at a fixed interval since we can't
 * get real-time progress from serverless API routes.
 */
export default function LoadingProgress({ steps, intervalMs = 2500, subtitle }: LoadingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (steps.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        // Stay on the last step (don't loop)
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [steps.length, intervalMs]);

  const progress = steps.length > 1
    ? Math.min(((currentStep + 1) / steps.length) * 100, 95) // Never hit 100% until actually done
    : 30; // Single step: show indeterminate-ish

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="h-7 w-7 animate-spin text-indigo-500 mb-4" />

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status message */}
      <p className="text-sm text-slate-500 font-medium transition-opacity duration-300">
        {steps[currentStep] ?? steps[steps.length - 1]}
      </p>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
