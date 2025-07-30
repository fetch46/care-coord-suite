-- Create assessment types table
CREATE TABLE public.assessment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_types ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment types
CREATE POLICY "Allow all operations on assessment_types" 
ON public.assessment_types 
FOR ALL 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_assessment_types_updated_at
BEFORE UPDATE ON public.assessment_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default assessment types
INSERT INTO public.assessment_types (name, description) VALUES 
('Initial Assessment', 'First assessment when patient is admitted'),
('45 Day Assessment', 'Assessment conducted after 45 days'),
('90 Day Assessment', 'Assessment conducted after 90 days'),
('Annual Assessment', 'Yearly comprehensive assessment'),
('Change of Condition', 'Assessment due to change in patient condition');

-- Create index for better performance
CREATE INDEX idx_assessment_types_active ON public.assessment_types(is_active);