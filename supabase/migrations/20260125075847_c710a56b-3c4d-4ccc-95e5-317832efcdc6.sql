-- Add missing columns to organization_users
ALTER TABLE public.organization_users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add missing columns to timesheets
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS time_in TIME;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS time_out TIME;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS total_hours DECIMAL(5, 2);
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS caregiver_id UUID REFERENCES public.staff(id) ON DELETE SET NULL;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';

-- Add missing column to patients
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS room_number TEXT;

-- Create cms_content table
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  content_value TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create masquerade_sessions table
CREATE TABLE public.masquerade_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admissions table
CREATE TABLE public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  admission_date DATE NOT NULL,
  discharge_date DATE,
  status TEXT DEFAULT 'active',
  room_number TEXT,
  bed_number TEXT,
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  record_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.organization_packages(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  billing_cycle TEXT DEFAULT 'monthly',
  amount DECIMAL(10, 2),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masquerade_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS for cms_content
CREATE POLICY "Anyone can view active cms content" ON public.cms_content FOR SELECT USING (is_active = true);
CREATE POLICY "Super admins can manage cms content" ON public.cms_content FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS for masquerade_sessions
CREATE POLICY "Super admins can manage masquerade sessions" ON public.masquerade_sessions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can view their own target sessions" ON public.masquerade_sessions FOR SELECT USING (target_user_id = auth.uid());

-- RLS for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- RLS for admissions
CREATE POLICY "Org users can view their org admissions" ON public.admissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = admissions.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org staff can manage their org admissions" ON public.admissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = admissions.organization_id AND user_id = auth.uid())
);

-- RLS for medical_records
CREATE POLICY "Org users can view their org medical records" ON public.medical_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = medical_records.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org staff can manage their org medical records" ON public.medical_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = medical_records.organization_id AND user_id = auth.uid())
);

-- RLS for payments
CREATE POLICY "Org users can view their org payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = payments.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage their org payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = payments.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS for subscriptions
CREATE POLICY "Super admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Org users can view their org subscription" ON public.subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = subscriptions.organization_id AND user_id = auth.uid())
);

-- Update triggers
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON public.cms_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON public.admissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();