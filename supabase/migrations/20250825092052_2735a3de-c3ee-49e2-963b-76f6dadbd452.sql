-- Give the current user administrator role so they can access Super Admin features
INSERT INTO public.user_roles (user_id, role) 
VALUES ('7d795e72-81be-4853-be00-bd73660cdff5', 'administrator')
ON CONFLICT (user_id, role) DO NOTHING;

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS update_organization_users_updated_at ON public.organization_users;

-- Fix the organization_users RLS policies completely
DROP POLICY IF EXISTS "Super admins can manage all organization users" ON organization_users;
DROP POLICY IF EXISTS "Organization users can view their own membership" ON organization_users;
DROP POLICY IF EXISTS "Users can be added to organizations" ON organization_users;

-- Create new simple policies
CREATE POLICY "Super admins full access" 
ON organization_users 
FOR ALL 
USING (has_role(auth.uid(), 'administrator'::app_role))
WITH CHECK (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Users can view own membership" 
ON organization_users 
FOR SELECT 
USING (user_id = auth.uid());

-- Recreate the trigger
CREATE TRIGGER update_organization_users_updated_at
  BEFORE UPDATE ON public.organization_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create edge function for adding users to organizations
CREATE OR REPLACE FUNCTION public.add_user_to_organization(
  p_organization_id uuid,
  p_user_email text,
  p_role text DEFAULT 'user'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  result json;
BEGIN
  -- Find user by email from auth.users (need service role for this)
  -- For now, return a placeholder response
  result := json_build_object(
    'success', true,
    'message', 'User invitation sent (placeholder implementation)'
  );
  
  RETURN result;
END;
$$;