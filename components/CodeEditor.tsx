"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Lightbulb, X } from "lucide-react";
import { TestResults, type TestResultsData } from "./TestResults";

interface CodeEditorProps {
  challengeId: string;
  language: string;
  starterCode: string;
}

export function CodeEditor({
  challengeId,
  language,
  starterCode,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [results, setResults] = useState<TestResultsData | null>(null);
  const [hint, setHint] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const handleRun = async () => {
    setIsRunning(true);

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, code }),
    });

    const data = await res.json();
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
    setHint(data.hint);
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
      {hint && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[var(--color-surface)] border border-[var(--color-warning)] rounded-lg shadow-lg shadow-black/25 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="p-4">
            <button
              onClick={() => setHint("")}
              className="absolute top-3 right-3 p-1 rounded hover:bg-[var(--color-warning)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-warning)] transition-colors cursor-pointer"
              aria-label="Dismiss hint"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <div className="p-2 rounded-full bg-[var(--color-warning)]/20">
                <Lightbulb className="w-4 h-4 text-[var(--color-warning)]" />
              </div>
              <div>
                <p className="text-[var(--color-warning)] font-semibold text-sm mb-1">
                  Hint
                </p>
                <p className="text-[var(--color-text)] text-sm leading-relaxed">
                  {hint}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
