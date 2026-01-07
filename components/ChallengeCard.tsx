import Link from "next/link";
import { cn } from "@/lib/utils";

type Difficulty = "easy" | "medium" | "hard";
type Status = "not_started" | "in_progress" | "completed";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: string;
  user_progress?: Array<{
    status: Status;
    attempts_count?: number;
    hints_used?: number;
  }>;
}

interface ChallengeCardProps {
  challenge: Challenge;
}

const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string }
> = {
  easy: {
    label: "Easy",
    className: "bg-[var(--color-badge-easy)] text-[var(--color-text-inverse)]",
  },
  medium: {
    label: "Medium",
    className:
      "bg-[var(--color-badge-medium)] text-[var(--color-text-inverse)]",
  },
  hard: {
    label: "Hard",
    className: "bg-[var(--color-badge-hard)] text-[var(--color-text-inverse)]",
  },
};

const statusConfig: Record<Status, { icon: string; label: string }> = {
  not_started: { icon: "○", label: "Not started" },
  in_progress: { icon: "◐", label: "In progress" },
  completed: { icon: "●", label: "Completed" },
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const progress = challenge.user_progress?.[0];
  const status: Status = progress?.status || "not_started";
  const difficulty = challenge.difficulty || "easy";
  const difficultyStyles = difficultyConfig[difficulty];
  const statusInfo = statusConfig[status];

  return (
    <Link href={`/challenge/${challenge.id}`} className="block group">
      <div
        className={cn(
          "bg-[var(--color-card)] border border-[var(--color-border)]",
          "rounded-[var(--radius-lg)] p-6",
          "hover:bg-[var(--color-card-hover)] hover:border-[var(--color-primary)]",
          "transition-all duration-200 cursor-pointer",
          "shadow-[var(--shadow-md)]",
          "motion-safe:animate-[var(--animate-fade-in)]"
        )}
      >
        {/* Header with difficulty badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide",
              difficultyStyles.className
            )}
          >
            {difficultyStyles.label}
          </span>
          <span
            className={cn(
              "text-sm font-mono",
              status === "completed" && "text-[var(--color-success)]",
              status === "in_progress" && "text-[var(--color-warning)]",
              status === "not_started" && "text-[var(--color-text-muted)]"
            )}
            title={statusInfo.label}
          >
            {statusInfo.icon}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 mb-4">
          {challenge.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <span className="text-xs font-mono text-[var(--color-text-muted)] uppercase">
            {challenge.language}
          </span>
          {progress && (
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
              {progress.attempts_count !== undefined &&
                progress.attempts_count > 0 && (
                  <span title="Attempts">
                    <span className="font-mono">{progress.attempts_count}</span>{" "}
                    {progress.attempts_count === 1 ? "attempt" : "attempts"}
                  </span>
                )}
              {progress.hints_used !== undefined && progress.hints_used > 0 && (
                <span title="Hints used" className="text-[var(--color-warning)]">
                  <span className="font-mono">{progress.hints_used}</span>{" "}
                  {progress.hints_used === 1 ? "hint" : "hints"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
