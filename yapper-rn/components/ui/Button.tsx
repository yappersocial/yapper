import { ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, motion, radius as r, spacing, typography } from '@/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'accent' | 'glass' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sizePadding: Record<Size, { vertical: number; horizontal: number; fontSize: number }> = {
  sm: { vertical: 8,  horizontal: 14, fontSize: typography.sm },
  md: { vertical: 12, horizontal: 20, fontSize: typography.md },
  lg: { vertical: 16, horizontal: 26, fontSize: typography.lg },
};

export function Button({
  label, variant = 'primary', size = 'md', leading, trailing, fullWidth, style, disabled, ...rest
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const padding = sizePadding[size];

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={({ hovered }: any) => [
        fullWidth && { width: '100%' as const },
        { opacity: disabled ? 0.45 : hovered ? 0.96 : 1 },
        style,
      ]}
      {...rest}
    >
      <MotiView
        animate={{ scale: pressed ? 0.97 : 1 }}
        transition={motion.spring}
        style={[
          styles.base,
          {
            paddingVertical: padding.vertical,
            paddingHorizontal: padding.horizontal,
            borderRadius: r.pill,
          },
        ]}
      >
        {variant === 'primary' && (
          <LinearGradient
            colors={gradients.buttonPrimary}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: r.pill }]}
          />
        )}
        {variant === 'accent' && (
          <LinearGradient
            colors={gradients.buttonAccent}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: r.pill }]}
          />
        )}
        {variant === 'glass' && (
          <View style={[StyleSheet.absoluteFill, {
            borderRadius: r.pill,
            backgroundColor: colors.glassStrong,
            borderWidth: 1,
            borderColor: colors.glassBorder,
          }]} />
        )}
        {variant === 'danger' && (
          <View style={[StyleSheet.absoluteFill, {
            borderRadius: r.pill,
            backgroundColor: 'rgba(248,113,113,0.18)',
            borderWidth: 1,
            borderColor: colors.danger,
          }]} />
        )}

        <View style={styles.contentRow}>
          {leading}
          <AppText
            weight="semibold"
            style={{
              fontSize: padding.fontSize,
              color: variant === 'danger' ? colors.danger
                   : variant === 'ghost'  ? colors.text
                   : variant === 'glass'  ? colors.text
                   : '#0a0613',
              letterSpacing: -0.2,
            }}
          >
            {label}
          </AppText>
          {trailing}
        </View>
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 1,
  },
});
