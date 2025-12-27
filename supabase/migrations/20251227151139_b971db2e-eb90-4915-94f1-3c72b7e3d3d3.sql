-- Add added_by_email column to consultants table
ALTER TABLE public.consultants 
ADD COLUMN added_by_email text;