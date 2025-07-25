-- Create patient assessments table
CREATE TABLE public.patient_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assessed_by UUID NOT NULL,
  assessor_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  recommendations TEXT,
  next_assessment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create caregiver assessments table
CREATE TABLE public.caregiver_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assessed_by UUID NOT NULL,
  assessor_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  recommendations TEXT,
  next_assessment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patient_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for patient assessments
CREATE POLICY "Allow all operations on patient_assessments" 
ON public.patient_assessments 
FOR ALL 
USING (true);

-- Create policies for caregiver assessments
CREATE POLICY "Allow all operations on caregiver_assessments" 
ON public.caregiver_assessments 
FOR ALL 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patient_assessments_updated_at
BEFORE UPDATE ON public.patient_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_caregiver_assessments_updated_at
BEFORE UPDATE ON public.caregiver_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();