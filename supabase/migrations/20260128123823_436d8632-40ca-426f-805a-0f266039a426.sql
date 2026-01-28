-- Add attachment_size column to contact_messages
ALTER TABLE public.contact_messages 
ADD COLUMN attachment_size integer;