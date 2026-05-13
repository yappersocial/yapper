import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors, motion, radius as r, spacing, typography } from '@/theme';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { GlassView } from '@/components/ui/GlassView';
import { AppText } from '@/components/ui/AppText';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface ComposeBoxProps {
  profile: Profile;
  onPosted?: () => void;
}

const MAX = 280;

export function ComposeBox({ profile, onPosted }: ComposeBoxProps) {
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const [posting, setPosting] = useState(false);

  const trimmed = content.trim();
  const remaining = MAX - content.length;
  const canPost = !!trimmed && remaining >= 0 && !posting;

  const submit = async () => {
    if (!canPost) return;
    setPosting(true);
    const { error } = await supabase.from('posts').insert({
      user_id: profile.id,
      content: trimmed,
    });
    setPosting(false);
    if (!error) {
      setContent('');
      onPosted?.();
    }
  };

  return (
    <GlassView intensity={50} iridescent borderRadius={r.lg} elevated style={{ marginBottom: spacing.md }}>
      <View style={styles.row}>
        <Avatar uri={profile.avatar_url} name={profile.display_name || profile.username} size={44} ring />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <TextInput
            value={content}
            onChangeText={setContent}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="What's happening?"
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={MAX + 40}
            style={styles.input}
          />
          <AnimatePresence>
            {(focused || trimmed.length > 0) && (
              <MotiView
                from={{ opacity: 0, translateY: -6 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -6 }}
                transition={motion.timing}
                style={styles.footer}
              >
                <View style={styles.tools}>
                  <Tool icon="image-outline" />
                  <Tool icon="happy-outline" />
                  <Tool icon="location-outline" />
                </View>
                <View style={styles.footerRight}>
                  <AppText
                    size="sm"
                    color={remaining < 0 ? 'danger' : remaining <= 20 ? 'accent' : 'tertiary'}
                    weight="medium"
                  >
                    {remaining}
                  </AppText>
                  <Button label={posting ? 'Posting…' : 'Yap'} size="sm" onPress={submit} disabled={!canPost} />
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </View>
    </GlassView>
  );
}

function Tool({ icon }: { icon: any }) {
  const [hover, setHover] = useState(false);
  return (
    <MotiView
      animate={{ scale: hover ? 1.12 : 1, backgroundColor: hover ? colors.glassStrong : 'transparent' }}
      transition={motion.spring}
      onHoverIn={() => setHover(true) as any}
      onHoverOut={() => setHover(false) as any}
      style={styles.tool}
    >
      <Ionicons name={icon} size={20} color={hover ? colors.iris2 : colors.textSecondary} />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: spacing.lg, gap: spacing.md },
  input: {
    color: colors.text,
    fontSize: typography.lg,
    minHeight: 28,
    paddingTop: 6,
    outlineWidth: 0 as any,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  tools: { flexDirection: 'row', gap: 4 },
  tool: { padding: 8, borderRadius: r.pill },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
