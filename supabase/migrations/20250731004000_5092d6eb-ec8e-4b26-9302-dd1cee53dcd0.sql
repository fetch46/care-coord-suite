-- Create function to synchronize user and staff creation
CREATE OR REPLACE FUNCTION public.create_user_with_staff(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_role text,
  p_phone text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  staff_id uuid;
  result json;
BEGIN
  -- Note: This function documents the process but actual user creation
  -- must be done through Supabase Auth API
  -- The frontend should:
  -- 1. Call supabase.auth.admin.createUser() 
  -- 2. Then call this function to create staff record and assign role
  
  -- For now, we'll create a placeholder for manual testing
  -- In production, this should be called after successful auth user creation
  
  -- Insert into staff table
  INSERT INTO public.staff (
    first_name, 
    last_name, 
    email,
    phone,
    role,
    status
  ) VALUES (
    p_first_name,
    p_last_name, 
    p_email,
    p_phone,
    p_role,
    'Active'
  ) RETURNING id INTO staff_id;
  
  -- Create result
  result := json_build_object(
    'success', true,
    'staff_id', staff_id,
    'message', 'Staff record created. User must be created through Auth API.'
  );
  
  RETURN result;
END;
$$;

-- Function to approve tenant signup and create tenant
CREATE OR REPLACE FUNCTION public.approve_tenant_signup(
  p_signup_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  signup_record record;
  new_tenant_id uuid;
  result json;
BEGIN
  -- Get signup details
  SELECT * INTO signup_record 
  FROM public.tenant_signups 
  WHERE id = p_signup_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Signup not found or already processed'
    );
  END IF;
  
  -- Create tenant record
  INSERT INTO public.tenants (
    company_name,
    admin_email,
    status,
    subscription_status
  ) VALUES (
    signup_record.company_name,
    signup_record.admin_email,
    'active',
    'trial'
  ) RETURNING id INTO new_tenant_id;
  
  -- Update signup record
  UPDATE public.tenant_signups 
  SET 
    status = 'approved',
    tenant_id = new_tenant_id,
    processed_date = now()
  WHERE id = p_signup_id;
  
  -- Create result
  result := json_build_object(
    'success', true,
    'tenant_id', new_tenant_id,
    'message', 'Tenant created successfully'
  );
  
  RETURN result;
END;
$$;