/**
 * Tab Layout — Custom bottom navigation bar
 * Matches the web app's premium design: black bar, lime active indicator
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '@/constants/theme';
import { Home, Compass, People, Stats, Mail } from '@/components/Icons';

const TAB_ITEMS = [
  { name: 'index', label: 'Home', icon: Home },
  { name: 'discover', label: 'Discover', icon: Compass },
  { name: 'community', label: 'Community', icon: People },
  { name: 'stats', label: 'Stats', icon: Stats },
  { name: 'messages', label: 'Inbox', icon: Mail },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopWidth: 0,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
            },
            android: { elevation: 20 },
          }),
        },
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.whiteAlpha(0.35),
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.black,
          fontSize: 8,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginTop: 4,
        },
      }}
    >
      {TAB_ITEMS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <tab.icon size={22} color={color} />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
          }}
          listeners={{
            tabPress: () => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            },
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 28,
  },
  iconContainerActive: {
    // Active icon gets a subtle glow
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lime,
  },
});
