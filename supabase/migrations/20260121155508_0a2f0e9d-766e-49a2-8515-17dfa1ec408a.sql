-- Add can_view_analytics permission to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS can_view_analytics boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS analytics_access_granted_by uuid,
ADD COLUMN IF NOT EXISTS analytics_access_granted_at timestamp with time zone;

-- Add visibility fields to activity_logs
ALTER TABLE public.activity_logs
ADD COLUMN IF NOT EXISTS visibility_scope text DEFAULT 'team' CHECK (visibility_scope IN ('private', 'team', 'global')),
ADD COLUMN IF NOT EXISTS is_super_admin_activity boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS target_user_id uuid,
ADD COLUMN IF NOT EXISTS performer_role text,
ADD COLUMN IF NOT EXISTS created_by_chain jsonb DEFAULT '[]'::jsonb;

-- Create index for faster activity filtering
CREATE INDEX IF NOT EXISTS idx_activity_logs_visibility ON public.activity_logs(visibility_scope, is_super_admin_activity);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_target ON public.activity_logs(user_id, target_user_id);

-- Update RLS policies for activity_logs to enforce visibility rules
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_logs;

-- Super admins can view all activities
CREATE POLICY "Super admins can view all activities"
ON public.activity_logs
FOR SELECT
USING (is_super_admin(auth.uid()));

-- Admins can view non-super-admin activities for their team
CREATE POLICY "Admins can view team activities"
ON public.activity_logs
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND NOT is_super_admin(auth.uid())
  AND is_super_admin_activity = false
  AND (
    -- Own activities
    user_id = auth.uid()
    -- Activities on users they created
    OR target_user_id IN (
      SELECT user_id FROM public.profiles WHERE created_by = auth.uid()
    )
    -- Activities by users they created
    OR user_id IN (
      SELECT user_id FROM public.profiles WHERE created_by = auth.uid()
    )
  )
);

-- Regular users can only view their own activities
CREATE POLICY "Users can view own activities only"
ON public.activity_logs
FOR SELECT
USING (
  user_id = auth.uid()
  AND is_super_admin_activity = false
);

-- Update insert policy
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.activity_logs;

CREATE POLICY "Authenticated users can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS for analytics access control - update profiles policies
DROP POLICY IF EXISTS "Admins can update users they created" ON public.profiles;

CREATE POLICY "Admins can update users they created"
ON public.profiles
FOR UPDATE
USING (
  is_admin(auth.uid()) 
  AND (
    is_super_admin(auth.uid()) 
    OR created_by = auth.uid()
    OR user_id = auth.uid()
  )
);