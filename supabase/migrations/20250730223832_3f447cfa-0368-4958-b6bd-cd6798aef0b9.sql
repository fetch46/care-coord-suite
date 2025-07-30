-- Create CMS content table for managing landing page content
CREATE TABLE public.cms_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL DEFAULT 'text',
  content_value JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default content for landing page
INSERT INTO public.cms_content (content_key, content_type, content_value) VALUES
('hero_title', 'text', '{"text": "Streamline Healthcare Management & Care"}'),
('hero_subtitle', 'text', '{"text": "Comprehensive healthcare management platform designed for care teams to deliver exceptional patient care while reducing administrative burden."}'),
('hero_badge', 'text', '{"text": "Healthcare Management System"}'),
('company_name', 'text', '{"text": "CareSync"}'),
('features_title', 'text', '{"text": "Everything You Need for Complete Care"}'),
('features_subtitle', 'text', '{"text": "Our integrated platform provides all the tools your healthcare team needs to deliver exceptional patient care efficiently."}'),
('benefits_title', 'text', '{"text": "Transform Your Healthcare Operations"}'),
('benefits_subtitle', 'text', '{"text": "Join hundreds of healthcare facilities that have improved their operations and patient outcomes with our comprehensive management platform."}'),
('cta_title', 'text', '{"text": "Ready to Transform Your Healthcare Operations?"}'),
('cta_subtitle', 'text', '{"text": "Join our platform and experience the difference comprehensive healthcare management can make for your organization."}'),
('footer_text', 'text', '{"text": "Healthcare Management System - Empowering Care Teams Since 2024"}');

-- Create tenant signups table for companies registering from landing page
CREATE TABLE public.tenant_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_first_name TEXT NOT NULL,
  admin_last_name TEXT NOT NULL,
  admin_phone TEXT,
  company_size TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  signup_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_date TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create masquerade sessions table for super admin impersonation
CREATE TABLE public.masquerade_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  super_admin_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  tenant_id UUID,
  session_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masquerade_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for cms_content
CREATE POLICY "Everyone can view active CMS content" 
ON public.cms_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Super admins can manage CMS content" 
ON public.cms_content 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for tenant_signups  
CREATE POLICY "Anyone can create tenant signup" 
ON public.tenant_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Super admins can view all tenant signups" 
ON public.tenant_signups 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can update tenant signups" 
ON public.tenant_signups 
FOR UPDATE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for masquerade_sessions
CREATE POLICY "Super admins can manage masquerade sessions" 
ON public.masquerade_sessions 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_cms_content_updated_at
BEFORE UPDATE ON public.cms_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_signups_updated_at
BEFORE UPDATE ON public.tenant_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_masquerade_sessions_updated_at
BEFORE UPDATE ON public.masquerade_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add super_admin role to the enum
ALTER TYPE public.app_role ADD VALUE 'super_admin';