-- Create company_settings table
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  organization_name TEXT,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_transactions table
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_profiles table
CREATE TABLE public.organization_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  founded_year INTEGER,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to medical_records
ALTER TABLE public.medical_records ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.medical_records ADD COLUMN IF NOT EXISTS recorded_date DATE;
ALTER TABLE public.medical_records ADD COLUMN IF NOT EXISTS is_confidential BOOLEAN DEFAULT false;

-- Add missing columns to timesheets for digital timesheet
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS sleep_in BOOLEAN DEFAULT false;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS miles DECIMAL(10, 2);
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS personal_care_tasks JSONB;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS home_management_tasks JSONB;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS activities_tasks JSONB;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS additional_notes TEXT;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS caregiver_signature TEXT;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS patient_signature TEXT;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;

-- RLS for company_settings
CREATE POLICY "Org users can view their company settings" ON public.company_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = company_settings.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage company settings" ON public.company_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = company_settings.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS for financial_transactions
CREATE POLICY "Org users can view their financial transactions" ON public.financial_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = financial_transactions.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage financial transactions" ON public.financial_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = financial_transactions.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS for organization_profiles
CREATE POLICY "Org users can view their org profile" ON public.organization_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = organization_profiles.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage org profile" ON public.organization_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = organization_profiles.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- Add triggers
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON public.company_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_profiles_updated_at BEFORE UPDATE ON public.organization_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();