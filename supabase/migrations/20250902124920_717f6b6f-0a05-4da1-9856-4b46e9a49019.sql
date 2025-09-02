-- Fix search path for the convert_empty_domain function
CREATE OR REPLACE FUNCTION convert_empty_domain()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.domain = '' THEN
    NEW.domain = NULL;
  END IF;
  RETURN NEW;
END;
$$;