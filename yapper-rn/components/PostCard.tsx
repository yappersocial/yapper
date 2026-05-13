import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors, motion, radius as r, spacing, typography } from '@/theme';
import { Avatar } from '@/components/ui/Avatar';
import { AppText } from '@/components/ui/AppText';
import { GlassView } from '@/components/ui/GlassView';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onPress?: () => void;
  delay?: number;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604_800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}

export function PostCard({ post, currentUserId, onPress, delay = 0 }: PostCardProps) {
  const [liked, setLiked]   = useState(post.liked_by_me ?? false);
  const [count, setCount]   = useState(post.likes_count ?? 0);
  const [pulse, setPulse]   = useState(false);
  const profile = post.profiles;
  if (!profile) return null;

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => c + (newLiked ? 1 : -1));
    setPulse(true);
    setTimeout(() => setPulse(false), 280);
    if (newLiked) {
      await supabase.from('likes').insert({ user_id: currentUserId, post_id: post.id });
    } else {
      await supabase.from('likes').delete().eq('user_id', currentUserId).eq('post_id', post.id);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ ...motion.springSoft, delay }}
      style={{ marginBottom: spacing.md }}
    >
      <Pressable onPress={onPress}>
        <GlassView intensity={45} iridescent borderRadius={r.lg}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Avatar uri={profile.avatar_url} name={profile.display_name || profile.username} size={42} ring={profile.is_super_admin || profile.is_admin} />
              <View style={{ flex: 1 }}>
                <View style={styles.headerRow}>
                  <AppText weight="bold" size="md" style={{ letterSpacing: -0.2 }}>
                    {profile.display_name || profile.username}
                  </AppText>
                  {profile.is_super_admin && <Ionicons name="shield-checkmark" size={14} color={colors.iris4} />}
                  {!profile.is_super_admin && profile.is_admin && <Ionicons name="shield-checkmark" size={14} color={colors.text} />}
                  {!profile.is_admin && profile.is_verified && <Ionicons name="checkmark-circle" size={14} color={colors.iris2} />}
                  <AppText size="sm" color="tertiary">·</AppText>
                  <AppText size="sm" color="secondary">@{profile.username}</AppText>
                  <AppText size="sm" color="tertiary">·</AppText>
                  <AppText size="sm" color="tertiary">{timeAgo(post.created_at)}</AppText>
                </View>
              </View>
            </View>

            {post.content && (
              <AppText size="md" style={{ marginTop: spacing.sm, lineHeight: 22 }}>
                {post.content}
              </AppText>
            )}

            {post.media_url && (
              <View style={styles.mediaWrap}>
                <Image
                  source={{ uri: post.media_url }}
                  style={{ width: '100%', aspectRatio: 16 / 10, borderRadius: r.md }}
                  contentFit="cover"
                  transition={400}
                />
              </View>
            )}

            <View style={styles.actions}>
              <ActionBtn icon="chatbubble-outline" label={String(0)} />
              <ActionBtn icon="repeat-outline" label="" />
              <Pressable onPress={toggleLike} style={styles.actionPressable}>
                <MotiView
                  animate={{ scale: pulse ? 1.4 : 1 }}
                  transition={{ type: 'spring', damping: 9, stiffness: 240 }}
                >
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={liked ? colors.like : colors.textSecondary}
                  />
                </MotiView>
                <AppText size="sm" color={liked ? 'danger' : 'secondary'}>{count}</AppText>
              </Pressable>
              <ActionBtn icon="bookmark-outline" label="" />
              <ActionBtn icon="share-outline" label="" />
            </View>
          </View>
        </GlassView>
      </Pressable>
    </MotiView>
  );
}

function ActionBtn({ icon, label }: { icon: any; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={styles.actionPressable}
    >
      <MotiView animate={{ scale: hover ? 1.1 : 1 }} transition={motion.spring}>
        <Ionicons name={icon} size={18} color={hover ? colors.iris2 : colors.textSecondary} />
      </MotiView>
      {!!label && <AppText size="sm" color="secondary">{label}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  mediaWrap: {
    marginTop: spacing.md,
    borderRadius: r.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, paddingTop: spacing.sm, gap: spacing.lg },
  actionPressable: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 },
});
