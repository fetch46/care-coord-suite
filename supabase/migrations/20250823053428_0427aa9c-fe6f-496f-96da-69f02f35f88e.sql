-- FINAL SECURITY FIX CORRECTED: Address remaining vulnerable tables
-- Add missing organization_id columns to remaining sensitive tables
ALTER TABLE public.patient_allergies 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.patient_caregivers 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.admissions 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.availabilities 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.invoice_items 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Drop existing permissive policies on remaining sensitive tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT polname, relname FROM pg_policy p
             JOIN pg_class t ON p.polrelid = t.oid
             JOIN pg_namespace n ON t.relnamespace = n.oid
             WHERE n.nspname = 'public'
             AND t.relname IN ('patient_allergies', 'patient_caregivers', 'rooms', 
                              'admissions', 'availabilities', 'invoice_items')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.polname, r.relname);
    END LOOP;
END $$;

-- Create organization-scoped RLS policies for PATIENT_ALLERGIES
CREATE POLICY "org_users_patient_allergies"
ON public.patient_allergies FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_patient_allergies"
ON public.patient_allergies FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for PATIENT_CAREGIVERS
CREATE POLICY "org_users_patient_caregivers"
ON public.patient_caregivers FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_patient_caregivers"
ON public.patient_caregivers FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for ROOMS
CREATE POLICY "org_users_rooms"
ON public.rooms FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_rooms"
ON public.rooms FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for ADMISSIONS
CREATE POLICY "org_users_admissions"
ON public.admissions FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_admissions"
ON public.admissions FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for AVAILABILITIES
CREATE POLICY "org_users_availabilities"
ON public.availabilities FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_availabilities"
ON public.availabilities FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for INVOICE_ITEMS
CREATE POLICY "org_users_invoice_items"
ON public.invoice_items FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_invoice_items"
ON public.invoice_items FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create additional role-based policies for medical staff access (using valid roles only)
CREATE POLICY "medical_staff_patient_allergies"
ON public.patient_allergies FOR SELECT TO authenticated
USING (
  organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true) AND
  (has_role(auth.uid(), 'registered_nurse'::app_role) OR has_role(auth.uid(), 'caregiver'::app_role) OR has_role(auth.uid(), 'administrator'::app_role))
);

CREATE POLICY "staff_own_availability"
ON public.availabilities FOR ALL TO authenticated
USING (
  staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
  organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true)
)
WITH CHECK (
  staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
  organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true)
);