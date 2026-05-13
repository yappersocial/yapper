import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

interface AppTextProps extends TextProps {
  size?: keyof Pick<typeof typography, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'>;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger';
  tracking?: 'tight' | 'normal' | 'wide';
}

const colorMap = {
  primary: colors.text,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  accent: colors.iris1,
  danger: colors.danger,
};

export function AppText({
  size = 'md',
  weight = 'regular',
  color = 'primary',
  tracking = 'normal',
  style,
  children,
  ...rest
}: AppTextProps) {
  const style$: TextStyle = {
    fontSize: typography[size],
    fontWeight: typography[weight],
    color: colorMap[color],
    letterSpacing: tracking === 'tight' ? -0.4 : tracking === 'wide' ? 0.6 : 0,
  };

  return (
    <Text style={[styles.base, style$, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    // RN Web inherits letter-spacing; native uses it directly
  },
});
