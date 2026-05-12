-- ============================================================
-- YAPPER — DMs + Media. Run in Supabase SQL Editor.
-- ============================================================

-- Make post content optional (for media-only posts)
alter table public.posts alter column content drop not null;

-- Media columns on posts
alter table public.posts add column if not exists media_url  text;
alter table public.posts add column if not exists media_type text; -- 'image' | 'video' | 'gif'

-- ──────────────────────────────────────────────
-- MESSAGES
-- ──────────────────────────────────────────────
create table if not exists public.messages (
  id             uuid primary key default uuid_generate_v4(),
  sender_id      uuid not null,
  recipient_id   uuid not null,
  content        text,
  shared_post_id uuid,
  read           boolean not null default false,
  created_at     timestamptz not null default now(),
  constraint messages_sender_fk    foreign key (sender_id)      references public.profiles(id) on delete cascade,
  constraint messages_recipient_fk foreign key (recipient_id)   references public.profiles(id) on delete cascade,
  constraint messages_post_fk      foreign key (shared_post_id) references public.posts(id)    on delete set null,
  constraint messages_has_content  check (content is not null or shared_post_id is not null)
);

create index if not exists messages_sender_idx    on public.messages(sender_id,    created_at desc);
create index if not exists messages_recipient_idx on public.messages(recipient_id, created_at desc);

-- RLS
alter table public.messages enable row level security;

create policy "messages_select" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "messages_insert" on public.messages
  for insert with check (auth.uid() = sender_id);

create policy "messages_update" on public.messages
  for update using (auth.uid() = recipient_id); -- for marking read

-- Enable realtime (also go to Supabase Dashboard > Database > Replication and enable messages table)
-- alter publication supabase_realtime add table public.messages;

-- ──────────────────────────────────────────────
-- STORAGE BUCKET FOR POST MEDIA
-- ──────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

create policy "post_media_select" on storage.objects
  for select using (bucket_id = 'post-media');

create policy "post_media_insert" on storage.objects
  for insert with check (bucket_id = 'post-media' and auth.role() = 'authenticated');

create policy "post_media_delete" on storage.objects
  for delete using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);
