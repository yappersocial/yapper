// Mirrors the Supabase schema from Yapper2 — extend as new tables come online.

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  is_verified: boolean;
  is_admin: boolean;
  is_super_admin: boolean;
  is_banned: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | 'gif' | null;
  reply_to: string | null;
  repost_of: string | null;
  created_at: string;
  profiles?: Profile;
  likes?: { user_id: string }[];
  likes_count?: number;
  liked_by_me?: boolean;
  original_post?: Post | null;
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      posts:    { Row: Post;    Insert: Partial<Post>;    Update: Partial<Post> };
      likes:    { Row: { user_id: string; post_id: string }; Insert: { user_id: string; post_id: string }; Update: never };
      follows:  { Row: { follower_id: string; following_id: string }; Insert: { follower_id: string; following_id: string }; Update: never };
      bookmarks:{ Row: { user_id: string; post_id: string }; Insert: { user_id: string; post_id: string }; Update: never };
      blocks:   { Row: { blocker_id: string; blocked_id: string }; Insert: { blocker_id: string; blocked_id: string }; Update: never };
    };
  };
};
