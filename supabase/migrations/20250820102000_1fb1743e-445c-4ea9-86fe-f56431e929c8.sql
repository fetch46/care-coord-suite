-- Fix the timesheets table foreign key reference error
-- The previous migration had an incorrect self-reference

ALTER TABLE public.timesheets 
DROP COLUMN IF EXISTS organization_id;

-- Add the correct organization_id reference
ALTER TABLE public.timesheets 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;