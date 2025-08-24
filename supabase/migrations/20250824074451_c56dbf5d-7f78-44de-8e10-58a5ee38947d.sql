-- Auto-set admin_user_id on organizations insert to satisfy RLS
CREATE OR REPLACE FUNCTION public.set_organization_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  -- If admin_user_id not provided, set it to the current authenticated user
  IF NEW.admin_user_id IS NULL THEN
    NEW.admin_user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to apply the function before insert
DROP TRIGGER IF EXISTS set_organization_admin_user_trigger ON public.organizations;
CREATE TRIGGER set_organization_admin_user_trigger
BEFORE INSERT ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.set_organization_admin_user();

-- Ensure updated_at is maintained on updates
DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
CREATE TRIGGER set_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();