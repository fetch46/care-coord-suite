-- Create role permissions table
CREATE TABLE public.role_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  resource text NOT NULL,
  can_view boolean NOT NULL DEFAULT false,
  can_create boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, resource)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for role permissions
CREATE POLICY "Admins can manage all role permissions" 
ON public.role_permissions 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'));

CREATE POLICY "Users can view role permissions" 
ON public.role_permissions 
FOR SELECT 
TO authenticated
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_role_permissions_updated_at
BEFORE UPDATE ON public.role_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default permissions for each role
INSERT INTO public.role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
-- Administrator permissions
('administrator', 'patients', true, true, true, true),
('administrator', 'staff', true, true, true, true),
('administrator', 'medical_records', true, true, true, true),
('administrator', 'appointments', true, true, true, true),
('administrator', 'assessments', true, true, true, true),
('administrator', 'timesheets', true, true, true, true),
('administrator', 'reports', true, true, true, true),
('administrator', 'settings', true, true, true, true),

-- Reception permissions
('reception', 'patients', true, true, true, false),
('reception', 'staff', true, false, false, false),
('reception', 'medical_records', true, false, false, false),
('reception', 'appointments', true, true, true, true),
('reception', 'assessments', true, false, false, false),
('reception', 'timesheets', true, false, false, false),
('reception', 'reports', true, false, false, false),
('reception', 'settings', false, false, false, false),

-- Registered Nurse permissions
('registered_nurse', 'patients', true, true, true, false),
('registered_nurse', 'staff', true, false, false, false),
('registered_nurse', 'medical_records', true, true, true, false),
('registered_nurse', 'appointments', true, true, true, false),
('registered_nurse', 'assessments', true, true, true, true),
('registered_nurse', 'timesheets', true, true, true, false),
('registered_nurse', 'reports', true, false, false, false),
('registered_nurse', 'settings', false, false, false, false),

-- Caregiver permissions
('caregiver', 'patients', true, false, true, false),
('caregiver', 'staff', false, false, false, false),
('caregiver', 'medical_records', true, false, false, false),
('caregiver', 'appointments', true, false, false, false),
('caregiver', 'assessments', true, true, false, false),
('caregiver', 'timesheets', true, true, true, false),
('caregiver', 'reports', false, false, false, false),
('caregiver', 'settings', false, false, false, false);