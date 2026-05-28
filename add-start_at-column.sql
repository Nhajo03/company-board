-- Run this if you already created the table before
-- Adds the start_at column for announce scheduling

ALTER TABLE public.announces ADD COLUMN IF NOT EXISTS start_at timestamptz;
