// Types derived from auto-generated supabase.ts
// Re-run `npx supabase gen types typescript` to update

import type { Tables, TablesInsert, TablesUpdate } from "./supabase";

// ============================================================================
// Table Row Types (derived from generated types)
// ============================================================================

export type Profile = Tables<"profiles">;
export type Challenge = Tables<"challenges">;
export type Attempt = Tables<"attempts">;
export type AIHint = Tables<"ai_hints">;
export type UserProgress = Tables<"user_progress">;
export type KnowledgeBase = Tables<"knowledge_base">;

// ============================================================================
// Insert Types (derived from generated types)
// ============================================================================

export type ProfileInsert = TablesInsert<"profiles">;
export type ChallengeInsert = TablesInsert<"challenges">;
export type AttemptInsert = TablesInsert<"attempts">;
export type AIHintInsert = TablesInsert<"ai_hints">;
export type UserProgressInsert = TablesInsert<"user_progress">;
export type KnowledgeBaseInsert = TablesInsert<"knowledge_base">;

// ============================================================================
// Update Types (derived from generated types)
// ============================================================================

export type ProfileUpdate = TablesUpdate<"profiles">;
export type ChallengeUpdate = TablesUpdate<"challenges">;
export type AttemptUpdate = TablesUpdate<"attempts">;
export type AIHintUpdate = TablesUpdate<"ai_hints">;
export type UserProgressUpdate = TablesUpdate<"user_progress">;
export type KnowledgeBaseUpdate = TablesUpdate<"knowledge_base">;

// ============================================================================
// Enums (manually defined for stricter typing than DB strings)
// ============================================================================

export type Difficulty = "easy" | "medium" | "hard";
export type Language = "python" | "javascript" | "typescript";
export type HintType = "syntax" | "logic" | "approach" | "edge_case" | "general";
export type ProgressStatus = "not_started" | "in_progress" | "completed";

// ============================================================================
// JSON Types (for JSONB columns - provides structure the generated types lack)
// ============================================================================

export interface TestCase {
  input: unknown;
  expected: unknown;
  description?: string;
}

export interface TestResult {
  name: string;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  error?: string;
}

export interface FallbackHint {
  hint: string;
  type: HintType;
}

export interface KnowledgeSource {
  title?: string;
  url?: string;
  section?: string;
}

export interface KnowledgeMetadata {
  topic?: string;
  source?: KnowledgeSource;
  tags?: string[];
  difficulty?: string;
}

// Type for match_knowledge RPC result (KnowledgeBase row + similarity score)
export interface KnowledgeMatch {
  id: string;
  challenge_id: string | null;
  content: string;
  type: string;
  language: string;
  metadata: KnowledgeMetadata;
  similarity: number;
}

// ============================================================================
// UI Types (for component props and API responses)
// ============================================================================

export interface HintSource {
  title: string;
  url?: string;
  section?: string;
  topic?: string;
}

export interface HintData {
  hint: string;
  sources: HintSource[];
}

// RAG-specific types (includes similarity score from vector search)
export interface RAGSource extends HintSource {
  similarity: number;
}

export interface RAGHintResult {
  hint: string;
  hint_type: HintType;
  sources: RAGSource[];
  tokens_used?: number;
}

// ============================================================================
// Re-export Database type for convenience
// ============================================================================

export type { Database } from "./supabase";
