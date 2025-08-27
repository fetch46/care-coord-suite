-- Fix all remaining functions with search path issues
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

CREATE OR REPLACE FUNCTION public.set_organization_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If admin_user_id not provided, set it to the current authenticated user
  IF NEW.admin_user_id IS NULL THEN
    NEW.admin_user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_user_to_organization(p_organization_id uuid, p_user_email text, p_role text DEFAULT 'user'::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.notify_new_assessment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  patient_name TEXT;
BEGIN
  -- Get patient name
  SELECT first_name || ' ' || last_name INTO patient_name
  FROM public.patients
  WHERE id = NEW.patient_id;
  
  -- Send notification for new assessment
  PERFORM public.send_notification_from_template(
    CASE 
      WHEN TG_TABLE_NAME = 'skin_assessments' THEN 'new_skin_assessment'
      ELSE 'new_patient_assessment'
    END,
    jsonb_build_object('patient_name', patient_name)
  );
  
  RETURN NEW;
END;
$$;

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