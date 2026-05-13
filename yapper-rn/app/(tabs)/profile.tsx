import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { GlassView } from '@/components/ui/GlassView';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { colors, gradients, motion, radius as r, spacing } from '@/theme';
import type { Post } from '@/lib/types';

type Tab = 'yaps' | 'likes';

export default function Profile() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('yaps');
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const [fwRes, fgRes] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id',  profile.id),
      ]);
      setFollowers(fwRes.count || 0);
      setFollowing(fgRes.count || 0);
      await loadPosts();
    })();
  }, [profile, tab]);

  const loadPosts = async () => {
    if (!profile) return;
    let data;
    if (tab === 'yaps') {
      const res = await supabase
        .from('posts')
        .select('*, profiles!user_id(*), likes(user_id)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);
      data = res.data;
    } else {
      const res = await supabase
        .from('likes')
        .select('post_id, posts(*, profiles!user_id(*), likes(user_id))')
        .eq('user_id', profile.id)
        .limit(50);
      data = (res.data || []).map((r: any) => r.posts).filter(Boolean);
    }
    setPosts(((data || []) as any[]).map((p) => ({
      ...p,
      liked_by_me: (p.likes || []).some((l: any) => l.user_id === profile.id),
      likes_count: (p.likes || []).length,
    })) as Post[]);
  };

  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AmbientBackground />
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <SafeAreaView edges={['top']}>
            <View style={styles.banner}>
              {profile.banner_url ? (
                <Image source={{ uri: profile.banner_url }} style={StyleSheet.absoluteFill} contentFit="cover" />
              ) : (
                <LinearGradient
                  colors={gradients.irisWarm}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
            </View>

            <View style={styles.headerCard}>
              <GlassView intensity={55} iridescent elevated borderRadius={r.xl}>
                <View style={{ padding: spacing.xl }}>
                  <View style={styles.avatarRow}>
                    <View style={{ marginTop: -64 }}>
                      <Avatar
                        uri={profile.avatar_url}
                        name={profile.display_name || profile.username}
                        size={104}
                        ring
                      />
                    </View>
                    <Button label="Sign out" variant="glass" size="sm" onPress={signOut} />
                  </View>

                  <View style={{ marginTop: spacing.md }}>
                    <View style={styles.nameRow}>
                      <AppText size="xxl" weight="bold" tracking="tight">
                        {profile.display_name || profile.username}
                      </AppText>
                      {profile.is_super_admin && <Ionicons name="shield-checkmark" size={18} color={colors.iris4} />}
                      {!profile.is_super_admin && profile.is_admin && <Ionicons name="shield-checkmark" size={18} color={colors.text} />}
                      {!profile.is_admin && profile.is_verified && <Ionicons name="checkmark-circle" size={18} color={colors.iris2} />}
                    </View>
                    <AppText size="sm" color="secondary">@{profile.username}</AppText>
                    {profile.bio && (
                      <AppText size="md" style={{ marginTop: spacing.md, lineHeight: 22 }}>
                        {profile.bio}
                      </AppText>
                    )}
                    <View style={styles.stats}>
                      <Stat count={following} label="Following" />
                      <Stat count={followers} label="Followers" />
                    </View>
                  </View>
                </View>
              </GlassView>
            </View>

            <View style={styles.tabsWrap}>
              <GlassView intensity={40} borderRadius={9999}>
                <View style={styles.tabs}>
                  <TabBtn label="Yaps"  active={tab === 'yaps'}  onPress={() => setTab('yaps')} />
                  <TabBtn label="Likes" active={tab === 'likes'} onPress={() => setTab('likes')} />
                </View>
              </GlassView>
            </View>
          </SafeAreaView>
        }
        renderItem={({ item, index }) => (
          <PostCard
            post={item}
            currentUserId={profile.id}
            delay={Math.min(index, 8) * 30}
          />
        )}
      />
    </View>
  );
}

function Stat({ count, label }: { count: number; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
      <AppText size="md" weight="bold">{count}</AppText>
      <AppText size="sm" color="secondary">{label}</AppText>
    </View>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <MotiView
      animate={{ backgroundColor: active ? colors.glassStrong : 'transparent' }}
      transition={motion.timing}
      style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 9999 }}
      onTouchEnd={onPress}
    >
      <AppText size="sm" weight={active ? 'bold' : 'medium'} color={active ? 'primary' : 'secondary'}>
        {label}
      </AppText>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 120, paddingHorizontal: spacing.lg },
  banner: { height: 160, borderRadius: 0, overflow: 'hidden', marginHorizontal: -spacing.lg },
  headerCard: { marginTop: -32 },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stats: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  tabsWrap: { marginTop: spacing.md, marginBottom: spacing.md },
  tabs: { flexDirection: 'row', padding: 4 },
});
