-- First check if organization_users table exists and fix infinite recursion
-- Create organization_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  is_confirmed BOOLEAN DEFAULT false,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Enable RLS
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "org_users_select" ON public.organization_users;
DROP POLICY IF EXISTS "org_users_insert" ON public.organization_users;
DROP POLICY IF EXISTS "org_users_update" ON public.organization_users;
DROP POLICY IF EXISTS "org_users_delete" ON public.organization_users;

-- Create safe RLS policies without recursion
-- Super admins can do everything
CREATE POLICY "super_admin_all_organization_users" ON public.organization_users
FOR ALL
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Organization admins can manage their organization users
CREATE POLICY "org_admin_manage_users" ON public.organization_users
FOR ALL
USING (
  organization_id IN (
    SELECT id FROM public.organizations 
    WHERE admin_user_id = auth.uid()
  )
);

-- Users can view their own membership
CREATE POLICY "users_view_own_membership" ON public.organization_users
FOR SELECT
USING (user_id = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER organization_users_updated_at
  BEFORE UPDATE ON public.organization_users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();