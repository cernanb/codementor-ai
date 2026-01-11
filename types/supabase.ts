export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ai_hints: {
        Row: {
          attempt_id: string | null;
          challenge_id: string;
          created_at: string | null;
          hint_text: string;
          hint_type: string | null;
          id: string;
          metadata: Json | null;
          tokens_used: number | null;
          user_code: string;
          user_id: string;
        };
        Insert: {
          attempt_id?: string | null;
          challenge_id: string;
          created_at?: string | null;
          hint_text: string;
          hint_type?: string | null;
          id?: string;
          metadata?: Json | null;
          tokens_used?: number | null;
          user_code: string;
          user_id: string;
        };
        Update: {
          attempt_id?: string | null;
          challenge_id?: string;
          created_at?: string | null;
          hint_text?: string;
          hint_type?: string | null;
          id?: string;
          metadata?: Json | null;
          tokens_used?: number | null;
          user_code?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_hints_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: false;
            referencedRelation: "attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_hints_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          }
        ];
      };
      attempts: {
        Row: {
          challenge_id: string;
          code: string;
          created_at: string | null;
          error_message: string | null;
          execution_time_ms: number | null;
          id: string;
          passed: boolean | null;
          test_results: Json | null;
          user_id: string;
        };
        Insert: {
          challenge_id: string;
          code: string;
          created_at?: string | null;
          error_message?: string | null;
          execution_time_ms?: number | null;
          id?: string;
          passed?: boolean | null;
          test_results?: Json | null;
          user_id: string;
        };
        Update: {
          challenge_id?: string;
          code?: string;
          created_at?: string | null;
          error_message?: string | null;
          execution_time_ms?: number | null;
          id?: string;
          passed?: boolean | null;
          test_results?: Json | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attempts_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          }
        ];
      };
      challenges: {
        Row: {
          created_at: string | null;
          description: string;
          difficulty: string;
          function_name: string;
          hints: Json | null;
          id: string;
          language: string;
          order_index: number | null;
          solution_code: string;
          starter_code: string;
          test_cases: Json;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          difficulty: string;
          function_name: string;
          hints?: Json | null;
          id?: string;
          language: string;
          order_index?: number | null;
          solution_code: string;
          starter_code: string;
          test_cases: Json;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          difficulty?: string;
          function_name?: string;
          hints?: Json | null;
          id?: string;
          language?: string;
          order_index?: number | null;
          solution_code?: string;
          starter_code?: string;
          test_cases?: Json;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      knowledge_base: {
        Row: {
          challenge_id: string | null;
          content: string;
          created_at: string | null;
          embedding: string;
          id: string;
          language: string;
          metadata: Json;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          challenge_id?: string | null;
          content: string;
          created_at?: string | null;
          embedding: string;
          id?: string;
          language: string;
          metadata?: Json;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          challenge_id?: string | null;
          content?: string;
          created_at?: string | null;
          embedding?: string;
          id?: string;
          language?: string;
          metadata?: Json;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "knowledge_base_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          attempts_count: number | null;
          challenge_id: string;
          completed_at: string | null;
          first_attempt_at: string | null;
          hints_used: number | null;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          attempts_count?: number | null;
          challenge_id: string;
          completed_at?: string | null;
          first_attempt_at?: string | null;
          hints_used?: number | null;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          attempts_count?: number | null;
          challenge_id?: string;
          completed_at?: string | null;
          first_attempt_at?: string | null;
          hints_used?: number | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      rag_effectiveness: {
        Row: {
          challenge_id: string | null;
          challenge_title: string | null;
          non_rag_hints: number | null;
          non_rag_success_rate: number | null;
          overall_success_rate: number | null;
          rag_hints: number | null;
          rag_success_rate: number | null;
          total_hints: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_hints_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      get_knowledge_base_stats: {
        Args: never;
        Returns: {
          by_challenge: Json;
          by_language: Json;
          by_type: Json;
          total_documents: number;
        }[];
      };
      match_knowledge: {
        Args: {
          filter_challenge_id?: string;
          filter_language?: string;
          filter_type?: string;
          match_count?: number;
          match_threshold?: number;
          query_embedding: string;
        };
        Returns: {
          challenge_id: string;
          content: string;
          id: string;
          language: string;
          metadata: Json;
          similarity: number;
          type: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
