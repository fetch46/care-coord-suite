-- Create patient emergency contacts table
CREATE TABLE public.patient_emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT,
  home_phone TEXT,
  work_phone TEXT,
  cell_phone TEXT,
  address TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient insurance details table
CREATE TABLE public.patient_insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  company TEXT,
  member_number TEXT,
  group_number TEXT,
  phone_number TEXT,
  medicaid_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient surgeries table
CREATE TABLE public.patient_surgeries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  surgery_name TEXT NOT NULL,
  surgery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient physicians table
CREATE TABLE public.patient_physicians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  physician_name TEXT NOT NULL,
  physician_phone TEXT,
  npi_number TEXT,
  physician_address TEXT,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update patients table to include additional registration fields
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS middle_name TEXT,
ADD COLUMN IF NOT EXISTS sex TEXT,
ADD COLUMN IF NOT EXISTS race TEXT,
ADD COLUMN IF NOT EXISTS ssn TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS date_of_discharge DATE,
ADD COLUMN IF NOT EXISTS primary_diagnosis TEXT,
ADD COLUMN IF NOT EXISTS secondary_diagnosis TEXT,
ADD COLUMN IF NOT EXISTS plan_of_care TEXT,
ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'draft';

-- Enable Row Level Security on new tables
ALTER TABLE public.patient_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_physicians ENABLE ROW LEVEL SECURITY;

-- Create policies for patient emergency contacts
CREATE POLICY "Allow all operations on patient_emergency_contacts" 
ON public.patient_emergency_contacts 
FOR ALL 
USING (true);

-- Create policies for patient insurance
CREATE POLICY "Allow all operations on patient_insurance" 
ON public.patient_insurance 
FOR ALL 
USING (true);

-- Create policies for patient surgeries
CREATE POLICY "Allow all operations on patient_surgeries" 
ON public.patient_surgeries 
FOR ALL 
USING (true);

-- Create policies for patient physicians
CREATE POLICY "Allow all operations on patient_physicians" 
ON public.patient_physicians 
FOR ALL 
USING (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_patient_emergency_contacts_updated_at
BEFORE UPDATE ON public.patient_emergency_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_insurance_updated_at
BEFORE UPDATE ON public.patient_insurance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_surgeries_updated_at
BEFORE UPDATE ON public.patient_surgeries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_physicians_updated_at
BEFORE UPDATE ON public.patient_physicians
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_patient_emergency_contacts_patient_id ON public.patient_emergency_contacts(patient_id);
CREATE INDEX idx_patient_insurance_patient_id ON public.patient_insurance(patient_id);
CREATE INDEX idx_patient_surgeries_patient_id ON public.patient_surgeries(patient_id);
CREATE INDEX idx_patient_physicians_patient_id ON public.patient_physicians(patient_id);