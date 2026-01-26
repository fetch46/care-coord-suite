-- Add missing columns to organizations table for Super Admin functionality
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS admin_email TEXT,
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS max_patients INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS admin_user_id UUID,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Create partial unique index on domain (allows multiple NULLs but unique non-empty values)
CREATE UNIQUE INDEX IF NOT EXISTS organizations_domain_unique_idx 
ON public.organizations (domain) 
WHERE domain IS NOT NULL AND domain != '';