-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info'::text,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications for all users" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for auto-updating timestamps
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add logo_url column to company_settings table
ALTER TABLE public.company_settings 
ADD COLUMN logo_url TEXT DEFAULT NULL;

-- Insert some sample notifications
INSERT INTO public.notifications (user_id, title, message, type) 
SELECT 
    auth.uid(),
    'Welcome to CareSync',
    'Your account has been set up successfully. Start by completing your profile.',
    'info'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.notifications (user_id, title, message, type) 
SELECT 
    auth.uid(),
    'New Patient Assignment',
    'You have been assigned to care for patient Jane Smith in Room 204.',
    'assignment'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.notifications (user_id, title, message, type) 
SELECT 
    auth.uid(),
    'Assessment Due',
    'Patient in Room 105 requires a quarterly assessment by end of week.',
    'reminder'
WHERE auth.uid() IS NOT NULL;