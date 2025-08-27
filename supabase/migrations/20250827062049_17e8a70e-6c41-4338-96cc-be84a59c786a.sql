-- Fix remaining functions with search path issues
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

CREATE OR REPLACE FUNCTION public.send_notification_from_template(p_template_type text, p_data jsonb DEFAULT '{}'::jsonb, p_tenant_id uuid DEFAULT NULL::uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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