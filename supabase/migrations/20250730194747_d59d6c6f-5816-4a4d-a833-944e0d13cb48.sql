-- Create staff table to match what the code expects
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  profile_image_url TEXT,
  specialization TEXT,
  shift TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for staff
CREATE POLICY "Allow all operations on staff" 
ON public.staff 
FOR ALL 
USING (true);

-- Create availabilities table for schedule management
CREATE TABLE public.availabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id),
  patient_id UUID REFERENCES public.patients(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'On Leave')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for availabilities
CREATE POLICY "Allow all operations on availabilities" 
ON public.availabilities 
FOR ALL 
USING (true);

-- Add update trigger for staff
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for availabilities
CREATE TRIGGER update_availabilities_updated_at
BEFORE UPDATE ON public.availabilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing caregivers data to staff table
INSERT INTO public.staff (id, first_name, last_name, role, email, phone, profile_image_url, specialization, shift, status, created_at)
SELECT id, first_name, last_name, role, email, phone, profile_image_url, specialization, shift, status, created_at
FROM public.caregivers;