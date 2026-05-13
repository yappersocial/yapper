import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MotiView } from 'moti';
import { colors, motion, radius as r, spacing, typography } from '@/theme';
import { AppText } from './AppText';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label && (
        <AppText
          size="xs"
          weight="medium"
          color={focused ? 'accent' : 'secondary'}
          style={{ marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}
        >
          {label}
        </AppText>
      )}
      <MotiView
        animate={{
          borderColor: error ? colors.danger : focused ? colors.iris1 : colors.glassBorder,
          backgroundColor: focused ? colors.glassStrong : colors.glass,
        }}
        transition={motion.timing}
        style={styles.field}
      >
        <TextInput
          {...rest}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, style]}
        />
      </MotiView>
      {error && (
        <AppText size="xs" color="danger" style={{ marginTop: 6 }}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  field: {
    borderWidth: 1,
    borderRadius: r.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  input: {
    color: colors.text,
    fontSize: typography.md,
    outlineWidth: 0 as any, // RN Web: kill the default outline
    minHeight: 24,
  },
});
