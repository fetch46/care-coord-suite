-- Fix organization packages access for super admins and package creation
-- Add a policy to allow viewing active packages for everyone (needed for the dropdown)
CREATE POLICY IF NOT EXISTS "Everyone can view active packages"
ON public.organization_packages
FOR SELECT
TO authenticated
USING (is_active = true);

-- Ensure super admins can manage package assignments
CREATE POLICY IF NOT EXISTS "Super admins can manage package assignments"
ON public.organization_package_assignments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role);

-- Fix the existing super admin policy name to be clearer
DROP POLICY IF EXISTS "Super admins can manage subscription packages" ON public.organization_packages;
CREATE POLICY "Super admins can manage all packages"
ON public.organization_packages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));