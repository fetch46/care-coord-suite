-- Fix domain constraint issue for organizations
-- Convert empty domain strings to NULL to avoid unique constraint violations
UPDATE organizations 
SET domain = NULL 
WHERE domain = '';

-- Ensure domain field allows multiple NULL values but not empty strings
-- Drop existing constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'organizations_domain_key'
    ) THEN
        ALTER TABLE organizations DROP CONSTRAINT organizations_domain_key;
    END IF;
END$$;

-- Create a partial unique index that ignores NULL values but prevents duplicate non-empty domains
CREATE UNIQUE INDEX IF NOT EXISTS organizations_domain_unique_idx 
ON organizations (domain) 
WHERE domain IS NOT NULL AND domain != '';

-- Create a trigger to automatically convert empty domain strings to NULL
CREATE OR REPLACE FUNCTION convert_empty_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.domain = '' THEN
    NEW.domain = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_convert_empty_domain
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION convert_empty_domain();