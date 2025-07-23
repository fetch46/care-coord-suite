-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  admission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Discharged')),
  room_number TEXT,
  care_level TEXT CHECK (care_level IN ('Low', 'Medium', 'High', 'Critical')),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create allergies table
CREATE TABLE public.patient_allergies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  allergy_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Life-threatening')),
  reaction TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create caregivers table
CREATE TABLE public.caregivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Nurse', 'Caregiver', 'Doctor', 'Therapist')),
  specialization TEXT,
  phone TEXT,
  email TEXT,
  shift TEXT CHECK (shift IN ('Day', 'Evening', 'Night', 'Rotating')),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_caregivers junction table
CREATE TABLE public.patient_caregivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
  assignment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, caregiver_id)
);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('Diagnosis', 'Treatment', 'Medication', 'Vital Signs', 'Assessment', 'Note')),
  title TEXT NOT NULL,
  description TEXT,
  recorded_by TEXT,
  recorded_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attachments JSONB,
  is_confidential BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - can be restricted later with auth)
CREATE POLICY "Allow all operations on patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on patient_allergies" ON public.patient_allergies FOR ALL USING (true);
CREATE POLICY "Allow all operations on caregivers" ON public.caregivers FOR ALL USING (true);
CREATE POLICY "Allow all operations on patient_caregivers" ON public.patient_caregivers FOR ALL USING (true);
CREATE POLICY "Allow all operations on medical_records" ON public.medical_records FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.patients (first_name, last_name, date_of_birth, gender, phone, email, room_number, care_level, status) VALUES
('John', 'Smith', '1945-03-15', 'Male', '(555) 123-4567', 'john.smith@email.com', 'A101', 'Medium', 'Active'),
('Mary', 'Johnson', '1938-07-22', 'Female', '(555) 987-6543', 'mary.johnson@email.com', 'B205', 'High', 'Active'),
('Robert', 'Wilson', '1952-11-08', 'Male', '(555) 456-7890', 'robert.wilson@email.com', 'C312', 'Low', 'Active'),
('Patricia', 'Brown', '1941-05-30', 'Female', '(555) 321-0987', 'patricia.brown@email.com', 'A203', 'Critical', 'Active');

INSERT INTO public.patient_allergies (patient_id, allergy_name, severity, reaction) VALUES
((SELECT id FROM public.patients WHERE first_name = 'John' AND last_name = 'Smith'), 'Penicillin', 'Severe', 'Rash and breathing difficulty'),
((SELECT id FROM public.patients WHERE first_name = 'Mary' AND last_name = 'Johnson'), 'Shellfish', 'Moderate', 'Hives and swelling'),
((SELECT id FROM public.patients WHERE first_name = 'Robert' AND last_name = 'Wilson'), 'Peanuts', 'Life-threatening', 'Anaphylaxis'),
((SELECT id FROM public.patients WHERE first_name = 'Patricia' AND last_name = 'Brown'), 'Latex', 'Mild', 'Skin irritation');

INSERT INTO public.caregivers (first_name, last_name, role, specialization, phone, email, shift) VALUES
('Sarah', 'Davis', 'Nurse', 'Geriatric Care', '(555) 111-2222', 'sarah.davis@caresync.com', 'Day'),
('Michael', 'Thompson', 'Caregiver', 'Physical Therapy', '(555) 333-4444', 'michael.thompson@caresync.com', 'Evening'),
('Jennifer', 'Garcia', 'Doctor', 'Internal Medicine', '(555) 555-6666', 'jennifer.garcia@caresync.com', 'Day'),
('David', 'Martinez', 'Therapist', 'Speech Therapy', '(555) 777-8888', 'david.martinez@caresync.com', 'Day');

INSERT INTO public.patient_caregivers (patient_id, caregiver_id, is_primary) VALUES
((SELECT id FROM public.patients WHERE first_name = 'John' AND last_name = 'Smith'), (SELECT id FROM public.caregivers WHERE first_name = 'Sarah' AND last_name = 'Davis'), true),
((SELECT id FROM public.patients WHERE first_name = 'Mary' AND last_name = 'Johnson'), (SELECT id FROM public.caregivers WHERE first_name = 'Jennifer' AND last_name = 'Garcia'), true),
((SELECT id FROM public.patients WHERE first_name = 'Robert' AND last_name = 'Wilson'), (SELECT id FROM public.caregivers WHERE first_name = 'Michael' AND last_name = 'Thompson'), true);

INSERT INTO public.medical_records (patient_id, record_type, title, description, recorded_by) VALUES
((SELECT id FROM public.patients WHERE first_name = 'John' AND last_name = 'Smith'), 'Diagnosis', 'Hypertension', 'Patient diagnosed with stage 2 hypertension', 'Dr. Jennifer Garcia'),
((SELECT id FROM public.patients WHERE first_name = 'Mary' AND last_name = 'Johnson'), 'Medication', 'Daily Medications', 'Metformin 500mg twice daily for diabetes management', 'Sarah Davis, RN'),
((SELECT id FROM public.patients WHERE first_name = 'Robert' AND last_name = 'Wilson'), 'Assessment', 'Weekly Assessment', 'Patient showing improvement in mobility and cognitive function', 'Michael Thompson');