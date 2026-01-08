// Database types generated from supabase/migrations/20260107173904_init_tables.sql

// ============================================================================
// Enums
// ============================================================================

export type Difficulty = "easy" | "medium" | "hard";

export type Language = "python" | "javascript" | "typescript";

export type HintType = "syntax" | "logic" | "approach" | "edge_case" | "general";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

// ============================================================================
// JSON Types (for JSONB columns)
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

// ============================================================================
// Table Types
// ============================================================================

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: Language;
  starter_code: string;
  solution_code: string;
  test_cases: TestCase[];
  hints: FallbackHint[] | null;
  function_name: string;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  challenge_id: string;
  code: string;
  passed: boolean | null;
  test_results: TestResult[] | null;
  execution_time_ms: number | null;
  error_message: string | null;
  created_at: string;
}

export interface AIHint {
  id: string;
  user_id: string;
  challenge_id: string;
  attempt_id: string | null;
  user_code: string;
  hint_text: string;
  hint_type: HintType | null;
  tokens_used: number | null;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  challenge_id: string;
  status: ProgressStatus;
  attempts_count: number;
  hints_used: number;
  completed_at: string | null;
  first_attempt_at: string | null;
  updated_at: string;
}

// ============================================================================
// Insert Types (for creating new records)
// ============================================================================

export interface ProfileInsert {
  id: string;
  username: string;
  avatar_url?: string | null;
}

export interface ChallengeInsert {
  title: string;
  description: string;
  difficulty: Difficulty;
  language: Language;
  starter_code: string;
  solution_code: string;
  test_cases: TestCase[];
  function_name: string;
  hints?: FallbackHint[] | null;
  order_index?: number | null;
}

export interface AttemptInsert {
  user_id: string;
  challenge_id: string;
  code: string;
  passed?: boolean | null;
  test_results?: TestResult[] | null;
  execution_time_ms?: number | null;
  error_message?: string | null;
}

export interface AIHintInsert {
  user_id: string;
  challenge_id: string;
  user_code: string;
  hint_text: string;
  attempt_id?: string | null;
  hint_type?: HintType | null;
  tokens_used?: number | null;
}

export interface UserProgressInsert {
  user_id: string;
  challenge_id: string;
  status?: ProgressStatus;
  attempts_count?: number;
  hints_used?: number;
  completed_at?: string | null;
  first_attempt_at?: string | null;
}

// ============================================================================
// Update Types (for updating existing records)
// ============================================================================

export interface ProfileUpdate {
  username?: string;
  avatar_url?: string | null;
}

export interface ChallengeUpdate {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  language?: Language;
  starter_code?: string;
  solution_code?: string;
  test_cases?: TestCase[];
  hints?: FallbackHint[] | null;
  function_name?: string;
  order_index?: number | null;
}

export interface AttemptUpdate {
  passed?: boolean | null;
  test_results?: TestResult[] | null;
  execution_time_ms?: number | null;
  error_message?: string | null;
}

export interface AIHintUpdate {
  hint_text?: string;
  hint_type?: HintType | null;
  tokens_used?: number | null;
}

export interface UserProgressUpdate {
  status?: ProgressStatus;
  attempts_count?: number;
  hints_used?: number;
  completed_at?: string | null;
  first_attempt_at?: string | null;
}

// ============================================================================
// Database Schema Type (for Supabase client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      challenges: {
        Row: Challenge;
        Insert: ChallengeInsert;
        Update: ChallengeUpdate;
      };
      attempts: {
        Row: Attempt;
        Insert: AttemptInsert;
        Update: AttemptUpdate;
      };
      ai_hints: {
        Row: AIHint;
        Insert: AIHintInsert;
        Update: AIHintUpdate;
      };
      user_progress: {
        Row: UserProgress;
        Insert: UserProgressInsert;
        Update: UserProgressUpdate;
      };
    };
  };
}
