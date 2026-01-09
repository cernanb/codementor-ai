import { executeCode, SupportedLanguage } from "@/lib/piston";
import { TestResult, Challenge } from "@/types";

interface TestCase {
  name: string;
  input: string;
  expected: string;
  description?: string;
}

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
      return `${userCode}\n\nconsole.log(JSON.stringify(${functionName}(...${input})))`;
    case "typescript":
      return `${userCode}\n\nconsole.log(JSON.stringify(${functionName}(...${input})))`;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

export interface RunTestsResult {
  testResults: TestResult[];
  allPassed: boolean;
}

/**
 * Runs all test cases against user code and returns the results.
 * This is the core test execution logic used by both submit and hint endpoints.
 */
export async function runTests(
  code: string,
  challenge: Challenge
): Promise<RunTestsResult> {
  const testResults: TestResult[] = [];
  let allPassed = true;

  for (const testCase of challenge.test_cases as TestCase[]) {
    const wrappedCode = wrapCodeWithTestHarness(
      code,
      challenge.language as SupportedLanguage,
      challenge.function_name,
      testCase.input
    );

    const result = await executeCode(
      wrappedCode,
      challenge.language as SupportedLanguage
    );
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
        passed = JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
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

  return { testResults, allPassed };
}

/**
 * Gets only the failed tests from a test run.
 * Useful for hint generation which only needs failed tests.
 */
export function getFailedTests(testResults: TestResult[]): TestResult[] {
  return testResults.filter((result) => !result.passed);
}
