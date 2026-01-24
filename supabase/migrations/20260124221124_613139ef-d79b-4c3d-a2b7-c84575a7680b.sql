-- Drop the permissive ALL policy and create specific ones
DROP POLICY IF EXISTS "Admins can manage social links" ON public.social_links;

-- Create specific policies for each operation
CREATE POLICY "Admins can view all social links"
  ON public.social_links FOR SELECT
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can insert social links"
  ON public.social_links FOR INSERT
  WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update social links"
  ON public.social_links FOR UPDATE
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete social links"
  ON public.social_links FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));