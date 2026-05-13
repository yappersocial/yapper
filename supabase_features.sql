-- ─── Bookmarks, Blocks, Reposts ──────────────────────────────────────────────
-- Run in Supabase Dashboard → SQL Editor → New query

-- 1. Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id    uuid REFERENCES posts(id)    ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, post_id)
);
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. Blocks table
CREATE TABLE IF NOT EXISTS blocks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(blocker_id, blocked_id)
);
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own blocks" ON blocks
  FOR ALL USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

-- 3. Reposts: add column to posts (self-referencing FK)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS repost_of uuid REFERENCES posts(id) ON DELETE CASCADE;
