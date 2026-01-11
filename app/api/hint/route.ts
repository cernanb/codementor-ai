import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateHintWithRAG } from "@/lib/rag";
import type { RAGSource } from "@/types";
import { runTests, getFailedTests } from "@/lib/test-runner";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { validateRequest, schemas } from "@/lib/middleware/validation";
import {
  formatErrorResponse,
  logError,
  NotFoundError,
  UnauthorizedError,
  ExternalServiceError,
} from "@/lib/errors";

async function handleHint(request: NextRequest) {
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
      schemas.requestHint
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

    // Run tests server-side to get accurate failed tests
    let failedTests;
    try {
      const { testResults } = await runTests(code, challenge);
      failedTests = getFailedTests(testResults);
    } catch (error) {
      throw new ExternalServiceError("Piston", "Failed to execute code", error);
    }

    // If no failed tests, the code is already correct - no hint needed
    if (failedTests.length === 0) {
      return NextResponse.json({
        hint: "Your code passes all tests! No hint needed.",
        hint_type: "success",
        hint_id: null,
        sources: [],
      });
    }

    // Get previous hints for context
    const { data: previousHints, error: hintsError } = await supabase
      .from("ai_hints")
      .select("hint_text")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (hintsError) {
      logError(hintsError, { userId: user.id, challengeId });
    }

    const hints = previousHints?.map((h) => h.hint_text) || [];

    let hint: string;
    let hint_type: string;
    let tokens_used: number | undefined;
    let sources: RAGSource[] = [];

    try {
      const result = await generateHintWithRAG(
        challenge,
        code,
        failedTests,
        hints
      );
      hint = result.hint;
      hint_type = result.hint_type;
      tokens_used = result.tokens_used;
      sources = result.sources;
    } catch (error) {
      throw new ExternalServiceError(
        "OpenAI",
        "Failed to generate hint",
        error
      );
    }

    const { data: savedHint, error: saveError } = await supabase
      .from("ai_hints")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        user_code: code,
        hint_text: hint,
        hint_type,
        tokens_used,
        metadata: {
          rag_enabled: true,
          sources_count: sources.length,
          sources: sources.map((s) => ({
            title: s.title,
            url: s.url,
            topic: s.topic,
            similarity: s.similarity,
          })),
        },
      })
      .select()
      .single();

    if (saveError || !savedHint) {
      throw new ExternalServiceError(
        "Database",
        "Failed to save hint",
        saveError
      );
    }

    // Update hints_used in user_progress (upsert if no record exists)
    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("hints_used")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .single();

    if (existingProgress) {
      const { error: updateError } = await supabase
        .from("user_progress")
        .update({ hints_used: (existingProgress.hints_used || 0) + 1 })
        .eq("user_id", user.id)
        .eq("challenge_id", challengeId);

      if (updateError) {
        logError(updateError, { userId: user.id, challengeId });
      }
    } else {
      const { error: insertError } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: "in_progress",
          hints_used: 1,
          first_attempt_at: new Date().toISOString(),
        });

      if (insertError) {
        logError(insertError, { userId: user.id, challengeId });
      }
    }

    return NextResponse.json({
      hint,
      hint_type,
      hint_id: savedHint.id,
      sources: sources
        .filter((s) => s.title)
        .map((s) => ({
          title: s.title,
          url: s.url,
          section: s.section,
          topic: s.topic,
        })),
    });
  } catch (error) {
    logError(error, { endpoint: "/api/hint" });
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.statusCode,
    });
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    { maxRequests: 10, windowMs: 60 * 1000 }, // 10 hints per minute (more restrictive)
    handleHint
  );
}
