-- Create timesheet_approvals table for approval workflow
CREATE TABLE public.timesheet_approvals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    timesheet_id UUID NOT NULL REFERENCES public.timesheets(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on timesheet_approvals
ALTER TABLE public.timesheet_approvals ENABLE ROW LEVEL SECURITY;

-- Create policies for timesheet_approvals
CREATE POLICY "Users can view timesheet approvals for their timesheets" 
ON public.timesheet_approvals 
FOR SELECT 
USING (
    timesheet_id IN (
        SELECT id FROM public.timesheets WHERE caregiver_id IN (
            SELECT id FROM public.staff WHERE user_id = auth.uid()
        )
    )
    OR approver_id = auth.uid()
);

CREATE POLICY "Supervisors can manage timesheet approvals" 
ON public.timesheet_approvals 
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role) OR has_role(auth.uid(), 'registered_nurse'::app_role));

-- Add trigger for updating timestamps
CREATE TRIGGER update_timesheet_approvals_updated_at
    BEFORE UPDATE ON public.timesheet_approvals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add approval_status to timesheets table
ALTER TABLE public.timesheets 
ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Create assessment_reports table for tracking generated reports
CREATE TABLE public.assessment_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID NOT NULL,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('patient', 'caregiver', 'comprehensive', 'skin')),
    report_title TEXT NOT NULL,
    generated_by UUID NOT NULL REFERENCES auth.users(id),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    patient_name TEXT,
    assessor_name TEXT,
    assessment_date DATE,
    report_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on assessment_reports
ALTER TABLE public.assessment_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment_reports
CREATE POLICY "All authenticated users can view assessment reports" 
ON public.assessment_reports 
FOR SELECT 
USING (true);

CREATE POLICY "All authenticated users can create assessment reports" 
ON public.assessment_reports 
FOR INSERT 
WITH CHECK (auth.uid() = generated_by);