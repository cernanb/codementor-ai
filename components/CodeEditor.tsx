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
  testCases: unknown;
}

export function CodeEditor({
  challengeId,
  language,
  starterCode,
  testCases,
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
    const failedTests = results?.test_results?.filter((t) => !t.passed) || [];

    const res = await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId,
        code,
        failedTests,
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
        <div className="border-t border-[var(--color-border)] p-4">
          <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)] rounded-md p-4 relative">
            <button
              onClick={() => setHint("")}
              className="absolute top-2 right-2 p-1 rounded hover:bg-[var(--color-warning)]/20 text-[var(--color-warning)] transition-colors cursor-pointer"
              aria-label="Dismiss hint"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <Lightbulb className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--color-warning)] font-semibold mb-2">
                  Hint
                </p>
                <p className="text-[var(--color-text)]">{hint}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
