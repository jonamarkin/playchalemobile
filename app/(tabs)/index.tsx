/**
 * Home Dashboard — port of AppDashboard.tsx
 * The main screen users see when they open the app
 * Accessible without login (view-only), actions gated behind auth
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { colors, typography, shadows, borderRadius } from '@/constants/theme';
import { useGames, usePlayers, useProfile, useMyGames } from '@/hooks/useData';
import { useAuthContext } from '@/providers/AuthProvider';
import { useUIStore } from '@/hooks/useUIStore';
import { Logo, Clock, MapPin, UpArrow, ChevronRight, Plus } from '@/components/Icons';
import { GameCardSkeleton } from '@/components/ui/Skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, requireAuth } = useAuthContext();
  const { openModal } = useUIStore();

  const { data: games = [], isLoading: gamesLoading, refetch: refetchGames } = useGames();
  const { data: players = [] } = usePlayers();
  const { data: profile } = useProfile(user?.id);
  const { data: myGames } = useMyGames(user?.id);

  const upcomingGames = games.filter((g: any) => g.status === 'upcoming').slice(0, 5);
  const risingStars = players.slice(0, 5);
  const spotlightGame = upcomingGames[0];

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchGames();
    setRefreshing(false);
  }, [refetchGames]);

  return (
    <View style={styles.container}>
    <ScrollView
      style={[{ paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Animated.View entering={FadeInRight.delay(100)} style={styles.headerLabel}>
          <View style={styles.headerDot} />
          <Text style={styles.headerLabelText}>Athlete Command Center</Text>
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(200)} style={styles.headerTitle}>
          {user && profile ? (
            <>
              Welcome back,{'\n'}
              <View style={styles.nameHighlight}>
                <Text style={styles.nameHighlightText}>
                  {profile.name.split(' ')[0]}
                </Text>
              </View>
            </>
          ) : (
            <>Find Your{'\n'}Next Game</>
          )}
        </Animated.Text>

        {/* City Rank Card — only show when logged in */}
        {user && profile && (
          <Animated.View entering={FadeInUp.delay(400)} style={styles.rankCard}>
            <View style={styles.rankCardOverlay}>
              <Logo size={40} />
            </View>
            <View style={styles.rankTextBlock}>
              <Text style={styles.rankLabel}>City Rank</Text>
              <Text style={styles.rankValue}>#1,242</Text>
            </View>
            <View style={styles.rankArrow}>
              <UpArrow size={18} color={colors.dark} />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Spotlight Match */}
      {spotlightGame ? (
        <Animated.View entering={FadeInUp.delay(300)}>
          <Pressable
            style={styles.spotlightCard}
            onPress={() => router.push(`/game/${spotlightGame.id}`)}
          >
            <Image
              source={spotlightGame.imageUrl}
              style={styles.spotlightImage}
              contentFit="cover"
              transition={500}
            />
            <View style={styles.spotlightOverlay} />
            <View style={styles.spotlightContent}>
              <View style={styles.spotlightBadge}>
                <Text style={styles.spotlightBadgeText}>Spotlight Match Today</Text>
              </View>
              <Text style={styles.spotlightTitle}>{spotlightGame.title}</Text>
              <View style={styles.spotlightMeta}>
                <View style={styles.spotlightMetaItem}>
                  <Clock size={12} color={colors.whiteAlpha(0.7)} />
                  <Text style={styles.spotlightMetaText}>{spotlightGame.time}</Text>
                </View>
                <View style={styles.spotlightMetaItem}>
                  <MapPin size={12} color={colors.whiteAlpha(0.7)} />
                  <Text style={styles.spotlightMetaText}>{spotlightGame.location.split('•')[0]}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      ) : gamesLoading ? (
        <GameCardSkeleton />
      ) : null}

      {/* Quick Stats — only for logged-in users */}
      {user && profile?.stats && (
        <Animated.View entering={FadeInUp.delay(400)} style={styles.statsRow}>
          {[
            { label: 'Win Rate', value: profile.stats.winRate, bg: colors.white, text: colors.dark, labelColor: colors.blackAlpha(0.3) },
            { label: 'Season MVPs', value: profile.stats.mvps, bg: colors.dark, text: colors.lime, labelColor: colors.whiteAlpha(0.4) },
            { label: 'Reliability', value: profile.stats.reliability, bg: colors.white, text: colors.dark, labelColor: colors.blackAlpha(0.3) },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Text style={[styles.statValue, { color: stat.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: stat.labelColor }]}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>
      )}

      {/* Recommended Games */}
      <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Games</Text>
          <Pressable onPress={() => router.push('/(tabs)/discover')}>
            <Text style={styles.sectionLink}>View All</Text>
          </Pressable>
        </View>

        {upcomingGames.slice(1, 4).map((game: any) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.gameRow, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push(`/game/${game.id}`)}
          >
            <Image
              source={game.imageUrl}
              style={styles.gameRowImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.gameRowContent}>
              <Text style={styles.gameRowSport}>{game.sport}</Text>
              <Text style={styles.gameRowTitle} numberOfLines={1}>{game.title}</Text>
              <View style={styles.gameRowMeta}>
                <Clock size={10} color={colors.blackAlpha(0.4)} />
                <Text style={styles.gameRowMetaText}>{game.time}</Text>
              </View>
            </View>
            <View style={styles.gameRowArrow}>
              <ChevronRight size={16} color={colors.blackAlpha(0.3)} />
            </View>
          </Pressable>
        ))}
      </Animated.View>

      {/* My Games — only for logged-in users */}
      {user && myGames && (
        <Animated.View entering={FadeInUp.delay(600)} style={styles.myGamesCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Games</Text>
            <Pressable onPress={() => requireAuth(() => router.push('/mygames'))}>
              <Text style={styles.sectionLink}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.myGamesGrid}>
            <View style={styles.myGamesStat}>
              <Text style={styles.myGamesStatValue}>{myGames.hostedGames.length}</Text>
              <Text style={styles.myGamesStatLabel}>Hosted</Text>
            </View>
            <View style={styles.myGamesStat}>
              <Text style={styles.myGamesStatValue}>{myGames.joinedGames.length}</Text>
              <Text style={styles.myGamesStatLabel}>Joined</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Rising Stars */}
      <Animated.View entering={FadeInUp.delay(700)} style={styles.risingStarsCard}>
        <Text style={styles.sectionTitle}>Rising Stars</Text>
        {risingStars.map((star: any, i: number) => (
          <Pressable
            key={star.id}
            style={({ pressed }) => [styles.starRow, pressed && { backgroundColor: colors.blackAlpha(0.05) }]}
            onPress={() => router.push(`/profile/${star.slug || star.id}`)}
          >
            <View style={styles.starRank}>
              <Text style={styles.starRankText}>#{i + 1}</Text>
            </View>
            {star.avatar ? (
              <Image source={star.avatar} style={styles.starAvatar} contentFit="cover" />
            ) : (
              <View style={[styles.starAvatar, styles.starAvatarPlaceholder]}>
                <Text style={styles.starAvatarPlaceholderText}>{star.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.starInfo}>
              <Text style={styles.starName}>{star.name}</Text>
              <Text style={styles.starSport}>{star.mainSport}</Text>
            </View>
            <ChevronRight size={14} color={colors.blackAlpha(0.2)} />
          </Pressable>
        ))}
        <Pressable
          style={styles.viewRankingsButton}
          onPress={() => router.push('/(tabs)/community')}
        >
          <Text style={styles.viewRankingsText}>View Global Rankings</Text>
        </Pressable>
      </Animated.View>

      {/* Bottom spacer for tab bar */}
      <View style={{ height: 100 }} />
    </ScrollView>

    {/* Floating Action Button for Create Game */}
    <Animated.View entering={FadeInUp.delay(800)} style={styles.fabContainer}>
      <Pressable 
        style={styles.fab} 
        onPress={() => requireAuth(() => openModal('create'))}
      >
        <Plus size={24} color={colors.lime} />
      </Pressable>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },
  // Header
  header: {
    gap: 16,
  },
  headerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.dark,
  },
  headerLabelText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.blackAlpha(0.3),
  },
  headerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 36,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1.5,
    lineHeight: 38,
    color: colors.dark,
  },
  nameHighlight: {
    backgroundColor: colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 2,
    transform: [{ rotate: '-1deg' }],
  },
  nameHighlightText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 36,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1.5,
    color: colors.lime,
  },
  // Rank Card
  rankCard: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    alignSelf: 'flex-start',
    ...shadows['2xl'],
  },
  rankCardOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.05,
    transform: [{ rotate: '12deg' }],
  },
  rankTextBlock: {
    alignItems: 'flex-end',
  },
  rankLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.whiteAlpha(0.4),
    marginBottom: 2,
  },
  rankValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    color: colors.lime,
  },
  rankArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Spotlight
  spotlightCard: {
    height: 240,
    borderRadius: borderRadius['3xl'],
    overflow: 'hidden',
    ...shadows['2xl'],
  },
  spotlightImage: {
    ...StyleSheet.absoluteFillObject,
  },
  spotlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackAlpha(0.55),
  },
  spotlightContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: 'flex-end',
  },
  spotlightBadge: {
    backgroundColor: colors.lime,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  spotlightBadgeText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.dark,
  },
  spotlightTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    lineHeight: 30,
    color: colors.white,
    marginBottom: 10,
  },
  spotlightMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  spotlightMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotlightMetaText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.whiteAlpha(0.7),
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
    ...shadows.sm,
  },
  statValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  // Section
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.blackAlpha(0.05),
    paddingBottom: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.dark,
  },
  sectionLink: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
  },
  // Game Row
  gameRow: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
    ...shadows.sm,
  },
  gameRowImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  gameRowContent: {
    flex: 1,
  },
  gameRowSport: {
    fontFamily: typography.fontFamily.black,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
    marginBottom: 4,
  },
  gameRowTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 16,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.dark,
  },
  gameRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  gameRowMetaText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
  },
  gameRowArrow: {
    padding: 12,
    backgroundColor: colors.blackAlpha(0.04),
    borderRadius: 9999,
  },
  // My Games
  myGamesCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    padding: 24,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
    gap: 16,
    ...shadows.sm,
  },
  myGamesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  myGamesStat: {
    flex: 1,
    backgroundColor: colors.beige,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  myGamesStatValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    color: colors.dark,
  },
  myGamesStatLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.3),
  },
  // Rising Stars
  risingStarsCard: {
    backgroundColor: colors.beige,
    borderRadius: borderRadius['3xl'],
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  starRank: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRankText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    fontStyle: 'italic',
    color: colors.lime,
  },
  starAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  starAvatarPlaceholder: {
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starAvatarPlaceholderText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    color: colors.dark,
  },
  starInfo: {
    flex: 1,
  },
  starName: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.3,
    color: colors.dark,
  },
  starSport: {
    fontFamily: typography.fontFamily.black,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.3),
  },
  viewRankingsButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewRankingsText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.blackAlpha(0.3),
  },
});
