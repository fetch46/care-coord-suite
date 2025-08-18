-- Add new enum values for app_role
ALTER TYPE public.app_role ADD VALUE 'owner';
ALTER TYPE public.app_role ADD VALUE 'admin';
ALTER TYPE public.app_role ADD VALUE 'staff';