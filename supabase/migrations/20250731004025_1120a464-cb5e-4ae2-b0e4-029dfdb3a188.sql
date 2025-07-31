-- Fix search path security for functions
ALTER FUNCTION public.create_user_with_staff SET search_path TO '';
ALTER FUNCTION public.approve_tenant_signup SET search_path TO '';
ALTER FUNCTION public.has_role SET search_path TO '';
ALTER FUNCTION public.handle_new_user SET search_path TO '';
ALTER FUNCTION public.update_updated_at_column SET search_path TO '';

-- Update the create_user_with_staff function to handle user_id properly
CREATE OR REPLACE FUNCTION public.create_user_with_staff(
  p_user_id uuid,
  p_email text,
  p_first_name text,
  p_last_name text,
  p_role text,
  p_phone text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  staff_id uuid;
  result json;
BEGIN
  -- Update staff table with user_id
  INSERT INTO public.staff (
    user_id,
    first_name, 
    last_name, 
    email,
    phone,
    role,
    status
  ) VALUES (
    p_user_id,
    p_first_name,
    p_last_name, 
    p_email,
    p_phone,
    p_role,
    'Active'
  ) RETURNING id INTO staff_id;
  
  -- Assign role to user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create result
  result := json_build_object(
    'success', true,
    'staff_id', staff_id,
    'user_id', p_user_id,
    'message', 'User and staff record synchronized successfully.'
  );
  
  RETURN result;
END;
$$;