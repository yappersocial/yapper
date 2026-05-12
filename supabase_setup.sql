-- ============================================================
-- YAPPER — Run this entire file in Supabase SQL Editor
-- Dashboard > SQL Editor > New query > Paste > Run
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  bio           text,
  avatar_url    text,
  banner_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, created_at)
  values (new.id, now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────
-- POSTS
-- ──────────────────────────────────────────────
create table if not exists public.posts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  content    text not null check (char_length(content) <= 280),
  reply_to   uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists posts_reply_to_idx on public.posts(reply_to);
create index if not exists posts_created_at_idx on public.posts(created_at desc);

-- ──────────────────────────────────────────────
-- LIKES
-- ──────────────────────────────────────────────
create table if not exists public.likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- ──────────────────────────────────────────────
-- FOLLOWS
-- ──────────────────────────────────────────────
create table if not exists public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ──────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  actor_id   uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('like','follow','reply')),
  post_id    uuid references public.posts(id) on delete cascade,
  read       boolean default false,
  created_at timestamptz default now()
);

create index if not exists notif_user_idx on public.notifications(user_id, created_at desc);

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.posts         enable row level security;
alter table public.likes         enable row level security;
alter table public.follows       enable row level security;
alter table public.notifications enable row level security;

-- Profiles: anyone can read; only you can update your own
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Posts: anyone can read; authenticated users can insert their own; only author can delete
create policy "posts_select"  on public.posts for select using (true);
create policy "posts_insert"  on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete"  on public.posts for delete using (auth.uid() = user_id);

-- Likes: anyone can read; authenticated users manage their own
create policy "likes_select"  on public.likes for select using (true);
create policy "likes_insert"  on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete"  on public.likes for delete using (auth.uid() = user_id);

-- Follows: anyone can read; authenticated users manage their own
create policy "follows_select" on public.follows for select using (true);
create policy "follows_insert" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete" on public.follows for delete using (auth.uid() = follower_id);

-- Notifications: only you can read/update your own
create policy "notif_select" on public.notifications for select using (auth.uid() = user_id);
create policy "notif_insert" on public.notifications for insert with check (true);
create policy "notif_update" on public.notifications for update using (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- STORAGE BUCKET FOR AVATARS
-- ──────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_select" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_insert" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_update" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_delete" on storage.objects for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
