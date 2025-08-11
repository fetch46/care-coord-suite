-- Insert default role permissions for medical records access control

-- Clear existing permissions for medical_records if any
DELETE FROM public.role_permissions WHERE resource = 'medical_records';

-- Add permissions for administrator role
INSERT INTO public.role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('administrator', 'medical_records', true, true, true, true),
('administrator', 'billing', true, true, true, true),
('administrator', 'invoices', true, true, true, true),
('administrator', 'payments', true, true, true, true);

-- Add permissions for registered_nurse role  
INSERT INTO public.role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('registered_nurse', 'medical_records', true, true, true, false),
('registered_nurse', 'billing', true, false, false, false),
('registered_nurse', 'invoices', true, false, false, false),
('registered_nurse', 'payments', true, false, false, false);

-- Add permissions for caregiver role
INSERT INTO public.role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('caregiver', 'medical_records', true, true, false, false),
('caregiver', 'billing', false, false, false, false),
('caregiver', 'invoices', false, false, false, false),
('caregiver', 'payments', false, false, false, false);

-- Add permissions for reception role
INSERT INTO public.role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('reception', 'medical_records', true, false, false, false),
('reception', 'billing', true, true, false, false),
('reception', 'invoices', true, true, false, false),
('reception', 'payments', true, true, false, false);