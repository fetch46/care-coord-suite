-- Fix security definer functions to have proper search_path
CREATE OR REPLACE FUNCTION public.send_notification_from_template(
  p_template_type TEXT,
  p_data JSONB DEFAULT '{}'::jsonb,
  p_tenant_id UUID DEFAULT NULL
)
RETURNS UUID
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

-- Fix other functions to have proper search_path
CREATE OR REPLACE FUNCTION public.notify_new_tenant_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Send notification for new tenant signup
  PERFORM public.send_notification_from_template(
    'new_tenant_signup',
    jsonb_build_object('company_name', NEW.company_name)
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_patient_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Send notification for new patient registration
  PERFORM public.send_notification_from_template(
    'new_patient_registration',
    jsonb_build_object('patient_name', NEW.first_name || ' ' || NEW.last_name)
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_assessment()
RETURNS TRIGGER
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

CREATE OR REPLACE FUNCTION public.notify_new_timesheet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.notify_patient_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;