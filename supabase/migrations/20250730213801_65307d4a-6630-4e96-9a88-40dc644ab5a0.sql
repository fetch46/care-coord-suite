-- Create tenants table for multi-tenant SaaS
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  domain TEXT UNIQUE,
  admin_email TEXT NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}'
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  max_users INTEGER,
  max_patients INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment gateways table
CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create communication gateways table
CREATE TABLE public.communication_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  provider TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_users, max_patients) VALUES
('Basic', 'Basic plan for small care facilities', 99.00, 990.00, '["Patient Management", "Basic Scheduling", "Reports"]', 10, 50),
('Professional', 'Professional plan for medium facilities', 199.00, 1990.00, '["Advanced Patient Management", "Staff Scheduling", "Advanced Reports", "Assessments"]', 50, 200),
('Enterprise', 'Enterprise plan for large facilities', 399.00, 3990.00, '["All Features", "Custom Integrations", "Priority Support", "Advanced Analytics"]', -1, -1);

-- Insert default payment gateway
INSERT INTO public.payment_gateways (name, provider, configuration) VALUES
('Stripe', 'stripe', '{"publishable_key": "", "secret_key": "", "webhook_secret": ""}');

-- Insert default communication gateways
INSERT INTO public.communication_gateways (name, type, provider, configuration) VALUES
('SendGrid', 'email', 'sendgrid', '{"api_key": "", "from_email": "", "from_name": ""}'),
('Twilio', 'sms', 'twilio', '{"account_sid": "", "auth_token": "", "from_number": ""}');

-- Enable RLS on all new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_gateways ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants (using text role for now until super_admin is added)
CREATE POLICY "Admins can manage all tenants" ON public.tenants
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Tenant admins can view their own tenant" ON public.tenants
FOR SELECT USING (admin_user_id = auth.uid());

-- Create policies for subscription plans
CREATE POLICY "Everyone can view active plans" ON public.subscription_plans
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.subscription_plans
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create policies for subscriptions
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

CREATE POLICY "Tenant admins can view their subscriptions" ON public.subscriptions
FOR SELECT USING (tenant_id IN (SELECT id FROM public.tenants WHERE admin_user_id = auth.uid()));

-- Create policies for payment gateways
CREATE POLICY "Admins can manage payment gateways" ON public.payment_gateways
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create policies for communication gateways
CREATE POLICY "Admins can manage communication gateways" ON public.communication_gateways
FOR ALL USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at
BEFORE UPDATE ON public.payment_gateways
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communication_gateways_updated_at
BEFORE UPDATE ON public.communication_gateways
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();