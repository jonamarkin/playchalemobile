/**
 * Discover Games — port of DiscoverGames.tsx
 * Browse and filter games with FlashList for max performance
 * Fully accessible without login
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useGames } from '@/hooks/useData';
import GameCard from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/ui/Skeleton';
import { Search, Filter } from '@/components/Icons';

const SPORTS = ['All', 'Football', 'Basketball', 'Tennis', 'Padel', 'Volleyball', 'Swimming', 'Athletics'];
const SKILL_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Competitive'];

export default function DiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: games = [], isLoading, refetch } = useGames();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All Levels');
  const [showFilters, setShowFilters] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSport = selectedSport === 'All' || game.sport === selectedSport;
      const matchesSkill = selectedSkill === 'All Levels' || game.skillLevel === selectedSkill;
      const matchesSearch = !searchQuery ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSport && matchesSkill && matchesSearch;
    });
  }, [games, selectedSport, selectedSkill, searchQuery]);

  const renderGameCard = useCallback(({ item, index }: { item: any; index: number }) => (
    <View style={styles.cardWrapper}>
      <GameCard
        game={item}
        index={index}
        onPress={() => router.push(`/game/${item.id}`)}
      />
    </View>
  ), [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Discover</Text>
          <Text style={styles.headerTitle}>Find Your Match</Text>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.blackAlpha(0.3)} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games, locations..."
            placeholderTextColor={colors.blackAlpha(0.3)}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
        <Pressable
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} color={showFilters ? colors.dark : colors.blackAlpha(0.5)} />
        </Pressable>
      </Animated.View>

      {/* Sport Filter Chips */}
      <Animated.ScrollView
        entering={FadeInDown.delay(300)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      >
        {SPORTS.map(sport => (
          <Pressable
            key={sport}
            style={[styles.chip, selectedSport === sport && styles.chipActive]}
            onPress={() => setSelectedSport(sport)}
          >
            <Text style={[styles.chipText, selectedSport === sport && styles.chipTextActive]}>
              {sport}
            </Text>
          </Pressable>
        ))}
      </Animated.ScrollView>

      {/* Skill Level Filters (expandable) */}
      {showFilters && (
        <Animated.ScrollView
          entering={FadeInDown}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {SKILL_LEVELS.map(level => (
            <Pressable
              key={level}
              style={[styles.chipOutline, selectedSkill === level && styles.chipOutlineActive]}
              onPress={() => setSelectedSkill(level)}
            >
              <Text style={[styles.chipOutlineText, selectedSkill === level && styles.chipOutlineTextActive]}>
                {level}
              </Text>
            </Pressable>
          ))}
        </Animated.ScrollView>
      )}

      {/* Results count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredGames.length} {filteredGames.length === 1 ? 'match' : 'matches'} found
        </Text>
      </View>

      {/* Game Cards List */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <GameCardSkeleton />
          <GameCardSkeleton />
        </View>
      ) : (
        <FlashList
          data={filteredGames}
          renderItem={renderGameCard}

          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Matches Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters or search query</Text>
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
  headerLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.blackAlpha(0.3),
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  filterButtonActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.08),
  },
  chipActive: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  chipText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.blackAlpha(0.5),
  },
  chipTextActive: {
    color: colors.lime,
  },
  chipOutline: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.blackAlpha(0.1),
  },
  chipOutlineActive: {
    borderColor: colors.lime,
    backgroundColor: colors.limeAlpha(0.1),
  },
  chipOutlineText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.blackAlpha(0.4),
  },
  chipOutlineTextActive: {
    color: colors.dark,
  },
  resultsBar: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  resultsText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.25),
  },
  skeletonContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
