-- Create skin_assessments table
CREATE TABLE public.skin_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  date DATE NOT NULL,
  attending_physician TEXT,
  room_number TEXT,
  
  -- Body diagram annotations (JSON format for dot positions)
  body_annotations JSONB DEFAULT '{}'::jsonb,
  
  -- Hot spot assessments (JSON format)
  hot_spot_assessments JSONB DEFAULT '{}'::jsonb,
  
  -- Additional notes
  general_notes TEXT,
  
  -- Assessment metadata
  assessed_by UUID REFERENCES public.caregivers(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'reviewed')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skin_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all operations on skin_assessments" 
ON public.skin_assessments 
FOR ALL 
USING (true);

-- Add update trigger
CREATE TRIGGER update_skin_assessments_updated_at
BEFORE UPDATE ON public.skin_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure patient_allergies table exists for allergy display
CREATE TABLE IF NOT EXISTS public.patient_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  allergy_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  reaction TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on patient_allergies if it was just created
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;

-- Create or update RLS policy for patient_allergies
DROP POLICY IF EXISTS "Allow all operations on patient_allergies" ON public.patient_allergies;
CREATE POLICY "Allow all operations on patient_allergies" 
ON public.patient_allergies 
FOR ALL 
USING (true);

-- Insert some sample allergies for testing
INSERT INTO public.patient_allergies (patient_id, allergy_name, severity, reaction, notes)
SELECT p.id, 'Penicillin', 'severe', 'Anaphylaxis', 'Avoid all penicillin-based antibiotics'
FROM public.patients p
WHERE p.first_name = 'John' AND p.last_name = 'Doe'
ON CONFLICT DO NOTHING;

INSERT INTO public.patient_allergies (patient_id, allergy_name, severity, reaction, notes)
SELECT p.id, 'Latex', 'moderate', 'Skin rash', 'Use latex-free gloves and equipment'
FROM public.patients p
WHERE p.first_name = 'John' AND p.last_name = 'Doe'
ON CONFLICT DO NOTHING;