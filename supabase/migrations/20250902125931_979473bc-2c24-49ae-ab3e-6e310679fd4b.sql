-- Fix all functions to have proper search_path settings

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix set_organization_admin_user function
CREATE OR REPLACE FUNCTION public.set_organization_admin_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- If admin_user_id not provided, set it to the current authenticated user
  IF NEW.admin_user_id IS NULL THEN
    NEW.admin_user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix add_user_to_organization function
CREATE OR REPLACE FUNCTION public.add_user_to_organization(p_organization_id uuid, p_user_email text, p_role text DEFAULT 'user'::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix approve_tenant_signup function
CREATE OR REPLACE FUNCTION public.approve_tenant_signup(p_signup_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix send_notification_from_template function
CREATE OR REPLACE FUNCTION public.send_notification_from_template(p_template_type text, p_data jsonb DEFAULT '{}'::jsonb, p_tenant_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  template_record public.notification_templates;
  notification_id UUID;
  recipient_role TEXT;
  user_record RECORD;
  final_title TEXT;
  final_message TEXT;
  data_key TEXT;
  data_value TEXT;
BEGIN
  -- Get the notification template
  SELECT * INTO template_record 
  FROM public.notification_templates 
  WHERE type = p_template_type AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Notification template not found: %', p_template_type;
  END IF;
  
  -- Start with template text
  final_title := template_record.title_template;
  final_message := template_record.message_template;
  
  -- Replace placeholders with actual data
  FOR data_key, data_value IN SELECT * FROM jsonb_each_text(p_data) LOOP
    final_title := replace(final_title, '{{' || data_key || '}}', data_value);
    final_message := replace(final_message, '{{' || data_key || '}}', data_value);
  END LOOP;
  
  -- Send notifications to all recipient roles
  FOR recipient_role IN SELECT * FROM jsonb_array_elements_text(template_record.recipients) LOOP
    -- Find users with this role in the specified tenant (or all if no tenant specified)
    FOR user_record IN 
      SELECT DISTINCT ur.user_id
      FROM public.user_roles ur
      JOIN public.staff s ON s.user_id = ur.user_id
      LEFT JOIN public.tenants t ON t.admin_user_id = ur.user_id OR s.id IS NOT NULL
      WHERE ur.role::text = recipient_role
        AND (p_tenant_id IS NULL OR t.id = p_tenant_id OR s.user_id IN (
          SELECT staff.user_id FROM staff 
          -- This is a simplified tenant association - in a real app you'd have better tenant-staff relationships
        ))
    LOOP
      -- Insert notification for each user
      INSERT INTO public.notifications (
        user_id, 
        title, 
        message, 
        type, 
        notification_type,
        tenant_id,
        metadata
      ) VALUES (
        user_record.user_id,
        final_title,
        final_message,
        'info',
        p_template_type,
        p_tenant_id,
        p_data
      ) RETURNING id INTO notification_id;
    END LOOP;
  END LOOP;
  
  RETURN notification_id;
END;
$function$;

-- Fix notify_new_assessment function
CREATE OR REPLACE FUNCTION public.notify_new_assessment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix create_user_with_staff functions
CREATE OR REPLACE FUNCTION public.create_user_with_staff(p_email text, p_first_name text, p_last_name text, p_role text, p_phone text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix notify_new_tenant_signup function
CREATE OR REPLACE FUNCTION public.notify_new_tenant_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Send notification for new tenant signup
  PERFORM public.send_notification_from_template(
    'new_tenant_signup',
    jsonb_build_object('company_name', NEW.company_name)
  );
  
  RETURN NEW;
END;
$function$;

-- Fix notify_new_patient_registration function
CREATE OR REPLACE FUNCTION public.notify_new_patient_registration()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Send notification for new patient registration
  PERFORM public.send_notification_from_template(
    'new_patient_registration',
    jsonb_build_object('patient_name', NEW.first_name || ' ' || NEW.last_name)
  );
  
  RETURN NEW;
END;
$function$;

-- Fix notify_new_timesheet function
CREATE OR REPLACE FUNCTION public.notify_new_timesheet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  caregiver_name TEXT;
BEGIN
  -- Get caregiver name
  SELECT first_name || ' ' || last_name INTO caregiver_name
  FROM public.staff
  WHERE id = NEW.caregiver_id;
  
  -- Send notification for new timesheet submission
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
    PERFORM public.send_notification_from_template(
      'new_timesheet_submitted',
      jsonb_build_object('caregiver_name', caregiver_name)
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix notify_patient_assignment function
CREATE OR REPLACE FUNCTION public.notify_patient_assignment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  patient_name TEXT;
  caregiver_user_id UUID;
BEGIN
  -- Get patient name
  SELECT first_name || ' ' || last_name INTO patient_name
  FROM public.patients
  WHERE id = NEW.patient_id;
  
  -- Get caregiver user_id
  SELECT user_id INTO caregiver_user_id
  FROM public.staff
  WHERE id = NEW.caregiver_id;
  
  -- Send notification to the assigned caregiver
  IF caregiver_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id, 
      title, 
      message, 
      type, 
      notification_type,
      metadata
    ) VALUES (
      caregiver_user_id,
      'New Patient Assigned',
      'You have been assigned to patient "' || patient_name || '".',
      'info',
      'new_patient_assigned',
      jsonb_build_object('patient_name', patient_name, 'patient_id', NEW.patient_id)
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix create_super_admin_user function
CREATE OR REPLACE FUNCTION public.create_super_admin_user(user_email text, user_password text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix create_user_with_staff with user_id function
CREATE OR REPLACE FUNCTION public.create_user_with_staff(p_user_id uuid, p_email text, p_first_name text, p_last_name text, p_role text, p_phone text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;