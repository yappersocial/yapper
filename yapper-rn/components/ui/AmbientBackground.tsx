import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { gradients } from '@/theme';

/**
 * Slowly-drifting iridescent aurora behind every screen.
 * Two blurred gradient blobs that orbit lazily — gives the page a "living"
 * background without distracting from content.
 */
export function AmbientBackground() {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 22000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, []);

  const blob1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: -120 + t.value * 80 },
      { translateY: -80 + t.value * 60 },
      { scale: 1 + t.value * 0.15 },
    ],
    opacity: 0.55 + t.value * 0.15,
  }));

  const blob2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: 120 - t.value * 60 },
      { translateY: 100 - t.value * 40 },
      { scale: 1 + (1 - t.value) * 0.12 },
    ],
    opacity: 0.45 + (1 - t.value) * 0.2,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={gradients.bgAurora}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, styles.blob1, blob1Style]}>
        <LinearGradient
          colors={['rgba(167,139,250,0.55)', 'rgba(167,139,250,0)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.blob, styles.blob2, blob2Style]}>
        <LinearGradient
          colors={['rgba(125,211,252,0.45)', 'rgba(125,211,252,0)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.blob, styles.blob3, blob1Style]}>
        <LinearGradient
          colors={['rgba(240,171,252,0.30)', 'rgba(240,171,252,0)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 520, height: 520,
    borderRadius: 9999,
  },
  blob1: { top: '-10%', left: '-15%' },
  blob2: { bottom: '-10%', right: '-15%' },
  blob3: { top: '40%', right: '20%', width: 320, height: 320 },
});
