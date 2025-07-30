-- Create Super Admin user and assign administrator role
-- Note: Since we can't add super_admin to the enum, we'll use administrator role
-- You can manually create the user via Supabase Auth UI or create a signup function

-- First, let's create a function to help create super admin users
CREATE OR REPLACE FUNCTION create_super_admin_user(user_email TEXT, user_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Note: This function is for documentation purposes only
  -- Actual user creation must be done through Supabase Auth
  -- You'll need to:
  -- 1. Go to Supabase Dashboard > Authentication > Users
  -- 2. Click "Add User" 
  -- 3. Enter email: hello@stratus.africa
  -- 4. Enter password: Noel@2018
  -- 5. Then run the SQL below to assign roles
  
  RETURN 'Please create user through Supabase Dashboard, then run assignment query';
END;
$$;

-- After creating the user in Supabase Dashboard, run this to assign admin role:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ((SELECT id FROM auth.users WHERE email = 'hello@stratus.africa'), 'administrator');

-- Also add to staff table:
-- INSERT INTO public.staff (user_id, first_name, last_name, email, role, status)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'hello@stratus.africa'),
--   'Super',
--   'Admin', 
--   'hello@stratus.africa',
--   'administrator',
--   'Active'
-- );