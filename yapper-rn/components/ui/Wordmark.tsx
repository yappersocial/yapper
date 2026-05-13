import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, typography } from '@/theme';

interface WordmarkProps {
  size?: number;
  text?: string;
}

/**
 * Gradient-filled "Yapper" wordmark using LinearGradient with text mask on native.
 * On web, falls back to backgroundClip:text via inline style for the same effect.
 */
export function Wordmark({ size = 56, text = 'Yapper' }: WordmarkProps) {
  // RN Web: use CSS backgroundClip trick
  if (typeof document !== 'undefined') {
    return (
      <Text
        style={{
          fontSize: size,
          fontWeight: typography.heavy,
          letterSpacing: -size * 0.05,
          // @ts-ignore — web-only style props
          background: 'linear-gradient(120deg, #a78bfa 0%, #7dd3fc 50%, #5eead4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        } as any}
      >
        {text}
      </Text>
    );
  }

  // Native: gradient behind transparent text (approximation since RN doesn't do text gradient natively)
  return (
    <View>
      <LinearGradient
        colors={gradients.iris}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any } as any}
      />
      <Text
        style={{
          fontSize: size,
          fontWeight: typography.heavy,
          letterSpacing: -size * 0.05,
          color: 'transparent',
        }}
      >
        {text}
      </Text>
    </View>
  );
}
