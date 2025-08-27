-- Fix infinite recursion in organization_users policies
-- Create a security definer function to get user's organizations safely
CREATE OR REPLACE FUNCTION public.get_user_organizations(p_user_id uuid)
RETURNS TABLE(organization_id uuid)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT ou.organization_id 
  FROM organization_users ou
  WHERE ou.user_id = p_user_id 
    AND ou.is_confirmed = true;
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "org_users_patients" ON public.patients;
DROP POLICY IF EXISTS "org_users_staff" ON public.staff;
DROP POLICY IF EXISTS "org_users_availabilities" ON public.availabilities;
DROP POLICY IF EXISTS "org_users_invoices" ON public.invoices;
DROP POLICY IF EXISTS "org_users_invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "org_users_payments" ON public.payments;
DROP POLICY IF EXISTS "org_users_billing_accounts" ON public.billing_accounts;
DROP POLICY IF EXISTS "org_users_rooms" ON public.rooms;
DROP POLICY IF EXISTS "org_users_skin_assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "org_users_patient_assessments" ON public.comprehensive_patient_assessments;

-- Create new policies using the security definer function
CREATE POLICY "org_users_patients" ON public.patients
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_staff" ON public.staff
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_availabilities" ON public.availabilities
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_invoices" ON public.invoices
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_invoice_items" ON public.invoice_items
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_payments" ON public.payments
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_billing_accounts" ON public.billing_accounts
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_rooms" ON public.rooms
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_skin_assessments" ON public.skin_assessments
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "org_users_patient_assessments" ON public.comprehensive_patient_assessments
FOR ALL
USING (organization_id IN (SELECT get_user_organizations(auth.uid())))
WITH CHECK (organization_id IN (SELECT get_user_organizations(auth.uid())));

-- Add the current user to an organization for testing
-- Get first organization and add current user as confirmed member
INSERT INTO public.organization_users (user_id, organization_id, role, is_confirmed)
SELECT 
  'b71976c0-4203-4c70-8fd8-aef5047dcd04'::uuid,
  o.id,
  'admin',
  true
FROM organizations o 
WHERE NOT EXISTS (
  SELECT 1 FROM organization_users ou 
  WHERE ou.user_id = 'b71976c0-4203-4c70-8fd8-aef5047dcd04'::uuid 
    AND ou.organization_id = o.id
)
LIMIT 1;