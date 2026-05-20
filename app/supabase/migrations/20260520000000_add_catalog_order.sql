-- Add manual catalog ordering for the default public catalog view.
ALTER TABLE public.talents
  ADD COLUMN IF NOT EXISTS catalog_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_talents_catalog_order
  ON public.talents (catalog_order, created_at DESC);
