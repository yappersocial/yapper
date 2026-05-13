import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius as r, shadows } from '@/theme';

interface GlassViewProps {
  children?: ReactNode;
  intensity?: number;
  borderRadius?: number;
  iridescent?: boolean;
  elevated?: boolean;
  noBorder?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Liquid Glass surface.
 * - BlurView for the frost
 * - Optional iridescent gradient wash
 * - Specular highlight gradient along the top edge
 * - Hairline border to suggest glass refraction
 */
export function GlassView({
  children,
  intensity = 60,
  borderRadius = r.lg,
  iridescent = false,
  elevated = false,
  noBorder = false,
  style,
}: GlassViewProps) {
  return (
    <View
      style={[
        styles.wrap,
        {
          borderRadius,
          borderWidth: noBorder ? 0 : StyleSheet.hairlineWidth,
        },
        elevated && shadows.glass,
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      {iridescent && (
        <LinearGradient
          colors={[
            'rgba(167,139,250,0.12)',
            'rgba(125,211,252,0.04)',
            'rgba(94,234,212,0.10)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          pointerEvents="none"
        />
      )}
      <LinearGradient
        colors={gradients.highlight}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    position: 'relative',
  },
  content: { flex: 1, zIndex: 1 },
});
