-- Add manual homepage curation controls for talent profiles.
ALTER TABLE public.talents
  ADD COLUMN IF NOT EXISTS featured_on_home BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS homepage_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_talents_homepage_featured
  ON public.talents (featured_on_home, homepage_order, updated_at DESC)
  WHERE featured_on_home = true;
