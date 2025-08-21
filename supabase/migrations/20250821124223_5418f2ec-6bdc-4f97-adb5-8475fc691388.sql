-- CRITICAL SECURITY FIX PART 2: Handle existing policies and complete the security fix
-- First, add missing organization_id columns to tables that need them
ALTER TABLE public.medical_records 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.caregivers 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.comprehensive_patient_assessments 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.billing_accounts 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.skin_assessments 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Drop ALL existing policies for sensitive tables to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on sensitive tables
    FOR r IN SELECT polname, relname FROM pg_policy p
             JOIN pg_class t ON p.polrelid = t.oid
             JOIN pg_namespace n ON t.relnamespace = n.oid
             WHERE n.nspname = 'public'
             AND t.relname IN ('medical_records', 'caregivers', 'comprehensive_patient_assessments', 
                              'invoices', 'payments', 'billing_accounts', 'skin_assessments', 
                              'staff', 'timesheets')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.polname, r.relname);
    END LOOP;
END $$;

-- Create comprehensive organization-scoped RLS policies for MEDICAL_RECORDS
CREATE POLICY "org_users_medical_records"
ON public.medical_records FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_medical_records"
ON public.medical_records FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for CAREGIVERS
CREATE POLICY "org_users_caregivers"
ON public.caregivers FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_caregivers"
ON public.caregivers FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for COMPREHENSIVE_PATIENT_ASSESSMENTS
CREATE POLICY "org_users_patient_assessments"
ON public.comprehensive_patient_assessments FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_patient_assessments"
ON public.comprehensive_patient_assessments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for INVOICES
CREATE POLICY "org_users_invoices"
ON public.invoices FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_invoices"
ON public.invoices FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for PAYMENTS
CREATE POLICY "org_users_payments"
ON public.payments FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_payments"
ON public.payments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for BILLING_ACCOUNTS
CREATE POLICY "org_users_billing_accounts"
ON public.billing_accounts FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_billing_accounts"
ON public.billing_accounts FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for SKIN_ASSESSMENTS  
CREATE POLICY "org_users_skin_assessments"
ON public.skin_assessments FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_skin_assessments"
ON public.skin_assessments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for STAFF
CREATE POLICY "org_users_staff"
ON public.staff FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_staff"
ON public.staff FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create comprehensive organization-scoped RLS policies for TIMESHEETS
CREATE POLICY "org_users_timesheets"
ON public.timesheets FOR ALL TO authenticated
USING (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true))
WITH CHECK (organization_id IN (SELECT organization_id FROM public.organization_users WHERE user_id = auth.uid() AND is_confirmed = true));

CREATE POLICY "super_admin_timesheets"
ON public.timesheets FOR ALL TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));