import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runTests } from "@/lib/test-runner";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { validateRequest, schemas } from "@/lib/middleware/validation";
import {
  formatErrorResponse,
  logError,
  NotFoundError,
  UnauthorizedError,
  ExternalServiceError,
} from "@/lib/errors";

async function handleSubmit(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    // Validate request body
    const { challengeId, code } = await validateRequest(
      request,
      schemas.submitCode
    );

    // Get challenge
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", challengeId)
      .single();

    if (challengeError || !challenge) {
      throw new NotFoundError("Challenge", challengeId);
    }

    // Run tests
    let testResults;
    let allPassed;
    try {
      const results = await runTests(code, challenge);
      testResults = results.testResults;
      allPassed = results.allPassed;
    } catch (error) {
      throw new ExternalServiceError("Piston", "Failed to execute code", error);
    }

    // Save attempt
    const { data: attempt, error: attemptError } = await supabase
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

    if (attemptError || !attempt) {
      throw new ExternalServiceError(
        "Database",
        "Failed to save attempt",
        attemptError
      );
    }

    // Update progress
    const { error: progressError } = await supabase
      .from("user_progress")
      .upsert({
        user_id: user.id,
        challenge_id: challengeId,
        status: allPassed ? "completed" : "in_progress",
        attempts_count: 1,
        completed_at: allPassed ? new Date().toISOString() : null,
      });

    if (progressError) {
      // Log but don't fail the request if progress update fails
      logError(progressError, { userId: user.id, challengeId });
    }

    return NextResponse.json({
      success: true,
      passed: allPassed,
      test_results: testResults,
      attempt_id: attempt.id,
    });
  } catch (error) {
    logError(error, { endpoint: "/api/submit" });
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.statusCode,
    });
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    { maxRequests: 30, windowMs: 60 * 1000 }, // 30 requests per minute
    handleSubmit
  );
}
