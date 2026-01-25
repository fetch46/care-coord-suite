-- Add missing columns to assessments tables
ALTER TABLE public.patient_assessments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.patient_assessments ADD COLUMN IF NOT EXISTS recommendations TEXT;

ALTER TABLE public.caregiver_assessments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.caregiver_assessments ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Add missing columns to staff table
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Add missing column to user_roles table
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create role_permissions table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (role, resource)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  appointment_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add work_date column to timesheets (if missing)
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS work_date DATE;

-- Create timesheet_approvals table
CREATE TABLE public.timesheet_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID REFERENCES public.timesheets(id) ON DELETE CASCADE NOT NULL,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  approval_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_approvals ENABLE ROW LEVEL SECURITY;

-- RLS for role_permissions
CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- RLS for appointments
CREATE POLICY "Org users can view their org appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = appointments.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org staff can manage their org appointments" ON public.appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = appointments.organization_id AND user_id = auth.uid())
);

-- RLS for timesheet_approvals
CREATE POLICY "Users can view related timesheet approvals" ON public.timesheet_approvals FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.timesheets t
    JOIN public.organization_users ou ON ou.organization_id = t.organization_id
    WHERE t.id = timesheet_approvals.timesheet_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org admins can manage timesheet approvals" ON public.timesheet_approvals FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.timesheets t
    JOIN public.organization_users ou ON ou.organization_id = t.organization_id
    WHERE t.id = timesheet_approvals.timesheet_id AND ou.user_id = auth.uid() AND ou.role IN ('admin', 'owner', 'administrator')
  )
);

-- Update triggers
CREATE TRIGGER update_role_permissions_updated_at BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();