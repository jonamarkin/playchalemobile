/**
 * Player Profile screen — view any player's profile
 * Accessible without auth (view-only)
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useProfile } from '@/hooks/useData';
import { useAuthContext } from '@/providers/AuthProvider';
import { ChevronLeft, Star, Trophy, Share } from '@/components/Icons';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requireAuth } = useAuthContext();

  const { data: profile, isLoading } = useProfile(id);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.emptyTitle}>Player Not Found</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const attributes = profile.attributes || {};
  const stats = profile.stats || {};
  const maxAttr = 99;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={[styles.profileHeader, { paddingTop: insets.top + 16 }]}
        >
          {/* Back Button */}
          <Pressable style={styles.headerBackButton} onPress={() => router.back()}>
            <ChevronLeft size={20} color={colors.whiteAlpha(0.7)} />
          </Pressable>

          {/* Share Button */}
          <Pressable style={styles.headerShareButton}>
            <Share size={18} color={colors.whiteAlpha(0.7)} />
          </Pressable>

          {/* Avatar + Info */}
          <View style={styles.profileInfoBlock}>
            {profile.avatar ? (
              <Image source={profile.avatar} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>{profile.name.charAt(0)}</Text>
              </View>
            )}
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileSport}>{profile.mainSport}</Text>
            {profile.location && (
              <Text style={styles.profileLocation}>{profile.location}</Text>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.gamesPlayed || 0}</Text>
              <Text style={styles.quickStatLabel}>Games</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.rating?.toFixed(1) || '—'}</Text>
              <Text style={styles.quickStatLabel}>Rating</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.winRate || '0%'}</Text>
              <Text style={styles.quickStatLabel}>Win Rate</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.mvps || 0}</Text>
              <Text style={styles.quickStatLabel}>MVPs</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bio */}
        {profile.bio && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.bioSection}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </Animated.View>
        )}

        {/* Attributes */}
        {Object.keys(attributes).length > 0 && (
          <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Attributes</Text>
            <View style={styles.attributesCard}>
              {Object.entries(attributes).map(([key, value]) => (
                <View key={key} style={styles.attributeRow}>
                  <Text style={styles.attributeLabel}>{key}</Text>
                  <View style={styles.attributeBarBg}>
                    <View
                      style={[
                        styles.attributeBarFill,
                        { width: `${((value as number) / maxAttr) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.attributeValue}>{value as number}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Challenge Button */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.challengeSection}>
          <Pressable
            style={styles.challengeButton}
            onPress={() => requireAuth(() => { /* open challenge modal */ })}
          >
            <Trophy size={18} color={colors.dark} />
            <Text style={styles.challengeButtonText}>Challenge Player</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.blackAlpha(0.4),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.blackAlpha(0.3),
  },
  backBtn: {
    backgroundColor: colors.dark,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  backBtnText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  // Profile Header
  profileHeader: {
    backgroundColor: colors.dark,
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 20,
  },
  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.whiteAlpha(0.08),
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 16,
    top: 60,
    zIndex: 10,
  },
  headerShareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.whiteAlpha(0.08),
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 60,
    zIndex: 10,
  },
  profileInfoBlock: {
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: colors.lime,
    ...shadows['2xl'],
  },
  avatarPlaceholder: {
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 36,
    color: colors.dark,
  },
  profileName: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.white,
  },
  profileSport: {
    fontFamily: typography.fontFamily.black,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.lime,
  },
  profileLocation: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.whiteAlpha(0.4),
    marginTop: 2,
  },
  // Quick Stats
  quickStatsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.whiteAlpha(0.1),
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    color: colors.white,
  },
  quickStatLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.whiteAlpha(0.35),
    marginTop: 4,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: colors.whiteAlpha(0.1),
  },
  // Bio
  bioSection: {
    padding: 20,
    gap: 8,
  },
  bioText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.blackAlpha(0.6),
    lineHeight: 22,
  },
  // Section
  section: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 16,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.dark,
  },
  // Attributes
  attributesCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attributeLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.blackAlpha(0.4),
    width: 70,
  },
  attributeBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.blackAlpha(0.06),
    borderRadius: 3,
    overflow: 'hidden',
  },
  attributeBarFill: {
    height: '100%',
    backgroundColor: colors.lime,
    borderRadius: 3,
  },
  attributeValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.dark,
    width: 28,
    textAlign: 'right',
  },
  // Challenge
  challengeSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  challengeButton: {
    backgroundColor: colors.lime,
    borderRadius: 9999,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...shadows.lime,
  },
  challengeButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.dark,
  },
});
