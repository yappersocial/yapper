import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { GlassView } from '@/components/ui/GlassView';
import { Wordmark } from '@/components/ui/Wordmark';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { useAuth } from '@/hooks/useAuth';
import { colors, motion, radius as r, spacing } from '@/theme';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [busy, setBusy]         = useState(false);

  const submit = async () => {
    setError(null);
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setBusy(true);
    const { error } = await signUp(email.trim(), password);
    setBusy(false);
    if (error) setError(error);
    else setSuccess(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AmbientBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <MotiView
            from={{ opacity: 0, translateY: 24, scale: 0.96 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={motion.springSoft}
            style={styles.center}
          >
            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Wordmark size={64} />
              <AppText size="md" color="secondary" style={{ marginTop: spacing.sm }}>
                Make yourself a glass house.
              </AppText>
            </View>

            <GlassView intensity={60} iridescent elevated borderRadius={r.xl}>
              <View style={{ padding: spacing.xl }}>
                <AppText size="xxl" weight="bold" tracking="tight">Create account</AppText>
                <AppText size="sm" color="secondary" style={{ marginBottom: spacing.lg }}>
                  Free, forever-ish.
                </AppText>

                {success ? (
                  <View style={styles.success}>
                    <AppText size="md" color="primary">
                      Check your inbox to confirm your email, then sign in.
                    </AppText>
                    <View style={{ height: spacing.md }} />
                    <Button label="Back to sign in" variant="glass" onPress={() => router.replace('/(auth)/sign-in')} fullWidth />
                  </View>
                ) : (
                  <>
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
                      placeholder="6+ characters"
                    />
                    <View style={{ height: spacing.md }} />
                    <Input
                      label="Confirm password"
                      value={confirm}
                      onChangeText={setConfirm}
                      secureTextEntry
                      placeholder="••••••••"
                      error={error || undefined}
                    />
                    <View style={{ height: spacing.lg }} />
                    <Button
                      label={busy ? 'Creating…' : 'Create account'}
                      variant="accent"
                      onPress={submit}
                      disabled={busy || !email || !password || !confirm}
                      fullWidth
                      size="lg"
                    />
                    <Pressable onPress={() => router.back()} style={{ marginTop: spacing.lg, alignItems: 'center' }}>
                      <AppText size="sm" color="secondary">
                        Already have one?{' '}
                        <AppText size="sm" color="accent" weight="semibold">Sign in</AppText>
                      </AppText>
                    </Pressable>
                  </>
                )}
              </View>
            </GlassView>
          </MotiView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl, maxWidth: 440, alignSelf: 'center', width: '100%' },
  success: { backgroundColor: 'rgba(94,234,212,0.10)', borderRadius: 14, padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(94,234,212,0.4)' },
});
