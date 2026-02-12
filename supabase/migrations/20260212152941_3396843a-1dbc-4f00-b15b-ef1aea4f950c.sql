
-- Create organization_signups table for tracking signup requests
CREATE TABLE IF NOT EXISTS public.organization_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_first_name TEXT NOT NULL DEFAULT '',
  admin_last_name TEXT NOT NULL DEFAULT '',
  admin_phone TEXT,
  company_size TEXT,
  industry TEXT,
  selected_plan TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organization_signups ENABLE ROW LEVEL SECURITY;

-- Super admins can manage all signups
CREATE POLICY "Super admins can manage all signups"
ON public.organization_signups
FOR ALL
USING (is_super_admin(auth.uid()));

-- Anyone can insert a signup (public registration)
CREATE POLICY "Anyone can submit a signup request"
ON public.organization_signups
FOR INSERT
WITH CHECK (true);
