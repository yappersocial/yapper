// Dark + iridescent design system

export const colors = {
  // Base
  bg: '#080513',
  bgElevated: '#120a23',
  bgDeep: '#04020b',

  // Glass surfaces (used with BlurView)
  glass: 'rgba(255, 255, 255, 0.04)',
  glassStrong: 'rgba(255, 255, 255, 0.08)',
  glassDeep: 'rgba(255, 255, 255, 0.02)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.18)',
  glassHighlight: 'rgba(255, 255, 255, 0.15)',

  // Text
  text: '#f4f1fb',
  textSecondary: 'rgba(244, 241, 251, 0.65)',
  textTertiary: 'rgba(244, 241, 251, 0.40)',
  textInverse: '#0a0613',

  // Iridescent palette
  iris1: '#a78bfa',   // violet
  iris2: '#7dd3fc',   // sky
  iris3: '#5eead4',   // teal
  iris4: '#f0abfc',   // pink

  // States
  accent: '#a78bfa',
  accentHover: '#8b6dee',
  danger: '#f87171',
  success: '#86efac',
  warning: '#fbbf24',
  like: '#fb7185',

  // Overlays
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimSoft: 'rgba(0, 0, 0, 0.30)',
};

export const gradients = {
  iris: ['#a78bfa', '#7dd3fc', '#5eead4'] as const,
  irisWarm: ['#f0abfc', '#a78bfa', '#7dd3fc'] as const,
  bg: ['#0a0613', '#120a23', '#04020b'] as const,
  bgAurora: ['#1a0b3d', '#0a0613', '#0b1b3d'] as const,
  highlight: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0)'] as const,
  buttonPrimary: ['#a78bfa', '#7dd3fc'] as const,
  buttonAccent: ['#f0abfc', '#a78bfa'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 9999,
};

export const typography = {
  // Sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  xxxl: 40,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '900' as const,
};

export const shadows = {
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.iris1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const motion = {
  // Standard spring for interactive elements
  spring: { type: 'spring', damping: 18, stiffness: 320, mass: 0.7 } as const,
  // Slower spring for entering surfaces
  springSoft: { type: 'spring', damping: 22, stiffness: 180, mass: 0.9 } as const,
  // Quick timing for hover/focus
  timing: { type: 'timing', duration: 220 } as const,
  // Slow ambient animation (background drift)
  ambient: { type: 'timing', duration: 14000, loop: true } as const,
};
