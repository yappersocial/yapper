-- ============================================================
-- YAPPER — Run this in Supabase SQL Editor to add
-- is_admin, is_verified, and admin RLS policies
-- ============================================================

-- Add new columns
alter table public.profiles add column if not exists is_admin    boolean not null default false;
alter table public.profiles add column if not exists is_verified boolean not null default false;

-- Helper: check if the calling user is an admin (bypasses RLS via security definer)
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Allow admins to update ANY profile (grants/revokes verified + admin badges)
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles
  for update using (public.is_admin());

-- Grant the first admin directly in Supabase:
--   UPDATE public.profiles SET is_admin = true WHERE username = 'yourusername';
-- After that, admins can promote others via the Admin Panel in the app.
