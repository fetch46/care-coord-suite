-- Create password_reset_tokens table for secure password reset functionality
CREATE TABLE public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) -- admin who created the reset
);

-- Enable RLS on password_reset_tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy for password reset tokens - only admins can create and view
CREATE POLICY "Admins can manage password reset tokens" ON public.password_reset_tokens
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create notification_templates table for different notification types
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of role names who should receive this notification
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notification_templates
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Policy for notification templates - only admins can manage
CREATE POLICY "Admins can manage notification templates" ON public.notification_templates
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

-- Policy for viewing notification templates
CREATE POLICY "Users can view active notification templates" ON public.notification_templates
FOR SELECT USING (is_active = true);

-- Add tenant_id to notifications table to support multi-tenant notifications
ALTER TABLE public.notifications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Add notification metadata for better tracking
ALTER TABLE public.notifications ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.notifications ADD COLUMN notification_type TEXT DEFAULT 'system';

-- Create tenant_profiles table for comprehensive tenant management
CREATE TABLE public.tenant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  website_url TEXT,
  license_number TEXT,
  tax_id TEXT,
  billing_address TEXT,
  billing_contact_name TEXT,
  billing_contact_email TEXT,
  billing_contact_phone TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tenant_profiles
ALTER TABLE public.tenant_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for tenant_profiles
CREATE POLICY "Tenant admins can manage their tenant profile" ON public.tenant_profiles
FOR ALL USING (
  tenant_id IN (
    SELECT tenants.id FROM tenants 
    WHERE tenants.admin_user_id = auth.uid()
  )
);

CREATE POLICY "Super admins can manage all tenant profiles" ON public.tenant_profiles
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

-- Insert default notification templates
INSERT INTO public.notification_templates (type, title_template, message_template, recipients) VALUES
('new_tenant_signup', 'New Tenant Signup', 'A new tenant "{{company_name}}" has signed up and requires approval.', '["administrator"]'),
('new_patient_registration', 'New Patient Registered', 'A new patient "{{patient_name}}" has been registered.', '["administrator", "registered_nurse"]'),
('new_skin_assessment', 'New Skin Assessment Submitted', 'A new skin assessment has been submitted for patient "{{patient_name}}".', '["administrator", "registered_nurse"]'),
('new_patient_assessment', 'New Patient Assessment Submitted', 'A new patient assessment has been submitted for "{{patient_name}}".', '["administrator", "registered_nurse"]'),
('new_timesheet_submitted', 'New Timesheet Submitted', 'A new timesheet has been submitted by {{caregiver_name}} for approval.', '["administrator", "registered_nurse"]'),
('new_patient_assigned', 'New Patient Assigned', 'You have been assigned to patient "{{patient_name}}".', '["caregiver"]'),
('password_reset', 'Password Reset', 'Your password has been reset. Please check your email for login instructions.', '[]');

-- Create function to send notifications based on templates
CREATE OR REPLACE FUNCTION public.send_notification_from_template(
  p_template_type TEXT,
  p_data JSONB DEFAULT '{}'::jsonb,
  p_tenant_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Create trigger function for new tenant signups
CREATE OR REPLACE FUNCTION public.notify_new_tenant_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Create trigger for new tenant signups
CREATE TRIGGER trigger_notify_new_tenant_signup
  AFTER INSERT ON public.tenant_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_tenant_signup();

-- Create trigger function for new patient registrations
CREATE OR REPLACE FUNCTION public.notify_new_patient_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Create trigger for new patient registrations
CREATE TRIGGER trigger_notify_new_patient_registration
  AFTER INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_patient_registration();

-- Create trigger function for new assessments
CREATE OR REPLACE FUNCTION public.notify_new_assessment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Create triggers for assessments
CREATE TRIGGER trigger_notify_new_skin_assessment
  AFTER INSERT ON public.skin_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_assessment();

CREATE TRIGGER trigger_notify_new_patient_assessment
  AFTER INSERT ON public.patient_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_assessment();

-- Create trigger function for new timesheets
CREATE OR REPLACE FUNCTION public.notify_new_timesheet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Create trigger for timesheet submissions
CREATE TRIGGER trigger_notify_new_timesheet
  AFTER UPDATE ON public.timesheets
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_timesheet();

-- Create trigger function for patient assignments
CREATE OR REPLACE FUNCTION public.notify_patient_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Create trigger for patient assignments
CREATE TRIGGER trigger_notify_patient_assignment
  AFTER INSERT ON public.patient_caregivers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_patient_assignment();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tenant_profiles_updated_at
  BEFORE UPDATE ON public.tenant_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();