-- Fix WARN: Permissive INSERT policies on audit tables
-- Restrict INSERT to records related to submissions the user owns

-- Drop existing permissive policies on status_history
DROP POLICY IF EXISTS "Users can insert status history" ON public.status_history;

-- Create owner-scoped policy for status_history (users + admins)
CREATE POLICY "Users can insert status history for own submissions"
ON public.status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.submissions
    WHERE submissions.id = submission_id
    AND submissions.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
);

-- Drop existing permissive policies on rate_history
DROP POLICY IF EXISTS "Users can insert rate history" ON public.rate_history;

-- Create owner-scoped policy for rate_history (users + admins)
CREATE POLICY "Users can insert rate history for own submissions"
ON public.rate_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.submissions
    WHERE submissions.id = submission_id
    AND submissions.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
);