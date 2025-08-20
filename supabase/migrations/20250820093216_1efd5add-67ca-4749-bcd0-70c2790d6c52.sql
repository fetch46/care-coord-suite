-- Fix RLS policy for organizations table to allow super admins
-- First drop the existing policy
DROP POLICY IF EXISTS "Admins can manage all tenants" ON public.organizations;

-- Create new policy with correct role check
CREATE POLICY "Super admins can manage all organizations" 
ON public.organizations 
FOR ALL 
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Also ensure the policy allows organization admins to view their own org
CREATE POLICY "Organization admins can view their own organization" 
ON public.organizations 
FOR SELECT 
USING (admin_user_id = auth.uid());