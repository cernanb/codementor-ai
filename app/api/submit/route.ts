import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executeCode, SupportedLanguage } from "@/lib/piston";

function wrapCodeWithTestHarness(
  userCode: string,
  language: SupportedLanguage,
  functionName: string,
  input: string
): string {
  switch (language) {
    case "python":
      return `${userCode}\n\nprint(${functionName}(${input}))`;
    case "javascript":
      // Use spread operator for multi-argument functions (input is JSON array)
      return `${userCode}\n\nconsole.log(JSON.stringify(${functionName}(...${input})))`;
    case "typescript":
      return `${userCode}\n\nconsole.log(JSON.stringify(${functionName}(...${input})))`;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { challengeId, code } = await request.json();
  // Get challenge
  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }
  // Run tests
  const testResults = [];
  let allPassed = true;
  for (const testCase of challenge.test_cases) {
    // Wrap user code with test harness that calls the function
    const wrappedCode = wrapCodeWithTestHarness(
      code,
      challenge.language,
      challenge.function_name,
      testCase.input
    );
    const result = await executeCode(wrappedCode, challenge.language);
    const expected = testCase.expected.trim();

    // Check if test expects an error
    const expectsError = expected.startsWith("Error:");

    let actual: string;
    let passed: boolean;

    if (expectsError) {
      // For error tests, check stderr contains the expected error message
      actual = result.stderr.trim();
      passed = actual.includes(expected.replace("Error: ", ""));
    } else {
      actual = result.stdout.trim();
      // Normalize comparison: try JSON parse for array/object comparison
      try {
        const actualParsed = JSON.parse(actual);
        const expectedParsed = JSON.parse(expected);
        passed =
          JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
      } catch {
        // Fall back to string comparison for non-JSON outputs
        passed = actual === expected;
      }
    }

    allPassed = allPassed && passed;
    testResults.push({
      name: testCase.name,
      passed,
      expected,
      actual,
      error: expectsError ? "" : result.stderr,
    });
  }

  const { data: attempt } = await supabase
    .from("attempts")
    .insert({
      user_id: user.id,
      challenge_id: challengeId,
      code,
      passed: allPassed,
      test_results: testResults,
    })
    .select()
    .single();

  await supabase.from("user_progress").upsert({
    user_id: user.id,
    challenge_id: challengeId,
    status: allPassed ? "completed" : "in_progress",
    attempts_count: 1,
    completed_at: allPassed ? new Date().toISOString() : null,
  });
  return NextResponse.json({
    success: true,
    passed: allPassed,
    test_results: testResults,
    attempt_id: attempt.id,
  });
}
