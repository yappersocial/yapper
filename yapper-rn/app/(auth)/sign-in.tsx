import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Link, useRouter } from 'expo-router';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { GlassView } from '@/components/ui/GlassView';
import { Wordmark } from '@/components/ui/Wordmark';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { useAuth } from '@/hooks/useAuth';
import { colors, motion, radius as r, spacing } from '@/theme';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [busy, setBusy]         = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setError(error);
    else router.replace('/(tabs)/home');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AmbientBackground />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}
        >
          <MotiView
            from={{ opacity: 0, translateY: 24, scale: 0.96 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={motion.springSoft}
            style={styles.center}
          >
            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Wordmark size={64} />
              <AppText size="md" color="secondary" style={{ marginTop: spacing.sm }}>
                Glass-bright social, just for you.
              </AppText>
            </View>

            <GlassView intensity={60} iridescent elevated borderRadius={r.xl} style={styles.card}>
              <View style={styles.cardInner}>
                <AppText size="xxl" weight="bold" tracking="tight">Welcome back</AppText>
                <AppText size="sm" color="secondary" style={{ marginBottom: spacing.lg }}>
                  Sign in to keep yapping.
                </AppText>

                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                />
                <View style={{ height: spacing.md }} />
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  placeholder="••••••••"
                  error={error || undefined}
                />

                <View style={{ height: spacing.lg }} />
                <Button
                  label={busy ? 'Signing in…' : 'Sign in'}
                  onPress={submit}
                  disabled={busy || !email || !password}
                  fullWidth
                  size="lg"
                />

                <Pressable
                  onPress={() => router.push('/(auth)/sign-up')}
                  style={{ marginTop: spacing.lg, alignItems: 'center' }}
                >
                  <AppText size="sm" color="secondary">
                    No account yet?{' '}
                    <AppText size="sm" color="accent" weight="semibold">Create one</AppText>
                  </AppText>
                </Pressable>
              </View>
            </GlassView>
          </MotiView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav:  { flex: 1 },
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl, maxWidth: 440, alignSelf: 'center', width: '100%' },
  card: { width: '100%' },
  cardInner: { padding: spacing.xl },
});
