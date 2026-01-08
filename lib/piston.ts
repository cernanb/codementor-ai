const PISTON_URL = process.env.PISTON_URL || "http://localhost:2000";

export const LANGUAGES = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "20.11.1" },
  typescript: { language: "typescript", version: "5.0.3" },
} as const;

export type SupportedLanguage = keyof typeof LANGUAGES;

interface PistonResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  language: string;
  version: string;
}

export async function executeCode(
  code: string,
  language: SupportedLanguage,
  stdin: string = ""
) {
  const langConfig = LANGUAGES[language];

  const response = await fetch(`${PISTON_URL}/api/v2/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
      stdin,
      args: [],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Piston API error: ${response.status} ${response.statusText}`
    );
  }

  const result: PistonResponse = await response.json();

  // Handle compilation errors for compiled languages (like TypeScript)
  if (result.compile && result.compile.code !== 0) {
    return {
      stdout: "",
      stderr: result.compile.stderr || result.compile.output,
      status: { id: 6, description: "Compilation Error" },
      time: null,
      memory: null,
    };
  }

  return {
    stdout: result.run.stdout,
    stderr: result.run.stderr,
    status: {
      id: result.run.code === 0 ? 3 : 11,
      description: result.run.code === 0 ? "Accepted" : "Runtime Error",
    },
    time: null,
    memory: null,
  };
}
