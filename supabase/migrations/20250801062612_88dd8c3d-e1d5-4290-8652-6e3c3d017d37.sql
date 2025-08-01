-- Check existing functions and fix search_path issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix the existing handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  staff_record_id uuid;
  user_first_name text;
  user_last_name text;
BEGIN
  -- Get first_name and last_name from metadata, with defaults if null
  user_first_name := COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'User');
  user_last_name := COALESCE(NEW.raw_user_meta_data ->> 'last_name', 'Unknown');

  -- Insert into profiles table
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    user_first_name, 
    user_last_name,
    NEW.email
  );

  -- Insert into staff table with proper null handling
  INSERT INTO public.staff (
    user_id,
    first_name, 
    last_name, 
    email,
    role,
    status
  ) VALUES (
    NEW.id,
    user_first_name, 
    user_last_name,
    NEW.email,
    'caregiver', -- default role
    'Active'
  ) RETURNING id INTO staff_record_id;

  -- Assign default role to new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'caregiver');

  RETURN NEW;
END;
$$;

-- Fix other existing functions
CREATE OR REPLACE FUNCTION public.create_user_with_staff(p_email text, p_first_name text, p_last_name text, p_role text, p_phone text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.approve_tenant_signup(p_signup_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.create_user_with_staff(p_user_id uuid, p_email text, p_first_name text, p_last_name text, p_role text, p_phone text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.create_super_admin_user(user_email text, user_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Note: This function is for documentation purposes only
  -- Actual user creation must be done through Supabase Auth
  -- You'll need to:
  -- 1. Go to Supabase Dashboard > Authentication > Users
  -- 2. Click "Add User" 
  -- 3. Enter email: hello@stratus.africa
  -- 4. Enter password: Noel@2018
  -- 5. Then run the SQL below to assign roles
  
  RETURN 'Please create user through Supabase Dashboard, then run assignment query';
END;
$$;