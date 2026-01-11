-- Add UPDATE policy for attempts table
-- Users can update their own attempts (e.g., to save code changes)

CREATE POLICY "Users can update their own attempts"
  ON attempts FOR UPDATE
  USING ((select auth.uid()) = user_id);
