-- Create timesheets table to store digital timesheet submissions
CREATE TABLE public.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES public.caregivers(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  
  -- Time log information
  work_date DATE NOT NULL,
  time_in TIME NOT NULL,
  time_out TIME NOT NULL,
  break_minutes INTEGER DEFAULT 0,
  sleep_in BOOLEAN DEFAULT false,
  total_hours DECIMAL(4,2),
  miles DECIMAL(6,2),
  
  -- Task duties (JSON format)
  personal_care_tasks JSONB DEFAULT '{}'::jsonb,
  home_management_tasks JSONB DEFAULT '{}'::jsonb,
  activities_tasks JSONB DEFAULT '{}'::jsonb,
  
  -- Comments and signatures
  additional_comments TEXT,
  employee_signature TEXT,
  employee_signature_date DATE,
  patient_signature TEXT,
  patient_signature_date DATE,
  
  -- Status and metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all operations on timesheets" 
ON public.timesheets 
FOR ALL 
USING (true);

-- Add update trigger
CREATE TRIGGER update_timesheets_updated_at
BEFORE UPDATE ON public.timesheets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();