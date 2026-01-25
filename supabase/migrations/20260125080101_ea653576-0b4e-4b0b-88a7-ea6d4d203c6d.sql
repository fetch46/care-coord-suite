-- Add more missing columns to timesheets
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS additional_comments TEXT;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS employee_signature TEXT;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS employee_signature_date DATE;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS patient_signature_date DATE;

-- Add admission_date and care_level to patients
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS admission_date DATE;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS care_level TEXT;

-- Create patient_allergies table
CREATE TABLE public.patient_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  allergy_name TEXT NOT NULL,
  severity TEXT,
  reaction TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_types table
CREATE TABLE public.assessment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skin_assessment_findings table
CREATE TABLE public.skin_assessment_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skin_assessment_id UUID REFERENCES public.skin_assessments(id) ON DELETE CASCADE,
  body_part TEXT NOT NULL,
  finding_type TEXT,
  description TEXT,
  severity TEXT,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_assessment_findings ENABLE ROW LEVEL SECURITY;

-- RLS for patient_allergies
CREATE POLICY "Org users can view patient allergies" ON public.patient_allergies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = patient_allergies.patient_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org staff can manage patient allergies" ON public.patient_allergies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = patient_allergies.patient_id AND ou.user_id = auth.uid()
  )
);

-- RLS for assessment_types
CREATE POLICY "Anyone can view assessment types" ON public.assessment_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage assessment types" ON public.assessment_types FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS for skin_assessment_findings
CREATE POLICY "Org users can view skin assessment findings" ON public.skin_assessment_findings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.skin_assessments sa
    JOIN public.patients p ON p.id = sa.patient_id
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE sa.id = skin_assessment_findings.skin_assessment_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org staff can manage skin assessment findings" ON public.skin_assessment_findings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.skin_assessments sa
    JOIN public.patients p ON p.id = sa.patient_id
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE sa.id = skin_assessment_findings.skin_assessment_id AND ou.user_id = auth.uid()
  )
);