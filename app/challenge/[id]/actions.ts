"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveAttemptCode(attemptId: string, code: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attempts")
    .update({ code })
    .eq("id", attemptId);

  if (error) {
    throw new Error("Failed to save code");
  }

  return { success: true };
}
