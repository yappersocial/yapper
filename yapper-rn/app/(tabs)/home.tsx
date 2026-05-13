import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { GlassView } from '@/components/ui/GlassView';
import { Wordmark } from '@/components/ui/Wordmark';
import { ComposeBox } from '@/components/ComposeBox';
import { PostCard } from '@/components/PostCard';
import { AppText } from '@/components/ui/AppText';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { colors, motion, radius as r, spacing } from '@/theme';
import type { Post } from '@/lib/types';

type Tab = 'for_you' | 'following';

export default function Home() {
  const router = useRouter();
  const { profile } = useAuth();
  const [tab, setTab]           = useState<Tab>('for_you');
  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefresh] = useState(false);

  const loadFeed = useCallback(async () => {
    if (!profile) return;
    let query = supabase
      .from('posts')
      .select('*, profiles!user_id(*), likes(user_id)')
      .is('reply_to', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (tab === 'following') {
      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', profile.id);
      const ids = (follows || []).map((f: any) => f.following_id);
      ids.push(profile.id);
      query = query.in('user_id', ids);
    }

    const { data } = await query;
    const mapped = (data || []).map((p: any) => ({
      ...p,
      liked_by_me: (p.likes || []).some((l: any) => l.user_id === profile.id),
      likes_count: (p.likes || []).length,
    }));
    setPosts(mapped as Post[]);
    setLoading(false);
  }, [profile, tab]);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  const onRefresh = async () => {
    setRefresh(true);
    await loadFeed();
    setRefresh(false);
  };

  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AmbientBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Wordmark size={28} />
        </View>

        <View style={styles.tabsWrap}>
          <GlassView intensity={40} borderRadius={9999}>
            <View style={styles.tabs}>
              <TabBtn label="For you"   active={tab === 'for_you'}   onPress={() => setTab('for_you')} />
              <TabBtn label="Following" active={tab === 'following'} onPress={() => setTab('following')} />
            </View>
          </GlassView>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.iris1}
              colors={[colors.iris1]}
            />
          }
          ListHeaderComponent={<ComposeBox profile={profile} onPosted={loadFeed} />}
          renderItem={({ item, index }) => (
            <PostCard
              post={item}
              currentUserId={profile.id}
              delay={Math.min(index, 8) * 35}
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <AppText size="lg" weight="semibold">It's quiet here.</AppText>
                <AppText size="sm" color="secondary" style={{ marginTop: 4 }}>
                  Yap something to start the feed.
                </AppText>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </View>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <MotiView
      animate={{
        backgroundColor: active ? colors.glassStrong : 'transparent',
      }}
      transition={motion.timing}
      style={styles.tab}
      onTouchEnd={onPress}
    >
      <AppText
        size="sm"
        weight={active ? 'bold' : 'medium'}
        color={active ? 'primary' : 'secondary'}
      >
        {label}
      </AppText>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.sm },
  tabsWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  tabs: { flexDirection: 'row', padding: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 9999 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  empty: { alignItems: 'center', padding: spacing.xxl },
});
