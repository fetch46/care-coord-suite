-- Allow authenticated users to view active organization packages (for dropdown)
DROP POLICY IF EXISTS "Everyone can view active organization packages" ON public.organization_packages;
CREATE POLICY "Everyone can view active organization packages"
ON public.organization_packages
FOR SELECT
TO authenticated
USING (is_active = true);
