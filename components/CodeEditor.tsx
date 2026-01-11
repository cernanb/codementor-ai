"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Lightbulb,
  X,
  ExternalLink,
  BookOpen,
  Disc2Icon,
} from "lucide-react";
import { TestResults, type TestResultsData } from "./TestResults";
import type { Attempt, HintData } from "@/types";
import { saveAttemptCode } from "@/app/challenge/[id]/actions";

interface CodeEditorProps {
  challengeId: string;
  language: string;
  starterCode: string;
  currentAttempt?: Attempt;
}

export function CodeEditor({
  challengeId,
  language,
  starterCode,
  currentAttempt,
}: CodeEditorProps) {
  const [code, setCode] = useState(
    currentAttempt ? currentAttempt.code : starterCode
  );
  const [results, setResults] = useState<TestResultsData | null>(null);
  const [hintData, setHintData] = useState<HintData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCode = async () => {
    if (!currentAttempt?.id) return;
    setIsSaving(true);
    try {
      await saveAttemptCode(currentAttempt.id, code);
    } catch (error) {
      console.error("Failed to save code:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId,
        code,
        attemptId: currentAttempt?.id,
      }),
    });

    const data = await res.json();
    setResults(data);
    setIsRunning(false);
  };
  const handleRun = async () => {
    setIsRunning(true);

    const res = await fetch("/api/run-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId,
        code,
        attemptId: currentAttempt?.id,
      }),
    });

    const data = await res.json();
    console.log(data);
    setResults(data);
    setIsRunning(false);
  };
  const handleHint = async () => {
    setIsLoadingHint(true);

    const res = await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId,
        code,
      }),
    });

    const data = await res.json();
    setHintData({
      hint: data.hint,
      sources: data.sources || [],
    });
    setIsLoadingHint(false);
  };
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-800 p-4 flex gap-2">
        <Button onClick={handleRun} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run Tests
        </Button>
        <Button variant="outline" onClick={handleHint} disabled={isLoadingHint}>
          <Lightbulb className="w-4 h-4 mr-2" />
          {isLoadingHint ? "Thinking..." : "Get Hint"}
        </Button>
        <Button
          variant="outline"
          onClick={handleSaveCode}
          disabled={isSaving || !currentAttempt}
        >
          <Disc2Icon className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        {results?.passed && <Button onClick={handleSubmit}>Submit</Button>}
      </div>
      <Editor
        height="60%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono",
        }}
      />
      {results && (
        <div className="border-t border-slate-800 p-4 overflow-y-auto">
          <TestResults results={results} />
        </div>
      )}
      {hintData && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[var(--color-surface)] border border-[var(--color-warning)] rounded-lg shadow-lg shadow-black/25 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="p-4">
            <button
              onClick={() => setHintData(null)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-[var(--color-warning)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-warning)] transition-colors cursor-pointer"
              aria-label="Dismiss hint"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <div className="p-2 rounded-full bg-[var(--color-warning)]/20">
                <Lightbulb className="w-4 h-4 text-[var(--color-warning)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--color-warning)] font-semibold text-sm mb-1">
                  Hint
                </p>
                <p className="text-[var(--color-text)] text-sm leading-relaxed">
                  {hintData.hint}
                </p>
                {hintData.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs mb-2">
                      <BookOpen className="w-3 h-3" />
                      <span>Related documentation</span>
                    </div>
                    <ul className="space-y-1">
                      {hintData.sources.map((source, index) => (
                        <li key={index} className="text-xs">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                            >
                              {source.title}
                              {source.section && (
                                <span className="text-[var(--color-text-muted)]">
                                  ({source.section})
                                </span>
                              )}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[var(--color-text-muted)]">
                              {source.title}
                              {source.section && ` (${source.section})`}
                              {source.topic && (
                                <span className="ml-1 px-1.5 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                                  {source.topic}
                                </span>
                              )}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
