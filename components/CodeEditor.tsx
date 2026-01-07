"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Lightbulb } from "lucide-react";
import { TestResults } from "./TestResults";

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
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
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
    // TODO: Implement hint generation
  };
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-800 p-4 flex gap-2">
        <Button onClick={handleRun} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run Tests
        </Button>
        <Button variant="outline" onClick={handleHint}>
          <Lightbulb className="w-4 h-4 mr-2" />
          Get Hint
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
    </div>
  );
}
