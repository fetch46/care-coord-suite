-- CRITICAL SECURITY FIX: Replace public access policies with organization-scoped RLS policies
-- This fixes 8 critical vulnerabilities identified in the security scan

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

-- Drop all existing permissive policies for sensitive tables
DROP POLICY IF EXISTS "Allow all operations on medical_records" ON public.medical_records;
DROP POLICY IF EXISTS "Allow all operations on caregivers" ON public.caregivers;
DROP POLICY IF EXISTS "Allow all operations on comprehensive_patient_assessments" ON public.comprehensive_patient_assessments;
DROP POLICY IF EXISTS "Allow all operations on invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow all operations on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow all operations on billing_accounts" ON public.billing_accounts;
DROP POLICY IF EXISTS "Allow all operations on skin_assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Allow all operations on staff" ON public.staff;
DROP POLICY IF EXISTS "Allow all operations on timesheets" ON public.timesheets;

-- Create organization-scoped RLS policies for MEDICAL_RECORDS
CREATE POLICY "Organization users can manage medical records"
ON public.medical_records
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all medical records"
ON public.medical_records
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for CAREGIVERS
CREATE POLICY "Organization users can manage caregivers"
ON public.caregivers
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all caregivers"
ON public.caregivers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for COMPREHENSIVE_PATIENT_ASSESSMENTS
CREATE POLICY "Organization users can manage patient assessments"
ON public.comprehensive_patient_assessments
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all patient assessments"
ON public.comprehensive_patient_assessments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for INVOICES
CREATE POLICY "Organization users can manage invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for PAYMENTS
CREATE POLICY "Organization users can manage payments"
ON public.payments
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all payments"
ON public.payments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for BILLING_ACCOUNTS
CREATE POLICY "Organization users can manage billing accounts"
ON public.billing_accounts
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all billing accounts"
ON public.billing_accounts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for SKIN_ASSESSMENTS  
CREATE POLICY "Organization users can manage skin assessments"
ON public.skin_assessments
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all skin assessments"
ON public.skin_assessments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for STAFF
CREATE POLICY "Organization users can manage staff"
ON public.staff
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all staff"
ON public.staff
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Create organization-scoped RLS policies for TIMESHEETS
CREATE POLICY "Organization users can manage timesheets"
ON public.timesheets
FOR ALL
TO authenticated
USING (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
))
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_users 
  WHERE user_id = auth.uid() AND is_confirmed = true
));

CREATE POLICY "Super admins can manage all timesheets"
ON public.timesheets
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

-- Add additional role-based policies for sensitive medical data (more restrictive)
CREATE POLICY "Medical staff can view medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_users 
    WHERE user_id = auth.uid() AND is_confirmed = true
  ) AND (
    has_role(auth.uid(), 'registered_nurse'::app_role) OR
    has_role(auth.uid(), 'doctor'::app_role) OR
    has_role(auth.uid(), 'administrator'::app_role)
  )
);

CREATE POLICY "Medical staff can view patient assessments"
ON public.comprehensive_patient_assessments
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_users 
    WHERE user_id = auth.uid() AND is_confirmed = true
  ) AND (
    has_role(auth.uid(), 'registered_nurse'::app_role) OR
    has_role(auth.uid(), 'doctor'::app_role) OR
    has_role(auth.uid(), 'caregiver'::app_role) OR
    has_role(auth.uid(), 'administrator'::app_role)
  )
);

CREATE POLICY "Medical staff can view skin assessments"
ON public.skin_assessments
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_users 
    WHERE user_id = auth.uid() AND is_confirmed = true
  ) AND (
    has_role(auth.uid(), 'registered_nurse'::app_role) OR
    has_role(auth.uid(), 'doctor'::app_role) OR
    has_role(auth.uid(), 'caregiver'::app_role) OR
    has_role(auth.uid(), 'administrator'::app_role)
  )
);