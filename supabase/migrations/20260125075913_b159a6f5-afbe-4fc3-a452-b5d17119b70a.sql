-- Add missing columns to appointments table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS caregiver_id UUID REFERENCES public.staff(id) ON DELETE SET NULL;

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  room_type TEXT,
  floor TEXT,
  building TEXT,
  capacity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_reports table
CREATE TABLE public.assessment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID,
  assessment_type TEXT NOT NULL,
  report_title TEXT NOT NULL,
  generated_by TEXT,
  patient_name TEXT,
  assessor_name TEXT,
  assessment_date DATE,
  report_data JSONB,
  findings TEXT,
  recommendations TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive_patient_assessments view or table
CREATE TABLE public.comprehensive_patient_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  assessor_name TEXT,
  score INTEGER,
  max_score INTEGER DEFAULT 100,
  status TEXT DEFAULT 'pending',
  assessment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  source TEXT DEFAULT 'patient_assessment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprehensive_patient_assessments ENABLE ROW LEVEL SECURITY;

-- RLS for rooms
CREATE POLICY "Org users can view their org rooms" ON public.rooms FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = rooms.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage rooms" ON public.rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = rooms.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS for assessment_reports
CREATE POLICY "Authenticated can view assessment reports" ON public.assessment_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create assessment reports" ON public.assessment_reports FOR INSERT TO authenticated WITH CHECK (true);

-- RLS for comprehensive_patient_assessments
CREATE POLICY "Org users can view assessments" ON public.comprehensive_patient_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = comprehensive_patient_assessments.patient_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org staff can manage assessments" ON public.comprehensive_patient_assessments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = comprehensive_patient_assessments.patient_id AND ou.user_id = auth.uid()
  )
);

-- Add triggers
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assessment_reports_updated_at BEFORE UPDATE ON public.assessment_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comprehensive_patient_assessments_updated_at BEFORE UPDATE ON public.comprehensive_patient_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();