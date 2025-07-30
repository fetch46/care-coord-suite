-- Fix the handle_new_user trigger to handle null first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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