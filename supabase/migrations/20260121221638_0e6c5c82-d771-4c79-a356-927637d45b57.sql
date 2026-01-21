-- Create a table to track submission attempts for rate limiting
CREATE TABLE IF NOT EXISTS public.submission_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- email or IP
  table_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow public inserts to rate limits (for tracking)
CREATE POLICY "Anyone can insert rate limit entries"
  ON public.submission_rate_limits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view/delete rate limit entries
CREATE POLICY "Admins can manage rate limits"
  ON public.submission_rate_limits
  FOR ALL
  TO authenticated
  USING (is_admin_or_editor(auth.uid()));

-- Create index for fast lookups
CREATE INDEX idx_rate_limits_lookup 
  ON public.submission_rate_limits(identifier, table_name, created_at);

-- Auto-cleanup old entries (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.submission_rate_limits 
  WHERE created_at < now() - interval '1 hour';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_cleanup_rate_limits
  AFTER INSERT ON public.submission_rate_limits
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_rate_limits();

-- Rate limiting function: max 5 submissions per hour per identifier
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  submission_count integer;
BEGIN
  -- Count submissions in the last hour
  SELECT COUNT(*) INTO submission_count
  FROM public.submission_rate_limits
  WHERE identifier = p_identifier
    AND table_name = p_table_name
    AND created_at > now() - interval '1 hour';
  
  -- Allow if under limit (5 per hour)
  IF submission_count < 5 THEN
    -- Record this submission attempt
    INSERT INTO public.submission_rate_limits (identifier, table_name)
    VALUES (p_identifier, p_table_name);
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Drop old permissive INSERT policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Create new INSERT policies with rate limiting
CREATE POLICY "Anyone can subscribe to newsletter with rate limit"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    check_rate_limit(email, 'newsletter_subscribers')
  );

CREATE POLICY "Anyone can submit contact messages with rate limit"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    check_rate_limit(email, 'contact_messages')
  );