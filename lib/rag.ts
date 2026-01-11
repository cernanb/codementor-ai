import {
  AIHint,
  Challenge,
  HintType,
  KnowledgeMatch,
  TestResult,
} from "@/types";
import { createClient } from "./supabase/server";
import { getOpenAIClient } from "./openai";

export interface RAGSource {
  title: string;
  url?: string;
  section?: string;
  topic?: string;
  similarity: number;
}

export interface RAGHintResult {
  hint: string;
  hint_type: HintType;
  sources: RAGSource[];
  tokens_used?: number;
}

async function retrieveRelevantDocs(
  userCode: string,
  failedTests: TestResult[],
  language?: string
): Promise<KnowledgeMatch[]> {
  const supabase = await createClient();
  const openai = getOpenAIClient();

  console.log(failedTests);

  const errorContext = `
    Programming language: ${language || "unknown"}
    Code with issues: ${userCode}
    Failed tests: ${failedTests
      .map(
        (test) =>
          `${test.name}: expected "${test.expected}", got "${test.actual}"`
      )
      .join("; ")}
  `;

  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: errorContext,
  });

  const { data: relevantDocs } = await supabase.rpc("match_knowledge", {
    query_embedding: queryEmbedding.data[0].embedding,
    match_threshold: 0.4,
    match_count: 3,
    filter_language: language || null,
  });

  return relevantDocs || [];
}

function extractSources(docs: KnowledgeMatch[]): RAGSource[] {
  return docs.map((doc) => ({
    title: doc.metadata?.source?.title || doc.metadata?.topic || doc.type,
    url: doc.metadata?.source?.url,
    section: doc.metadata?.source?.section,
    topic: doc.metadata?.topic,
    similarity: Math.round(doc.similarity * 100) / 100,
  }));
}

export async function generateHintWithRAG(
  challenge: Challenge,
  userCode: string,
  failedTests: TestResult[],
  previousHints: AIHint[] = []
): Promise<RAGHintResult> {
  const openai = getOpenAIClient();

  const relevantDocs = await retrieveRelevantDocs(
    userCode,
    failedTests,
    challenge.language
  );

  const sources = extractSources(relevantDocs);

  const docsContext = relevantDocs
    .map((doc, i) => {
      const sourceLabel =
        doc.metadata?.source?.title || doc.metadata?.topic || `Source ${i + 1}`;
      return `[${sourceLabel}]:\n${doc.content}`;
    })
    .join("\n\n---\n\n");

  const prompt = `You are an experienced coding mentor helping a student learn. You have access to relevant documentation that may help guide your hint.

CHALLENGE:
${challenge.description}

STUDENT'S CODE:
\`\`\`${challenge.language}
${userCode}
\`\`\`

FAILED TESTS:
${failedTests
  .map((t) => `- ${t.name}: Expected "${t.expected}", got "${t.actual}"`)
  .join("\n")}

PREVIOUS HINTS GIVEN:
${previousHints.map((h) => `- ${h}`).join("\n") || "None"}

RELEVANT DOCUMENTATION:
${docsContext || "No relevant documentation found."}

Using the documentation above as reference, provide ONE guiding hint that:
1. Identifies a specific issue in the student's code
2. References relevant concepts from the documentation when applicable
3. Asks a leading question to guide their thinking
4. Does NOT include solution code or give away the answer
5. Uses beginner-friendly language
6. Encourages them to trace through their logic

Respond in JSON format:
{
  "hint": "Your guiding hint here, referencing documentation concepts if relevant",
  "type": "syntax|logic|approach|edge_case"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  });

  const content = response.choices[0].message.content || "";

  let parsed: { hint: string; type: string };
  try {
    parsed = JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    parsed = { hint: content, type: "approach" };
  }

  return {
    hint: parsed.hint,
    hint_type: parsed.type as RAGHintResult["hint_type"],
    sources,
    tokens_used: response.usage?.total_tokens,
  };
}
