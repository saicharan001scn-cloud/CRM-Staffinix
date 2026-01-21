-- Add created_by field to profiles table to track who created each user
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_created_by ON public.profiles(created_by);

-- Update RLS policy for profiles to allow admins to see only users they created
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view users they created" 
ON public.profiles 
FOR SELECT 
USING (
  is_admin(auth.uid()) AND (
    is_super_admin(auth.uid()) OR 
    created_by = auth.uid() OR 
    user_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_super_admin(auth.uid()));

-- Update insert policy to track creator
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Update policy for admins to update only users they created
DROP POLICY IF EXISTS "Users can update profiles" ON public.profiles;

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can update users they created" 
ON public.profiles 
FOR UPDATE 
USING (
  is_admin(auth.uid()) AND (
    is_super_admin(auth.uid()) OR 
    created_by = auth.uid()
  )
);

-- Add delete policy for super admins only
CREATE POLICY "Super admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (is_super_admin(auth.uid()));