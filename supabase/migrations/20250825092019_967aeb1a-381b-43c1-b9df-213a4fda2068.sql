-- Fix infinite recursion in organization_users RLS policies by creating proper policies

-- First drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow organization users" ON organization_users CASCADE;
DROP POLICY IF EXISTS "Organization users can view themselves" ON organization_users CASCADE;
DROP POLICY IF EXISTS "Organization admins can manage users" ON organization_users CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all organization users" ON organization_users CASCADE;

-- Create simple, non-recursive policies for organization_users
CREATE POLICY "Super admins can manage all organization users" 
ON organization_users 
FOR ALL 
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Organization users can view their own membership" 
ON organization_users 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can be added to organizations" 
ON organization_users 
FOR INSERT 
WITH CHECK (true);

-- Create a secure function to check organization membership without recursion
CREATE OR REPLACE FUNCTION public.is_organization_member(org_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_users ou
    WHERE ou.organization_id = org_id 
    AND ou.user_id = user_id 
    AND ou.is_confirmed = true
  );
$$;

-- Add missing organization_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.organization_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  is_confirmed boolean NOT NULL DEFAULT false,
  invited_at timestamp with time zone NOT NULL DEFAULT now(),
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Enable RLS on organization_users
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger for organization_users
CREATE TRIGGER update_organization_users_updated_at
  BEFORE UPDATE ON public.organization_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();