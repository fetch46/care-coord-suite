-- Assign administrator role to current user so they can manage organizations
INSERT INTO public.user_roles (user_id, role)
VALUES (auth.uid(), 'administrator'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Also ensure the user has a profile
INSERT INTO public.profiles (id, email)
SELECT auth.uid(), 
       COALESCE(
         (SELECT email FROM auth.users WHERE id = auth.uid()),
         'super-admin@healthcare.system'
       )
ON CONFLICT (id) DO NOTHING;