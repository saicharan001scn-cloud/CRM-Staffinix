-- Fix overly permissive INSERT policies by adding user context validation

-- Drop and recreate activity_logs INSERT policy with better security
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert own activity logs"
ON public.activity_logs FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Drop and recreate login_history INSERT policy with better security  
DROP POLICY IF EXISTS "System can insert login history" ON public.login_history;
CREATE POLICY "Users can insert own login history"
ON public.login_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());