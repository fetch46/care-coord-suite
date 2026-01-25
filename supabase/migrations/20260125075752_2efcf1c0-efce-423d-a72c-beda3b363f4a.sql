-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff', 'administrator', 'reception', 'registered_nurse', 'caregiver');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  subscription_status TEXT DEFAULT 'trial',
  is_active BOOLEAN DEFAULT true,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  user_limit INTEGER DEFAULT 10,
  storage_limit_gb INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_users table
CREATE TABLE public.organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'staff',
  is_confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- Create organization_packages table
CREATE TABLE public.organization_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  billing_type TEXT DEFAULT 'monthly',
  user_limit INTEGER DEFAULT 10,
  storage_gb INTEGER DEFAULT 5,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_package_assignments table
CREATE TABLE public.organization_package_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.organization_packages(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  shift TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_caregivers table
CREATE TABLE public.patient_caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  caregiver_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (patient_id, caregiver_id)
);

-- Create patient_assessments table
CREATE TABLE public.patient_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  assessment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  score INTEGER,
  max_score INTEGER DEFAULT 100,
  assessor_name TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  assessment_date DATE DEFAULT CURRENT_DATE,
  next_assessment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create caregiver_assessments table
CREATE TABLE public.caregiver_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  assessment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  score INTEGER,
  max_score INTEGER DEFAULT 100,
  assessor_name TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  assessment_date DATE DEFAULT CURRENT_DATE,
  next_assessment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_signups table
CREATE TABLE public.tenant_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_size TEXT,
  industry TEXT,
  admin_first_name TEXT NOT NULL,
  admin_last_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_phone TEXT,
  selected_plan TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timesheets table
CREATE TABLE public.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE,
  clock_out TIMESTAMP WITH TIME ZONE,
  break_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_package_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'owner')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_super_admin(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can manage all roles" ON public.user_roles FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS Policies for organizations
CREATE POLICY "Super admins can manage all organizations" ON public.organizations FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Org users can view their organization" ON public.organizations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = id AND user_id = auth.uid())
);

-- RLS Policies for organization_users
CREATE POLICY "Super admins can manage all org users" ON public.organization_users FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can view their org memberships" ON public.organization_users FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for organization_packages
CREATE POLICY "Anyone can view active packages" ON public.organization_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Super admins can manage packages" ON public.organization_packages FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS Policies for organization_package_assignments
CREATE POLICY "Super admins can manage package assignments" ON public.organization_package_assignments FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Org users can view their package assignments" ON public.organization_package_assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = organization_package_assignments.organization_id AND user_id = auth.uid())
);

-- RLS Policies for staff
CREATE POLICY "Super admins can manage all staff" ON public.staff FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Org users can view their org staff" ON public.staff FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = staff.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage their org staff" ON public.staff FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = staff.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS Policies for patients
CREATE POLICY "Super admins can manage all patients" ON public.patients FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Org users can view their org patients" ON public.patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = patients.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org staff can manage their org patients" ON public.patients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = patients.organization_id AND user_id = auth.uid())
);

-- RLS Policies for patient_caregivers
CREATE POLICY "Org users can view patient caregivers" ON public.patient_caregivers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = patient_caregivers.patient_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org admins can manage patient caregivers" ON public.patient_caregivers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = patient_caregivers.patient_id AND ou.user_id = auth.uid() AND ou.role IN ('admin', 'owner', 'administrator')
  )
);

-- RLS Policies for patient_assessments
CREATE POLICY "Org users can view patient assessments" ON public.patient_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = patient_assessments.patient_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org staff can manage patient assessments" ON public.patient_assessments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    JOIN public.organization_users ou ON ou.organization_id = p.organization_id
    WHERE p.id = patient_assessments.patient_id AND ou.user_id = auth.uid()
  )
);

-- RLS Policies for caregiver_assessments
CREATE POLICY "Org users can view caregiver assessments" ON public.caregiver_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.staff s
    JOIN public.organization_users ou ON ou.organization_id = s.organization_id
    WHERE s.id = caregiver_assessments.caregiver_id AND ou.user_id = auth.uid()
  )
);
CREATE POLICY "Org admins can manage caregiver assessments" ON public.caregiver_assessments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.staff s
    JOIN public.organization_users ou ON ou.organization_id = s.organization_id
    WHERE s.id = caregiver_assessments.caregiver_id AND ou.user_id = auth.uid() AND ou.role IN ('admin', 'owner', 'administrator')
  )
);

-- RLS Policies for schedules
CREATE POLICY "Org users can view their org schedules" ON public.schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = schedules.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org staff can manage their org schedules" ON public.schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = schedules.organization_id AND user_id = auth.uid())
);

-- RLS Policies for invoices
CREATE POLICY "Org users can view their org invoices" ON public.invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = invoices.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage their org invoices" ON public.invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = invoices.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- RLS Policies for tenant_signups
CREATE POLICY "Anyone can create tenant signups" ON public.tenant_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Super admins can view all signups" ON public.tenant_signups FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage signups" ON public.tenant_signups FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS Policies for timesheets
CREATE POLICY "Org users can view their org timesheets" ON public.timesheets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = timesheets.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Staff can manage their own timesheets" ON public.timesheets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.staff WHERE id = timesheets.staff_id AND user_id = auth.uid())
);
CREATE POLICY "Org admins can manage all timesheets" ON public.timesheets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organization_users WHERE organization_id = timesheets.organization_id AND user_id = auth.uid() AND role IN ('admin', 'owner', 'administrator'))
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_packages_updated_at BEFORE UPDATE ON public.organization_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patient_assessments_updated_at BEFORE UPDATE ON public.patient_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_caregiver_assessments_updated_at BEFORE UPDATE ON public.caregiver_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tenant_signups_updated_at BEFORE UPDATE ON public.tenant_signups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON public.timesheets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();