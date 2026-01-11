-- ================================================================
-- RAG Knowledge Base Migration
-- Adds vector-based documentation retrieval system
-- ================================================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges ON DELETE CASCADE,
  
  -- Core content
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  
  -- High-level categorical fields (for fast filtering)
  type TEXT NOT NULL CHECK (type IN ('language_docs', 'common_patterns', 'best_practices', 'examples')),
  language TEXT NOT NULL CHECK (language IN ('python', 'javascript', 'typescript')),
  
  -- Flexible metadata (sources, topics, tags, etc.)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creaete indices
CREATE INDEX idx_kb_challenge_id ON knowledge_base(challenge_id);
CREATE INDEX idx_kb_type ON knowledge_base(type);
CREATE INDEX idx_kb_language ON knowledge_base(language);
CREATE INDEX idx_kb_metadata ON knowledge_base USING GIN (metadata);

CREATE INDEX idx_kb_embedding ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_kb_metadata_topic ON knowledge_base ((metadata->>'topic'));
CREATE INDEX idx_kb_metadata_difficulty ON knowledge_base ((metadata->>'difficulty'));

-- Enable Row Level Security (RLS)
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Knowledge base is publicly readable"
  ON knowledge_base FOR SELECT
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Service role can manage knowledge base"
  ON knowledge_base FOR ALL
  USING (auth.role() = 'service_role');

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.4,
  match_count INT DEFAULT 3,
  filter_challenge_id UUID DEFAULT NULL,
  filter_type TEXT DEFAULT NULL,
  filter_language TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  challenge_id UUID,
  content TEXT,
  type TEXT,
  language TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.challenge_id,
    kb.content,
    kb.type,
    kb.language,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 
    -- Similarity threshold
    1 - (kb.embedding <=> query_embedding) >= match_threshold
    -- Optional filters
    AND (filter_challenge_id IS NULL OR kb.challenge_id = filter_challenge_id)
    AND (filter_type IS NULL OR kb.type = filter_type)
    AND (filter_language IS NULL OR kb.language = filter_language)
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;



CREATE OR REPLACE FUNCTION get_knowledge_base_stats()
RETURNS TABLE (
  total_documents BIGINT,
  by_type JSONB,
  by_language JSONB,
  by_challenge JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_documents,
    jsonb_object_agg(type, count) as by_type,
    jsonb_object_agg(language, count) as by_language,
    jsonb_object_agg(challenge_id::text, count) as by_challenge
  FROM (
    SELECT 
      type,
      language,
      challenge_id,
      COUNT(*) as count
    FROM knowledge_base
    GROUP BY type, language, challenge_id
  ) stats;
END;
$$;

-- Step 8: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_base_updated_at 
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Update ai_hints table to track RAG usage
-- Add metadata column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_hints' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE ai_hints ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index on ai_hints metadata for analytics
CREATE INDEX IF NOT EXISTS idx_ai_hints_metadata ON ai_hints USING GIN (metadata);

-- Step 10: Create analytics view for RAG effectiveness
CREATE OR REPLACE VIEW rag_effectiveness AS
SELECT
  h.challenge_id,
  c.title as challenge_title,
  COUNT(*) as total_hints,
  COUNT(*) FILTER (WHERE h.metadata->>'rag_enabled' = 'true') as rag_hints,
  COUNT(*) FILTER (WHERE h.metadata->>'rag_enabled' = 'false' OR h.metadata->>'rag_enabled' IS NULL) as non_rag_hints,
  -- Success rate: next attempt passed
  ROUND(
    100.0 * COUNT(*) FILTER (
      WHERE EXISTS (
        SELECT 1 FROM attempts a
        WHERE a.user_id = h.user_id
          AND a.challenge_id = h.challenge_id
          AND a.created_at > h.created_at
          AND a.passed = true
        ORDER BY a.created_at ASC
        LIMIT 1
      )
    ) / NULLIF(COUNT(*), 0),
    2
  ) as overall_success_rate,
  ROUND(
    100.0 * COUNT(*) FILTER (
      WHERE h.metadata->>'rag_enabled' = 'true'
        AND EXISTS (
          SELECT 1 FROM attempts a
          WHERE a.user_id = h.user_id
            AND a.challenge_id = h.challenge_id
            AND a.created_at > h.created_at
            AND a.passed = true
          ORDER BY a.created_at ASC
          LIMIT 1
        )
    ) / NULLIF(COUNT(*) FILTER (WHERE h.metadata->>'rag_enabled' = 'true'), 0),
    2
  ) as rag_success_rate,
  ROUND(
    100.0 * COUNT(*) FILTER (
      WHERE (h.metadata->>'rag_enabled' = 'false' OR h.metadata->>'rag_enabled' IS NULL)
        AND EXISTS (
          SELECT 1 FROM attempts a
          WHERE a.user_id = h.user_id
            AND a.challenge_id = h.challenge_id
            AND a.created_at > h.created_at
            AND a.passed = true
          ORDER BY a.created_at ASC
          LIMIT 1
        )
    ) / NULLIF(COUNT(*) FILTER (WHERE h.metadata->>'rag_enabled' = 'false' OR h.metadata->>'rag_enabled' IS NULL), 0),
    2
  ) as non_rag_success_rate
FROM ai_hints h
JOIN challenges c ON h.challenge_id = c.id
GROUP BY h.challenge_id, c.title;

-- Step 11: Add comments for documentation
COMMENT ON TABLE knowledge_base IS 'Vector-based knowledge base for RAG-enhanced hint generation';
COMMENT ON COLUMN knowledge_base.content IS 'Documentation text content to be embedded and retrieved';
COMMENT ON COLUMN knowledge_base.embedding IS 'OpenAI text-embedding-3-small vector (1536 dimensions)';
COMMENT ON COLUMN knowledge_base.type IS 'Category: language_docs, common_patterns, best_practices, examples';
COMMENT ON COLUMN knowledge_base.language IS 'Programming language: python, javascript, typescript';
COMMENT ON COLUMN knowledge_base.metadata IS 'Flexible JSONB for topics, sources, tags, etc. Structure: { topic, source: { title, url, section }, tags, difficulty }';

COMMENT ON FUNCTION match_knowledge IS 'Vector similarity search with optional filters. Returns most relevant documents based on cosine similarity.';
COMMENT ON FUNCTION get_knowledge_base_stats IS 'Returns statistics about knowledge base content distribution';

COMMENT ON VIEW rag_effectiveness IS 'Analytics view comparing RAG vs non-RAG hint effectiveness. Shows success rates (did next attempt pass?)';

-- Step 12: Grant permissions (adjust as needed for your setup)
-- These are conservative defaults - adjust based on your needs

-- Public can read knowledge base and use search function
GRANT SELECT ON knowledge_base TO anon, authenticated;
GRANT EXECUTE ON FUNCTION match_knowledge TO anon, authenticated;
GRANT SELECT ON rag_effectiveness TO authenticated;

-- Only service role can modify
GRANT ALL ON knowledge_base TO service_role;

-- ================================================================
-- Migration Complete
-- ================================================================

-- Verify installation
DO $$ 
BEGIN
  RAISE NOTICE 'Knowledge base migration complete!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run the seeding script to populate knowledge base';
  RAISE NOTICE '2. Test vector search: SELECT * FROM match_knowledge((SELECT embedding FROM knowledge_base LIMIT 1));';
  RAISE NOTICE '3. Check stats: SELECT * FROM get_knowledge_base_stats();';
END $$;