import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/theme';
import { AppText } from './AppText';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  ring?: boolean;
}

export function Avatar({ uri, name, size = 40, ring = false }: AvatarProps) {
  const initials = (name || '?').trim().slice(0, 2).toUpperCase();
  const inner = size - (ring ? 4 : 0);

  const body = uri ? (
    <Image
      source={{ uri }}
      style={{ width: inner, height: inner, borderRadius: inner / 2 }}
      contentFit="cover"
      transition={300}
    />
  ) : (
    <LinearGradient
      colors={gradients.iris}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{
        width: inner, height: inner, borderRadius: inner / 2,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <AppText weight="bold" style={{ fontSize: inner * 0.4, color: '#0a0613' }}>
        {initials}
      </AppText>
    </LinearGradient>
  );

  if (!ring) return body;

  return (
    <LinearGradient
      colors={gradients.iris}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{
        width: size, height: size, borderRadius: size / 2,
        padding: 2, alignItems: 'center', justifyContent: 'center',
      }}
    >
      <View style={{ backgroundColor: colors.bg, borderRadius: inner / 2 }}>
        {body}
      </View>
    </LinearGradient>
  );
}

const _styles = StyleSheet.create({});
