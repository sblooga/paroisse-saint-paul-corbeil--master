-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a new policy that allows users to see their own roles AND admins to see all roles
CREATE POLICY "Users can view own roles, admins can view all"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);