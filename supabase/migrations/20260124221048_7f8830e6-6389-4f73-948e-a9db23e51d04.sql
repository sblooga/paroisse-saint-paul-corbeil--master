-- Create social_links table for managing social media icons dynamically
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Public read access for active links
CREATE POLICY "Public can view active social links"
  ON public.social_links FOR SELECT
  USING (active = true);

-- Admin/editor management access
CREATE POLICY "Admins can manage social links"
  ON public.social_links FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default social links
INSERT INTO public.social_links (name, icon, url, sort_order, active) VALUES
  ('Facebook', 'facebook', 'https://www.facebook.com/stpaulcorbeil', 1, true),
  ('Instagram', 'instagram', '#', 2, true),
  ('YouTube', 'youtube', 'https://www.youtube.com/@eglise-st.paul-corbeil-essonne', 3, true),
  ('Flickr', 'flickr', 'https://www.flickr.com/photos/paroissesaintpaul/albums/', 4, true),
  ('WhatsApp', 'whatsapp', 'https://wa.me/33986346726', 5, true);