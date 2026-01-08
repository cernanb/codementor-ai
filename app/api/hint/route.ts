import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateHint } from "@/lib/openai";
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { challengeId, code, failedTests } = await request.json();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  const { data: previousHints } = await supabase
    .from("ai_hints")
    .select("hint_text")
    .eq("user_id", user.id)
    .eq("challenge_id", challengeId)
    .order("created_at", { ascending: false })
    .limit(3);

  const hints = previousHints?.map((h) => h.hint_text) || [];

  const { hint, hint_type, tokens_used } = await generateHint(
    challenge,
    code,
    failedTests,
    hints
  );

  const { data: savedHint } = await supabase
    .from("ai_hints")
    .insert({
      user_id: user.id,
      challenge_id: challengeId,
      user_code: code,
      hint_text: hint,
      hint_type,
      tokens_used,
    })
    .select()
    .single();

  await supabase.rpc("increment_hints_used", {
    p_user_id: user.id,
    p_challenge_id: challengeId,
  });
  return NextResponse.json({
    hint,
    hint_type,
    hint_id: savedHint.id,
  });
}
