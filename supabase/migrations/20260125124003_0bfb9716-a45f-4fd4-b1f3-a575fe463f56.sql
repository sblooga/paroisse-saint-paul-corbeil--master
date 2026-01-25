-- Create audio_files table for podcasts and homilies
CREATE TABLE public.audio_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_fr TEXT,
  title_pl TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  duration INTEGER, -- duration in seconds (optional for future use)
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active audio files"
  ON public.audio_files
  FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can view all audio files"
  ON public.audio_files
  FOR SELECT
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can insert audio files"
  ON public.audio_files
  FOR INSERT
  WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update audio files"
  ON public.audio_files
  FOR UPDATE
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete audio files"
  ON public.audio_files
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_audio_files_updated_at
  BEFORE UPDATE ON public.audio_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a']
);

-- Storage policies for audio bucket
CREATE POLICY "Anyone can view audio files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'audio');

CREATE POLICY "Admins can upload audio files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update audio files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'audio' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete audio files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'audio' AND has_role(auth.uid(), 'admin'));