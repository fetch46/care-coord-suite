-- Add missing columns to admissions table
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS room_id uuid;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS admission_type text DEFAULT 'regular';
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS attending_physician text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS admission_notes text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS insurance_authorization text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS estimated_length_of_stay integer;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS care_level text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS special_requirements text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS emergency_contact_notified boolean DEFAULT false;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS admission_status text DEFAULT 'admitted';

-- Add missing columns to patient_insurance table  
ALTER TABLE public.patient_insurance ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.patient_insurance ADD COLUMN IF NOT EXISTS member_number text;
ALTER TABLE public.patient_insurance ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.patient_insurance ADD COLUMN IF NOT EXISTS medicaid_number text;

-- Create financial_settings table
CREATE TABLE IF NOT EXISTS public.financial_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  base_currency text DEFAULT 'USD',
  tax_rate numeric DEFAULT 0,
  payment_methods text[] DEFAULT ARRAY['cash', 'card', 'insurance']::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.financial_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org users can view financial settings" ON public.financial_settings
FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_users WHERE organization_id = financial_settings.organization_id AND user_id = auth.uid())
);

CREATE POLICY "Org admins can manage financial settings" ON public.financial_settings
FOR ALL USING (
  EXISTS (SELECT 1 FROM organization_users WHERE organization_id = financial_settings.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  is_enabled boolean DEFAULT true,
  module_key text UNIQUE NOT NULL,
  category text,
  dependencies text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules" ON public.modules
FOR SELECT USING (true);

CREATE POLICY "Super admins can manage modules" ON public.modules
FOR ALL USING (is_super_admin(auth.uid()));

-- Add title column to comprehensive_patient_assessments if missing
ALTER TABLE public.comprehensive_patient_assessments ADD COLUMN IF NOT EXISTS title text DEFAULT 'Patient Assessment';