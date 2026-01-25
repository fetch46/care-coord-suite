-- Add payment_number to payments
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_number TEXT;

-- Create patient_emergency_contacts table
CREATE TABLE public.patient_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_insurance table
CREATE TABLE public.patient_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  provider_name TEXT NOT NULL,
  policy_number TEXT,
  group_number TEXT,
  subscriber_name TEXT,
  effective_date DATE,
  expiration_date DATE,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_surgeries table
CREATE TABLE public.patient_surgeries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  surgery_name TEXT NOT NULL,
  surgery_date DATE,
  hospital TEXT,
  surgeon TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_physicians table
CREATE TABLE public.patient_physicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  physician_name TEXT NOT NULL,
  specialty TEXT,
  phone TEXT,
  fax TEXT,
  address TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add business_address to organization_profiles
ALTER TABLE public.organization_profiles ADD COLUMN IF NOT EXISTS business_address TEXT;

-- Enable RLS on new tables
ALTER TABLE public.patient_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_physicians ENABLE ROW LEVEL SECURITY;

-- RLS policies for all new patient-related tables
CREATE POLICY "Org users can view patient emergency contacts" ON public.patient_emergency_contacts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_emergency_contacts.patient_id AND ou.user_id = auth.uid())
);
CREATE POLICY "Org staff can manage patient emergency contacts" ON public.patient_emergency_contacts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_emergency_contacts.patient_id AND ou.user_id = auth.uid())
);

CREATE POLICY "Org users can view patient insurance" ON public.patient_insurance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_insurance.patient_id AND ou.user_id = auth.uid())
);
CREATE POLICY "Org staff can manage patient insurance" ON public.patient_insurance FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_insurance.patient_id AND ou.user_id = auth.uid())
);

CREATE POLICY "Org users can view patient surgeries" ON public.patient_surgeries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_surgeries.patient_id AND ou.user_id = auth.uid())
);
CREATE POLICY "Org staff can manage patient surgeries" ON public.patient_surgeries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_surgeries.patient_id AND ou.user_id = auth.uid())
);

CREATE POLICY "Org users can view patient physicians" ON public.patient_physicians FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_physicians.patient_id AND ou.user_id = auth.uid())
);
CREATE POLICY "Org staff can manage patient physicians" ON public.patient_physicians FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients p JOIN public.organization_users ou ON ou.organization_id = p.organization_id WHERE p.id = patient_physicians.patient_id AND ou.user_id = auth.uid())
);