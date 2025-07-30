-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add user_id to staff table to link with profiles
ALTER TABLE public.staff ADD COLUMN user_id uuid REFERENCES public.profiles(id);

-- Create index for better performance
CREATE INDEX idx_staff_user_id ON public.staff(user_id);

-- Function to handle new user signup and create profile + staff record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  staff_record_id uuid;
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );

  -- Insert into staff table
  INSERT INTO public.staff (
    user_id,
    first_name, 
    last_name, 
    email,
    role,
    status
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    'caregiver', -- default role
    'Active'
  ) RETURNING id INTO staff_record_id;

  -- Assign default role to new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'caregiver');

  RETURN NEW;
END;
$$;

-- Create trigger to handle new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update staff table RLS to work with authentication
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Staff RLS policies
CREATE POLICY "Staff can view all staff records" 
ON public.staff 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Staff can update their own record" 
ON public.staff 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all staff" 
ON public.staff 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'administrator'));

-- Update updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();