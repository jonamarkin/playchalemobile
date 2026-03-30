/**
 * Stats screen — port of ProfileDashboard.tsx
 * Player's own stats, attributes, and game history
 * Requires auth — redirects to login if not authenticated
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useProfile, useMyGames, usePendingApprovals } from '@/hooks/useData';
import { useAuthContext } from '@/providers/AuthProvider';
import { Logo, Trophy, Star, Edit, Share, ChevronRight } from '@/components/Icons';

export default function StatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, hasProfile, requireAuth } = useAuthContext();
  const { data: profile } = useProfile(user?.id);
  const { data: myGames } = useMyGames(user?.id);
  const { data: pendingApprovals } = usePendingApprovals(user?.id);

  // If not logged in, show a prompt
  if (!user) {
    return (
      <View style={[styles.container, styles.centeredContainer, { paddingTop: insets.top }]}>
        <Logo size={48} />
        <Text style={styles.authPromptTitle}>Your Pro Stats</Text>
        <Text style={styles.authPromptSubtitle}>Sign in to view your stats, attributes, and match history</Text>
        <Pressable style={styles.authButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.authButtonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  if (!profile) return null;

  const attributes = profile.attributes || {};
  const stats = profile.stats || {};
  const maxAttr = 99;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.profileHeader}>
        <View style={styles.profileHeaderBg}>
          <Logo size={60} />
        </View>
        <View style={styles.profileInfo}>
          {profile.avatar ? (
            <Image source={profile.avatar} style={styles.profileAvatar} contentFit="cover" />
          ) : (
            <View style={[styles.profileAvatar, styles.profileAvatarPlaceholder]}>
              <Text style={styles.profileAvatarPlaceholderText}>{profile.name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileSport}>{profile.mainSport} Elite</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.profileActions}>
          <Pressable style={styles.actionButton}>
            <Edit size={16} color={colors.whiteAlpha(0.8)} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Share size={16} color={colors.whiteAlpha(0.8)} />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats.gamesPlayed || 0}</Text>
            <Text style={styles.quickStatLabel}>Matches</Text>
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

      {/* Pending Approvals */}
      {pendingApprovals && pendingApprovals.length > 0 && (
        <Animated.View entering={FadeInUp.delay(200)} style={styles.pendingCard}>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingApprovals.length} Pending</Text>
          </View>
          <Text style={styles.pendingTitle}>Stat Approvals</Text>
          <Text style={styles.pendingSubtitle}>
            You have {pendingApprovals.length} game result{pendingApprovals.length > 1 ? 's' : ''} to review
          </Text>
        </Animated.View>
      )}

      {/* Attributes */}
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

      {/* Season Stats */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>Season Stats</Text>
        <View style={styles.seasonStatsGrid}>
          {[
            { label: 'Reliability', value: stats.reliability || '100%' },
            { label: 'Win Rate', value: stats.winRate || '0%' },
            { label: 'Games', value: stats.gamesPlayed || 0 },
            { label: 'MVPs', value: stats.mvps || 0 },
          ].map((stat, i) => (
            <View key={i} style={styles.seasonStatCard}>
              <Text style={styles.seasonStatValue}>{stat.value}</Text>
              <Text style={styles.seasonStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* My Games Summary */}
      {myGames && (
        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>My Games</Text>
          <View style={styles.myGamesRow}>
            <View style={[styles.myGameCard, { backgroundColor: colors.dark }]}>
              <Text style={[styles.myGameCount, { color: colors.lime }]}>{myGames.hostedGames.length}</Text>
              <Text style={[styles.myGameLabel, { color: colors.whiteAlpha(0.4) }]}>Hosted</Text>
            </View>
            <View style={[styles.myGameCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.myGameCount, { color: colors.dark }]}>{myGames.joinedGames.length}</Text>
              <Text style={[styles.myGameLabel, { color: colors.blackAlpha(0.3) }]}>Joined</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
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
    paddingHorizontal: 40,
    gap: 16,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 20,
  },
  // Auth prompt
  authPromptTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
    marginTop: 16,
  },
  authPromptSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.blackAlpha(0.5),
    textAlign: 'center',
    lineHeight: 20,
  },
  authButton: {
    backgroundColor: colors.dark,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
    marginTop: 8,
  },
  authButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  // Profile Header
  profileHeader: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius['3xl'],
    padding: 24,
    gap: 20,
    overflow: 'hidden',
  },
  profileHeaderBg: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.08,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.lime,
  },
  profileAvatarPlaceholder: {
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarPlaceholderText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    color: colors.dark,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.white,
  },
  profileSport: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.whiteAlpha(0.08),
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.1),
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  actionButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.whiteAlpha(0.7),
  },
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
  // Pending
  pendingCard: {
    backgroundColor: colors.lime,
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 6,
  },
  pendingBadge: {
    backgroundColor: colors.dark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  pendingBadgeText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.lime,
  },
  pendingTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 18,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.dark,
  },
  pendingSubtitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.blackAlpha(0.6),
  },
  // Section
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 18,
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
  // Season Stats
  seasonStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  seasonStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  seasonStatValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    color: colors.dark,
  },
  seasonStatLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.3),
    marginTop: 4,
  },
  // My Games
  myGamesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  myGameCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
  },
  myGameCount: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
  },
  myGameLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
});
