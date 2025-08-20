-- Allow any authenticated user to create an organization where they are the admin
CREATE POLICY IF NOT EXISTS "Users can create their own organization"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (admin_user_id = auth.uid());

-- Also allow users to update their own organization if they are the admin (optional but helpful)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'organizations' AND policyname = 'Admins can update their own organization'
  ) THEN
    CREATE POLICY "Admins can update their own organization"
    ON public.organizations
    FOR UPDATE
    TO authenticated
    USING (admin_user_id = auth.uid())
    WITH CHECK (admin_user_id = auth.uid());
  END IF;
END $$;
