-- Create subscription_packages table for super admin package management
CREATE TABLE public.subscription_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0.00,
  billing_type TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_type IN ('monthly', 'yearly', 'one-time')),
  features JSONB DEFAULT '[]'::jsonb,
  user_limit INTEGER DEFAULT 10,
  storage_gb INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription packages
CREATE POLICY "Super admins can manage subscription packages" 
ON public.subscription_packages 
FOR ALL 
USING (has_role(auth.uid(), 'administrator'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_subscription_packages_updated_at
BEFORE UPDATE ON public.subscription_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default packages
INSERT INTO public.subscription_packages (name, description, price, billing_type, features, user_limit, storage_gb, is_popular) VALUES
('Starter', 'Perfect for small clinics and practices', 29.99, 'monthly', '["Patient Management", "Basic Scheduling", "Medical Records", "5 Staff Accounts"]', 5, 5, false),
('Professional', 'Ideal for growing healthcare organizations', 79.99, 'monthly', '["All Starter Features", "Advanced Scheduling", "Assessment Tools", "Billing & Invoicing", "25 Staff Accounts", "Priority Support"]', 25, 25, true),
('Enterprise', 'Complete solution for large healthcare systems', 199.99, 'monthly', '["All Professional Features", "Multi-location Support", "Advanced Analytics", "Custom Integrations", "Unlimited Staff", "Dedicated Support"]', -1, 100, false);