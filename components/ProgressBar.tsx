"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export function ProgressBar({ completed, total, className }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total && total > 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Stats row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[var(--color-text-muted)] text-sm">
          <span
            className={cn(
              "font-mono font-semibold",
              isComplete
                ? "text-[var(--color-success)]"
                : "text-[var(--color-text)]"
            )}
          >
            {completed}
          </span>
          <span className="mx-1">/</span>
          <span className="font-mono">{total}</span>
          <span className="ml-2">challenges completed</span>
        </span>
        <span
          className={cn(
            "font-mono text-sm font-semibold",
            isComplete
              ? "text-[var(--color-success)]"
              : "text-[var(--color-primary)]"
          )}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress bar track */}
      <div className="relative h-2 bg-[var(--color-surface)] rounded-full overflow-hidden border border-[var(--color-border)]">
        {/* Progress bar fill */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out",
            isComplete
              ? "bg-[var(--color-success)]"
              : "bg-[var(--color-primary)]"
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Terminal-style segment markers */}
        {total > 0 && total <= 10 && (
          <div className="absolute inset-0 flex">
            {Array.from({ length: total - 1 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-[var(--color-border)]/50"
              />
            ))}
            <div className="flex-1" />
          </div>
        )}
      </div>

      {/* Completion message */}
      {isComplete && (
        <p className="mt-2 text-xs text-[var(--color-success)] font-mono motion-safe:animate-[var(--animate-fade-in)]">
          All challenges completed!
        </p>
      )}
    </div>
  );
}
