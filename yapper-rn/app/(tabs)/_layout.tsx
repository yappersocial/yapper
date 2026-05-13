import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useAuth } from '@/hooks/useAuth';
import { colors, motion, spacing } from '@/theme';

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <MotiView
      animate={{
        scale: focused ? 1.08 : 1,
        translateY: focused ? -2 : 0,
      }}
      transition={motion.spring}
      style={{ alignItems: 'center', justifyContent: 'center', padding: 6 }}
    >
      {focused && (
        <MotiView
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={motion.spring}
          style={[StyleSheet.absoluteFill, styles.activePill]}
        >
          <LinearGradient
            colors={['rgba(167,139,250,0.30)', 'rgba(125,211,252,0.18)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </MotiView>
      )}
      <Ionicons
        name={name}
        size={24}
        color={focused ? colors.iris2 : colors.textSecondary}
        style={{ zIndex: 1 }}
      />
    </MotiView>
  );
}

export default function TabsLayout() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace('/(auth)/sign-in');
  }, [loading, session]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFill}>
              <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']}
                start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          ),
          sceneStyle: { backgroundColor: colors.bg },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: Platform.OS === 'ios' ? 24 : spacing.md,
    height: 64,
    borderRadius: 9999,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  activePill: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
});
