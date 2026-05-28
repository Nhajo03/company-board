-- =====================================================
-- COMPANY BOARD — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- =====================================================

-- Table: announces
create table public.announces (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text,
  category      text,
  image_url     text,
  display_order integer default 0,
  is_active     boolean default true,
  is_alert      boolean default false,
  expires_at    timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_announces_update
  before update on public.announces
  for each row execute procedure public.handle_updated_at();

-- Row Level Security
alter table public.announces enable row level security;

-- Anyone can READ active announces (for kiosk screen)
create policy "Public read active announces"
  on public.announces for select
  using (true);

-- Only authenticated users can INSERT/UPDATE/DELETE
create policy "Admin insert"
  on public.announces for insert
  with check (auth.role() = 'authenticated');

create policy "Admin update"
  on public.announces for update
  using (auth.role() = 'authenticated');

create policy "Admin delete"
  on public.announces for delete
  using (auth.role() = 'authenticated');

-- =====================================================
-- Storage bucket for images
-- Run this separately in SQL Editor:
-- =====================================================
insert into storage.buckets (id, name, public)
values ('announce-images', 'announce-images', true);

-- Anyone can view images
create policy "Public image read"
  on storage.objects for select
  using (bucket_id = 'announce-images');

-- Only authenticated users can upload
create policy "Admin image upload"
  on storage.objects for insert
  with check (bucket_id = 'announce-images' and auth.role() = 'authenticated');

create policy "Admin image delete"
  on storage.objects for delete
  using (bucket_id = 'announce-images' and auth.role() = 'authenticated');

-- =====================================================
-- Sample data (optional)
-- =====================================================
insert into public.announces (title, content, category, display_order, is_active) values
  ('Welcome to Company Board', 'Your digital signage solution is up and running. Add your announcements from the admin panel.', 'General', 1, true),
  ('Urgent: Meeting Room A Available', 'Meeting Room A is now available for booking via the internal portal.', 'HR', 2, true);
