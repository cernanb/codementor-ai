"use client";

import { CheckCircle2, XCircle, Clock } from "lucide-react";

export interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  error?: string;
}

export interface TestResultsData {
  success: boolean;
  passed: boolean;
  test_results: TestResult[];
  execution_time_ms?: number;
}

interface TestResultsProps {
  results: TestResultsData;
}

export function TestResults({ results }: TestResultsProps) {
  const { test_results, execution_time_ms, passed: allPassed } = results;
  const passedCount = test_results.filter((t) => t.passed).length;
  const totalCount = test_results.length;

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {allPassed ? (
            <CheckCircle2 className="w-6 h-6 text-[var(--color-success)]" />
          ) : (
            <XCircle className="w-6 h-6 text-[var(--color-error)]" />
          )}
          <span
            className={`font-semibold font-mono ${
              allPassed
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]"
            }`}
          >
            {allPassed ? "All Tests Passed!" : "Some Tests Failed"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[var(--color-text-muted)] text-sm">
          <span>
            {passedCount}/{totalCount} passed
          </span>
          {execution_time_ms !== undefined && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {execution_time_ms}ms
            </span>
          )}
        </div>
      </div>

      {/* Test Results List */}
      <div className="bg-[var(--color-code-bg)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
        {test_results.map((test, index) => (
          <div
            key={index}
            className="flex items-start gap-3 py-3 px-4 border-b border-[var(--color-border)] last:border-b-0"
          >
            {test.passed ? (
              <span className="text-[var(--color-success)] text-xl leading-none mt-0.5">
                ✓
              </span>
            ) : (
              <span className="text-[var(--color-error)] text-xl leading-none mt-0.5">
                ✗
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[var(--color-text)] font-medium font-mono text-sm">
                {test.name}
              </p>
              {!test.passed && (
                <div className="mt-2 space-y-1">
                  {test.expected !== undefined && test.actual !== undefined && (
                    <p className="text-[var(--color-text-muted)] text-sm font-mono">
                      Expected:{" "}
                      <code className="bg-[var(--color-success-muted)]/20 text-[var(--color-success)] px-1.5 py-0.5 rounded">
                        {test.expected}
                      </code>
                    </p>
                  )}
                  {test.actual !== undefined && (
                    <p className="text-[var(--color-text-muted)] text-sm font-mono">
                      Got:{" "}
                      <code className="bg-[var(--color-error-muted)]/20 text-[var(--color-error)] px-1.5 py-0.5 rounded">
                        {test.actual}
                      </code>
                    </p>
                  )}
                  {test.error && (
                    <p className="text-[var(--color-error)] text-sm font-mono mt-2 bg-[var(--color-error)]/10 p-2 rounded">
                      {test.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
