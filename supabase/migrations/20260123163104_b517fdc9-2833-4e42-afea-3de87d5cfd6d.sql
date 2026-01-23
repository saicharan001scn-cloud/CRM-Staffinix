-- Fix PUBLIC_DATA_EXPOSURE: Restrict SELECT policies to owner + admins

-- Jobs table: Replace permissive policy with owner-scoped access
DROP POLICY IF EXISTS "Users can view all jobs" ON public.jobs;
CREATE POLICY "Users can view own jobs or admins can view all" ON public.jobs 
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Submissions table: Replace permissive policy with owner-scoped access  
DROP POLICY IF EXISTS "Users can view all submissions" ON public.submissions;
CREATE POLICY "Users can view own submissions or admins can view all" ON public.submissions 
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Vendors table: Replace permissive policy with owner-scoped access
DROP POLICY IF EXISTS "Users can view all vendors" ON public.vendors;
CREATE POLICY "Users can view own vendors or admins can view all" ON public.vendors 
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Consultants table: Also has the same issue, fix it
DROP POLICY IF EXISTS "Users can view all consultants" ON public.consultants;
CREATE POLICY "Users can view own consultants or admins can view all" ON public.consultants 
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));