-- Add missing columns to assessment_reports
ALTER TABLE public.assessment_reports ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add missing columns to invoices
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS invoice_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2),
  service_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availabilities table
CREATE TABLE public.availabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create caregivers table (or view for staff with caregiver role)
CREATE TABLE public.caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'caregiver',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skin_assessments table
CREATE TABLE public.skin_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  assessor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assessment_date DATE DEFAULT CURRENT_DATE,
  skin_condition TEXT,
  pressure_ulcer_risk TEXT,
  notes TEXT,
  body_map_data JSONB,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discharges table
CREATE TABLE public.discharges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_id UUID REFERENCES public.admissions(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  discharge_date DATE NOT NULL,
  discharge_reason TEXT,
  discharge_summary TEXT,
  follow_up_instructions TEXT,
  discharged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discharges ENABLE ROW LEVEL SECURITY;

-- RLS for invoice_items
CREATE POLICY "Org users can view invoice items" ON public.invoice_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices i
    JOIN public.organization_users ou ON ou.organization_id = i.organization_id
    WHERE i.id = invoice_items.invoice_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org admins can manage invoice items" ON public.invoice_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.invoices i
    JOIN public.organization_users ou ON ou.organization_id = i.organization_id
    WHERE i.id = invoice_items.invoice_id AND ou.user_id = auth.uid() AND ou.role IN ('admin', 'owner', 'administrator')
  )
);

-- RLS for availabilities
CREATE POLICY "Org users can view availabilities" ON public.availabilities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.staff s
    JOIN public.organization_users ou ON ou.organization_id = s.organization_id
    WHERE s.id = availabilities.staff_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Staff can manage their own availabilities" ON public.availabilities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.staff WHERE id = availabilities.staff_id AND user_id = auth.uid())
);

-- RLS for caregivers
CREATE POLICY "Org users can view caregivers" ON public.caregivers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = caregivers.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage caregivers" ON public.caregivers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = caregivers.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS for skin_assessments
CREATE POLICY "Org users can view skin assessments" ON public.skin_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = skin_assessments.patient_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org staff can manage skin assessments" ON public.skin_assessments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = skin_assessments.patient_id AND ou.user_id = auth.uid()
  )
);

-- RLS for discharges
CREATE POLICY "Org users can view discharges" ON public.discharges FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = discharges.patient_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org staff can manage discharges" ON public.discharges FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = discharges.patient_id AND ou.user_id = auth.uid()
  )
);

-- Add triggers
CREATE TRIGGER update_availabilities_updated_at BEFORE UPDATE ON public.availabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_caregivers_updated_at BEFORE UPDATE ON public.caregivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skin_assessments_updated_at BEFORE UPDATE ON public.skin_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discharges_updated_at BEFORE UPDATE ON public.discharges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();