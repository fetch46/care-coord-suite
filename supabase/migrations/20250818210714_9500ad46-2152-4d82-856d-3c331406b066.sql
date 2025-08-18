-- Rename tenants table to organizations
ALTER TABLE public.tenants RENAME TO organizations;

-- Update related tables to use organization_id instead of tenant_id
ALTER TABLE public.subscriptions RENAME COLUMN tenant_id TO organization_id;
ALTER TABLE public.tenant_profiles RENAME COLUMN tenant_id TO organization_id;
ALTER TABLE public.masquerade_sessions RENAME COLUMN tenant_id TO organization_id;

-- Rename tenant_profiles to organization_profiles  
ALTER TABLE public.tenant_profiles RENAME TO organization_profiles;

-- Update the app_role enum to include new roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';

-- Create organizations_users table for organization user management
CREATE TABLE public.organization_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'staff',
  is_confirmed BOOLEAN NOT NULL DEFAULT false,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Enable RLS on organization_users
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;

-- Create policies for organization_users
CREATE POLICY "Owners can manage organization users"
ON public.organization_users
FOR ALL
USING (
  organization_id IN (
    SELECT id FROM public.organizations 
    WHERE admin_user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view organization users"
ON public.organization_users
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_users
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
);

CREATE POLICY "Super admins can manage all organization users"
ON public.organization_users
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Update subscription_packages to organization_packages for clarity
ALTER TABLE public.subscription_packages RENAME TO organization_packages;

-- Create organization_package_assignments table
CREATE TABLE public.organization_package_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.organization_packages(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, package_id)
);

-- Enable RLS on organization_package_assignments
ALTER TABLE public.organization_package_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for organization_package_assignments
CREATE POLICY "Super admins can manage package assignments"
ON public.organization_package_assignments
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Organization owners can view their package assignments"
ON public.organization_package_assignments
FOR SELECT
USING (
  organization_id IN (
    SELECT id FROM public.organizations 
    WHERE admin_user_id = auth.uid()
  )
);

-- Update organizations table to include more fields
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 10;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS max_patients INTEGER DEFAULT 100;

-- Update triggers for updated_at
CREATE TRIGGER update_organization_users_updated_at
BEFORE UPDATE ON public.organization_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_package_assignments_updated_at
BEFORE UPDATE ON public.organization_package_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();