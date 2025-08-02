-- Add subscription plan field to tenant_signups table
ALTER TABLE public.tenant_signups ADD COLUMN IF NOT EXISTS selected_plan TEXT DEFAULT 'basic';

-- Add plan details to track what was selected
ALTER TABLE public.tenant_signups ADD COLUMN IF NOT EXISTS plan_details JSONB DEFAULT '{}'::jsonb;