import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <AmbientBackground />
        <ActivityIndicator color={colors.iris1} size="large" />
      </View>
    );
  }

  return <Redirect href={session ? '/(tabs)/home' : '/(auth)/sign-in'} />;
}
