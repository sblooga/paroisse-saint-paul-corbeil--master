-- Add attachment_url column to contact_messages
ALTER TABLE public.contact_messages
ADD COLUMN attachment_url TEXT NULL,
ADD COLUMN attachment_name TEXT NULL;

-- Create storage bucket for contact attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('contact-attachments', 'contact-attachments', false, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to contact-attachments bucket (public form)
CREATE POLICY "Anyone can upload contact attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'contact-attachments');

-- Allow admins/editors to view contact attachments
CREATE POLICY "Admins can view contact attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'contact-attachments' 
  AND public.is_admin_or_editor(auth.uid())
);

-- Allow admins/editors to delete contact attachments
CREATE POLICY "Admins can delete contact attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'contact-attachments' 
  AND public.is_admin_or_editor(auth.uid())
);