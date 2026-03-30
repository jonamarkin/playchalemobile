/**
 * Community screen — port of TopPlayers.tsx
 * Player leaderboard with infinite scroll and search
 * Viewable without auth
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useInfinitePlayers } from '@/hooks/useData';
import { PlayerCardSkeleton } from '@/components/ui/Skeleton';
import { Search, Trophy, Star } from '@/components/Icons';
import { PlayerProfile } from '@/types';

export default function CommunityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfinitePlayers();

  const allPlayers = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return allPlayers;
    const q = searchQuery.toLowerCase();
    return allPlayers.filter(
      p => p.name.toLowerCase().includes(q) || p.mainSport.toLowerCase().includes(q)
    );
  }, [allPlayers, searchQuery]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderPlayer = useCallback(({ item, index }: { item: PlayerProfile; index: number }) => {
    const isTopThree = index < 3;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.playerCard,
          isTopThree && styles.playerCardTop,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() => router.push(`/profile/${item.slug || item.id}`)}
      >
        {/* Rank */}
        <View style={[styles.rankBadge, isTopThree && styles.rankBadgeTop]}>
          <Text style={[styles.rankText, isTopThree && styles.rankTextTop]}>
            #{index + 1}
          </Text>
        </View>

        {/* Avatar */}
        {item.avatar ? (
          <Image source={item.avatar} style={styles.avatar} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.playerSport}>{item.mainSport}</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingBlock}>
          <Star size={12} color={colors.lime} />
          <Text style={styles.ratingText}>
            {item.stats?.rating?.toFixed(1) || '—'}
          </Text>
        </View>
      </Pressable>
    );
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View style={styles.headerRow}>
          <Trophy size={22} color={colors.lime} />
          <Text style={styles.headerLabel}>Community</Text>
        </View>
        <Text style={styles.headerTitle}>Global Rankings</Text>
      </Animated.View>

      {/* Search */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.searchBar}>
        <Search size={18} color={colors.blackAlpha(0.3)} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search players or sports..."
          placeholderTextColor={colors.blackAlpha(0.3)}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </Animated.View>

      {/* Players List */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 8 }).map((_, i) => (
            <PlayerCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlashList
          data={filteredPlayers}
          renderItem={renderPlayer}

          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loadingMore}>
                <Text style={styles.loadingMoreText}>Loading more players...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Players Found</Text>
              <Text style={styles.emptySubtitle}>Try a different search</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.blackAlpha(0.3),
  },
  headerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.dark,
    padding: 0,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: 16,
    marginBottom: 8,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.04),
  },
  playerCardTop: {
    backgroundColor: colors.dark,
    borderColor: colors.whiteAlpha(0.1),
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.blackAlpha(0.06),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeTop: {
    backgroundColor: colors.lime,
  },
  rankText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.blackAlpha(0.5),
  },
  rankTextTop: {
    color: colors.dark,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 16,
    color: colors.dark,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontFamily: typography.fontFamily.black,
    fontSize: 15,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.3,
    color: colors.dark,
  },
  playerSport: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.3),
    marginTop: 2,
  },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.blackAlpha(0.04),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.dark,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.blackAlpha(0.3),
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.blackAlpha(0.3),
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.blackAlpha(0.3),
  },
});
