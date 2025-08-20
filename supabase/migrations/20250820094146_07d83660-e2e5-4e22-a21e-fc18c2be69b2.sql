-- Add organization_id to key tables for data isolation
-- This will enable organization-specific data filtering

-- Add organization_id to patients table
ALTER TABLE public.patients 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add organization_id to staff table  
ALTER TABLE public.staff 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add organization_id to timesheets table
ALTER TABLE public.timesheets 
ADD COLUMN organization_id UUID REFERENCES public.timesheets(id) ON DELETE CASCADE;

-- Update RLS policies for patients table
DROP POLICY IF EXISTS "Allow all operations on patients" ON public.patients;

CREATE POLICY "Super admins can manage all patients"
ON public.patients
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Organization users can manage their patients"
ON public.patients
FOR ALL
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid()
  )
);

-- Update RLS policies for staff table
DROP POLICY IF EXISTS "Allow all operations on staff" ON public.staff;

CREATE POLICY "Super admins can manage all staff"
ON public.staff
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Organization users can manage their staff"
ON public.staff
FOR ALL
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid()
  )
);