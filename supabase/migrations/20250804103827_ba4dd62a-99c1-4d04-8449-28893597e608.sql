-- Create admissions table
CREATE TABLE public.admissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  room_id UUID NOT NULL,
  admission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admission_type TEXT DEFAULT 'regular',
  admission_status TEXT DEFAULT 'admitted',
  discharge_date TIMESTAMP WITH TIME ZONE,
  discharge_reason TEXT,
  attending_physician TEXT,
  admission_notes TEXT,
  insurance_authorization TEXT,
  estimated_length_of_stay INTEGER,
  care_level TEXT,
  special_requirements TEXT,
  emergency_contact_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on admissions" ON public.admissions FOR ALL USING (true);

-- Create packages table for package management
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  billing_type TEXT DEFAULT 'monthly', -- monthly, daily, hourly, one-time
  duration_hours INTEGER, -- for hourly packages
  includes_services JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on packages" ON public.packages FOR ALL USING (true);

-- Create patient_packages to track which packages patients are on
CREATE TABLE public.patient_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  package_id UUID NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_packages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on patient_packages" ON public.patient_packages FOR ALL USING (true);

-- Create modules table for module management
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  module_key TEXT NOT NULL UNIQUE, -- for code reference
  category TEXT DEFAULT 'general',
  dependencies JSONB DEFAULT '[]'::jsonb, -- array of module keys this depends on
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on modules" ON public.modules FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_admissions_updated_at
  BEFORE UPDATE ON public.admissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_packages_updated_at
  BEFORE UPDATE ON public.patient_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default modules
INSERT INTO public.modules (name, display_name, description, module_key, category) VALUES
('patient_management', 'Patient Management', 'Manage patient records, registration, and information', 'patients', 'core'),
('scheduling', 'Scheduling & Appointments', 'Appointment scheduling and calendar management', 'scheduling', 'core'),
('assessments', 'Patient Assessments', 'Conduct and manage patient assessments', 'assessments', 'clinical'),
('billing', 'Billing & Finance', 'Billing, invoicing, and financial management', 'billing', 'business'),
('timesheet', 'Timesheet Management', 'Staff timesheet and time tracking', 'timesheet', 'hr'),
('reports', 'Reports & Analytics', 'Generate reports and analytics', 'reports', 'analytics'),
('medical_records', 'Medical Records', 'Manage patient medical records and documentation', 'medical_records', 'clinical'),
('skin_assessment', 'Skin Assessment', 'Specialized skin assessment tools', 'skin_assessment', 'clinical'),
('admissions', 'Admissions Management', 'Manage patient admissions and room assignments', 'admissions', 'core'),
('packages', 'Package Management', 'Manage care packages and pricing', 'packages', 'business');

-- Add indexes for performance
CREATE INDEX idx_admissions_patient_id ON public.admissions(patient_id);
CREATE INDEX idx_admissions_room_id ON public.admissions(room_id);
CREATE INDEX idx_admissions_status ON public.admissions(admission_status);
CREATE INDEX idx_patient_packages_patient_id ON public.patient_packages(patient_id);
CREATE INDEX idx_patient_packages_package_id ON public.patient_packages(package_id);
CREATE INDEX idx_patient_packages_status ON public.patient_packages(status);
CREATE INDEX idx_modules_enabled ON public.modules(is_enabled);
CREATE INDEX idx_modules_category ON public.modules(category);