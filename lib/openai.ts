import { AIHint, Challenge, TestResult } from "@/types";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHint(
  challenge: Challenge,
  userCode: string,
  failedTests: TestResult[],
  previousHints: AIHint[] = []
) {
  const prompt = `
    You are an experienced coding mentor helping a student learn.
    CHALLENGE: 
    ${challenge.description}
    STUDENTS CODE: 
    \`\`\`${challenge.language}
    ${userCode}
    \`\`\`
    FAILED TESTS:
    ${failedTests
      .map((t) => `- ${t.name}: Expected "${t.expected}", got "${t.actual}"`)
      .join("\n")}
    PREVIOUS HINTS:
    ${previousHints.join("\n") || "None"}
    Provide ONE guiding hint that:
    1. Identifies a specific issue (don't give multiple hints at once)
    2. Asks a leading question to guide their thinking
    3. Does NOT include solution code
    4. Uses beginner-friendly language
    5. Encourages them to trace through their logic
    Respond in JSON format:
    {
    "hint": "Your hint here",
    "type": "syntax|logic|approach|edge_case"
    }
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });
  const content = response.choices[0].message.content || "";
  const parsed = JSON.parse(content);
  return {
    hint: parsed.hint,
    hint_type: parsed.type,
    tokens_used: response.usage?.total_tokens,
  };
}
