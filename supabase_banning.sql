-- ─── Banning + Super Admin ────────────────────────────────────────────────────
-- Run in Supabase Dashboard → SQL Editor → New query

-- 1. New columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_super_admin boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned      boolean NOT NULL DEFAULT false;

-- 2. Helper: is the caller not banned?
CREATE OR REPLACE FUNCTION is_not_banned()
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_banned = true
  )
$$;

-- 3. Helper: is the caller a super admin?
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true
  )
$$;

-- 4. Trigger: protect is_super_admin from API edits;
--    restrict is_admin changes to super admins only
CREATE OR REPLACE FUNCTION profile_flags_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Service role (auth.uid() IS NULL) bypasses all guards
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;

  -- Nobody can flip is_super_admin through the API
  IF NEW.is_super_admin IS DISTINCT FROM OLD.is_super_admin THEN
    RAISE EXCEPTION 'is_super_admin can only be changed via the Supabase dashboard';
  END IF;

  -- Only super admins can grant or revoke admin
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF NOT (SELECT is_super_admin()) THEN
      RAISE EXCEPTION 'Only super admins can grant or revoke admin status';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_flags_guard ON profiles;
CREATE TRIGGER profile_flags_guard
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION profile_flags_guard();

-- 5. Admin update policy (replace old one from supabase_update.sql)
DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
CREATE POLICY "Admin can update profile flags" ON profiles
  FOR UPDATE
  USING  (is_admin())
  WITH CHECK (is_admin());

-- 6. Posts: banned users cannot post
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
CREATE POLICY "Users can post if not banned" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_not_banned());

-- 7. Posts: admins can delete any post
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
CREATE POLICY "Users and admins can delete posts" ON posts
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- 8. Likes: banned users cannot like
DROP POLICY IF EXISTS "Users can insert likes" ON likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON likes;
CREATE POLICY "Users can like if not banned" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_not_banned());
-- Keep the existing DELETE policy for unlikes (drop + recreate to be safe)
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Follows: banned users cannot follow
DROP POLICY IF EXISTS "Users can follow others" ON follows;
DROP POLICY IF EXISTS "Users can manage follows" ON follows;
DROP POLICY IF EXISTS "Users can insert follows" ON follows;
CREATE POLICY "Users can follow if not banned" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id AND is_not_banned());
DROP POLICY IF EXISTS "Users can unfollow" ON follows;
CREATE POLICY "Users can unfollow" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- 10. Messages: banned users cannot send DMs
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
CREATE POLICY "Users can send DMs if not banned" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id AND is_not_banned());
